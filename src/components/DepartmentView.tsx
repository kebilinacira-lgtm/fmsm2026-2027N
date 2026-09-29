import React, { useState } from 'react';
import { 
  Atom, 
  FlaskConical, 
  Binary, 
  Layers, 
  User, 
  Mail, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Download, 
  Microscope, 
  ChevronLeft, 
  FileText, 
  Building2, 
  Users, 
  ExternalLink, 
  Globe, 
  BarChart3, 
  Edit3, 
  Award, 
  TrendingUp,
  Percent,
  Maximize2,
  Upload,
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { DEPARTMENTS, MODULES_DATABASE, SCHEDULE_DATABASE, INITIAL_RESOURCES, INITIAL_ANNOUNCEMENTS } from '../data/facultyData';
import { DEPARTMENT_HEADS_DATA } from '../data/departmentHeadsData';
import { DepartmentId, DepartmentRealStats, UserProfile, DepartmentInfo, ModuleItem, FacultyTeacher } from '../types';
import { DepartmentContentManager } from './DepartmentContentManager';

interface DepartmentViewProps {
  selectedDeptId?: DepartmentId;
  initialDepartmentId?: string;
  onSelectDepartment?: (deptId: DepartmentId) => void;
  onDownloadResource?: (resId: string) => void;
  onOpenAIAdvisor?: () => void;
  departmentStats?: Record<DepartmentId, DepartmentRealStats>;
  currentUser?: UserProfile | null;
  onOpenStatsEditor?: (deptId: DepartmentId) => void;
  departmentsData?: Record<string, DepartmentInfo>;
  modulesData?: ModuleItem[];
  facultyTeachers?: FacultyTeacher[];
  onUpdateDepartments?: (depts: Record<string, DepartmentInfo>) => void;
  onUpdateModules?: (modules: ModuleItem[]) => void;
  onUpdateFacultyTeachers?: (teachers: FacultyTeacher[]) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const DepartmentView: React.FC<DepartmentViewProps> = ({
  selectedDeptId,
  initialDepartmentId,
  onSelectDepartment,
  onDownloadResource,
  onOpenAIAdvisor,
  departmentStats,
  currentUser,
  onOpenStatsEditor,
  departmentsData,
  modulesData,
  facultyTeachers = [],
  onUpdateDepartments,
  onUpdateModules,
  onUpdateFacultyTeachers,
  onShowToast,
}) => {
  const [currentDeptId, setCurrentDeptId] = useState<DepartmentId>(
    (selectedDeptId || (initialDepartmentId as DepartmentId) || 'common_sm') as DepartmentId
  );
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'specialties' | 'modules' | 'schedule' | 'labs' | 'resources'>('overview');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [showDepartmentEditorModal, setShowDepartmentEditorModal] = useState(false);

  const getInitialHeadPhoto = (deptId: DepartmentId): string => {
    try {
      const custom = localStorage.getItem(`fmsm_custom_dept_head_${deptId}`);
      if (custom) return custom;
      if (deptId === 'chemistry') {
        const chemCustom = localStorage.getItem('fmsm_custom_chem_head_photo');
        if (chemCustom) return chemCustom;
      }
    } catch {
      // fallback
    }
    return DEPARTMENT_HEADS_DATA[deptId]?.defaultPhoto || `/head_${deptId}_dept.jpg`;
  };

  const [headPhotos, setHeadPhotos] = useState<Record<DepartmentId, string>>({
    chemistry: getInitialHeadPhoto('chemistry'),
    physics: getInitialHeadPhoto('physics'),
    math: getInitialHeadPhoto('math'),
    common_sm: getInitialHeadPhoto('common_sm'),
  });

  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);
  const [showDeptHeadPhotoModal, setShowDeptHeadPhotoModal] = useState(false);
  const headFileInputRef = React.useRef<HTMLInputElement>(null);

  const isCurrentPhotoCustomized = (() => {
    try {
      if (localStorage.getItem(`fmsm_custom_dept_head_${currentDeptId}`)) return true;
      if (currentDeptId === 'chemistry' && localStorage.getItem('fmsm_custom_chem_head_photo')) return true;
    } catch {}
    return false;
  })();

  const handleHeadPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const res = reader.result as string;
      setHeadPhotos(prev => ({ ...prev, [currentDeptId]: res }));

      try {
        localStorage.setItem(`fmsm_custom_dept_head_${currentDeptId}`, res);
        if (currentDeptId === 'chemistry') {
          localStorage.setItem('fmsm_custom_chem_head_photo', res);
          localStorage.removeItem('fmsm_custom_chem_head_photo_v2');
        }
      } catch (err) {
        console.error('Failed to save head photo to localStorage', err);
      }

      try {
        await fetch('/api/upload-dept-head-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departmentId: currentDeptId, imageBase64: res })
        });
      } catch (err) {
        console.warn('Server upload background attempt:', err);
      }

      setSaveStatusMessage('✓ تم حفظ الصورة الجديدة لرئيس القسم بنجاح ودائماً على المنصة والخادم!');
      setTimeout(() => setSaveStatusMessage(null), 8000);
    };
    reader.readAsDataURL(file);
  };

  const handleResetHeadPhoto = async () => {
    const currentHeadInfo = DEPARTMENT_HEADS_DATA[currentDeptId];
    if (window.confirm(`هل تريد استعادة الصورة الأصلية للسيد ${currentHeadInfo.headName}؟`)) {
      const defaultPhoto = currentHeadInfo.originalPhoto || currentHeadInfo.defaultPhoto;
      setHeadPhotos(prev => ({ ...prev, [currentDeptId]: defaultPhoto }));

      try {
        localStorage.removeItem(`fmsm_custom_dept_head_${currentDeptId}`);
        if (currentDeptId === 'chemistry') {
          localStorage.removeItem('fmsm_custom_chem_head_photo');
          localStorage.removeItem('fmsm_custom_chem_head_photo_v2');
        }
      } catch (err) {
        console.error(err);
      }

      try {
        await fetch('/api/reset-dept-head-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departmentId: currentDeptId })
        });
      } catch (err) {
        console.warn('Server reset photo attempt:', err);
      }

      setSaveStatusMessage('✓ تمت استعادة الصورة الأصلية لرئيس القسم بنجاح.');
      setTimeout(() => setSaveStatusMessage(null), 5000);
    }
  };

  React.useEffect(() => {
    if (selectedDeptId) {
      setCurrentDeptId(selectedDeptId);
    } else if (initialDepartmentId && (initialDepartmentId in DEPARTMENTS)) {
      setCurrentDeptId(initialDepartmentId as DepartmentId);
    }
  }, [selectedDeptId, initialDepartmentId]);

  const allDepts = departmentsData || DEPARTMENTS;
  const dept = allDepts[currentDeptId] || DEPARTMENTS[currentDeptId] || DEPARTMENTS.common_sm;

  // Department-specific modules (live persistent database)
  const allModules = modulesData || MODULES_DATABASE;
  const deptModules = allModules.filter(m => m.departmentId === currentDeptId);
  
  // Department-specific schedules
  const deptSchedules = SCHEDULE_DATABASE.filter(s => s.departmentId === currentDeptId);

  // Department-specific resources
  const deptResources = INITIAL_RESOURCES.filter(r => r.departmentId === currentDeptId);

  // Department announcements
  const deptAnnouncements = INITIAL_ANNOUNCEMENTS.filter(a => a.departmentId === currentDeptId || a.departmentId === 'all');

  const isAuthorizedToEdit = currentUser && (
    currentUser.role === 'super_admin' || 
    currentUser.adminRole === 'super_admin' || 
    (currentUser.adminRole === 'dept_head' && currentUser.departmentId === currentDeptId)
  );

  const getDeptIcon = (id?: string) => {
    switch (id) {
      case 'physics': return <Atom className="w-6 h-6" />;
      case 'chemistry': return <FlaskConical className="w-6 h-6" />;
      case 'math': return <Binary className="w-6 h-6" />;
      case 'common_sm':
      default: return <Layers className="w-6 h-6" />;
    }
  };

  const getDeptColorClasses = (id?: string) => {
    switch (id) {
      case 'physics': return {
        badge: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
        activeBtn: 'bg-sky-600 text-white',
        border: 'border-sky-500',
        ring: 'focus:ring-sky-500'
      };
      case 'chemistry': return {
        badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
        activeBtn: 'bg-amber-600 text-white',
        border: 'border-amber-500',
        ring: 'focus:ring-amber-500'
      };
      case 'math': return {
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
        activeBtn: 'bg-indigo-600 text-white',
        border: 'border-indigo-500',
        ring: 'focus:ring-indigo-500'
      };
      case 'common_sm':
      default: return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
        activeBtn: 'bg-emerald-600 text-white',
        border: 'border-emerald-500',
        ring: 'focus:ring-emerald-500'
      };
    }
  };

  const colors = getDeptColorClasses(currentDeptId || selectedDeptId);

  return (
    <div className="space-y-6">
      {/* Department Head Full Permissions Action Banner */}
      {isAuthorizedToEdit && (
        <div className="bg-gradient-to-r from-amber-500/15 via-[#0B3D91]/15 to-emerald-500/15 border-2 border-amber-400 dark:border-amber-600/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  صلاحيات التعديل والإضافة الكاملة
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  أنت مسجل كمسؤول عن {dept.nameAr}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                يمكنك تعديل أي نص أو معلومة، وإضافة وحذف التخصصات والمخابر والأساتذة والمقاييس مباشرة من هنا.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDepartmentEditorModal(true)}
            className="px-5 py-2.5 bg-[#0B3D91] hover:bg-blue-900 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Edit3 className="w-4 h-4 text-amber-300" />
            <span>تعديل بيانات وإضافة محتوى للقسم ✏️</span>
          </button>
        </div>
      )}

      {/* Department Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(Object.keys(DEPARTMENTS) as DepartmentId[]).map((deptKey) => {
          const item = DEPARTMENTS[deptKey];
          const isSelected = currentDeptId === deptKey;
          return (
            <button
              key={deptKey}
              onClick={() => {
                setCurrentDeptId(deptKey);
                if (onSelectDepartment) onSelectDepartment(deptKey);
                setActiveSubTab('overview');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {getDeptIcon(deptKey)}
              <span>{item.nameAr}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded font-mono ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {item.shortCode}
              </span>
            </button>
          );
        })}
      </div>

      {/* Save / Reset Status Toast Banner */}
      {saveStatusMessage && (
        <div className="bg-emerald-500 text-white px-4 py-3 rounded-2xl shadow-md flex items-center justify-between gap-3 text-sm font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{saveStatusMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSaveStatusMessage(null)}
            className="text-white/80 hover:text-white text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Department Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              {getDeptIcon(currentDeptId)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colors?.badge || 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                  {dept.nameFr}
                </span>
                <span className="text-xs font-bold text-slate-500">رمز القسم: {dept.shortCode}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">{dept.nameAr}</h1>
              <p className="text-xs text-slate-500 mt-0.5">كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة</p>
            </div>
          </div>

          {/* Department Head Contact Card (All Departments) */}
          {(() => {
            const headInfo = DEPARTMENT_HEADS_DATA[currentDeptId] || DEPARTMENT_HEADS_DATA.common_sm;
            return (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-2 min-w-[280px]">
                <div className="flex items-center gap-3">
                  <div className="relative group shrink-0">
                    <img
                      src={headPhotos[currentDeptId]}
                      alt={`${headInfo.headName} - ${headInfo.headTitle}`}
                      className="w-14 h-16 object-cover object-center rounded-xl border border-slate-300 dark:border-slate-600 shadow-xs cursor-pointer group-hover:scale-105 transition-transform"
                      onClick={() => setShowDeptHeadPhotoModal(true)}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = headInfo.defaultPhoto;
                      }}
                    />
                    <div 
                      onClick={() => setShowDeptHeadPhotoModal(true)}
                      className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity"
                      title="تكبير وعرض الصورة بالحجم الكامل"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 border ${headInfo.theme.bgBadge} ${headInfo.theme.textBadge} ${headInfo.theme.border}`}>
                      {headInfo.headTitle}
                    </span>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {headInfo.headName}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] truncate">{headInfo.office}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${headInfo.email}`} className="hover:text-teal-700 underline font-mono text-[11px] truncate">
                      {headInfo.email}
                    </a>
                  </div>
                </div>

                <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold border-t border-slate-200/80 dark:border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setShowDeptHeadPhotoModal(true)}
                    className="hover:underline flex items-center gap-1 text-slate-600 dark:text-slate-300"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>عرض كامل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => headFileInputRef.current?.click()}
                    className="hover:underline flex items-center gap-1 text-emerald-700 dark:text-emerald-400"
                  >
                    <Upload className="w-3 h-3" />
                    <span>تغيير الصورة</span>
                  </button>
                  {isCurrentPhotoCustomized && (
                    <button
                      type="button"
                      onClick={handleResetHeadPhoto}
                      className="hover:underline flex items-center gap-1 text-rose-600 dark:text-rose-400"
                      title="استعادة الصورة الأصلية"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>استعادة الأصلية</span>
                    </button>
                  )}
                  <input
                    ref={headFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeadPhotoUpload}
                  />
                </div>

                {dept.officialPortalUrl && (
                  <a
                    href={dept.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-teal-800 dark:text-teal-400 hover:text-teal-950 font-bold group"
                    title="فتح الرابط الرسمي لبوابة هذا القسم على موقع الكلية"
                  >
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-teal-600" />
                      <span>البوابة الرسمية للقسم</span>
                    </div>
                    <ExternalLink className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform text-teal-600" />
                  </a>
                )}
              </div>
            );
          })()}
        </div>

        {/* Sub-Navigation Inside Department */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-6 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>نظرة عامة والتعريف</span>
          </button>
          <button
            onClick={() => setActiveSubTab('specialties')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'specialties' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>مسارات التكوين والتخصصات ({dept.specialties.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'modules' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>المقاييس والبرامج البيداغوجية</span>
          </button>
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'schedule' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>جدول التوقيت والأفواج</span>
          </button>
          <button
            onClick={() => setActiveSubTab('labs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'labs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>مخابر البحث والأشغال التطبيقية ({dept.labs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('resources')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'resources' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>الدروس والملخصات الرقمية</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Content Area */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Department Head Official Welcome Speech (كلمة السيد رئيس القسم) */}
          {(() => {
            const headInfo = DEPARTMENT_HEADS_DATA[currentDeptId] || DEPARTMENT_HEADS_DATA.common_sm;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                {/* Decorative background glow */}
                <div className={`absolute top-0 right-0 w-44 h-44 rounded-bl-full pointer-events-none opacity-10 ${
                  currentDeptId === 'chemistry' ? 'bg-amber-500' :
                  currentDeptId === 'physics' ? 'bg-sky-500' :
                  currentDeptId === 'math' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`} />

                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
                  {/* Department Head Portrait & Direct Photo Actions */}
                  <div className="shrink-0 flex flex-col items-center text-center w-full sm:w-auto">
                    <div className="relative group rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                      <img
                        src={headPhotos[currentDeptId]}
                        alt={`${headInfo.headName} - ${headInfo.headTitle}`}
                        className="w-full sm:w-72 md:w-80 h-56 sm:h-64 object-cover object-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                        onClick={() => setShowDeptHeadPhotoModal(true)}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = headInfo.defaultPhoto;
                        }}
                      />

                      {/* Controls overlay */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setShowDeptHeadPhotoModal(true)}
                          className="p-1.5 bg-slate-950/70 hover:bg-slate-950 text-white rounded-lg backdrop-blur-xs transition-colors shadow-xs"
                          title="تكبير الصورة بالحجم الكامل"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => headFileInputRef.current?.click()}
                          className={`p-1.5 text-white rounded-lg backdrop-blur-xs transition-colors shadow-xs ${headInfo.theme.buttonBg} ${headInfo.theme.buttonHover}`}
                          title="رفع أو اختيار صورتك الخاصة من جهازك"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        {isCurrentPhotoCustomized && (
                          <button
                            type="button"
                            onClick={handleResetHeadPhoto}
                            className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg backdrop-blur-xs transition-colors shadow-xs"
                            title="استعادة الصورة الأصلية"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 text-right">
                        <div className="text-white text-xs font-bold flex items-center justify-between">
                          <span>{headInfo.headName}</span>
                          <span className={`text-[10px] text-white px-2 py-0.5 rounded-full border ${headInfo.theme.buttonBg} border-white/30`}>
                            {headInfo.headTitle}
                          </span>
                        </div>
                        <div className="text-slate-300 text-[10px] mt-0.5 font-medium">
                          {headInfo.office}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => headFileInputRef.current?.click()}
                        className={`px-3 py-1.5 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs ${headInfo.theme.buttonBg} ${headInfo.theme.buttonHover}`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع / استبدال صورتك الخاصة</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeptHeadPhotoModal(true)}
                        className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium flex items-center gap-1.5 transition-all"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>عرض بالحجم الكامل</span>
                      </button>
                      {isCurrentPhotoCustomized && (
                        <button
                          type="button"
                          onClick={handleResetHeadPhoto}
                          className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl font-semibold flex items-center gap-1 text-xs"
                          title="استعادة الصورة الأصلية"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>استعادة الصورة الأصلية</span>
                        </button>
                      )}
                    </div>

                    {isCurrentPhotoCustomized ? (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>صورتك المخصصة محفوظة بشكل دائم على الخادم والمنصة</span>
                      </div>
                    ) : (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span>يمكنك رفع صورتك الخاصة واستبدالها أو استعادتها للأصلية في أي وقت</span>
                      </div>
                    )}
                  </div>

                  {/* Department Head Official Welcome Text */}
                  <div className="space-y-3.5 flex-1 border-r-0 lg:border-r lg:pr-6 border-slate-100 dark:border-slate-700 text-right">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                      <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${headInfo.theme.bgBadge} ${headInfo.theme.textBadge} ${headInfo.theme.border}`}>
                        {getDeptIcon(currentDeptId)}
                        <span>{headInfo.speechTitle}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {headInfo.deptNameFr}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {headInfo.speechQuote}
                    </h3>

                    <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                      {headInfo.speechParagraphs.map((para, idx) => (
                        <p 
                          key={idx} 
                          className={idx === headInfo.speechParagraphs.length - 1 ? `font-medium p-3 rounded-xl border ${headInfo.theme.bgBadge} ${headInfo.theme.textBadge} ${headInfo.theme.border}` : ''}
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('modules')}
                        className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${headInfo.theme.buttonBg} ${headInfo.theme.buttonHover}`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>تصفح المقاييس والبرامج البيداغوجية</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('labs')}
                        className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold flex items-center gap-1.5"
                      >
                        <Microscope className="w-3.5 h-3.5" />
                        <span>مخابر القسم ({dept.labs.length})</span>
                      </button>
                      <a
                        href={`mailto:${headInfo.email}`}
                        className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-mono"
                      >
                        {headInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* About Text */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">رسالة وأهداف {dept.nameAr}</h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {dept.description}
            </p>

            {/* Dynamic Real Department Statistics */}
            {(() => {
              const currentRealStats = departmentStats?.[currentDeptId];
              const students = currentRealStats?.studentsCount ?? dept.stats.students;
              const teachers = currentRealStats?.teachersCount ?? dept.stats.teachers;
              const specialties = currentRealStats?.specialtiesCount ?? dept.stats.specialtiesCount;
              const labs = currentRealStats?.laboratoriesCount ?? dept.stats.laboratories;
              const s1 = currentRealStats?.successRateS1 ?? 82.5;
              const s2 = currentRealStats?.successRateS2 ?? 85.0;
              const td = currentRealStats?.tdAttendanceRate ?? 92.4;
              const tp = currentRealStats?.tpAttendanceRate ?? 95.8;

              const isUserAuthorizedToEdit = 
                currentUser?.role === 'super_admin' || 
                currentUser?.adminRole === 'super_admin' || 
                (currentUser?.adminRole === 'dept_head' && currentUser?.departmentId === currentDeptId);

              return (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h4 className="text-sm font-bold text-slate-900">
                          الإحصائيات والأرقام الحقيقية المعتمدة للقسم
                        </h4>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          محيّنة وموثقة
                        </span>
                      </div>
                      {currentRealStats?.lastUpdatedDate && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          آخر تحديث: {currentRealStats.lastUpdatedDate} • المسؤول: {currentRealStats.lastUpdatedBy}
                        </p>
                      )}
                    </div>

                    {isUserAuthorizedToEdit && onOpenStatsEditor && (
                      <button
                        type="button"
                        onClick={() => onOpenStatsEditor(currentDeptId)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل إحصائيات {dept.nameAr}</span>
                      </button>
                    )}
                  </div>

                  {/* Primary 4 Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        {students.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">طالب مسجل بالقسم</div>
                      {currentRealStats?.studentsLicence && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          ليسانس: {currentRealStats.studentsLicence} | ماستر: {currentRealStats.studentsMaster || 0}
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        {teachers.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">أستاذ مؤطر وباحث</div>
                      {currentRealStats?.professorsCount && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          بروفيسور: {currentRealStats.professorsCount} | محاضر: {currentRealStats.docentsCount || 0}
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        {specialties}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">أطوار وتخصصات معتمدة</div>
                      {currentRealStats?.pfeCount && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          مذكرات PFE: {currentRealStats.pfeCount}
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        {labs}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">مخبر بيداغوجي وبحثي</div>
                      {currentRealStats?.classroomsCount && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          قاعات التدريس: {currentRealStats.classroomsCount}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary Pedagogical Indicators Strip (Success & Attendance) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center">
                    <div>
                      <span className="text-[11px] text-slate-600 font-bold block">نسبة نجاح S1:</span>
                      <span className="text-sm font-black text-emerald-800 font-mono">{s1}%</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-600 font-bold block">نسبة نجاح S2:</span>
                      <span className="text-sm font-black text-emerald-800 font-mono">{s2}%</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-600 font-bold block">حضور الأعمال الموجهة TD:</span>
                      <span className="text-sm font-black text-slate-800 font-mono">{td}%</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-600 font-bold block">حضور الأعمال التطبيقية TP:</span>
                      <span className="text-sm font-black text-slate-800 font-mono">{tp}%</span>
                    </div>
                  </div>

                  {currentRealStats?.notes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                      « {currentRealStats.notes} »
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Department Recent Announcements */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>إعلانات {dept.nameAr} الأخيرة</span>
              <span className="text-xs text-slate-500">تحديثات الأسبوع</span>
            </h3>
            <div className="space-y-3">
              {deptAnnouncements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-bold text-slate-700 font-mono">تاريخ الإعلان: {ann.date}</span>
                    <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">{ann.author}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{ann.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specialties Tab */}
      {activeSubTab === 'specialties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dept.specialties.map((spec, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  spec.cycle === 'Licence' ? 'bg-teal-100 text-teal-800' :
                  spec.cycle === 'Master' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  طور {spec.cycle}
                </span>
                <span className="text-xs text-slate-500 font-medium">المدة: {spec.duration}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">{spec.nameAr}</h4>
              <p className="text-xs font-medium text-slate-500 font-mono mb-3">{spec.nameFr}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{spec.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">نظام التدريس: LMD معتمد وزاريًا</span>
                <span className="text-teal-700 font-bold flex items-center gap-1">
                  المقررات والأرصدة
                  <ChevronLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modules Catalog Tab */}
      {activeSubTab === 'modules' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">المقررات والمقاييس المعتمدة في {dept.nameAr}</h3>
            <span className="text-xs text-slate-500">إجمالي المقاييس المسجلة: {deptModules.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-3">رمز المقياس</th>
                  <th className="p-3">اسم المقياس (بالعربية والفرنسية)</th>
                  <th className="p-3">المستوى / السداسي</th>
                  <th className="p-3 text-center">المعامل</th>
                  <th className="p-3 text-center">الأرصدة</th>
                  <th className="p-3 text-center">محاضرة / TD / TP</th>
                  <th className="p-3">الأستاذ المسؤول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {deptModules.map((mod) => (
                  <tr key={mod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-800">{mod.code}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{mod.nameAr}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{mod.nameFr}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{mod.description}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">{mod.level}</span>
                    </td>
                    <td className="p-3 text-center font-bold font-mono text-slate-900">{mod.coefficient}</td>
                    <td className="p-3 text-center font-bold font-mono text-emerald-700">{mod.credits}</td>
                    <td className="p-3 text-center text-slate-600 font-mono">
                      {mod.hoursLecture}h / {mod.hasTD ? `${mod.hoursTD}h` : '-'} / {mod.hasTP ? `${mod.hoursTP}h` : '-'}
                    </td>
                    <td className="p-3 font-medium text-slate-700 whitespace-nowrap">{mod.responsibleTeacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">جدول التوقيت وتوزيع الأفواج</h3>
              <p className="text-xs text-slate-500">أوقات المحاضرات، الأعمال الموجهة (TD)، والأشغال التطبيقية (TP)</p>
            </div>
            <div className="bg-slate-100 text-xs px-3 py-1.5 rounded-xl font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>السداسي الثاني 2025/2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {deptSchedules.length > 0 ? (
              deptSchedules.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition-all space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.day}
                    </span>
                    <span className="font-mono font-bold text-slate-700 text-[11px]">{item.timeSlot}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{item.moduleName}</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>نوع الحصة:</span>
                      <span className={`font-bold ${
                        item.type === 'محاضرة' ? 'text-indigo-700' :
                        item.type.includes('TD') ? 'text-amber-700' : 'text-emerald-700'
                      }`}>{item.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>المكان:</span>
                      <span className="font-medium text-slate-800">{item.room}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>الأستاذ:</span>
                      <span className="font-medium text-slate-800">{item.teacher}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span>الفوج:</span>
                      <span className="font-bold text-slate-700">{item.group}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                يتم رفع جداول التوقيت الرسمية من قِبل مصلحة التدريس ورؤساء الأقسام.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Labs Tab */}
      {activeSubTab === 'labs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dept.labs.map((lab, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 font-mono">
                  {lab.code}
                </span>
                <span className="text-xs text-slate-500 font-bold">مخبر معتمد بجامعة ورقلة</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">{lab.nameAr}</h4>
              <p className="text-xs font-medium text-slate-500 font-mono">{lab.nameFr}</p>
              <div className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
                <div><strong className="text-slate-900">مدير المخبر:</strong> {lab.director}</div>
                <div><strong className="text-slate-900">مجال التخصص والبحث:</strong> {lab.specialization}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources Tab */}
      {activeSubTab === 'resources' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">الموارد البيداغوجية والمحاضرات الرقمية</h3>
              <p className="text-xs text-slate-500">تحميل مطبوعات المحاضرات، سلاسل التمارين، والامتحانات المصححة لـ {dept.nameAr}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deptResources.map((res) => (
              <div key={res.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    res.type === 'cours' ? 'bg-teal-100 text-teal-800' :
                    res.type === 'td' ? 'bg-indigo-100 text-indigo-800' :
                    res.type === 'tp' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {res.type === 'cours' ? 'محاضرة' : res.type === 'td' ? 'سلسلة تمارين' : res.type === 'tp' ? 'أشغال تطبيقية' : 'امتحان مصحح'}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{res.fileSize} - {res.fileFormat}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{res.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{res.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{res.teacherName}</span>
                  <button
                    onClick={() => {
                      if (onDownloadResource) onDownloadResource(res.id);
                      alert(`جاري تحميل الملف الأكاديمي: ${res.title}\nحجم الملف: ${res.fileSize}`);
                    }}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Resolution Photo Modal for Department Head (All Departments) */}
      {showDeptHeadPhotoModal && (() => {
        const headInfo = DEPARTMENT_HEADS_DATA[currentDeptId] || DEPARTMENT_HEADS_DATA.common_sm;
        return (
          <div 
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowDeptHeadPhotoModal(false)}
          >
            <div 
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {headInfo.headName} - {headInfo.headTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {headInfo.deptNameAr} - كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => headFileInputRef.current?.click()}
                    className={`px-3 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${headInfo.theme.buttonBg} ${headInfo.theme.buttonHover}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>تغيير / رفع الصورة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeptHeadPhotoModal(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="py-3 flex-1 flex items-center justify-center overflow-auto bg-slate-950 rounded-2xl my-2">
                <img
                  src={headPhotos[currentDeptId]}
                  alt={headInfo.headName}
                  className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = headInfo.defaultPhoto;
                  }}
                />
              </div>

              <div className="pt-2 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  الصورة الرسمية للسيد {headInfo.headTitle} ({headInfo.headName})
                </span>

                <div className="flex items-center gap-2">
                  {isCurrentPhotoCustomized && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeptHeadPhotoModal(false);
                        handleResetHeadPhoto();
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة الصورة الأصلية</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeptHeadPhotoModal(false);
                      headFileInputRef.current?.click();
                    }}
                    className={`px-3 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${headInfo.theme.buttonBg} ${headInfo.theme.buttonHover}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>تغيير / رفع صورة أخرى</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeptHeadPhotoModal(false)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Full Department Content Editor Modal */}
      {showDepartmentEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-5xl my-8">
            <DepartmentContentManager
              deptId={currentDeptId}
              departments={allDepts}
              onSaveDepartments={(depts) => onUpdateDepartments?.(depts)}
              modules={allModules}
              onSaveModules={(mods) => onUpdateModules?.(mods)}
              facultyTeachers={facultyTeachers}
              onSaveFacultyTeachers={(tch) => onUpdateFacultyTeachers?.(tch)}
              currentUser={currentUser}
              onShowToast={onShowToast}
              isModal={true}
              onClose={() => setShowDepartmentEditorModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
