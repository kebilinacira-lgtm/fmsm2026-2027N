import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Clock, 
  Mail, 
  MapPin, 
  BookOpen, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  GraduationCap, 
  Building2, 
  FileText, 
  Award, 
  Calendar, 
  ExternalLink,
  Sparkles,
  ChevronDown,
  Atom,
  FlaskConical,
  Binary,
  Layers,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { FacultyTeacher, PedagogicalInquiry, DepartmentId, UserProfile, CourseResource, PFESubject } from '../types';
import { DEPARTMENTS, INITIAL_PFE_SUBJECTS } from '../data/facultyData';

interface PedagogicalBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: FacultyTeacher[];
  inquiries: PedagogicalInquiry[];
  onAddInquiry: (inquiry: PedagogicalInquiry) => void;
  onReplyInquiry: (inquiryId: string, replyContent: string, authorName: string) => void;
  currentUser?: UserProfile | null;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  initialDepartmentId?: DepartmentId;
  resources?: CourseResource[];
  currentLogoUrl?: string;
  facultyLogoUrl?: string;
}

export const PedagogicalBridgeModal: React.FC<PedagogicalBridgeModalProps> = ({
  isOpen,
  onClose,
  teachers,
  inquiries,
  onAddInquiry,
  onReplyInquiry,
  currentUser,
  onShowToast,
  initialDepartmentId = 'all',
  resources = [],
  currentLogoUrl = '/logo_univ_ouargla.png',
  facultyLogoUrl = '/logo_faculty_fmsm.png',
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'inquiries' | 'ask' | 'pfe'>('directory');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(initialDepartmentId);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected teacher for direct inquiry
  const [selectedTeacherForInquiry, setSelectedTeacherForInquiry] = useState<FacultyTeacher | null>(null);

  // Ask Form State
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [studentMatricule, setStudentMatricule] = useState(currentUser?.matricule || '');
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || '');
  const [inquiryDept, setInquiryDept] = useState<DepartmentId>(
    (currentUser?.departmentId as DepartmentId) || 'common_sm'
  );
  const [targetTeacherId, setTargetTeacherId] = useState<string>('');
  const [moduleName, setModuleName] = useState('');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Reply State for Teachers / Admins
  const [replyingInquiryId, setReplyingInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  // Filter Teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesDept = selectedDeptFilter === 'all' || t.departmentId === selectedDeptFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      t.name.toLowerCase().includes(q) ||
      t.specialty.toLowerCase().includes(q) ||
      t.modules.some(m => m.toLowerCase().includes(q)) ||
      t.office.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  // Filter Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (selectedDeptFilter !== 'all' && inq.departmentId !== selectedDeptFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inq.studentName.toLowerCase().includes(q) ||
      inq.subject.toLowerCase().includes(q) ||
      inq.question.toLowerCase().includes(q) ||
      inq.targetTeacherName.toLowerCase().includes(q) ||
      inq.trackingCode.toLowerCase().includes(q)
    );
  });

  const getDeptIcon = (deptId: DepartmentId) => {
    switch (deptId) {
      case 'physics': return <Atom className="w-4 h-4 text-sky-600" />;
      case 'chemistry': return <FlaskConical className="w-4 h-4 text-amber-600" />;
      case 'math': return <Binary className="w-4 h-4 text-indigo-600" />;
      case 'common_sm': return <Layers className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleStartInquiryForTeacher = (teacher: FacultyTeacher) => {
    setSelectedTeacherForInquiry(teacher);
    setTargetTeacherId(teacher.id);
    setInquiryDept(teacher.departmentId);
    setModuleName(teacher.modules[0] || '');
    setActiveTab('ask');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentMatricule.trim() || !subject.trim() || !question.trim()) {
      onShowToast('بيانات ناقصة', 'يرجى ملء جميع الحقول المطلوبة لإرسال استفسارك.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const trackingCode = `PED-FMSM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const teacher = teachers.find(t => t.id === targetTeacherId);
    const teacherName = teacher ? teacher.name : (DEPARTMENTS[inquiryDept]?.headName || 'إدارة القسم');

    const newInquiry: PedagogicalInquiry = {
      id: `inq-${Date.now()}`,
      trackingCode,
      studentName: studentName.trim(),
      matricule: studentMatricule.trim(),
      studentEmail: studentEmail.trim() || `${studentMatricule}@etu.univ-ouargla.dz`,
      departmentId: inquiryDept,
      targetTeacherId: targetTeacherId || undefined,
      targetTeacherName: teacherName,
      moduleName: moduleName.trim() || undefined,
      subject: subject.trim(),
      question: question.trim(),
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'قيد المراجعة'
    };

    onAddInquiry(newInquiry);
    setSubmittedCode(trackingCode);
    setIsSubmitting(false);
    onShowToast(
      'تم إرسال استفسارك البيداغوجي بنجاح',
      `رمز المتابعة الخاص بك: ${trackingCode}. سيصلك الرد هنا أو على بريدك الإلكتروني.`,
      'success'
    );
  };

  const handleSaveReply = (inquiryId: string) => {
    if (!replyText.trim()) return;
    const authorName = currentUser?.name || 'الأستاذ المؤطر';
    onReplyInquiry(inquiryId, replyText.trim(), authorName);
    setReplyingInquiryId(null);
    setReplyText('');
    onShowToast('تم تسجيل الرد الأكاديمي', 'تم توجيه الإجابة للطالب وتحديث حالة الاستفسار.', 'success');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-[#0B3D91] via-slate-900 to-[#071739] text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xs">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                    الوساطة والمرافقة البيداغوجية
                  </span>
                  <span className="text-xs text-blue-200 font-mono hidden sm:inline">
                    Espace d'Échange Enseignant - Étudiant
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  همزة الوصل بين الأستاذ والطالب
                </h2>
                <p className="text-xs text-blue-100/90 mt-0.5 max-w-2xl hidden sm:block">
                  دليل أساتذة الكلية، جداول الاستقبال الأسبوعية، نافذة الاستفسارات العلمية والمرافقة لمذكرات التخرج ومشاريع الماستر.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Sub Navigation Bar inside Modal */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-3 border-t border-white/15 relative z-10">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => { setActiveTab('directory'); setSubmittedCode(null); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'directory'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>دليل الأساتذة وساعات الاستقبال</span>
                <span className="text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded-full font-bold">
                  {teachers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('inquiries'); setSubmittedCode(null); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
                  activeTab === 'inquiries'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>الاستفسارات والتوجيه المباشر</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded-full font-bold">
                  {inquiries.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('ask'); setSelectedTeacherForInquiry(null); setSubmittedCode(null); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'ask'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-400/40'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>+ طرح استفسار بيداغوجي جديد</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('pfe'); setSubmittedCode(null); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'pfe'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>مذكرات التخرج ومشاريع الماستر</span>
              </button>
            </div>

            {/* Department Quick Filter */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-950/40 px-2.5 py-1.5 rounded-xl border border-white/10">
              <Filter className="w-3.5 h-3.5 text-amber-300" />
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="text-slate-900">جميع أقسام الكلية</option>
                <option value="chemistry" className="text-slate-900">قسم الكيمياء</option>
                <option value="physics" className="text-slate-900">قسم الفيزياء</option>
                <option value="math" className="text-slate-900">قسم الرياضيات</option>
                <option value="common_sm" className="text-slate-900">جذع مشترك علوم المادة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar (Tabs 1 & 2) */}
        {(activeTab === 'directory' || activeTab === 'inquiries') && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'directory'
                    ? 'ابحث باسم الأستاذ، المقياس، التخصص، أو رقم المكتب...'
                    : 'ابحث في الاستفسارات، باسم الطالب، الموضوع، أو رقم التتبع...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                مسح البحث
              </button>
            )}
          </div>
        )}

        {/* Modal Body / Scrollable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: TEACHER DIRECTORY & RECEPTION HOURS */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pb-1">
                <span>تم العثور على <strong className="text-slate-900 dark:text-white font-bold">{filteredTeachers.length}</strong> أستاذ باحث</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>الساعات الاستقبالية معتمدة رسمياً ومحدثة للسداسي الحالي</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeachers.map((teacher) => {
                  const dept = DEPARTMENTS[teacher.departmentId];
                  return (
                    <div 
                      key={teacher.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#0B3D91]/40 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Info */}
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 font-black text-[#0B3D91] dark:text-blue-300 text-sm shadow-xs">
                            {teacher.name.split(' ').slice(1, 3).map(n => n[0]).join('')}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B3D91] dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 flex items-center gap-1">
                                {getDeptIcon(teacher.departmentId)}
                                <span>{dept?.nameAr}</span>
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {teacher.grade}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                              {teacher.name}
                            </h4>

                            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {teacher.specialty}
                            </p>
                          </div>
                        </div>

                        {/* Location & Email Details */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{teacher.office}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${teacher.email}`} className="text-[#0B3D91] dark:text-blue-400 font-mono hover:underline truncate">
                              {teacher.email}
                            </a>
                            {teacher.phoneExtension && (
                              <span className="text-[11px] text-slate-400">
                                (تحويلة: {teacher.phoneExtension})
                              </span>
                            )}
                          </div>
                          {teacher.laboratory && (
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{teacher.laboratory}</span>
                            </div>
                          )}
                        </div>

                        {/* Weekly Reception Hours Highlight */}
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>ساعات الاستقبال والتأطير الأسبوعية للطلبة:</span>
                          </div>
                          <div className="space-y-1 text-[11px] text-amber-800 dark:text-amber-200">
                            {teacher.receptionHours.map((slot, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2">
                                <span className="font-semibold">{slot.day}:</span>
                                <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                                  {slot.time}
                                </span>
                                {slot.location && (
                                  <span className="text-amber-700 dark:text-amber-300 text-[10px]">
                                    ({slot.location})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Modules taught */}
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {teacher.modules.map((mod, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartInquiryForTeacher(teacher)}
                          className="w-full py-2 px-3 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>توجيه استفسار أو طلب موعد للأستاذ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES LIST & REPLIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>سجل الاستفسارات البيداغوجية والردود الأكاديمية ({filteredInquiries.length})</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('ask')}
                  className="font-bold text-[#0B3D91] dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>طرح استفسار جديد</span>
                </button>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">لا توجد استفسارات مطابقة للبحث</p>
                  <p className="text-xs text-slate-500 mt-1">يمكنك استخدام زر "طرح استفسار جديد" للتواصل مع الأساتذة وإدارة القسم.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredInquiries.map((inq) => {
                    const isAnswered = inq.status === 'تمت الإجابة';
                    const dept = DEPARTMENTS[inq.departmentId];
                    return (
                      <div 
                        key={inq.id}
                        className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                          isAnswered 
                            ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800/60 shadow-xs' 
                            : 'bg-white dark:bg-slate-800 border-amber-200 dark:border-amber-800/60'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-[#0B3D91] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-900">
                              {inq.trackingCode}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {inq.studentName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ({inq.matricule})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAnswered 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {inq.status}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {inq.dateSubmitted}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">موجه إلى:</span>
                            <span className="text-[#0B3D91] dark:text-blue-400 font-bold">{inq.targetTeacherName}</span>
                            <span>•</span>
                            <span>{dept?.nameAr}</span>
                            {inq.moduleName && (
                              <>
                                <span>•</span>
                                <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 rounded text-[11px] font-mono">{inq.moduleName}</span>
                              </>
                            )}
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                            {inq.subject}
                          </h4>

                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            {inq.question}
                          </p>
                        </div>

                        {/* Reply Section */}
                        {isAnswered && inq.replyContent && (
                          <div className="mt-3.5 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40">
                            <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-emerald-900 dark:text-emerald-300 font-bold">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>إجابة الأستاذ ({inq.replyAuthor}):</span>
                              </div>
                              {inq.replyDate && (
                                <span className="text-[10px] text-emerald-700 font-mono">
                                  {inq.replyDate}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                              {inq.replyContent}
                            </p>
                          </div>
                        )}

                        {/* Teacher / Admin Action: Add reply */}
                        {currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin' || currentUser.role === 'dept_head' || currentUser.role === 'super_admin') && (
                          <div className="mt-3 pt-2 flex items-center justify-end">
                            {replyingInquiryId === inq.id ? (
                              <div className="w-full space-y-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                  كتابة الرد الأكاديمي للطالب ({inq.studentName}):
                                </label>
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={3}
                                  placeholder="اكتب التوضيح البيداغوجي، أو حدد موعداً للاستقبال بمكتبك..."
                                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setReplyingInquiryId(null)}
                                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                                  >
                                    إلغاء
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveReply(inq.id)}
                                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                                  >
                                    تسجيل الرد واعتماده
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingInquiryId(inq.id);
                                  setReplyText(inq.replyContent || '');
                                }}
                                className="text-xs font-bold text-[#0B3D91] dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{isAnswered ? 'تعديل الإجابة' : 'كتابة الرد على الطالب'}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ASK NEW INQUIRY FORM */}
          {activeTab === 'ask' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {submittedCode ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-200">
                      تم استلام استفسارك البيداغوجي بنجاح
                    </h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                      تم توجيه الاستفسار للأستاذ المعني وإدارة القسم للدراسة والرد.
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 max-w-sm mx-auto">
                    <span className="text-[11px] text-slate-500 block mb-1">رمز المتابعة الخاص بك:</span>
                    <span className="font-mono text-base font-black text-[#0B3D91] dark:text-blue-400">
                      {submittedCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('inquiries')}
                      className="px-5 py-2.5 bg-[#0B3D91] text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-all cursor-pointer"
                    >
                      عرض الاستفسار في السجل
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmittedCode(null)}
                      className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      طرح استفسار آخر
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                    <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Send className="w-5 h-5 text-amber-500" />
                      <span>توجيه استفسار بيداغوجي أو طلب استشارة</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      اطرح سؤالك الأكاديمي، استفسر عن تمرين أو درس، أو اطلب موعداً خلال الساعات الاستقبالية للأستاذ.
                    </p>
                  </div>

                  {selectedTeacherForInquiry && (
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-blue-700 dark:text-blue-300 font-bold">الأستاذ المستهدف:</span>
                        <strong className="text-slate-900 dark:text-white">{selectedTeacherForInquiry.name}</strong>
                        <span className="text-slate-500">({selectedTeacherForInquiry.office})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTeacherForInquiry(null)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        تغيير الأستاذ
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        اسم ولقب الطالب *
                      </label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="مثال: بن علي عبد الرؤوف"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم التسجيل الجامعي (Matricule) *
                      </label>
                      <input
                        type="text"
                        required
                        value={studentMatricule}
                        onChange={(e) => setStudentMatricule(e.target.value)}
                        placeholder="مثال: 232339011452"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        القسم المعني *
                      </label>
                      <select
                        value={inquiryDept}
                        onChange={(e) => setInquiryDept(e.target.value as DepartmentId)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                      >
                        <option value="common_sm">جذع مشترك علوم المادة (L1 SM)</option>
                        <option value="chemistry">قسم الكيمياء</option>
                        <option value="physics">قسم الفيزياء</option>
                        <option value="math">قسم الرياضيات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        توجيه الاستفسار إلى:
                      </label>
                      <select
                        value={targetTeacherId}
                        onChange={(e) => setTargetTeacherId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                      >
                        <option value="">-- رئيس وإدارة القسم مباشرة --</option>
                        {teachers
                          .filter(t => t.departmentId === inquiryDept)
                          .map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.grade})
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        المقياس (إن وجد)
                      </label>
                      <input
                        type="text"
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
                        placeholder="مثال: كيمياء 1، ميكانيكا، تحليل 2..."
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        البريد الإلكتروني للتواصل
                      </label>
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="name@etu.univ-ouargla.dz"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      موضوع الاستفسار *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="مثال: توضيح في برهان المبرهنة 3، أو طلب موعد لمناقشة مذكرة الماستر"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نص السؤال أو الاستفسار بالتفصيل *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="اكتب سؤالك بوضوح وبأسلوب علمي ليتسنى للأستاذ تقديم إجابة دقيقة..."
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('directory')}
                      className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800"
                    >
                      إلغاء والعودة للدليل
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الاستفسار الآن'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: PFE & MASTER RESEARCH PROJECTS */}
          {activeTab === 'pfe' && (
            <div className="space-y-4">
              <div className="p-4 bg-linear-to-r from-purple-900/10 via-slate-50 to-blue-50 dark:from-purple-950/40 dark:via-slate-800 dark:to-slate-800 rounded-2xl border border-purple-200 dark:border-purple-800/40">
                <h4 className="font-bold text-sm text-purple-950 dark:text-purple-300 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <span>دليل مواضيع مذكرات التخرج ومشاريع نهاية الدراسة (Master 2)</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  المواضيع المقترحة من قبل الأساتذة الباحثين ومخابر الكلية المعتمدة. يمكن للطلبة التواصل مع المشرفين خلال ساعات الاستقبال المحددة أعلاه.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_PFE_SUBJECTS.map((pfe) => {
                  const dept = DEPARTMENTS[pfe.departmentId];
                  return (
                    <div 
                      key={pfe.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {pfe.level} - {pfe.specialty}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            pfe.status === 'مكتمل' ? 'bg-slate-100 text-slate-600' :
                            pfe.status === 'قيد المناقشة' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {pfe.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {pfe.title}
                        </h4>

                        <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">الأستاذ المشرف:</span>
                            <span className="text-[#0B3D91] dark:text-blue-400 font-bold">{pfe.supervisor}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">المخبر الحاضن:</span>
                            <span>{pfe.laboratory}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                            {pfe.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">
                          الطلبة المسجلون: {pfe.enrolledStudents.join('، ') || 'متاح للتسجيل'}
                        </span>
                        {pfe.defenseDate && (
                          <span className="text-purple-700 font-bold font-mono text-[11px]">
                            المناقشة: {pfe.defenseDate}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#0B3D91]" />
            <span>كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
