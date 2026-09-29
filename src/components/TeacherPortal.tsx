import React, { useState } from 'react';
import { 
  UserCheck, 
  UploadCloud, 
  Table, 
  Award, 
  FileText, 
  Plus, 
  Save, 
  Download, 
  Calendar, 
  CheckCircle2, 
  BookOpen, 
  Printer,
  Sparkles,
  Users,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingUp,
  LineChart
} from 'lucide-react';
import { DEPARTMENTS, MODULES_DATABASE, INITIAL_PFE_SUBJECTS } from '../data/facultyData';
import { DepartmentId, CourseResource, PFESubject, TeacherAdministrativeRequest } from '../types';
import { StudentPerformanceCharts } from './StudentPerformanceCharts';

interface TeacherPortalProps {
  onGenerateDocument: (type: string, data: any) => void;
  onAddResource: (newRes: CourseResource) => void;
  currentLogoUrl?: string;
  facultyLogoUrl?: string;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onGenerateDocument,
  onAddResource,
  currentLogoUrl = '/logo_univ_ouargla.png',
  facultyLogoUrl = '/logo_faculty_fmsm.png'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'grades' | 'analytics' | 'pfe' | 'schedule' | 'admin'>('analytics');

  // Course upload form
  const [resTitle, setResTitle] = useState('');
  const [resModuleCode, setResModuleCode] = useState('SM111');
  const [resDept, setResDept] = useState<DepartmentId>('common_sm');
  const [resType, setResType] = useState<'cours' | 'td' | 'tp' | 'exam_correction'>('cours');
  const [resTeacher, setResTeacher] = useState('أ. د. بوقرة عبد الحليم');
  const [resDesc, setResDesc] = useState('');
  const [resFileNotice, setResFileNotice] = useState<string | null>(null);

  // Grade Entry State
  const [selectedGradingModule, setSelectedGradingModule] = useState('SM111');
  const [selectedGroup, setSelectedGroup] = useState('الفوج 01 (Groupe 1)');
  const [studentsRoster, setStudentsRoster] = useState([
    { id: 1, matricule: '232339011452', name: 'بن علي عبد الرؤوف', cc: 14.5, tp: 15.0, exam: 13.5 },
    { id: 2, matricule: '232339088219', name: 'عثماني خولة', cc: 12.5, tp: 14.0, exam: 10.5 },
    { id: 3, matricule: '232339045610', name: 'قدوري سيف الدين', cc: 16.0, tp: 17.0, exam: 15.0 },
    { id: 4, matricule: '232339077112', name: 'بلقاسم أسماء', cc: 11.0, tp: 13.5, exam: 9.0 },
    { id: 5, matricule: '232339091244', name: 'زايدي محمد الأمين', cc: 13.5, tp: 14.5, exam: 12.0 },
  ]);
  const [gradesSavedNotice, setGradesSavedNotice] = useState(false);

  // PFE proposal state
  const [pfeList, setPfeList] = useState<PFESubject[]>(INITIAL_PFE_SUBJECTS);
  const [newPfeTitle, setNewPfeTitle] = useState('');
  const [newPfeDept, setNewPfeDept] = useState<DepartmentId>('physics');
  const [newPfeSpec, setNewPfeSpec] = useState('ماستر فيزياء طاقوية وطاقات متجددة');
  const [newPfeLab, setNewPfeLab] = useState('مخبر تطوير الطاقات المتجددة في الأقاليم الصحراوية (LDER)');
  const [newPfeDesc, setNewPfeDesc] = useState('');
  const [showPfeModal, setShowPfeModal] = useState(false);

  // Teacher Admin Requests
  const [teacherRequests, setTeacherRequests] = useState<TeacherAdministrativeRequest[]>([
    {
      id: 'treq-01',
      trackingCode: 'ENS-FMSM-2026-1092',
      teacherName: 'أ. د. بوقرة عبد الحليم',
      grade: 'أستاذ التعليم العالي (Professeur)',
      departmentId: 'chemistry',
      requestType: 'attestation_travail',
      dateSubmitted: '2026-05-10',
      status: 'موافق عليه',
      details: 'طلب شهادة عمل حديثة لملف الترقية والتأطير.'
    }
  ]);

  const [tReqType, setTReqType] = useState<'attestation_travail' | 'autorisation_absence' | 'stage_court_duree' | 'reservation_labo'>('attestation_travail');
  const [tReqName, setTReqName] = useState('أ. د. بوقرة عبد الحليم');
  const [tReqGrade, setTReqGrade] = useState('أستاذ محاضر "أ" (MCA)');
  const [tReqDept, setTReqDept] = useState<DepartmentId>('chemistry');
  const [tReqDetails, setTReqDetails] = useState('');
  const [tReqErrors, setTReqErrors] = useState<{ name?: string; grade?: string; details?: string }>({});
  const [tReqTouched, setTReqTouched] = useState<Record<string, boolean>>({});
  const [tReqSuccessNotice, setTReqSuccessNotice] = useState<string | null>(null);

  // Form errors for course upload and PFE
  const [uploadErrors, setUploadErrors] = useState<{ title?: string; desc?: string }>({});
  const [pfeErrors, setPfeErrors] = useState<{ title?: string; desc?: string }>({});

  const handleGradeChange = (id: number, field: 'cc' | 'tp' | 'exam', val: string) => {
    const num = parseFloat(val);
    setStudentsRoster(prev => prev.map(s => s.id === id ? { ...s, [field]: isNaN(num) ? 0 : num } : s));
  };

  const handleSaveGrades = () => {
    setGradesSavedNotice(true);
    setTimeout(() => setGradesSavedNotice(false), 4000);
  };

  const handleUploadCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { title?: string; desc?: string } = {};
    if (!resTitle.trim()) {
      errors.title = 'يرجى إدخال عنوان المطبوعة أو المقرر العلمي.';
    } else if (resTitle.trim().length < 3) {
      errors.title = 'عنوان المقرر قصير جداً (3 أحرف على الأقل).';
    }

    if (!resDesc.trim()) {
      errors.desc = 'يرجى كتابة وصف موجز أو محاور المقرر للطلبة.';
    }

    if (Object.keys(errors).length > 0) {
      setUploadErrors(errors);
      return;
    }
    setUploadErrors({});

    const selectedMod = MODULES_DATABASE.find(m => m.code === resModuleCode);
    const newCourse: CourseResource = {
      id: `res-${Date.now()}`,
      title: resTitle.trim(),
      moduleCode: resModuleCode,
      moduleName: selectedMod ? selectedMod.nameAr : 'مقرر علمي',
      departmentId: resDept,
      level: selectedMod ? selectedMod.level : 'L1 SM',
      type: resType,
      teacherName: resTeacher,
      academicYear: '2025 - 2026',
      fileSize: '3.4 MB',
      fileFormat: 'PDF',
      uploadDate: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      description: resDesc.trim()
    };

    onAddResource(newCourse);
    setResFileNotice(`تم نشر وإيداع المحتوى "${resTitle}" بنجاح! يمكن للطلبة الآن تحميله من فضاء الطالب.`);
    setResTitle('');
    setResDesc('');
  };

  const handleAddPFE = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { title?: string; desc?: string } = {};
    if (!newPfeTitle.trim()) {
      errors.title = 'يرجى إدخال عنوان موضوع مذكرة التخرج.';
    } else if (newPfeTitle.trim().length < 5) {
      errors.title = 'عنوان المذكرة يجب أن يكون واضحاً ومفصلاً (5 أحرف على الأقل).';
    }

    if (!newPfeDesc.trim()) {
      errors.desc = 'يرجى كتابة ملخص عن الإشكالية والأهداف العلمية للمذكرة.';
    } else if (newPfeDesc.trim().length < 10) {
      errors.desc = 'ملخص المذكرة يجب أن يكون كافياً ومفصلاً (10 أحرف على الأقل).';
    }

    if (Object.keys(errors).length > 0) {
      setPfeErrors(errors);
      return;
    }
    setPfeErrors({});

    const newPfe: PFESubject = {
      id: `pfe-${Date.now()}`,
      title: newPfeTitle.trim(),
      departmentId: newPfeDept,
      level: 'Master 2',
      specialty: newPfeSpec,
      supervisor: resTeacher,
      laboratory: newPfeLab,
      description: newPfeDesc.trim(),
      maxStudents: 2,
      enrolledStudents: [],
      status: 'متاح للتسجيل'
    };

    setPfeList([newPfe, ...pfeList]);
    setShowPfeModal(false);
    setNewPfeTitle('');
    setNewPfeDesc('');
    setPfeErrors({});
  };

  const validateTeacherDocForm = (): boolean => {
    const errors: { name?: string; grade?: string; details?: string } = {};

    const name = tReqName.trim();
    if (!name) {
      errors.name = 'يرجى إدخال اسم ولقب الأستاذ بالكامل.';
    } else if (name.length < 3) {
      errors.name = 'يجب أن يتكون اسم الأستاذ من 3 أحرف على الأقل.';
    }

    const grade = tReqGrade.trim();
    if (!grade) {
      errors.grade = 'يرجى كتابة أو تحديد الرتبة الأكاديمية (مثال: أستاذ محاضر "أ"، أستاذ التعليم العالي).';
    }

    const details = tReqDetails.trim();
    if (!details) {
      errors.details = 'يرجى توضيح تفاصيل ومبررات الطلب الإداري أو الغرض منه.';
    } else if (details.length < 5) {
      errors.details = 'تفاصيل الطلب غير مكتملة، يرجى تقديم توضيح كافٍ (5 أحرف على الأقل).';
    }

    setTReqErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTeacherRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setTReqSuccessNotice(null);
    setTReqTouched({ name: true, grade: true, details: true });

    if (!validateTeacherDocForm()) {
      return;
    }

    const code = `ENS-FMSM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: TeacherAdministrativeRequest = {
      id: `treq-${Date.now()}`,
      trackingCode: code,
      teacherName: tReqName.trim(),
      grade: tReqGrade.trim(),
      departmentId: tReqDept,
      requestType: tReqType,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'قيد المعالجة',
      details: tReqDetails.trim()
    };

    setTeacherRequests([newReq, ...teacherRequests]);
    setTReqSuccessNotice(`تم تسجيل طلبك الإداري بنجاح برقم التتبع: ${code}. ستتم معالجته من قبل إدارة الكلية.`);
    setTReqDetails('');
    setTReqErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Teacher Hub Header - Algerian National Academic Colors */}
      <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 rounded-2xl shadow-sm border border-emerald-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentLogoUrl}
            alt="شعار جامعة قاصدي مرباح ورقلة"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain p-1 bg-white shadow-md border-2 border-emerald-500/50 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
              <UserCheck className="w-4 h-4" />
              <span>فضاء هيئة التدريس والأساتذة الباحثين - كلية FMSM ورقلة</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              بوابة الأستاذ: إدارة المقررات، إحصائيات الأداء، وحجز النقاط
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              منصة رقمية موحدة للأساتذة في أقسام الفيزياء، الكيمياء، الرياضيات والجذع المشترك SM لإيداع الدروس، ومتابعة التحليل الإحصائي لأداء الطلبة، واستخراج الوثائق الرسمية.
            </p>
          </div>
        </div>

        <div className="bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl text-xs font-mono">
          <span className="text-emerald-300 font-bold">الحساب الأكاديمي:</span> د. بوقرة عبد الحليم (قسم الكيمياء)
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-300" />
          <span>إحصائيات ورسوم بيانية لأداء الطلبة</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
            تحليل بياني
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('grades')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'grades'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>حجز ومداولة نقاط الامتحان والـ CC</span>
        </button>

        <button
          onClick={() => setActiveSubTab('upload')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'upload'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>إيداع ونشر المحتوى البيداغوجي</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pfe')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pfe'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>اقتراح وتأطير مذكرات التخرج (PFE)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'schedule'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>العبء والتوقيت الأسبوعي للأستاذ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('admin')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'admin'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>الشباك الإداري والطلبات الرسمية</span>
        </button>
      </div>

      {/* Success Notice */}
      {resFileNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{resFileNotice}</span>
          </div>
          <button 
            onClick={() => setResFileNotice(null)}
            className="text-emerald-700 font-bold hover:underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Subtab 1: Course Upload */}
      {activeSubTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">إيداع درس أو سلسلة أعمال موجهة أو تقرير مخبري</h3>
              <p className="text-xs text-slate-500">ينشر الملف مباشرة في فضاء الطالب ليتمكن الطلبة المسجلون في الفوج من تنزيله</p>
            </div>

            <form onSubmit={handleUploadCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم / الفرع المعني</label>
                  <select
                    value={resDept}
                    onChange={(e: any) => setResDept(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="common_sm">جذع مشترك علوم المادة (SM)</option>
                    <option value="physics">قسم الفيزياء</option>
                    <option value="chemistry">قسم الكيمياء</option>
                    <option value="math">قسم الرياضيات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المقياس المعني</label>
                  <select
                    value={resModuleCode}
                    onChange={(e) => setResModuleCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                  >
                    {MODULES_DATABASE.map(m => (
                      <option key={m.id} value={m.code}>
                        {m.code} - {m.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الوثيقة البيداغوجية</label>
                  <select
                    value={resType}
                    onChange={(e: any) => setResType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="cours">محاضرة رسمية (Cours)</option>
                    <option value="td">سلسلة أعمال موجهة (Série TD)</option>
                    <option value="tp">دليل أعمال تطبيقية مخبرية (Fascicule TP)</option>
                    <option value="exam_correction">امتحان مع التصحيح وسلم التنقيط</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الأستاذ صاحب المطبوعة</label>
                  <input
                    type="text"
                    value={resTeacher}
                    onChange={(e) => setResTeacher(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان المطبوعة أو السلسلة
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: محاضرات الكيمياء الحرارية والتوازنات الكيميائية - السداسي 2"
                  value={resTitle}
                  onChange={(e) => {
                    setResTitle(e.target.value);
                    if (uploadErrors.title) setUploadErrors(prev => ({ ...prev, title: undefined }));
                  }}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:outline-none transition-all text-sm ${
                    uploadErrors.title
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {uploadErrors.title && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadErrors.title}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ملخص المحتوى وملاحظات للطلبة
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="حدد المحاور التي تغطيها هذه المطبوعة أو تاريخ استلام حلول التمارين..."
                  value={resDesc}
                  onChange={(e) => {
                    setResDesc(e.target.value);
                    if (uploadErrors.desc) setUploadErrors(prev => ({ ...prev, desc: undefined }));
                  }}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    uploadErrors.desc
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {uploadErrors.desc && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadErrors.desc}</span>
                  </div>
                )}
              </div>

              {/* Upload Dropzone mockup */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="font-bold text-slate-800 text-xs">اسحب الملف وأفلته هنا أو اضغط للاختيار من جهازك</div>
                <div className="text-[11px] text-slate-400 mt-1">يدعم ملفات PDF, DOCX, ZIP حتى حجم 50 ميغابايت</div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>اعتماد ونشر المطبوعة الآن</span>
                </button>
              </div>
            </form>
          </div>

          {/* Teacher Info Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">إرشادات النشر البيداغوجي (FMSM)</h4>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>• يجب أن تحمل المطبوعة ترويسة كلية الرياضيات وعلوم المادة وجامعة قاصدي مرباح ورقلة والسنة الجامعية.</p>
              <p>• يستحسن إدراج الأهداف البيداغوجية وقائمة المراجع في الصفحة التمهيدية للمحاضرات.</p>
              <p>• بالنسبة لسلاسل الـ TD، يرجى إرفاق التصحيحات النموذجية وسلم التنقيط بعد إنجاز الحصص في القاعات.</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Grades Entry & Deliberations */}
      {activeSubTab === 'grades' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                حجز علامات المراقبة المستمرة (CC) والامتحان النهائي
              </h3>
              <p className="text-xs text-slate-500">حساب آلي للمعدل النهائي وإعداد محضر النقاط الرسمي للمداولات</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedGradingModule}
                onChange={(e) => setSelectedGradingModule(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="SM111">SM111 - فيزياء 1 (ميكانيكا)</option>
                <option value="SM112">SM112 - كيمياء 1 (بنية المادة)</option>
                <option value="SM113">SM113 - رياضيات 1 (تحليل 1)</option>
              </select>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="الفوج 01 (Groupe 1)">الفوج 01</option>
                <option value="الفوج 02 (Groupe 2)">الفوج 02</option>
                <option value="الفوج 03 (Groupe 3)">الفوج 03</option>
              </select>
            </div>
          </div>

          {gradesSavedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ ومزامنة كشف النقاط بنجاح مع قاعدة بيانات الكلية!</span>
            </div>
          )}

          {/* Roster Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">#</th>
                  <th className="p-3">رقم التسجيل (Matricule)</th>
                  <th className="p-3">اسم ولقب الطالب</th>
                  <th className="p-3 text-center">نقطة الـ TD (CC) - 40%</th>
                  <th className="p-3 text-center">نقطة الـ TP - 20%</th>
                  <th className="p-3 text-center">نقطة الامتحان - 60%</th>
                  <th className="p-3 text-center bg-slate-200/50">المعدل المحسوب</th>
                  <th className="p-3 text-center">القرار الأولي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {studentsRoster.map((s, idx) => {
                  const finalNote = Number((s.exam * 0.6 + s.cc * 0.2 + s.tp * 0.2).toFixed(2));
                  const isPassed = finalNote >= 10.0;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-800">{s.matricule}</td>
                      <td className="p-3 font-sans font-medium text-slate-900">{s.name}</td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={s.cc ?? ''}
                          onChange={(e) => handleGradeChange(s.id, 'cc', e.target.value)}
                          className="w-16 p-1.5 text-center font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={s.tp ?? ''}
                          onChange={(e) => handleGradeChange(s.id, 'tp', e.target.value)}
                          className="w-16 p-1.5 text-center font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={s.exam ?? ''}
                          onChange={(e) => handleGradeChange(s.id, 'exam', e.target.value)}
                          className="w-16 p-1.5 text-center font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </td>
                      <td className="p-3 text-center bg-slate-50 font-bold text-sm">
                        <span className={isPassed ? 'text-emerald-700' : 'text-rose-600'}>
                          {finalNote.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isPassed ? 'مكتسب' : 'استدراك'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500">
              عدد الطلبة في هذا الفوج: <strong>{studentsRoster.length}</strong>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveSubTab('analytics')}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-amber-300" />
                <span>عرض الرسوم البيانية لأداء الفوج</span>
              </button>
              <button
                onClick={handleSaveGrades}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات في النظام</span>
              </button>
              <button
                onClick={() => {
                  onGenerateDocument('bordereau_notes', {
                    moduleCode: selectedGradingModule,
                    group: selectedGroup,
                    teacher: resTeacher,
                    students: studentsRoster
                  });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة محضر النقاط الرسمي للمداولات</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab: Student Performance Charts & Analytics */}
      {activeSubTab === 'analytics' && (
        <StudentPerformanceCharts currentLogoUrl={currentLogoUrl} />
      )}

      {/* Subtab 3: PFE Proposals */}
      {activeSubTab === 'pfe' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-base text-slate-900">مذكرات التخرج ومشاريع نهاية الدراسة (PFE)</h3>
              <p className="text-xs text-slate-500">اقتراح عناوين مذكرات ماستر 2 ومتابعة الطلبة ولجان المناقشة</p>
            </div>
            <button
              onClick={() => setShowPfeModal(true)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>اقتراح موضوع مذكرة جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pfeList.map((pfe) => (
              <div key={pfe.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {pfe.level} - {pfe.specialty}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    pfe.status === 'متاح للتسجيل' ? 'bg-emerald-100 text-emerald-800' :
                    pfe.status === 'مكتمل' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pfe.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">{pfe.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{pfe.description}</p>

                <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <div><strong>المشرف:</strong> {pfe.supervisor}</div>
                  <div><strong>المخبر التابع:</strong> {pfe.laboratory}</div>
                  <div>
                    <strong>الطلبة المسجلون:</strong>{' '}
                    {pfe.enrolledStudents.length > 0 ? (
                      <span className="text-slate-800 font-bold">{pfe.enrolledStudents.join('، ')}</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">شاغر (في انتظار اختيار الطلبة)</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New PFE Modal */}
          {showPfeModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900">اقتراح موضوع مذكرة تخرج جديد</h3>
                  <button onClick={() => setShowPfeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleAddPFE} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      عنوان المذكرة المقترح
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPfeTitle}
                      onChange={(e) => {
                        setNewPfeTitle(e.target.value);
                        if (pfeErrors.title) setPfeErrors(prev => ({ ...prev, title: undefined }));
                      }}
                      placeholder="مثال: دراسة تجريبية ونظرية لمركبات نانوية وتطبيقاتها..."
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:outline-none transition-all text-xs ${
                        pfeErrors.title
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                          : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                      }`}
                    />
                    {pfeErrors.title && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{pfeErrors.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">القسم</label>
                      <select
                        value={newPfeDept}
                        onChange={(e: any) => setNewPfeDept(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="physics">قسم الفيزياء</option>
                        <option value="chemistry">قسم الكيمياء</option>
                        <option value="math">قسم الرياضيات</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">التخصص</label>
                      <input
                        type="text"
                        value={newPfeSpec}
                        onChange={(e) => setNewPfeSpec(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">مخبر البحث المحتضن للعمل</label>
                    <input
                      type="text"
                      value={newPfeLab}
                      onChange={(e) => setNewPfeLab(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ملخص الإشكالية ومنهجية العمل
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newPfeDesc}
                      onChange={(e) => {
                        setNewPfeDesc(e.target.value);
                        if (pfeErrors.desc) setPfeErrors(prev => ({ ...prev, desc: undefined }));
                      }}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                        pfeErrors.desc
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                          : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                      }`}
                    />
                    {pfeErrors.desc && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{pfeErrors.desc}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPfeModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold"
                    >
                      حفظ واقتراح الموضوع
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 4: Teacher Schedule */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">الجدول الأسبوعي للأستاذ الباحث</h3>
              <p className="text-xs text-slate-500">الحصص البيداغوجية، المخابر، وساعات الاستقبال البيداغوجي للطلبة</p>
            </div>
            <div className="bg-indigo-50 text-indigo-900 text-xs px-3 py-1.5 rounded-xl font-bold">
              الحجم الساعي الأسبوعي: 12 ساعة
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">الأحد: 11:20 - 12:50</span>
              <h4 className="font-bold text-sm text-slate-900">كيمياء 2 (الديناميكا الحرارية)</h4>
              <div className="text-xs text-slate-600">
                <div>النوع: محاضرة عامة</div>
                <div>المكان: مدرج جابر بن حيان (Amphi B)</div>
                <div>الفئة: طلبة L1 علوم المادة</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">الثلاثاء: 13:00 - 16:10</span>
              <h4 className="font-bold text-sm text-slate-900">أعمال تطبيقية كيمياء المحاليل</h4>
              <div className="text-xs text-slate-600">
                <div>النوع: مخبر TP</div>
                <div>المكان: مخبر الكيمياء العامة 02</div>
                <div>الفئة: الفوج 01 و 02</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">الخميس: 10:00 - 12:00</span>
              <h4 className="font-bold text-sm text-slate-900">استقبال بيداغوجي وتأطير مذكرات ماستر</h4>
              <div className="text-xs text-slate-600">
                <div>النوع: استقبال واستشارات بيداغوجية</div>
                <div>المكان: مكتب الأستاذ - الجناح C مكتب 118</div>
                <div>الفئة: طلبة ماستر 2 كيمياء</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Teacher Admin Requests */}
      {activeSubTab === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">إيداع طلب إداري للأستاذ</h3>
              <p className="text-xs text-slate-500 mt-0.5">استخراج فوري للشهادات أو إيداع طلب رسمي للعمادة</p>
            </div>

            <form onSubmit={handleCreateTeacherRequest} className="space-y-3 text-xs">
              {tReqSuccessNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>تم تسجيل طلب الأستاذ</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTReqSuccessNotice(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed">{tReqSuccessNotice}</p>
                </div>
              )}

              {Object.keys(tReqErrors).length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block">بيانات الطلب غير مكتملة:</span>
                    <span className="text-[11px]">يرجى تصحيح الحقول المحددة باللون الأحمر لمتابعة الطلب.</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">نوع الطلب</label>
                <select
                  value={tReqType}
                  onChange={(e: any) => setTReqType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="attestation_travail">شهادة عمل حديثة (Attestation de travail)</option>
                  <option value="autorisation_absence">طلب رخصة غياب (Autorisation d'absence)</option>
                  <option value="stage_court_duree">تربص علمي قصير المدى بالخارج (Stage)</option>
                  <option value="reservation_labo">حجز مخبر بحث لأعمال تجريبية</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم ولقب الأستاذ
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={tReqName}
                  onChange={(e) => {
                    setTReqName(e.target.value);
                    if (tReqErrors.name) setTReqErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  onBlur={() => setTReqTouched(prev => ({ ...prev, name: true }))}
                  className={`w-full p-2 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    tReqErrors.name
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                  }`}
                  placeholder="مثال: أ. د. بوقرة عبد الحليم"
                />
                {tReqErrors.name && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{tReqErrors.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الرتبة العلمية
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={tReqGrade}
                  onChange={(e) => {
                    setTReqGrade(e.target.value);
                    if (tReqErrors.grade) setTReqErrors(prev => ({ ...prev, grade: undefined }));
                  }}
                  onBlur={() => setTReqTouched(prev => ({ ...prev, grade: true }))}
                  className={`w-full p-2 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    tReqErrors.grade
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                  }`}
                  placeholder="مثال: أستاذ محاضر قسم أ (MCA)"
                />
                {tReqErrors.grade && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{tReqErrors.grade}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">القسم الأكاديمي</label>
                <select
                  value={tReqDept}
                  onChange={(e: any) => setTReqDept(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="common_sm">جذع مشترك علوم المادة</option>
                  <option value="physics">قسم الفيزياء</option>
                  <option value="chemistry">قسم الكيمياء</option>
                  <option value="math">قسم الرياضيات</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  تفاصيل ومبرر الطلب
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <textarea
                  rows={3}
                  value={tReqDetails}
                  onChange={(e) => {
                    setTReqDetails(e.target.value);
                    if (tReqErrors.details) setTReqErrors(prev => ({ ...prev, details: undefined }));
                  }}
                  onBlur={() => setTReqTouched(prev => ({ ...prev, details: true }))}
                  className={`w-full p-2 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    tReqErrors.details
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                  }`}
                  placeholder="حدد الغرض من الوثيقة (ملف ترقية، تأطير أطروحة، ملف إداري)..."
                />
                {tReqErrors.details && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{tReqErrors.details}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <span>إرسال الطلب لعمادة الكلية</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTReqTouched({ name: true, grade: true, details: true });
                    if (!validateTeacherDocForm()) {
                      return;
                    }
                    onGenerateDocument('attestation_travail', {
                      teacherName: tReqName,
                      grade: tReqGrade,
                      department: DEPARTMENTS[tReqDept].nameAr
                    });
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>معاينة وطباعة الشهادة المعتمدة</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">سجل طلبات الأستاذ</h3>
            <div className="space-y-3">
              {teacherRequests.map((tr) => (
                <div key={tr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">{tr.trackingCode}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[11px]">{tr.status}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    {tr.requestType === 'attestation_travail' ? 'شهادة عمل رسمية' : 'طلب رخصة غياب'}
                  </div>
                  <p className="text-xs text-slate-600">{tr.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
