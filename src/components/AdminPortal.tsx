import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  FileCheck, 
  Bell, 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  GraduationCap, 
  UserCheck, 
  Printer, 
  Building2, 
  ArrowUpRight,
  TrendingUp,
  Award,
  Save,
  X,
  Atom,
  FlaskConical,
  Binary,
  Layers,
  KeyRound,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  BookOpen,
  Database,
  Upload,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  Announcement, 
  StudentAdministrativeRequest, 
  DepartmentId, 
  UserProfile,
  DepartmentRealStats,
  FacultyGeneralRealStats,
  DepartmentHeadAccount,
  DepartmentInfo,
  ModuleItem,
  FacultyTeacher
} from '../types';
import { DepartmentContentManager } from './DepartmentContentManager';
import { 
  INITIAL_ANNOUNCEMENTS, 
  FACULTY_GENERAL_INFO, 
  DEPARTMENTS 
} from '../data/facultyData';
import { 
  APPROVED_STUDENTS_LIST, 
  ApprovedStudent 
} from '../data/approvedStudentsData';

interface AdminPortalProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  studentRequests: StudentAdministrativeRequest[];
  onUpdateRequestStatus: (id: string, newStatus: StudentAdministrativeRequest['status'], notes?: string) => void;
  onGenerateDocument: (type: string, data: any) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  departmentStats?: Record<DepartmentId, DepartmentRealStats>;
  facultyStats?: FacultyGeneralRealStats;
  departmentHeads?: DepartmentHeadAccount[];
  currentUser?: UserProfile | null;
  onOpenStatsEditor?: (deptId?: DepartmentId) => void;
  onOpenHeadsManager?: () => void;
  onResetAllStatsToDefault?: () => void;
  currentLogoUrl?: string;
  facultyLogoUrl?: string;
  onOpenProfileSettings?: () => void;
  onOpenPedagogicalBridge?: () => void;
  onOpenAccountsRBAC?: (tab?: 'accounts' | 'security' | 'manual') => void;
  onSaveDepartmentStats?: (deptId: DepartmentId, stats: DepartmentRealStats) => void;
  customDepartments?: Record<string, DepartmentInfo>;
  onUpdateDepartments?: (depts: Record<string, DepartmentInfo>) => void;
  customModules?: ModuleItem[];
  onUpdateModules?: (modules: ModuleItem[]) => void;
  facultyTeachers?: FacultyTeacher[];
  onUpdateFacultyTeachers?: (teachers: FacultyTeacher[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  studentRequests,
  onUpdateRequestStatus,
  onGenerateDocument,
  onShowToast,
  departmentStats,
  facultyStats,
  departmentHeads = [],
  currentUser,
  onOpenStatsEditor,
  onOpenHeadsManager,
  onResetAllStatsToDefault,
  currentLogoUrl = '/logo_univ_ouargla.png',
  facultyLogoUrl = '/logo_faculty_fmsm.png',
  onOpenProfileSettings,
  onOpenPedagogicalBridge,
  onOpenAccountsRBAC,
  onSaveDepartmentStats,
  customDepartments = DEPARTMENTS,
  onUpdateDepartments,
  customModules = [],
  onUpdateModules,
  facultyTeachers = [],
  onUpdateFacultyTeachers,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'announcements' | 'directory' | 'stats' | 'heads' | 'independence' | 'students_registry' | 'dept_content'>('dept_content');
  
  // Strict Department Head vs Super Admin Scoping
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.adminRole === 'super_admin' || currentUser?.email === 'kebili.nacira@gmail.com';
  const isDeptHead = !isSuperAdmin && (currentUser?.role === 'dept_head' || currentUser?.adminRole === 'dept_head' || !!currentUser?.departmentId);
  const userDeptId = currentUser?.departmentId as DepartmentId | undefined;
  const userDeptInfo = userDeptId ? DEPARTMENTS[userDeptId] : null;
  const userDeptName = userDeptInfo?.nameAr || (userDeptId ? `قسم ${userDeptId}` : '');

  const [selectedDeptForStats, setSelectedDeptForStats] = useState<DepartmentId>(
    (isDeptHead && userDeptId ? userDeptId : currentUser?.departmentId as DepartmentId) || 'common_sm'
  );
  const [printingStatsDept, setPrintingStatsDept] = useState<DepartmentId | null>(null);

  // In-place direct editable fields state for department statistics
  const [inlineStats, setInlineStats] = useState<{
    studentsCount?: number;
    teachersCount?: number;
    specialtiesCount?: number;
    laboratoriesCount?: number;
    successRateS1?: number;
    successRateS2?: number;
    tdAttendanceRate?: number;
    tpAttendanceRate?: number;
  }>({});

  const handleSaveInlineStats = (targetDept: DepartmentId) => {
    const existing = departmentStats?.[targetDept] || {
      departmentId: targetDept,
      studentsCount: DEPARTMENTS[targetDept]?.stats?.students || 0,
      teachersCount: DEPARTMENTS[targetDept]?.stats?.teachers || 0,
      specialtiesCount: DEPARTMENTS[targetDept]?.stats?.specialtiesCount || 0,
      laboratoriesCount: DEPARTMENTS[targetDept]?.stats?.laboratories || 0,
      successRateS1: 85,
      successRateS2: 88,
      tdAttendanceRate: 92,
      tpAttendanceRate: 95,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      lastUpdatedBy: currentUser?.name || 'مسؤول القسم'
    };

    const updated: DepartmentRealStats = {
      ...existing,
      studentsCount: inlineStats.studentsCount !== undefined ? inlineStats.studentsCount : existing.studentsCount,
      teachersCount: inlineStats.teachersCount !== undefined ? inlineStats.teachersCount : existing.teachersCount,
      specialtiesCount: inlineStats.specialtiesCount !== undefined ? inlineStats.specialtiesCount : existing.specialtiesCount,
      laboratoriesCount: inlineStats.laboratoriesCount !== undefined ? inlineStats.laboratoriesCount : existing.laboratoriesCount,
      successRateS1: inlineStats.successRateS1 !== undefined ? inlineStats.successRateS1 : existing.successRateS1,
      successRateS2: inlineStats.successRateS2 !== undefined ? inlineStats.successRateS2 : existing.successRateS2,
      tdAttendanceRate: inlineStats.tdAttendanceRate !== undefined ? inlineStats.tdAttendanceRate : existing.tdAttendanceRate,
      tpAttendanceRate: inlineStats.tpAttendanceRate !== undefined ? inlineStats.tpAttendanceRate : existing.tpAttendanceRate,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      lastUpdatedBy: currentUser?.name 
        ? `${currentUser.name} (${currentUser.adminTitle || 'مسؤول معتمد'})` 
        : existing.lastUpdatedBy
    };

    if (onSaveDepartmentStats) {
      onSaveDepartmentStats(targetDept, updated);
    }
    onShowToast(
      'تم اعتماد وحفظ الأرقام بنجاح',
      `تم تحديث أرقام ${DEPARTMENTS[targetDept]?.nameAr || targetDept} فوراً ونشرها في المنصة.`,
      'success'
    );
  };

  // Department filter for requests (Super admin can filter by all/any, dept head is locked)
  const [requestDeptFilter, setRequestDeptFilter] = useState<'all' | DepartmentId>(
    isDeptHead && userDeptId ? userDeptId : 'all'
  );

  // Student Registry Filter State
  const [studentRegistrySearch, setStudentRegistrySearch] = useState('');
  const [studentRegistryDept, setStudentRegistryDept] = useState<'all' | DepartmentId>(
    isDeptHead && userDeptId ? userDeptId : 'all'
  );
  const [studentRegistryLevel, setStudentRegistryLevel] = useState<string>('all');

  // Directory Search & Filter
  const [directoryType, setDirectoryType] = useState<'students' | 'teachers'>('students');
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryDept, setDirectoryDept] = useState<string>(
    isDeptHead && userDeptId ? userDeptId : 'all'
  );

  // Auto-synchronize locks for Department Heads
  useEffect(() => {
    if (isDeptHead && userDeptId) {
      setSelectedDeptForStats(userDeptId);
      setStudentRegistryDept(userDeptId);
      setRequestDeptFilter(userDeptId);
      setDirectoryDept(userDeptId);
      setNewDept(userDeptId);
    }
  }, [isDeptHead, userDeptId]);

  // Backup & Independence Handlers
  const handleExportFullDatabaseBackup = () => {
    try {
      const backupData = {
        meta: {
          platform: 'FMSM - Université Kasdi Merbah Ouargla',
          exportDate: new Date().toISOString(),
          exportedBy: currentUser?.name || 'المشرف العام',
          version: '2.5.0'
        },
        announcements,
        studentRequests,
        departmentStats,
        facultyStats,
        departmentHeads,
        localStorageSnapshot: {
          stats: localStorage.getItem('fmsm_department_real_stats_v1'),
          accounts: localStorage.getItem('fmsm_rbac_administrators_v1'),
          chatMessages: localStorage.getItem('fmsm_telegram_chat_messages_v2'),
          logoSize: localStorage.getItem('fmsm_logo_size')
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fmsm_complete_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onShowToast(
        'تم تصدير النسخة الاحتياطية بنجاح!',
        'تم حفظ كافة بيانات المنصة في ملف JSON على جهازك. يمكنك نقله أو استرجاعه في أي وقت دون الرجوع لمستضيف الموقع.',
        'success'
      );
    } catch (err) {
      onShowToast('خطأ في التصدير', 'حدث خطأ أثناء إنشاء النسخة الاحتياطية.', 'error');
    }
  };

  const handleRestoreBackupFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.localStorageSnapshot) {
          if (parsed.localStorageSnapshot.stats) {
            localStorage.setItem('fmsm_department_real_stats_v1', parsed.localStorageSnapshot.stats);
          }
          if (parsed.localStorageSnapshot.accounts) {
            localStorage.setItem('fmsm_rbac_administrators_v1', parsed.localStorageSnapshot.accounts);
          }
          if (parsed.localStorageSnapshot.chatMessages) {
            localStorage.setItem('fmsm_telegram_chat_messages_v2', parsed.localStorageSnapshot.chatMessages);
          }
        }

        onShowToast(
          'تم استرجاع النسخة الاحتياطية بنجاح!',
          'تمت استعادة كافة البيانات والإحصائيات بنجاح. سيتم تحديث الصفحة لتطبيق الإعدادات.',
          'success'
        );
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        onShowToast('خطأ في ملف النسخة الاحتياطية', 'الملف المحدد غير صالح أو تالف.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Requests filtering
  const [requestFilterStatus, setRequestFilterStatus] = useState<string>('all');
  const [requestSearch, setRequestSearch] = useState<string>('');

  // Announcement Modal State
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('exams');
  const [newAudience, setNewAudience] = useState<Announcement['targetAudience']>('all');
  const [newDept, setNewDept] = useState<DepartmentId | 'all'>('all');
  const [newContent, setNewContent] = useState('');
  const [newIsPinned, setNewIsPinned] = useState(false);

  // Mock Students Directory
  const mockStudents = [
    { matricule: '232339011452', name: 'بن علي عبد الرؤوف', dept: 'common_sm', level: 'L1 SM - S2', group: 'الفوج 01', email: 'a.benali@etu.univ-ouargla.dz', phone: '0661234567', status: 'منتظم' },
    { matricule: '2139045812', name: 'أحمد بن سالم', dept: 'chemistry', level: 'L3 Chimie des Matériaux', group: 'الفوج 02', email: 'ahmed.bensalem@etu.univ-ouargla.dz', phone: '0668901234', status: 'منتظم' },
    { matricule: '2239088219', name: 'عثماني خولة', dept: 'physics', level: 'L2 Physique Fondamentale', group: 'الفوج 01', email: 'k.othmani@etu.univ-ouargla.dz', phone: '0654129876', status: 'منتظم' },
    { matricule: '2139045610', name: 'قدوري سيف الدين', dept: 'math', level: 'M1 Mathématiques Appliquées', group: 'الفوج 01', email: 's.kaddouri@etu.univ-ouargla.dz', phone: '0770987654', status: 'منتظم' },
    { matricule: '2239077112', name: 'بلقاسم أسماء', dept: 'chemistry', level: 'M2 Chimie Organique', group: 'الفوج 01', email: 'a.belkacem@etu.univ-ouargla.dz', phone: '0663456789', status: 'مقبل على التخرج' },
    { matricule: '232339091244', name: 'زايدي محمد الأمين', dept: 'common_sm', level: 'L1 SM - S2', group: 'الفوج 03', email: 'm.zaidi@etu.univ-ouargla.dz', phone: '0555123456', status: 'منتظم' },
    { matricule: '2139049811', name: 'حمادي بلقاسم', dept: 'physics', level: 'M1 Physique Énergétique', group: 'الفوج 02', email: 'b.hammadi@etu.univ-ouargla.dz', phone: '0671239854', status: 'منتظم' },
    { matricule: '2239055102', name: 'عماري مريم', dept: 'math', level: 'L3 Mathématiques Générales', group: 'الفوج 01', email: 'm.ammari@etu.univ-ouargla.dz', phone: '0662991043', status: 'منتظم' },
  ];

  // Mock Teachers Directory
  const mockTeachers = [
    { name: 'أ. د. بوقرة عبد الحليم', grade: 'أستاذ التعليم العالي', dept: 'chemistry', email: 'a.bouguerra@univ-ouargla.dz', modules: 'كيمياء حرارية، كيمياء عضوية', office: 'مخبر الكيمياء B12' },
    { name: 'د. بلقاسم مرابط', grade: 'أستاذ محاضر "أ"', dept: 'physics', email: 'b.merabet@univ-ouargla.dz', modules: 'فيزياء كمية، كهرومغناطيسية', office: 'الجناح B - مكتب 204' },
    { name: 'د. بن سعيد فاطمة الزهراء', grade: 'أستاذة محاضرة "ب"', dept: 'math', email: 'f.bensaid@univ-ouargla.dz', modules: 'تحليل رياضي معمق، جبر خطي', office: 'الجناح C - مكتب 105' },
    { name: 'د. زرقان محمد', grade: 'أستاذ محاضر "أ"', dept: 'common_sm', email: 'sm.tc@univ-ouargla.dz', modules: 'ميكانيكا النقطة المادية', office: 'إدارة الجذع المشترك SM' },
    { name: 'د. قدوري ناصر', grade: 'أستاذ محاضر "أ"', dept: 'physics', email: 'dep.physique@univ-ouargla.dz', modules: 'ترموديناميك، طاقات متجددة', office: 'رئاسة قسم الفيزياء' },
  ];

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      onShowToast('خطأ في الإدخال', 'يرجى كتابة عنوان الإعلان والمحتوى.', 'error');
      return;
    }

    const assignedDept = isDeptHead && userDeptId ? userDeptId : newDept;
    const authorSignature = isDeptHead && userDeptId 
      ? `${currentUser?.name || 'رئيس القسم'} (رئاسة ${userDeptName})`
      : 'إدارة الكلية - مصلحة التمدرس';

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      departmentId: assignedDept,
      targetAudience: newAudience,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      isPinned: newIsPinned,
      content: newContent.trim(),
      author: authorSignature
    };

    onAddAnnouncement(newAnn);
    setIsAddAnnouncementOpen(false);
    setNewTitle('');
    setNewContent('');
    onShowToast('تم نشر الإعلان بنجاح', 'أصبح الإعلان متاحاً للطلبة والأساتذة فوراً.', 'success');
  };

  // Scoped requests: Department head only sees requests belonging to their department
  const scopedRequests = isDeptHead && userDeptId
    ? studentRequests.filter((req) => req.departmentId === userDeptId)
    : (requestDeptFilter === 'all'
        ? studentRequests
        : studentRequests.filter((req) => req.departmentId === requestDeptFilter));

  const filteredRequests = scopedRequests.filter((req) => {
    const matchesStatus = requestFilterStatus === 'all' || req.status === requestFilterStatus;
    const matchesSearch = 
      req.studentName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      req.matricule.includes(requestSearch) ||
      req.trackingCode.toLowerCase().includes(requestSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Scoped mock students and teachers for Directory tab (Department Head vs Super Admin)
  const scopedMockStudents = isDeptHead && userDeptId
    ? mockStudents.filter(s => s.dept === userDeptId)
    : (directoryDept === 'all' ? mockStudents : mockStudents.filter(s => s.dept === directoryDept));

  const scopedMockTeachers = isDeptHead && userDeptId
    ? mockTeachers.filter(t => t.dept === userDeptId)
    : (directoryDept === 'all' ? mockTeachers : mockTeachers.filter(t => t.dept === directoryDept));

  // Scoped announcements: Department head only sees announcements for their department + general faculty announcements
  const scopedAnnouncements = isDeptHead && userDeptId
    ? announcements.filter((a) => a.departmentId === userDeptId || a.departmentId === 'all')
    : announcements;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Admin Header Banner */}
      <div className="bg-linear-to-r from-[#0B3D91] via-slate-900 to-[#071739] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative p-2 rounded-xl bg-white/10 border border-white/20">
            <Shield className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap text-amber-300 text-xs font-bold mb-1">
              <span>إدارة كلية الرياضيات وعلوم المادة - FMSM</span>
              
              {/* Strict RBAC Role Badge */}
              {currentUser && (
                <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px] shadow-xs">
                  {currentUser.role === 'super_admin' || currentUser.adminRole === 'super_admin'
                    ? '👑 الإدارة العامة (صلاحية فحص وتعديل كل شيء)'
                    : `🏛️ ${currentUser.adminTitle || `مسؤول قسم ${currentUser.departmentId}`}`}
                </span>
              )}

              {(!currentUser || (currentUser.role !== 'super_admin' && currentUser.adminRole !== 'super_admin')) && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] text-white">
                  نظام الصلاحيات المخصصة
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              لوحة التحكم المركزية والإدارة البيداغوجية
            </h1>
            <p className="text-xs text-blue-100 mt-1 max-w-2xl">
              إدارة طلبات الوثائق الإدارية، نشر الأخبار والإعلانات، متابعة مؤشرات النجاح والغياب، وتسيير شؤون أقسام الكلية.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenAccountsRBAC && (
            <button
              type="button"
              onClick={() => onOpenAccountsRBAC('accounts')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-colors cursor-pointer border border-amber-300"
              title="عرض وتسيير الحسابات المعتمدة (الإدارة العامة + مسؤولو أقسام الكلية)"
            >
              <Shield className="w-3.5 h-3.5 text-slate-950" />
              <span>الحسابات والصلاحيات</span>
            </button>
          )}

          {(onOpenAccountsRBAC || onOpenProfileSettings) && (
            <button
              type="button"
              onClick={() => {
                if (onOpenAccountsRBAC) {
                  onOpenAccountsRBAC('security');
                } else if (onOpenProfileSettings) {
                  onOpenProfileSettings();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer border border-white/15"
              title="تعديل اسم المستخدم، البريد، واختيار وتغيير كلمة المرور الخاصة بك في أي وقت"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span>إعدادات الأمان وكلمة المرور</span>
            </button>
          )}

          {onOpenPedagogicalBridge && (
            <button
              type="button"
              onClick={onOpenPedagogicalBridge}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer border border-emerald-400/30"
              title="ساعات استقبال وتأطير الأساتذة والرد على استفسارات الطلبة"
            >
              <Users className="w-3.5 h-3.5" />
              <span>همزة الوصل البيداغوجية</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/15 text-xs text-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{FACULTY_GENERAL_INFO.currentAcademicYear}</span>
          </div>
        </div>
      </div>

      {/* DEPARTMENT HEAD DEDICATED WORKSPACE PANEL (Direct guidance on how to edit and manage their department) */}
      {currentUser && (currentUser.role === 'dept_head' || currentUser.adminRole === 'dept_head') && currentUser.departmentId && (
        <div className="bg-emerald-950/60 border-2 border-emerald-500/70 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  فضاء مسؤول القسم المباشر
                </span>
                <span className="text-xs text-emerald-300 font-bold">
                  {DEPARTMENTS[currentUser.departmentId]?.nameAr || currentUser.adminTitle}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                أهلاً بك: {currentUser.name}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5 max-w-xl">
                هنا مساحتك الحصرية: يمكنك تعديل إحصائيات قسمك، إدارة برامج الامتحانات، ونشر إعلانات خاصة بطلبة القسم مباشرة دون تعقيد.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {onOpenStatsEditor && (
              <button
                type="button"
                onClick={() => onOpenStatsEditor(currentUser.departmentId)}
                className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all transform hover:scale-102"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-950" />
                <span>تعديل إحصائيات قسمي فوراً</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setStudentRegistryDept(currentUser.departmentId!);
                setActiveTab('students_registry');
              }}
              className="flex-1 md:flex-none px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              <span>طلبة قسمي المعتمدين</span>
            </button>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS BAR - الخانات والإجراءات المباشرة للمسؤولين */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              دليل الخانات السريعة: أين تضغط وتعدّل؟ (اضغط على أي مهمة للوصول المباشر لخانات التعديل)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            روابط فورية لنماذج وخانات التعديل
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('dept_content')}
            className={`p-3 rounded-xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between gap-1.5 col-span-1 sm:col-span-2 lg:col-span-1 ${
              activeTab === 'dept_content'
                ? 'bg-amber-50 border-amber-500 dark:bg-amber-950/60 dark:border-amber-500 shadow-md ring-2 ring-amber-400'
                : 'bg-gradient-to-br from-amber-50/60 to-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 hover:border-amber-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-900 dark:text-amber-200 bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                صلاحيات كاملة مطلقة
              </span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                {isDeptHead ? `محرر وإدارة ${userDeptName}` : 'محرر محتوى الأقسام'}
              </div>
              <div className="text-[10px] text-slate-500">تعديل التعريف، إضافة تخصصات، مخابر، وأساتذة</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-emerald-50 border-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                خانات مباشرة
              </span>
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">1. إحصائيات القسم</div>
              <div className="text-[10px] text-slate-500">أعداد الطلبة والأساتذة والنجاح</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcements')}
            className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-blue-50 border-[#0B3D91] dark:bg-blue-950/40 dark:border-blue-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#0B3D91] dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded">
                نموذج النشر
              </span>
              <Bell className="w-4 h-4 text-[#0B3D91]" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">2. نشر إعلان رسمي</div>
              <div className="text-[10px] text-slate-500">كتابة ونشر الأخبار للطلبة</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('requests');
              setTimeout(() => {
                document.getElementById('requests-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-amber-50 border-amber-400 dark:bg-amber-950/40 dark:border-amber-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                موافقة / رفض / طباعة
              </span>
              <FileCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">3. طلبات الوثائق والشهادات</div>
              <div className="text-[10px] text-slate-500">شهادات التمدرس وكشوف النقاط للطلبة</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenAccountsRBAC) onOpenAccountsRBAC('security');
              else if (onOpenProfileSettings) onOpenProfileSettings();
            }}
            className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-right transition-all cursor-pointer flex flex-col justify-between gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                بياناتي
              </span>
              <KeyRound className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">4. كلمة المرور والبريد</div>
              <div className="text-[10px] text-slate-500">تعديل بيانات حسابك الشخصي</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('dept_content')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer relative ${
            activeTab === 'dept_content'
              ? 'bg-[#0B3D91] text-white shadow-md ring-2 ring-amber-400'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-500" />
          <span>{isDeptHead ? `محرر وإدارة محتوى ${userDeptName} (صلاحيات كاملة)` : 'محرر محتوى الأقسام (صلاحيات كاملة)'}</span>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
            تعديل وإضافة
          </span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isDeptHead ? `مؤشرات ${userDeptName}` : 'نظرة عامة والتحليلات'}</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer relative ${
            activeTab === 'requests'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{isDeptHead ? `طلبات وثائق ${userDeptName}` : 'طلبات الوثائق الإدارية (شهادات وكشوف)'}</span>
          {scopedRequests.filter(r => r.status === 'قيد المعالجة').length > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
              {scopedRequests.filter(r => r.status === 'قيد المعالجة').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{isDeptHead ? `إعلانات ${userDeptName}` : 'إدارة الإعلانات والأخبار'}</span>
          <span className="bg-blue-100 dark:bg-blue-900/60 text-[#0B3D91] dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {scopedAnnouncements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isDeptHead ? `دليل ${userDeptName}` : 'دليل الأساتذة والطلبة'}</span>
        </button>

        <button
          onClick={() => setActiveTab('students_registry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'students_registry'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-500" />
          <span>{isDeptHead ? `سجل طلبة ${userDeptName}` : 'سجل الطلبة المعتمد (التحقق الأكاديمي)'}</span>
          <span className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
            {isDeptHead && userDeptId 
              ? `${APPROVED_STUDENTS_LIST.filter(s => s.departmentId === userDeptId).length} طالب`
              : `${APPROVED_STUDENTS_LIST.length} طالب`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span>{isDeptHead ? `إحصائيات ${userDeptName}` : 'إحصائيات الأقسام الحقيقية'}</span>
          <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
            محيّنة
          </span>
        </button>

        <button
          onClick={() => setActiveTab('heads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'heads'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>{isDeptHead ? 'حسابي الإداري المعتمد' : 'هيكل مسؤولي الأقسام والحسابات'}</span>
          <span className="bg-amber-400/20 text-amber-800 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/30">
            {isDeptHead ? 'رئيس القسم' : '04 حسابات'}
          </span>
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('independence')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'independence'
                ? 'bg-linear-to-r from-emerald-700 to-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>التحكم الشامل والنسخ الاحتياطي</span>
            <span className="bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
              مستقل 100%
            </span>
          </button>
        )}

        {/* Shortcut to Pedagogical Bridge Modal */}
        {onOpenPedagogicalBridge && (
          <button
            onClick={onOpenPedagogicalBridge}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-linear-to-r from-teal-700 to-emerald-700 text-white hover:opacity-95 transition-all cursor-pointer shadow-xs border border-emerald-400/40"
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>همزة الوصل بين الأستاذ والطالب</span>
          </button>
        )}
      </div>

      {/* TAB 0: DEPARTMENT CONTENT & FULL MANAGEMENT (تعديل كامل وإضافة شاملة) */}
      {activeTab === 'dept_content' && (() => {
        const effectiveDept = (isDeptHead && userDeptId ? userDeptId : selectedDeptForStats) || 'physics';
        return (
          <div className="space-y-6">
            {/* If Super Admin, allow selecting department */}
            {isSuperAdmin && (
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0B3D91]" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    اختر القسم الذي تريد تعديل وتخصيص محتوياته بصفتك المشرف العام:
                  </span>
                </div>
                <select
                  value={selectedDeptForStats}
                  onChange={(e) => setSelectedDeptForStats(e.target.value as DepartmentId)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-[#0B3D91] dark:text-blue-300 cursor-pointer"
                >
                  <option value="physics">قسم الفيزياء (Physique)</option>
                  <option value="chemistry">قسم الكيمياء (Chimie)</option>
                  <option value="math">قسم الرياضيات (Mathématiques)</option>
                  <option value="common_sm">جذع مشترك علوم المادة (TC-SM)</option>
                </select>
              </div>
            )}

            <DepartmentContentManager
              deptId={effectiveDept}
              departments={customDepartments}
              onSaveDepartments={(depts) => onUpdateDepartments?.(depts)}
              modules={customModules}
              onSaveModules={(mods) => onUpdateModules?.(mods)}
              facultyTeachers={facultyTeachers}
              onSaveFacultyTeachers={(tch) => onUpdateFacultyTeachers?.(tch)}
              currentUser={currentUser}
              onShowToast={onShowToast}
            />
          </div>
        );
      })()}

      {/* TAB 1: ANALYTICS & DASHBOARD */}
      {activeTab === 'analytics' && (() => {
        const currentDeptStats = userDeptId ? departmentStats?.[userDeptId] : null;
        const deptStudents = currentDeptStats?.studentsCount ?? (userDeptInfo?.stats.students || 850);
        const deptTeachers = currentDeptStats?.teachersCount ?? (userDeptInfo?.stats.teachers || 45);
        const deptSuccessRate = currentDeptStats?.successRateS1 ?? 78.4;
        const deptPendingReqs = scopedRequests.filter(r => r.status === 'قيد المعالجة').length;
        const deptTdAtt = currentDeptStats?.tdAttendanceRate ?? 91.3;
        const deptTpAtt = currentDeptStats?.tpAttendanceRate ?? 96.8;
        const deptPfe = currentDeptStats?.pfeCount ?? 28;
        const deptSpecialties = currentDeptStats?.specialtiesCount ?? (userDeptInfo?.specialties.length || 4);

        return (
          <div className="space-y-6">
            {/* If Dept Head: Show specialized banner */}
            {isDeptHead && userDeptId && (
              <div className="bg-linear-to-r from-emerald-950 via-[#0B3D91] to-slate-900 border border-emerald-500/40 p-5 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                        مؤشرات حصرية
                      </span>
                      <span className="text-xs text-emerald-300 font-bold">لوحة أداء {userDeptName}</span>
                    </div>
                    <h2 className="text-base font-black text-white mt-1">مؤشرات وإحصائيات قسمك الأكاديمية</h2>
                  </div>
                </div>
                <div className="text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-slate-200">
                  السنة الجامعية 2025 / 2026
                </div>
              </div>
            )}

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isDeptHead ? `طلبة ${userDeptName}` : 'إجمالي الطلبة المسجلين بالكلية'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {isDeptHead ? deptStudents.toLocaleString() : '3,450'}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0B3D91] dark:text-blue-400 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>
                    {isDeptHead
                      ? `ليسانس: ${currentDeptStats?.studentsLicence || Math.round(deptStudents * 0.65)} | ماستر: ${currentDeptStats?.studentsMaster || Math.round(deptStudents * 0.35)}`
                      : '+6.2% مقارنة بالسنة الماضية'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isDeptHead ? `أساتذة ${userDeptName}` : 'هيئة التدريس والأساتذة'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {isDeptHead ? deptTeachers : '185'}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>
                    {isDeptHead
                      ? `${currentDeptStats?.professorsCount || Math.round(deptTeachers * 0.25)} برتبة أستاذ تعليم عالي`
                      : 'بينهم 48 أستاذ تعليم عالي (Professeur)'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isDeptHead ? `نسبة النجاح بـ ${userDeptName} (S1)` : 'نسبة النجاح العامة (S1)'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {isDeptHead ? `${deptSuccessRate}%` : '78.4%'}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>
                    {isDeptHead
                      ? `السداسي الثاني المتوقع: ${currentDeptStats?.successRateS2 || 79.1}%`
                      : 'أعلى نسبة في قسم الكيمياء (82.1%)'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isDeptHead ? `طلبات ${userDeptName} قيد المعالجة` : 'طلبات الوثائق قيد المعالجة'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                      {deptPendingReqs}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>
                    {isDeptHead
                      ? `إجمالي طلبات قسمك: ${scopedRequests.length} طلب`
                      : 'متوسط وقت المعالجة: أقل من 24 ساعة'}
                  </span>
                </div>
              </div>
            </div>

            {/* Graphical Representation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#0B3D91] dark:text-blue-400" />
                    <span>
                      {isDeptHead
                        ? `توزيع طلبة ${userDeptName} حسب الأطوار (LMD)`
                        : 'توزيع الطلبة حسب الأقسام والتخصصات'}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">السنة الحالية</span>
                </div>

                {isDeptHead ? (
                  <div className="space-y-3.5 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>طور الليسانس (L1, L2, L3)</span>
                        <span className="font-mono">
                          {currentDeptStats?.studentsLicence || Math.round(deptStudents * 0.65)} طالب (65%)
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>طور الماستر (M1, M2)</span>
                        <span className="font-mono">
                          {currentDeptStats?.studentsMaster || Math.round(deptStudents * 0.30)} طالب (30%)
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>طور الدكتوراه والبحث</span>
                        <span className="font-mono">
                          {currentDeptStats?.studentsDoctorat || Math.round(deptStudents * 0.05)} طالب (5%)
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '5%' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>جذع مشترك علوم المادة (TC-SM)</span>
                        <span className="font-mono">980 طالب (28.4%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '28.4%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>قسم الفيزياء (Physique)</span>
                        <span className="font-mono">890 طالب (25.8%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25.8%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>قسم الكيمياء (Chimie)</span>
                        <span className="font-mono">860 طالب (24.9%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '24.9%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>قسم الرياضيات (Mathématiques)</span>
                        <span className="font-mono">720 طالب (20.9%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: '20.9%' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart 2: Attendance & Success Metrics */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>
                      {isDeptHead
                        ? `مؤشرات الانضباط والنتائج بـ ${userDeptName}`
                        : 'مؤشرات الحضور ونسب النجاح بالسداسيات'}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">تقييم LMD</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
                    <div className="text-2xl font-black text-[#0B3D91] dark:text-blue-400">
                      {isDeptHead ? `${deptTdAtt}%` : '91.3%'}
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">نسبة حضور الأعمال الموجهة (TD)</div>
                    <p className="text-[11px] text-slate-500 mt-1">معدل الانضباط الأكاديمي</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {isDeptHead ? `${deptTpAtt}%` : '96.8%'}
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">نسبة حضور الأعمال التطبيقية (TP)</div>
                    <p className="text-[11px] text-slate-500 mt-1">التزام مخبري ممتاز</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {isDeptHead ? `${deptSpecialties} مسارات` : '83.5%'}
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      {isDeptHead ? 'تخصصات ليسانس وماستر' : 'نسبة النجاح في الليسانس (L3)'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isDeptHead ? 'عروض تكوين معتمدة' : 'نتائج مقبولة جداً'}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {isDeptHead ? `${deptPfe} مذكرة` : '92.0%'}
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      {isDeptHead ? 'مشاريع التخرج PFE' : 'نسبة مناقشة مذكرات الماستر (M2)'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isDeptHead ? 'قيد التأطير والمتابعة' : 'مشاريع تخرج مكتملة'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 2: DOCUMENT REQUESTS WORKFLOW */}
      {activeTab === 'requests' && (
        <div id="requests-section" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-6">
          {/* Guide Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800/60 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-black">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  شباك معالجة طلبات الوثائق الرسمية للطلبة (شهادات التمدرس وكشوف النقاط):
                </span>
                <span className="text-slate-600 dark:text-slate-400 mt-0.5 block">
                  اضغط الزر الأخضر <strong>[موافقة]</strong> لاعتماد الوثيقة فوراً، أو الزر الأحمر <strong>[رفض]</strong>، أو زر الطابعة 🖨️ <strong>[طباعة]</strong> لتوليد الشهادة الرسمية الموثقة بباركود الكلية.
                </span>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap border border-amber-300">
              {filteredRequests.length} طلبات في هذا الجدول
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isDeptHead ? `شباك طلبات الوثائق الإدارية لطلبة ${userDeptName}` : 'شباك طلبات الوثائق الإدارية الواردة من الطلبة'}
                </h2>
                {isDeptHead && (
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    خاص بطلبة قسمك فقط
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isDeptHead
                  ? `متابعة ومعالجة كشوف النقاط وشهادات التمدرس لطلبة ${userDeptName} حصراً.`
                  : 'متابعة وتحديث حالة شهادات التمدرس، كشوف النقاط، وبطاقات الطالب لجميع أقسام الكلية.'}
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  placeholder="بحث بالطالب أو رقم التسجيل..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 pr-9 pl-3 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>

              {/* Department Indicator: Selector for Super Admin, Locked Badge for Department Head */}
              {isSuperAdmin ? (
                <select
                  value={requestDeptFilter}
                  onChange={(e) => setRequestDeptFilter(e.target.value as any)}
                  className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                >
                  <option value="all">كافة الأقسام</option>
                  <option value="physics">قسم الفيزياء</option>
                  <option value="chemistry">قسم الكيمياء</option>
                  <option value="math">قسم الرياضيات</option>
                  <option value="common_sm">جذع مشترك علوم المادة</option>
                </select>
              ) : (
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>طلبات {userDeptName}</span>
                </div>
              )}

              <select
                value={requestFilterStatus}
                onChange={(e) => setRequestFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
              >
                <option value="all">كافة الحالات</option>
                <option value="قيد المعالجة">قيد المعالجة</option>
                <option value="مقبول وجاهز للاستلام">جاهز للاستلام</option>
                <option value="مرفوض">مرفوض</option>
              </select>
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">رمز التتبع</th>
                  <th className="p-3">الطالب</th>
                  <th className="p-3">القسم / المستوى</th>
                  <th className="p-3">نوع الوثيقة المطلوبة</th>
                  <th className="p-3">تاريخ الإيداع</th>
                  <th className="p-3">الحالة الحالية</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      لا توجد طلبات تطابق معايير البحث الحالية.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#0B3D91] dark:text-blue-400">
                        {req.trackingCode}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{req.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{req.matricule}</div>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">
                        {req.level}
                      </td>
                      <td className="p-3 font-medium">
                        {req.requestType === 'certificat_scolarite' && 'شهادة تمدرس رسمية'}
                        {req.requestType === 'releve_de_notes' && 'كشف نقاط فصلي'}
                        {req.requestType === 'carte_etudiant' && 'بطاقة طالب ممغنطة'}
                        {req.requestType === 'changement_groupe' && 'طلب تغيير الفوج'}
                      </td>
                      <td className="p-3 text-slate-500 font-mono">
                        {req.dateSubmitted}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            req.status === 'مقبول وجاهز للاستلام'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : req.status === 'قيد المعالجة'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          {req.status === 'مقبول وجاهز للاستلام' && <CheckCircle2 className="w-3 h-3" />}
                          {req.status === 'قيد المعالجة' && <Clock className="w-3 h-3" />}
                          {req.status === 'مرفوض' && <AlertCircle className="w-3 h-3" />}
                          <span>{req.status}</span>
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {req.status !== 'مقبول وجاهز للاستلام' && (
                            <button
                              onClick={() => {
                                onUpdateRequestStatus(req.id, 'مقبول وجاهز للاستلام', 'تمت الموافقة وتوقيع الوثيقة رسمياً.');
                                onShowToast('تمت الموافقة على الطلب', `الوثيقة ${req.trackingCode} أصبحت جاهزة للاستلام.`, 'success');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="الموافقة والتأشير"
                            >
                              موافقة
                            </button>
                          )}

                          {req.status !== 'مرفوض' && (
                            <button
                              onClick={() => {
                                onUpdateRequestStatus(req.id, 'مرفوض', 'يرجى مراجعة إدارة شؤون الطلبة لاستكمال الملف.');
                                onShowToast('تم رفض الطلب', `تم تحديث حالة ${req.trackingCode} إلى مرفوض.`, 'warning');
                              }}
                              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="رفض"
                            >
                              رفض
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onGenerateDocument(req.requestType, {
                                studentName: req.studentName,
                                matricule: req.matricule,
                                specialty: req.level,
                                date: req.dateSubmitted,
                                department: req.departmentId
                              });
                            }}
                            className="p-1 text-slate-600 hover:text-[#0B3D91] dark:text-slate-300 transition-colors cursor-pointer"
                            title="معاينة وطباعة الوثيقة"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                إدارة ونشر الأخبار والإعلانات الرسمية
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                تظهر الإعلانات المنشورة فوراً في الصفحة الرئيسية وبوابات الطلبة والأساتذة.
              </p>
            </div>

            <button
              onClick={() => setIsAddAnnouncementOpen(true)}
              className="bg-[#0B3D91] hover:bg-[#093275] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إعلان رسمي جديد</span>
            </button>
          </div>

          {/* DIRECT INLINE ANNOUNCEMENT PUBLISHING CARD (خانات كتابة ونشر إعلان جديد) */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-blue-950/30 p-5 rounded-2xl border-2 border-[#0B3D91]/40 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#0B3D91] text-white">
                  <Bell className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    خانات كتابة ونشر إعلان جديد مباشرة
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    املأ الخانات أدناه ثم اضغط "نشر هذا الإعلان الآن" ليظهر فوراً في واجهة الطلبة والأساتذة.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-[#0B3D91] dark:bg-blue-900/60 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200">
                {isDeptHead ? `خاص بـ ${userDeptName}` : 'نشر عام بالكلية'}
              </span>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    1. عنوان الإعلان *:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: رزنامة الامتحانات الاستدراكية، توزيع الأفواج، إعلان هام للطلبة..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#0B3D91] rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    2. تصنيف الإعلان:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="pedagogical">بيداغوجي وتدريس</option>
                    <option value="exams">امتحانات وتقييم</option>
                    <option value="deliberations">مداولات ونتائج</option>
                    <option value="scientific">علمي ومخابر</option>
                    <option value="administrative">إداري وتنظيمي</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    3. نص وتفاصيل الإعلان بالكامل *:
                  </label>
                  <textarea
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="اكتب التوجيهات والمعلومات التي تود إبلاغ الطلبة أو الأساتذة بها هنا بالتفصيل..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#0B3D91] rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      4. الفئة المستهدفة:
                    </label>
                    <select
                      value={newAudience}
                      onChange={(e) => setNewAudience(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2.5 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="all">كافة منتسبي الكلية</option>
                      <option value="students">الطلبة فقط</option>
                      <option value="teachers">الأساتذة فقط</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inlinePinned"
                      checked={newIsPinned}
                      onChange={(e) => setNewIsPinned(e.target.checked)}
                      className="w-4 h-4 text-[#0B3D91] rounded border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="inlinePinned" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      تثبيت بأعلى اللوحة 📌
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#0B3D91] hover:bg-[#082d6b] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>📢 نشر هذا الإعلان الآن</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Announcements Grid / List */}
          {scopedAnnouncements.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="font-bold text-xs">لا توجد إعلانات منشورة لهذا القسم حالياً.</p>
              <p className="text-[11px] text-slate-500 mt-1">يمكنك نشر أول إعلان لقسمك بالضغط على زر "إضافة إعلان رسمي جديد".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scopedAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-xl border transition-all ${
                    ann.isPinned
                      ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0B3D91] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {ann.category === 'exams' && 'امتحانات'}
                          {ann.category === 'deliberations' && 'مداولات'}
                          {ann.category === 'pedagogical' && 'بيداغوجي'}
                          {ann.category === 'scientific' && 'علمي'}
                          {ann.category === 'administrative' && 'إداري'}
                        </span>
                        {ann.isPinned && (
                          <span className="bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            مثبت بأعلى اللوحة
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">{ann.date}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {ann.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف الإعلان: "${ann.title}"؟`)) {
                          onDeleteAnnouncement(ann.id);
                          onShowToast('تم حذف الإعلان', 'تم حذف الإعلان من كافة المنصات.', 'info');
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      title="حذف الإعلان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {ann.content}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>المستهدفون: {ann.targetAudience === 'all' ? 'الجميع' : ann.targetAudience === 'students' ? 'الطلبة فقط' : 'الأساتذة فقط'}</span>
                    <span>الناشر: {ann.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USERS DIRECTORY (STUDENTS & TEACHERS) */}
      {activeTab === 'directory' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                دليل الكلية الموحد (الطلبة والأساتذة)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                قاعدة بيانات شاملة للتواصل والبحث الأكاديمي.
              </p>
            </div>

            {/* Toggle Student / Teacher view */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setDirectoryType('students')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  directoryType === 'students'
                    ? 'bg-white dark:bg-slate-800 text-[#0B3D91] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                قائمة الطلبة
              </button>
              <button
                onClick={() => setDirectoryType('teachers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  directoryType === 'teachers'
                    ? 'bg-white dark:bg-slate-800 text-[#0B3D91] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                قائمة الأساتذة
              </button>
            </div>
          </div>

          {/* Search bar & Department Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder={directoryType === 'students' ? 'ابحث باسم الطالب، رقم التسجيل، أو التخصص...' : 'ابحث باسم الأستاذ، الرتبة، أو المقياس...'}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            {isSuperAdmin ? (
              <select
                value={directoryDept}
                onChange={(e) => setDirectoryDept(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 px-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
              >
                <option value="all">كافة الأقسام بالكلية</option>
                <option value="physics">قسم الفيزياء</option>
                <option value="chemistry">قسم الكيمياء</option>
                <option value="math">قسم الرياضيات</option>
                <option value="common_sm">جذع مشترك علوم المادة</option>
              </select>
            ) : (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs shrink-0 whitespace-nowrap">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>دليل {userDeptName} فقط</span>
              </div>
            )}
          </div>

          {/* Directory Content Table */}
          {directoryType === 'students' ? (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">رقم التسجيل</th>
                    <th className="p-3">اسم الطالب</th>
                    <th className="p-3">القسم / التخصص</th>
                    <th className="p-3">الفوج</th>
                    <th className="p-3">البريد الجامعي</th>
                    <th className="p-3">الحالة الأكاديمية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scopedMockStudents
                    .filter(s => s.name.includes(directorySearch) || s.matricule.includes(directorySearch) || s.level.includes(directorySearch))
                    .map((st) => (
                      <tr key={st.matricule} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                        <td className="p-3 font-mono font-bold text-[#0B3D91] dark:text-blue-400">{st.matricule}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{st.name}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{st.level}</td>
                        <td className="p-3 font-medium">{st.group}</td>
                        <td className="p-3 font-mono text-slate-500">{st.email}</td>
                        <td className="p-3">
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full text-[11px]">
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">الأستاذ</th>
                    <th className="p-3">الرتبة العلمية</th>
                    <th className="p-3">القسم</th>
                    <th className="p-3">المقاييس المدرسة</th>
                    <th className="p-3">المكتب / المخبر</th>
                    <th className="p-3">البريد المهني</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scopedMockTeachers
                    .filter(t => t.name.includes(directorySearch) || t.modules.includes(directorySearch) || t.dept.includes(directorySearch))
                    .map((tc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{tc.name}</td>
                        <td className="p-3 text-amber-700 dark:text-amber-400 font-medium">{tc.grade}</td>
                        <td className="p-3 font-medium">{tc.dept}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{tc.modules}</td>
                        <td className="p-3 text-slate-500">{tc.office}</td>
                        <td className="p-3 font-mono text-[#0B3D91] dark:text-blue-400">{tc.email}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REAL DEPARTMENT & FACULTY STATISTICS */}
      {activeTab === 'stats' && (() => {
        const effectiveDept = (isDeptHead && userDeptId ? userDeptId : selectedDeptForStats) || 'common_sm';
        const currentRealStats = departmentStats?.[effectiveDept];
        const deptHead = departmentHeads?.find(h => h.departmentId === effectiveDept);
        const deptStatic = DEPARTMENTS[effectiveDept];

        const studentsTotal = currentRealStats?.studentsCount ?? deptStatic?.stats?.students ?? 0;
        const teachersTotal = currentRealStats?.teachersCount ?? deptStatic?.stats?.teachers ?? 0;
        const specialtiesTotal = currentRealStats?.specialtiesCount ?? deptStatic?.stats?.specialtiesCount ?? 0;
        const labsTotal = currentRealStats?.laboratoriesCount ?? deptStatic?.stats?.laboratories ?? 0;

        return (
          <div className="space-y-6">
            {/* Header Card with Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {isDeptHead ? `مؤشرات وإحصائيات ${userDeptName} المعتمدة` : 'نظام الإحصائيات والأرقام الحقيقية المعتمدة'}
                    </h2>
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      {isDeptHead ? 'خاص بقسمك' : 'قاعدة بيانات حية'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {isDeptHead
                      ? `بصفتك مسؤول ${userDeptName}، يمكنك اعتماد وتعديل الأرقام الحقيقية لأعداد الطلبة والأساتذة ونسب النجاح الخاصة بقسمك حصراً وطباعة الكشف الرسمي.`
                      : 'يمكن لمسؤولي الأقسام ومشرف المنصة إدخال واعتماد الأرقام الحقيقية لأعداد الطلبة، الأساتذة، ومؤشرات النجاح والغياب لكل قسم على حدة، مع إمكانية طباعة الكشوف الرسمية.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenStatsEditor?.(effectiveDept)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isDeptHead ? `تعديل أرقام ${userDeptName}` : 'تعديل واعتماد الأرقام الحقيقية'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintingStatsDept(effectiveDept)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-300 dark:border-slate-600"
                  >
                    <Printer className="w-4 h-4 text-[#0B3D91] dark:text-blue-400" />
                    <span>{isDeptHead ? `طباعة كشف ${userDeptName}` : 'طباعة الكشف الإحصائي'}</span>
                  </button>

                  {isSuperAdmin && onResetAllStatsToDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('هل تريد فعلاً إعادة تعيين الإحصائيات إلى القيم الافتراضية؟')) {
                          onResetAllStatsToDefault();
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                      title="إعادة ضبط القيم الافتراضية"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Department Selection Switcher: for Super Admin show all 4, for Dept Head show locked indicator */}
              {isSuperAdmin ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                  {[
                    { id: 'common_sm' as DepartmentId, name: 'جذع مشترك علوم المادة', short: 'TC-SM', icon: Layers, color: 'emerald' },
                    { id: 'physics' as DepartmentId, name: 'قسم الفيزياء', short: 'Physique', icon: Atom, color: 'sky' },
                    { id: 'chemistry' as DepartmentId, name: 'قسم الكيمياء', short: 'Chimie', icon: FlaskConical, color: 'amber' },
                    { id: 'math' as DepartmentId, name: 'قسم الرياضيات', short: 'Math', icon: Binary, color: 'indigo' },
                  ].map((d) => {
                    const Icon = d.icon;
                    const isSelected = selectedDeptForStats === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDeptForStats(d.id)}
                        className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#0B3D91]/10 border-[#0B3D91] dark:bg-blue-950/40 dark:border-blue-500 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#0B3D91] text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-500">{d.short}</span>
                        </div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{d.name}</div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-emerald-950 dark:text-emerald-100">
                          نطاق الصلاحيات: {userDeptName}
                        </span>
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                          قسمك الإداري المعتمد
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                        هذه اللوحة مخصصة لعرض وإدارة الأرقام الحقيقية ونسب النجاح والغياب الخاصة بـ {userDeptName} حصراً.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* IN-PLACE DIRECT EDITING FORM (خانات التعديل المباشر لأرقام القسم) */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-slate-800 dark:via-slate-850 dark:to-emerald-950/30 p-6 rounded-3xl border-2 border-emerald-500/60 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        خانات التعديل المباشرة
                      </span>
                      <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                        {deptStatic?.nameAr}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      تعديل أرقام ونسب {deptStatic?.nameAr} مباشرة
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      اكتب الأرقام في الخانات أدناه ثم اضغط على زر "حفظ واعتماد التغييرات" لتُحفظ فوراً في المنصة.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveInlineStats(effectiveDept)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ واعتماد التغييرات</span>
                </button>
              </div>

              {/* Grid of 8 Editable Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Students */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    1. إجمالي عدد الطلبة:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inlineStats.studentsCount ?? studentsTotal}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, studentsCount: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">طالب مقيد بالقسم</span>
                </div>

                {/* 2. Teachers */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    2. عدد الأساتذة المؤطرين:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inlineStats.teachersCount ?? teachersTotal}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, teachersCount: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">أستاذ في هيئة التدريس</span>
                </div>

                {/* 3. Specialties */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    3. تخصصات التكوين (LMD):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inlineStats.specialtiesCount ?? specialtiesTotal}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, specialtiesCount: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">تخصصات ليسانس وماستر</span>
                </div>

                {/* 4. Labs */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    4. مخابر البحث المعتمدة:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inlineStats.laboratoriesCount ?? labsTotal}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, laboratoriesCount: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">مخابر بحث نشطة</span>
                </div>

                {/* 5. Success S1 */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    5. نسبة نجاح السداسي الأول S1 (%):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={inlineStats.successRateS1 ?? (currentRealStats?.successRateS1 ?? 84.5)}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, successRateS1: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-emerald-600 block font-bold">% نسبة النجاح الرسمية S1</span>
                </div>

                {/* 6. Success S2 */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    6. نسبة نجاح السداسي الثاني S2 (%):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={inlineStats.successRateS2 ?? (currentRealStats?.successRateS2 ?? 88.0)}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, successRateS2: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-emerald-600 block font-bold">% نسبة النجاح الرسمية S2</span>
                </div>

                {/* 7. TD Attendance */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    7. نسبة حضور الأعمال الموجهة TD (%):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={inlineStats.tdAttendanceRate ?? (currentRealStats?.tdAttendanceRate ?? 92.0)}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, tdAttendanceRate: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">% مؤشر الانضباط والحضور TD</span>
                </div>

                {/* 8. TP Attendance */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-750 focus-within:border-emerald-500 shadow-xs space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    8. نسبة حضور الأعمال التطبيقية TP (%):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={inlineStats.tpAttendanceRate ?? (currentRealStats?.tpAttendanceRate ?? 95.0)}
                    onChange={(e) => setInlineStats(prev => ({ ...prev, tpAttendanceRate: Number(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">% مؤشر الانضباط بالمخابر TP</span>
                </div>
              </div>

              {/* Bottom Action Bar with Big Save Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
                <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    الناشر المعتمد لهذه الأرقام:{' '}
                    <strong className="text-slate-900 dark:text-white">{currentUser?.name || deptHead?.fullName || 'رئيس القسم'}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveInlineStats(effectiveDept)}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>💾 حفظ واعتماد هذه الأرقام للقسم فوراً</span>
                </button>
              </div>
            </div>

            {/* Department Real Stats Detail */}
            <div className="space-y-6">
              {/* Department Info & Manager Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-blue-200 font-bold mb-1">
                      بطاقة المؤشرات الحقيقية المعتمدة
                    </div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <span>{deptStatic?.nameAr}</span>
                      <span className="text-xs font-mono font-normal bg-white/20 px-2 py-0.5 rounded text-blue-100">
                        {deptStatic?.nameFr}
                      </span>
                    </h3>
                    <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
                      {deptStatic?.description}
                    </p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl border border-white/15 min-w-[240px]">
                    <div className="text-[11px] text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>مسؤول القسم المشرف على المعطيات:</span>
                    </div>
                    <div className="font-bold text-sm text-white">{deptHead?.fullName || 'رئيس القسم المكلف'}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{deptHead?.academicTitle || 'أستاذ محاضر'} • مكتب {deptHead?.officeRoom || 'العمادة'}</div>
                    <div className="text-[11px] text-blue-200 font-mono mt-1">{deptHead?.email || 'dept@univ-ouargla.dz'}</div>
                  </div>
                </div>
              </div>

                {/* Main 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Students Card */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي الطلبة المسجلين</span>
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                      {studentsTotal.toLocaleString()}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>طلبة طور الليسانس:</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {(currentRealStats?.studentsLicence ?? Math.round(studentsTotal * 0.75)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>طلبة طور الماستر:</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {(currentRealStats?.studentsMaster ?? Math.round(studentsTotal * 0.25)).toLocaleString()}
                        </span>
                      </div>
                      {currentRealStats?.studentsDoctorate !== undefined && (
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>طلبة الدكتوراه:</span>
                          <span className="font-bold font-mono text-slate-900 dark:text-white">
                            {currentRealStats.studentsDoctorate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teachers Card */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">هيئة التدريس والمؤطرين</span>
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                      {teachersTotal.toLocaleString()}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>أساتذة التعليم العالي (بروفيسور):</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {currentRealStats?.professorsCount ?? 12}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>أساتذة محاضرون (أ / ب):</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {currentRealStats?.docentsCount ?? 26}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>أساتذة مساعدون وباحثون:</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {currentRealStats?.assistantProfessorsCount ?? 14}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties & Research Card */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">التكوين ومشاريع التخرج</span>
                      <BookOpen className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                      {specialtiesTotal} <span className="text-xs font-normal text-slate-500">تخصصاً</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>مذكرات التخرج (PFE):</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {currentRealStats?.pfeCount ?? 42}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>قاعات التدريس المخصصة:</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {currentRealStats?.classroomsCount ?? 10}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>مخابر بيداغوجية وبحثية:</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {labsTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pedagogical Success & Attendance Card */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">مؤشرات النجاح والحضور</span>
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {currentRealStats?.successRateS1 ?? 84.5}%
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>نسبة نجاح السداسي الأول S1:</span>
                        <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                          {currentRealStats?.successRateS1 ?? 84.5}%
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>نسبة نجاح السداسي الثاني S2:</span>
                        <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                          {currentRealStats?.successRateS2 ?? 88.0}%
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>نسبة حضور الأعمال TD:</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {currentRealStats?.tdAttendanceRate ?? 92.0}%
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>نسبة حضور المخابر TP:</span>
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {currentRealStats?.tpAttendanceRate ?? 95.0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit & Legal Notes Box */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700 dark:text-slate-300">
                      <strong>حالة التوثيق:</strong> تم اعتماد ومصادقة هذه الأرقام بتاريخ{' '}
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentRealStats?.lastUpdatedDate || '2025-02-15'}</span>{' '}
                      بواسطة <span className="font-bold text-[#0B3D91] dark:text-blue-400">{currentRealStats?.lastUpdatedBy || deptHead?.fullName || 'رئيس القسم'}</span>.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenStatsEditor?.(effectiveDept)}
                    className="text-xs font-bold text-[#0B3D91] dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>تعديل هذا القسم الآن</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Faculty Overview Aggregated Strip (Super Admin Only) */}
                {isSuperAdmin && facultyStats && (
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                      <span>إجمالي الأرقام على مستوى الكلية ككل ({facultyStats.academicYear})</span>
                      <span className="text-xs text-slate-500 font-normal">جامعة قاصدي مرباح ورقلة</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
                        <div className="text-xl font-black text-[#0B3D91] dark:text-blue-400 font-mono">
                          {facultyStats.totalStudents.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">إجمالي الطلبة بالكلية</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
                        <div className="text-xl font-black text-amber-600 font-mono">
                          {facultyStats.totalTeachers.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">إجمالي الأساتذة المؤطرين</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
                        <div className="text-xl font-black text-sky-600 font-mono">
                          {facultyStats.totalSpecialties}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">تخصصات ليسانس وماستر</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
                        <div className="text-xl font-black text-indigo-600 font-mono">
                          {facultyStats.totalLaboratories}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">مخابر بحث معتمدة</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl col-span-2 sm:col-span-1">
                        <div className="text-xl font-black text-emerald-600 font-mono">
                          {facultyStats.totalGraduatesLastYear}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">متخرجو الدفعة السابقة</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      {/* TAB 6: DEPARTMENT HEADS & ACCOUNTS GOVERNANCE */}
      {activeTab === 'heads' && (() => {
        const displayHeads = isDeptHead && userDeptId
          ? departmentHeads.filter(h => h.departmentId === userDeptId)
          : departmentHeads;

        return (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-500" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {isDeptHead ? `بطاقة الحساب الإداري لرئاسة ${userDeptName}` : 'هيكل مسؤولي الأقسام وإدارة الحسابات'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {isDeptHead
                      ? `بيانات الدخول والصلاحيات المعتمدة لحساب رئيس ${userDeptName} لإدارة شؤون وإحصائيات القسم.`
                      : 'تم تخصيص حساب مستقل لكل مسؤول قسم لإدارة إحصائياته ونشر إعلاناته ومتابعة شؤون طلبته، بإشراف عام من مدير المنصة.'}
                  </p>
                </div>

                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => onOpenHeadsManager?.()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>إدارة وتكليف مسؤولي الأقسام</span>
                  </button>
                )}
              </div>
            </div>

            {/* Super Admin Oversight Banner (Super Admin Only) */}
            {isSuperAdmin && (
              <div className="bg-gradient-to-r from-slate-900 via-[#0B3D91] to-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">مشرف المنصة العام (Super Admin)</span>
                      <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                        صلاحيات شاملة
                      </span>
                    </div>
                    <p className="text-xs text-blue-100/80 mt-0.5">
                      الحساب الإشرافي المركزي لمتابعة كافة أقسام الكلية، إدارة الشعارين، وتوزيع الصلاحيات.
                    </p>
                  </div>
                </div>

                <div className="text-xs bg-white/10 px-3 py-2 rounded-xl border border-white/10">
                  <span className="text-slate-300 block">اسم المستخدم المركزي:</span>
                  <span className="font-mono font-bold text-amber-300">admin@fmsm.dz / 029713891</span>
                </div>
              </div>
            )}

            {/* Department Heads Display */}
            <div className={`grid grid-cols-1 ${isDeptHead ? 'max-w-2xl' : 'md:grid-cols-2'} gap-4`}>
              {displayHeads.map((head) => {
                const deptStatic = DEPARTMENTS[head.departmentId];
                return (
                  <div 
                    key={head.id} 
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs flex flex-col justify-between"
                  >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#0B3D91] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                          {head.departmentNameAr}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                          {head.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {head.academicTitle} • {head.officeRoom}
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>اسم المستخدم للدخول:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{head.username}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>البريد الإلكتروني:</span>
                        <span className="font-mono text-blue-700 dark:text-blue-300">{head.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>الهاتف الداخلي:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{head.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      آخر دخول: {head.lastLogin || 'نشط'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDeptForStats(head.departmentId);
                          setActiveTab('stats');
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-[#0B3D91] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors cursor-pointer"
                      >
                        عرض الإحصائيات
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenStatsEditor?.(head.departmentId)}
                        className="px-2.5 py-1 text-xs font-bold bg-[#0B3D91] text-white hover:bg-blue-900 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>تعديل الأرقام</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })()}

      {/* STATS OFFICIAL PRINT MODAL */}
      {printingStatsDept && (() => {
        const stats = departmentStats?.[printingStatsDept];
        const dept = DEPARTMENTS[printingStatsDept];
        const head = departmentHeads?.find(h => h.departmentId === printingStatsDept);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white text-slate-950 rounded-2xl shadow-2xl p-8 border border-slate-300">
              {/* Top Controls (not printed) */}
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#0B3D91]" />
                  <h3 className="font-bold text-base text-slate-900">معاينة وطباعة الكشف الإحصائي الرسمي</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#0B3D91] text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الآن (Ctrl+P)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintingStatsDept(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Content Area */}
              <div className="space-y-6">
                {/* Official Algerian Republic Header */}
                <div className="text-center space-y-1 text-xs">
                  <p className="font-bold">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                  <p className="font-bold">وزارة التعليم العالي والبحث العلمي</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-b border-slate-200 py-3">
                    <img src={currentLogoUrl} alt="شعار الجامعة" className="h-16 w-16 object-contain" />
                    <div>
                      <h4 className="font-black text-sm text-slate-900">جامعة قاصدي مرباح ورقلة</h4>
                      <h5 className="font-bold text-xs text-slate-800">كلية الرياضيات وعلوم المادة</h5>
                      <p className="text-[11px] text-slate-600 mt-0.5">{dept?.nameAr}</p>
                    </div>
                    <img src={facultyLogoUrl} alt="شعار الكلية" className="h-16 w-16 object-contain" />
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center py-2 bg-slate-50 border border-slate-300 rounded-xl">
                  <h2 className="text-lg font-black text-slate-900">
                    كشف إحصائي رسمي ومؤشرات التكوين البيداغوجي
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    السنة الجامعية: {FACULTY_GENERAL_INFO.currentAcademicYear} • معتمد من رئاسة القسم
                  </p>
                </div>

                {/* Details Table */}
                <div className="border border-slate-300 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <tbody>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300">
                        <td className="p-3 w-1/3">البيان الإحصائي</td>
                        <td className="p-3 w-1/3">الرقم المعتمد</td>
                        <td className="p-3 w-1/3">ملاحظات وتفصيل</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold">إجمالي الطلبة المسجلين</td>
                        <td className="p-3 font-black text-slate-900 font-mono text-sm">{stats?.studentsCount ?? dept?.stats.students}</td>
                        <td className="p-3 text-slate-600">ليسانس: {stats?.studentsLicence || 0} | ماستر: {stats?.studentsMaster || 0}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold">هيئة التدريس والتأطير</td>
                        <td className="p-3 font-black text-slate-900 font-mono text-sm">{stats?.teachersCount ?? dept?.stats.teachers}</td>
                        <td className="p-3 text-slate-600">بروفيسور: {stats?.professorsCount || 0} | محاضر: {stats?.docentsCount || 0}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold">عروض التكوين المعتمدة</td>
                        <td className="p-3 font-black text-slate-900 font-mono text-sm">{stats?.specialtiesCount ?? dept?.stats.specialtiesCount}</td>
                        <td className="p-3 text-slate-600">تخصصات ليسانس وماستر</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold">مخابر البحث والأعمال التطبيقية</td>
                        <td className="p-3 font-black text-slate-900 font-mono text-sm">{stats?.laboratoriesCount ?? dept?.stats.laboratories}</td>
                        <td className="p-3 text-slate-600">مخابر معتمدة بيداغوجياً</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold">نسبة النجاح بالسداسي الأول (S1)</td>
                        <td className="p-3 font-black text-emerald-800 font-mono text-sm">{stats?.successRateS1 ?? 82.5}%</td>
                        <td className="p-3 text-slate-600">امتحانات الدورة العادية</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold">نسبة النجاح بالسداسي الثاني (S2)</td>
                        <td className="p-3 font-black text-emerald-800 font-mono text-sm">{stats?.successRateS2 ?? 85.0}%</td>
                        <td className="p-3 text-slate-600">النتائج التراكمية السنوية</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold">مذكرات التخرج المنجزة (PFE)</td>
                        <td className="p-3 font-black text-slate-900 font-mono text-sm">{stats?.pfeCount ?? 40}</td>
                        <td className="p-3 text-slate-600">أطوار الماستر والليسانس المهني</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">نسبة حضور الأعمال TD / TP</td>
                        <td className="p-3 font-black text-slate-900 font-mono text-sm">TD: {stats?.tdAttendanceRate}% | TP: {stats?.tpAttendanceRate}%</td>
                        <td className="p-3 text-slate-600">الالتزام البيداغوجي</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures & Stamp */}
                <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                  <div className="border border-slate-200 rounded-xl p-4">
                    <p className="font-bold text-slate-800">رئيس القسم المكلف</p>
                    <p className="font-bold text-[#0B3D91] mt-1">{head?.fullName || 'رئيس القسم'}</p>
                    <div className="h-16 mt-3 border-b border-dashed border-slate-300"></div>
                    <span className="text-[10px] text-slate-400 mt-1 block">الختم والتوقيع الرسمي</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4">
                    <p className="font-bold text-slate-800">عميد كلية الرياضيات وعلوم المادة</p>
                    <p className="font-bold text-[#0B3D91] mt-1">أ.د. عميد الكلية</p>
                    <div className="h-16 mt-3 border-b border-dashed border-slate-300"></div>
                    <span className="text-[10px] text-slate-400 mt-1 block">ختم وتوقيع العمادة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB: INDEPENDENCE & BACKUP MANAGEMENT (100% Host-Independent) */}
      {activeTab === 'independence' && (
        <div className="space-y-6">
          {/* Main Explanatory Banner answering User's Question */}
          <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-500/40 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-black text-white">
                    استقلالية الإدارة والتحكم الكامل في المنصة (100% Self-Managed)
                  </h3>
                  <span className="bg-emerald-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                    دون الحاجة للمستضيف أبداً
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  <strong>جواباً على تساؤلكم الكريم:</strong> عند رفع هذه المنصة على استضافة الجامعة (أو أي خادم محلي)، 
                  <strong> يمكنك التحكم والتعديل في كل تفصيل بالمنصة مباشرة من متصفحك دون الحاجة للرجوع إلى الشخص أو الفريق الذي استضافها لك</strong>، ولن تضطري لإزعاجه بأي حال من الأحوال!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 text-xs">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تعديل ونشر وحذف الإعلانات والأخبار فورياً</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تغيير كلمات المرور والبريد لجميع المسؤولين</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تحديث الإحصائيات الرسمية ونسب النجاح</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>معالجة وتوقيع وثائق وكشوف نقاط الطلبة</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>إدارة غرف الدردشة الأكاديمية (التلغرام)</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تنزيل واسترجاع نسخة احتياطية بنقرة واحدة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backup & Restore Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Full Database Export */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    تصدير نسخة احتياطية كاملة (Full Backup JSON)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    حفظ كافة بيانات المنصة في ملف آمن على حاسوبك الشخصي
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                يشمل هذا التصدير: كافة الإعلانات الصادرة، طلبات واستدعاءات الطلبة، إحصائيات أقسام الكلية، بيانات حسابات المسؤولين، وأرشيف محادثات غرف التواصل الأكاديمية.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExportFullDatabaseBackup}
                  className="w-full py-3 px-4 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل النسخة الاحتياطية الآن (.JSON)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Restore from Backup File */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    استرجاع بيانات من نسخة سابقة (Restore Backup)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    استعادة الإعدادات والبيانات من ملف JSON في ثوانٍ
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                إذا قمت بتغيير جهاز الحاسوب أو الرغبة في استرجاع إحصائيات وإعلانات سابقة تم تصديرها، يمكنك اختيار الملف من جهازك واستعادته فورياً بدون أي أوامر تقنية أو اتصال بمشرف الخادم.
              </p>

              <div className="pt-2">
                <label className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-dashed border-slate-300 dark:border-slate-600 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer hover:scale-[1.02]">
                  <Upload className="w-4 h-4 text-blue-500" />
                  <span>تحديد ملف النسخة الاحتياطية (.JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackupFromFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: STUDENTS REGISTRY (التحقق الأكاديمي المعتمد من القوائم الرسمية للكلية) */}
      {activeTab === 'students_registry' && (() => {
        const effectiveRegistryDept = isDeptHead && userDeptId ? userDeptId : studentRegistryDept;
        const filteredStudents = APPROVED_STUDENTS_LIST.filter(st => {
          const matchesDept = effectiveRegistryDept === 'all' || st.departmentId === effectiveRegistryDept;
          const matchesLevel = studentRegistryLevel === 'all' || st.level === studentRegistryLevel;
          const q = studentRegistrySearch.trim().toLowerCase();
          const matchesSearch = !q || 
            st.nomAr.includes(q) ||
            st.prenomAr.includes(q) ||
            st.nomFr.toLowerCase().includes(q) ||
            st.prenomFr.toLowerCase().includes(q) ||
            st.matriculeEtudiant.toLowerCase().includes(q) ||
            st.matriculeBac.toLowerCase().includes(q) ||
            st.specialty.includes(q);
          return matchesDept && matchesLevel && matchesSearch;
        });

        const totalEnrolled = isDeptHead && userDeptId
          ? APPROVED_STUDENTS_LIST.filter(s => s.departmentId === userDeptId).length
          : APPROVED_STUDENTS_LIST.length;

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Card */}
            <div className="bg-linear-to-br from-slate-900 via-[#0B3D91] to-emerald-950 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {isDeptHead ? `سجل طلبة ${userDeptName} المعتمد` : 'سجل الطلبة النظاميين المعتمد'}
                    </span>
                    <span className="text-xs text-blue-200">
                      السنة الجامعية 2025 / 2026
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black mt-1">
                    {isDeptHead ? `قاعدة بيانات طلبة ${userDeptName} المعتمدة` : 'قاعدة معطيات الطلبة المعتمدة للكلية'}
                  </h2>
                  <p className="text-xs text-blue-100/90 mt-0.5 max-w-xl leading-relaxed">
                    {isDeptHead
                      ? `القائمة الرسمية الحصرية لطلبة ${userDeptName}؛ مسؤولو القسم يشرفون حصراً على بيانات وانضباط طلبة قسمهم.`
                      : 'القائمة الرسمية لطلبة كلية الرياضيات وعلوم المادة؛ أي طالب يُدخل رقم تسجيله يتم التعرف عليه فورياً، بينما يتم تمييز غير المسجلين كـ "زائر".'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
                <div className="text-center">
                  <div className="text-xs text-slate-300 font-semibold">{isDeptHead ? `طلبة ${userDeptName}` : 'إجمالي الطلبة المقيدين'}</div>
                  <div className="text-2xl font-black text-amber-300">{totalEnrolled}</div>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="text-xs text-slate-300 font-semibold">المعروض حالياً</div>
                  <div className="text-2xl font-black text-emerald-300">{filteredStudents.length}</div>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={studentRegistrySearch}
                    onChange={(e) => setStudentRegistrySearch(e.target.value)}
                    placeholder="ابحث برقم التسجيل (Matricule)، رقم البكالوريا، أو اسم الطالب..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pr-9 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  {studentRegistrySearch && (
                    <button
                      type="button"
                      onClick={() => setStudentRegistrySearch('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      مسح
                    </button>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  {isSuperAdmin ? (
                    <select
                      value={studentRegistryDept}
                      onChange={(e) => setStudentRegistryDept(e.target.value as any)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">كافة الأقسام</option>
                      <option value="math">قسم الرياضيات</option>
                      <option value="chemistry">قسم الكيمياء</option>
                      <option value="physics">قسم الفيزياء</option>
                      <option value="common_sm">جذع مشترك علوم المادة</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>قسمك: {userDeptName}</span>
                    </div>
                  )}

                  <select
                    value={studentRegistryLevel}
                    onChange={(e) => setStudentRegistryLevel(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">كافة المستويات</option>
                    <option value="L1">سنة أولى (L1)</option>
                    <option value="L2">سنة ثانية (L2)</option>
                    <option value="L3">سنة ثالثة (L3)</option>
                    <option value="M1">ماستر 1 (M1)</option>
                    <option value="M2">ماستر 2 (M2)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold">
                    <tr>
                      <th className="py-3 px-4">رقم التسجيل الجامعي</th>
                      <th className="py-3 px-3">رقم البكالوريا</th>
                      <th className="py-3 px-4">اسم ولقب الطالب</th>
                      <th className="py-3 px-3">القسم</th>
                      <th className="py-3 px-3">المستوى والتخصص</th>
                      <th className="py-3 px-3">تاريخ ومكان الميلاد</th>
                      <th className="py-3 px-3">حالة القيد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          لا توجد نتائج مطابقة لبحثك في سجل الطلبة.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => (
                        <tr key={st.matriculeEtudiant} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#0B3D91] dark:text-blue-400">
                            {st.matriculeEtudiant}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                            {st.matriculeBac}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            <div>{st.nomAr} {st.prenomAr}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{st.nomFr} {st.prenomFr}</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                            {st.departmentNameAr}
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-md text-[11px] border border-blue-200 dark:border-blue-800">
                              {st.level}
                            </span>
                            <span className="mr-1 text-[11px] text-slate-500 dark:text-slate-400">{st.specialty}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                            {st.dateNaissance} {st.lieuNaissance ? `(${st.lieuNaissance})` : ''}
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>طالب نظامي معتمد</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isAddAnnouncementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-[#0B3D91] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-bold">نشر إعلان رسمي جديد للكلية</h3>
              </div>
              <button
                onClick={() => setIsAddAnnouncementOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان الإعلان *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: رزنامة الامتحانات الاستدراكية للسداسي الثاني..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تصنيف الإعلان
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                  >
                    <option value="exams">امتحانات واختبارات</option>
                    <option value="deliberations">مداولات ونتائج</option>
                    <option value="pedagogical">بيداغوجي وتسجيلات</option>
                    <option value="scientific">ندوات ومؤتمرات</option>
                    <option value="administrative">إداري ومسابقات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الجمهور المستهدف
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                  >
                    <option value="all">كافة منتسبي الكلية</option>
                    <option value="students">الطلبة فقط</option>
                    <option value="teachers">الأساتذة فقط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  القسم المعني
                </label>
                {isDeptHead && userDeptId ? (
                  <div className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 px-3 font-bold text-[#0B3D91] dark:text-blue-300 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{userDeptName} (نطاق نشر إعلانات قسمك)</span>
                  </div>
                ) : (
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                  >
                    <option value="all">كافة الأقسام بالكلية</option>
                    <option value="common_sm">جذع مشترك علوم المادة (TC-SM)</option>
                    <option value="physics">قسم الفيزياء</option>
                    <option value="chemistry">قسم الكيمياء</option>
                    <option value="math">قسم الرياضيات</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نص الإعلان والتفاصيل *
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="أدخل نص وتفاصيل الإعلان كاملة هنا..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinAnnouncement"
                  checked={newIsPinned}
                  onChange={(e) => setNewIsPinned(e.target.checked)}
                  className="w-4 h-4 text-[#0B3D91] rounded-sm focus:ring-[#0B3D91]"
                />
                <label htmlFor="pinAnnouncement" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  تثبيت هذا الإعلان في أعلى اللوحة (Pinned Announcement)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAnnouncementOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0B3D91] hover:bg-[#093275] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  نشر الإعلان الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
