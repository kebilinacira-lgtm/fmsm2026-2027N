import React, { useState } from 'react';
import { 
  BookOpen, 
  Calculator, 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Send, 
  Calendar, 
  GraduationCap, 
  Filter, 
  Printer, 
  Clock,
  Sparkles,
  ChevronLeft,
  MapPin,
  FileUp,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { LmdCalculator } from './LmdCalculator';
import { DepartmentHeadUploadModal } from './DepartmentHeadUploadModal';
import { INITIAL_RESOURCES, INITIAL_GRADES, SCHEDULE_DATABASE, DEPARTMENTS } from '../data/facultyData';
import { CourseResource, GradeEntry, ScheduleSession, DepartmentId, StudentAdministrativeRequest, UserProfile, DepartmentHeadAccount } from '../types';

interface StudentPortalProps {
  onGenerateDocument: (type: string, data: any) => void;
  onOpenAIAdvisor: () => void;
  currentUser?: UserProfile | null;
  departmentHeads?: DepartmentHeadAccount[];
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

const STORAGE_DEPT_FILES_KEY = 'fmsm_dept_head_uploaded_files_v2';

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onGenerateDocument,
  onOpenAIAdvisor,
  currentUser,
  departmentHeads,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'calculator' | 'schedule' | 'grades' | 'documents' | 'orientation'>('courses');
  
  // Courses and department uploads state
  const [courses, setCourses] = useState<CourseResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DEPT_FILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...INITIAL_RESOURCES];
        }
      }
    } catch (e) {
      console.error('Failed to load department files', e);
    }
    return INITIAL_RESOURCES;
  });

  const [showDeptHeadUploadModal, setShowDeptHeadUploadModal] = useState(false);
  const [filterOnlyDeptHead, setFilterOnlyDeptHead] = useState(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState<string | null>(null);

  // Courses search and filter state
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Schedule filter state
  const [scheduleDept, setScheduleDept] = useState<string>('common_sm');
  const [scheduleLevel, setScheduleLevel] = useState<string>('L1 SM - S2');
  const [scheduleGroup, setScheduleGroup] = useState<string>('الفوج 01 (Groupe 1)');
  const [scheduleDay, setScheduleDay] = useState<string>('all');

  // Grades search state
  const [searchMatricule, setSearchMatricule] = useState('232339011452');
  const [foundGrades, setFoundGrades] = useState<GradeEntry[]>(INITIAL_GRADES.filter(g => g.matricule === '232339011452'));

  // Recourse (طعن بيداغوجي) form state
  const [showRecourseModal, setShowRecourseModal] = useState(false);
  const [recourseModule, setRecourseModule] = useState('');
  const [recourseReason, setRecourseReason] = useState('');
  const [recourseSubmittedNotice, setRecourseSubmittedNotice] = useState<string | null>(null);

  // Administrative Requests state
  const [studentRequests, setStudentRequests] = useState<StudentAdministrativeRequest[]>([
    {
      id: 'req-01',
      trackingCode: 'DOC-FMSM-2026-4412',
      studentName: 'بن علي عبد الرؤوف',
      matricule: '232339011452',
      departmentId: 'common_sm',
      level: 'L1 SM - S2',
      requestType: 'certificat_scolarite',
      dateSubmitted: '2026-06-01',
      status: 'مقبول وجاهز للاستلام',
      notes: 'الشهادة المدرسية موقعة بختم نيابة العمادة للدراسات.'
    }
  ]);

  // Request Form
  const [newRequestType, setNewRequestType] = useState<'certificat_scolarite' | 'releve_de_notes' | 'carte_etudiant' | 'changement_groupe'>('certificat_scolarite');
  const [reqStudentName, setReqStudentName] = useState('بن علي عبد الرؤوف');
  const [reqMatricule, setReqMatricule] = useState('232339011452');
  const [reqLevel, setReqLevel] = useState('السنة الأولى ليسانس علوم المادة (L1 SM)');
  const [reqDept, setReqDept] = useState<DepartmentId>('common_sm');
  const [reqReason, setReqReason] = useState('');
  const [docErrors, setDocErrors] = useState<{ studentName?: string; matricule?: string; level?: string; reason?: string }>({});
  const [docTouched, setDocTouched] = useState<Record<string, boolean>>({});
  const [docSuccessNotice, setDocSuccessNotice] = useState<string | null>(null);

  // Recourse Form Validation State
  const [recourseErrors, setRecourseErrors] = useState<{ module?: string; reason?: string }>({});
  const [recourseTouched, setRecourseTouched] = useState<Record<string, boolean>>({});
  const [searchMatriculeError, setSearchMatriculeError] = useState<string | null>(null);

  // Upload handler for Department Head files
  const handleUploadResource = (newResource: CourseResource) => {
    setCourses(prev => {
      const updated = [newResource, ...prev];
      try {
        const headOnly = updated.filter(c => c.isOfficialDeptHeadFile);
        localStorage.setItem(STORAGE_DEPT_FILES_KEY, JSON.stringify(headOnly));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });

    const msg = `تم نشر ملف "${newResource.title}" بنجاح في المنصة برعاية ${newResource.teacherName}!`;
    setUploadSuccessAlert(msg);
    if (onShowToast) {
      onShowToast('تم نشر الملف بنجاح', msg, 'success');
    }
  };

  // Delete handler for uploaded department files
  const handleDeleteDeptFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذا الملف المنشور من المنصة؟')) {
      setCourses(prev => {
        const updated = prev.filter(c => c.id !== id);
        try {
          const headOnly = updated.filter(c => c.isOfficialDeptHeadFile);
          localStorage.setItem(STORAGE_DEPT_FILES_KEY, JSON.stringify(headOnly));
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      if (onShowToast) {
        onShowToast('تم حذف الملف', 'تمت إزالة الملف من المنصة بنجاح.', 'info');
      }
    }
  };

  // Real file download handler for students
  const handleDownloadResource = (item: CourseResource) => {
    // Increment download count
    setCourses(prev => {
      const updated = prev.map(c => c.id === item.id ? { ...c, downloadsCount: c.downloadsCount + 1 } : c);
      try {
        const headOnly = updated.filter(c => c.isOfficialDeptHeadFile);
        localStorage.setItem(STORAGE_DEPT_FILES_KEY, JSON.stringify(headOnly));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    if (item.fileDataUrl) {
      const a = document.createElement('a');
      a.href = item.fileDataUrl;
      a.download = `${item.title}.${(item.fileFormat || 'pdf').toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const deptAr = item.departmentId === 'physics' ? 'قسم الفيزياء' :
                     item.departmentId === 'chemistry' ? 'قسم الكيمياء' :
                     item.departmentId === 'math' ? 'قسم الرياضيات' : 'فرع جذع مشترك علوم المادة';

      const content = `الجمهورية الجزائرية الديمقراطية الشعبية
وزارة التعليم العالي والبحث العلمي
جامعة قاصدي مرباح ورقلة - كلية الرياضيات وعلوم المادة (FMSM)
-----------------------------------------------------------
وثيقة بيداغوجية رسمية معتمدة عبر المنصة الرقمية
-----------------------------------------------------------
العنوان: ${item.title}
القسم: ${deptAr}
المقياس: ${item.moduleName} (${item.moduleCode})
المستوى الأكاديمي: ${item.level}
الأستاذ / المؤطر: ${item.teacherName}
السنة الجامعية: ${item.academicYear}
تاريخ النشر: ${item.uploadDate}
صيغة الملف الأصلية: ${item.fileFormat}

الوصف والمحتوى البيداغوجي:
${item.description || 'مقرر رسمي موجه لطلبة كلية الرياضيات وعلوم المادة بجامعة قاصدي مرباح ورقلة.'}
-----------------------------------------------------------
تم التحميل من فضاء الطالب الرقمي - كلية الرياضيات وعلوم المادة ورقلة 2026`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    if (onShowToast) {
      onShowToast('جاري التحميل', `تم بدء تحميل ملف: ${item.title}`, 'success');
    }
  };

  // Handle courses filtering
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
                          c.moduleName.toLowerCase().includes(courseSearch.toLowerCase()) ||
                          c.teacherName.toLowerCase().includes(courseSearch.toLowerCase()) ||
                          (c.description && c.description.toLowerCase().includes(courseSearch.toLowerCase()));
    const matchesDept = selectedDept === 'all' || c.departmentId === selectedDept;
    const matchesType = selectedType === 'all' || c.type === selectedType;
    const matchesHeadOnly = !filterOnlyDeptHead || c.isOfficialDeptHeadFile;
    return matchesSearch && matchesDept && matchesType && matchesHeadOnly;
  });

  const handleSearchGrades = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchMatriculeError(null);

    const trimmed = searchMatricule.trim();
    if (!trimmed) {
      setSearchMatriculeError('يرجى إدخال رقم التسجيل الجامعي للبحث عن كشف النقاط.');
      return;
    }

    const results = INITIAL_GRADES.filter(g => g.matricule.trim() === trimmed);
    setFoundGrades(results);
    if (results.length === 0) {
      setSearchMatriculeError(`لم يتم العثور على كشف نقاط مسجل برقم القيد (${trimmed}). يرجى التأكد من الرقم أو مراجعة مصلحة التدريس.`);
    }
  };

  const validateDocForm = (): boolean => {
    const errors: { studentName?: string; matricule?: string; level?: string; reason?: string } = {};

    const name = reqStudentName.trim();
    if (!name) {
      errors.studentName = 'يرجى إدخال الاسم واللقب الكامل للطالب.';
    } else if (name.length < 3) {
      errors.studentName = 'يجب أن يتكون اسم الطالب من 3 أحرف على الأقل.';
    }

    const mat = reqMatricule.trim();
    if (!mat) {
      errors.matricule = 'يرجى إدخال رقم التسجيل الجامعي (Matricule).';
    } else if (mat.length < 6) {
      errors.matricule = 'رقم التسجيل الجامعي يجب أن يحتوي على 6 أرقام/خانات على الأقل.';
    }

    const lvl = reqLevel.trim();
    if (!lvl) {
      errors.level = 'يرجى تحديد أو كتابة المستوى والتخصص الدراسي.';
    } else if (lvl.length < 2) {
      errors.level = 'المستوى الدراسي قصير جداً (مثال: L1 SM، L2 كيمياء، M1 فيزياء).';
    }

    if (newRequestType === 'changement_groupe') {
      const r = reqReason.trim();
      if (!r) {
        errors.reason = 'مبرر طلب تغيير الفوج إلزامي (مثال: تضارب التوقيت، بعد المسافة، أسباب صحية).';
      } else if (r.length < 6) {
        errors.reason = 'يرجى كتابة سبب مفصل لطلب تغيير الفوج (6 أحرف على الأقل).';
      }
    }

    setDocErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setDocSuccessNotice(null);
    setDocTouched({ studentName: true, matricule: true, level: true, reason: true });

    if (!validateDocForm()) {
      return;
    }

    const newCode = `DOC-FMSM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: StudentAdministrativeRequest = {
      id: `req-${Date.now()}`,
      trackingCode: newCode,
      studentName: reqStudentName.trim(),
      matricule: reqMatricule.trim(),
      departmentId: reqDept,
      level: reqLevel.trim(),
      requestType: newRequestType,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'قيد المعالجة',
      reason: reqReason.trim(),
      notes: 'تم استلام طلبك إلكترونياً وسيقوم عون مصلحة التدريس بمطابقته.'
    };

    setStudentRequests(prev => [newReq, ...prev]);
    setDocSuccessNotice(`تم تسجيل طلبك الإداري بنجاح برقم التتبع: ${newCode}. يمكنك متابعة المعالجة من سجل الطلبات.`);
  };

  const validateRecourseForm = (): boolean => {
    const errors: { module?: string; reason?: string } = {};

    if (!recourseModule.trim()) {
      errors.module = 'يرجى اختيار المقياس المعني بالطعن من القائمة.';
    }

    const r = recourseReason.trim();
    if (!r) {
      errors.reason = 'يرجى كتابة شرح وتفصيل كافٍ لمبرر الطعن.';
    } else if (r.length < 10) {
      errors.reason = 'يرجى تقديم تفاصيل واضحة لمبرر الطعن (10 أحرف على الأقل).';
    }

    setRecourseErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRecourse = (e: React.FormEvent) => {
    e.preventDefault();
    setRecourseTouched({ module: true, reason: true });

    if (!validateRecourseForm()) {
      return;
    }

    const code = `REC-FMSM-${Math.floor(1000 + Math.random() * 9000)}`;
    setRecourseSubmittedNotice(`تم إيداع طعنك البيداغوجي بنجاح تحت رقم القيد: ${code}. سيتم إحالته لرئيس المقياس وإشعارك بالنتيجة.`);
    setShowRecourseModal(false);
    setRecourseReason('');
    setRecourseModule('');
    setRecourseErrors({});
    setRecourseTouched({});
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <img
            src="/logo_univ_ouargla.png"
            alt="شعار جامعة قاصدي مرباح ورقلة"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain p-1 bg-white shadow-md border border-teal-400/30 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>فضاء الطالب الجامعي - كلية الرياضيات وعلوم المادة</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              بوابة الخدمات البيداغوجية والوثائق الرقمية
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              كل ما يحتاجه طالب الليسانس والماستر والجذع المشترك SM: المحاضرات والـ TD، حاسبة نظام LMD، كشوف النقاط، والشهادات المدرسية الفورية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIAdvisor}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>اسأل مستشار الكلية الذكي</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none print:hidden">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'courses'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>المحاضرات والمطبوعات الرقمية</span>
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'calculator'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>حاسبة معدل السداسي LMD</span>
          <span className="bg-teal-100 text-teal-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            ورقلة
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'schedule'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جدول التوقيت والدروس الأسبوعي</span>
        </button>

        <button
          onClick={() => setActiveSubTab('grades')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'grades'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>كشف النقاط والطعون البيداغوجية</span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'documents'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>شباك الوثائق والشهادات المدرسية</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orientation')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'orientation'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>دليل التوجيه لما بعد الجذع المشترك</span>
        </button>
      </div>

      {/* Recourse Success Notification */}
      {recourseSubmittedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-xs flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{recourseSubmittedNotice}</span>
          </div>
          <button 
            onClick={() => setRecourseSubmittedNotice(null)}
            className="text-emerald-700 font-bold hover:underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Subtab 1: Courses and Exercises */}
      {activeSubTab === 'courses' && (
        <div className="space-y-4">
          {/* Department Head Publishing Space Banner */}
          <div className="bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-teal-700/40">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                <ShieldCheck className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold bg-teal-500/20 text-teal-200 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                    فضاء المقررات والمطبوعات المعتمدة
                  </span>
                  <span className="text-[10px] text-teal-200/70">كلية FMSM ورقلة</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  المقررات والملفات الصادرة عن رؤساء الأقسام والأساتذة
                </h3>
                <p className="text-xs text-teal-100/80 mt-0.5 max-w-xl">
                  يتاح لرؤساء الأقسام (فيزياء، كيمياء، رياضيات، وجذع مشترك SM) رفع أي مطبوعة أو مقرر أو إعلان للطلبة مع إمكانية التحميل الفوري.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setFilterOnlyDeptHead(!filterOnlyDeptHead)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  filterOnlyDeptHead
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <span>⭐</span>
                <span>{filterOnlyDeptHead ? 'عرض جميع الملفات' : 'ملفات رؤساء الأقسام'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDeptHeadUploadModal(true)}
                className="bg-white hover:bg-teal-50 text-teal-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0"
              >
                <FileUp className="w-4 h-4 text-teal-700" />
                <span>رفع ملف (رئيس قسم)</span>
              </button>
            </div>
          </div>

          {/* Upload Success Alert */}
          {uploadSuccessAlert && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">{uploadSuccessAlert}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadSuccessAlert(null)}
                className="text-emerald-700 font-bold hover:underline"
              >
                إغلاق
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="ابحث عن درس، مقياس، أو أستاذ، أو رئيس قسم..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="all">جميع الأقسام والفروع</option>
                <option value="common_sm">جذع مشترك علوم المادة (SM)</option>
                <option value="physics">قسم الفيزياء</option>
                <option value="chemistry">قسم الكيمياء</option>
                <option value="math">قسم الرياضيات</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="all">جميع أنواع الملفات</option>
                <option value="cours">محاضرات (Cours)</option>
                <option value="td">سلاسل تمارين (TD)</option>
                <option value="tp">أعمال تطبيقية (TP)</option>
                <option value="exam_correction">امتحانات مصححة</option>
                <option value="resume">ملخصات ومخططات</option>
              </select>
            </div>
          </div>

          {/* Empty state */}
          {filteredCourses.length === 0 && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">لا توجد ملفات مطابقة لبحثك</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                جرب تغيير خيارات التصفية أو إلغاء حصر البحث على ملفات رؤساء الأقسام فقط.
              </p>
              {filterOnlyDeptHead && (
                <button
                  type="button"
                  onClick={() => setFilterOnlyDeptHead(false)}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  إلغاء التصفية وعرض جميع المقررات
                </button>
              )}
            </div>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-3 ${
                  item.isOfficialDeptHeadFile
                    ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                    : 'border-slate-200 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      item.type === 'cours' ? 'bg-teal-100 text-teal-800' :
                      item.type === 'td' ? 'bg-indigo-100 text-indigo-800' :
                      item.type === 'tp' ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type === 'cours' ? 'محاضرة' : item.type === 'td' ? 'سلسلة تمارين' : item.type === 'tp' ? 'أعمال تطبيقية' : 'امتحان مصحح'}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{item.fileSize} - {item.fileFormat}</span>
                  </div>

                  {item.isOfficialDeptHeadFile && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>معتمد من رئيس القسم</span>
                      </div>
                      <span className="text-[10px] text-amber-700 font-normal">رسمي ⭐</span>
                    </div>
                  )}

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                  <div className="text-xs text-slate-500 font-medium">
                    المقياس: <span className="text-teal-800 font-bold">{item.moduleName}</span>
                    {item.level && <span className="text-slate-400 text-[11px] mr-2">({item.level})</span>}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    <div className="font-semibold text-slate-700 text-xs">{item.teacherName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      تنزيل: {item.downloadsCount} | {item.uploadDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.isOfficialDeptHeadFile && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDeptFile(item.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="حذف الملف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDownloadResource(item)}
                      className="bg-slate-900 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="تحميل الملف إلى جهازك"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: LMD Calculator */}
      {activeSubTab === 'calculator' && (
        <LmdCalculator />
      )}

      {/* Subtab 3: Student Timetable / Weekly Schedule */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-5">
          {/* Schedule Controls & Filters (Hidden during print) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-700" />
                  <span>جدول التوقيت واستعمال الزمن الأسبوعي</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  السداسي الثاني - الموسم الجامعي 2025/2026 - كلية الرياضيات وعلوم المادة
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  title="طباعة جدول التوقيت الأسبوعي أو حفظه كملف PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة جدول التوقيت (PDF)</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">القسم / الجذع المشترك:</label>
                <select
                  value={scheduleDept}
                  onChange={(e) => setScheduleDept(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                    <option key={key} value={key}>{dept.nameAr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المستوى والتدرج:</label>
                <select
                  value={scheduleLevel}
                  onChange={(e) => setScheduleLevel(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  <option value="L1 SM - S2">سنة أولى ليسانس L1 SM (السداسي 2)</option>
                  <option value="L2 Math - S4">سنة ثانية ليسانس رياضيات L2</option>
                  <option value="L2 Physique - S4">سنة ثانية ليسانس فيزياء L2</option>
                  <option value="L2 Chimie - S4">سنة ثانية ليسانس كيمياء L2</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الفوج التربوي (Groupe):</label>
                <select
                  value={scheduleGroup}
                  onChange={(e) => setScheduleGroup(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  <option value="الفوج 01 (Groupe 1)">الفوج 01 (Groupe 1)</option>
                  <option value="الفوج 02 (Groupe 2)">الفوج 02 (Groupe 2)</option>
                  <option value="الفوج 03 (Groupe 3)">الفوج 03 (Groupe 3)</option>
                  <option value="الفوج 04 (Groupe 4)">الفوج 04 (Groupe 4)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تصفية حسب اليوم:</label>
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  <option value="all">كامل أيام الأسبوع (الأحد - الخميس)</option>
                  <option value="الأحد">الأحد</option>
                  <option value="الإثنين">الإثنين</option>
                  <option value="الثلاثاء">الثلاثاء</option>
                  <option value="الأربعاء">الأربعاء</option>
                  <option value="الخميس">الخميس</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Printable Sheet Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 print:border-none print:shadow-none print:p-0">
            {/* University & Faculty Header for Print */}
            <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4 gap-4">
              <div className="w-20 shrink-0 flex flex-col items-center">
                <img
                  src="/logo_univ_ouargla.png"
                  alt="شعار جامعة قاصدي مرباح ورقلة"
                  className="w-16 h-16 object-contain rounded-full border border-slate-300 p-0.5 bg-white"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[9px] font-bold text-slate-700 mt-1 font-mono">UKMO</span>
              </div>
              <div className="text-center space-y-0.5 flex-1">
                <div className="text-xs font-bold text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية - وزارة التعليم العالي والبحث العلمي</div>
                <div className="text-sm font-black text-slate-950">جامعة قاصدي مرباح ورقلة - كلية الرياضيات وعلوم المادة</div>
                <div className="text-xs font-bold text-teal-900">
                  {DEPARTMENTS[scheduleDept as DepartmentId]?.nameAr || 'قسم الجذع المشترك في علوم المادة'}
                </div>
                <div className="text-[11px] font-semibold text-slate-700">
                  جدول التوقيت واستعمال الزمن الأسبوعي | المستوى: {scheduleLevel} | {scheduleGroup}
                </div>
                <div className="text-[10px] text-slate-500">
                  السداسي الثاني - السنة الجامعية 2025/2026
                </div>
              </div>
              <div className="w-20 shrink-0 text-left text-[9px] font-mono text-slate-600">
                <div>FMSM-EDT</div>
                <div>تاريخ الطباعة:</div>
                <div className="font-bold">{new Date().toLocaleDateString('ar-DZ')}</div>
              </div>
            </div>

            {/* Screen Header Info & Print Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 print:hidden">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-base">
                    جدول توقيت: {scheduleLevel}
                  </span>
                  <span className="px-2.5 py-0.5 bg-teal-100 text-teal-900 rounded-full font-bold text-xs">
                    {scheduleGroup}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  القسم: <span className="font-bold text-slate-700">{DEPARTMENTS[scheduleDept as DepartmentId]?.nameAr || 'علوم المادة'}</span> | مدرجات وقاعات القطب الجامعي 03
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-teal-700" />
                <span>طباعة الصفحة كملف PDF</span>
              </button>
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-right text-xs border-collapse border border-slate-200 print:border-slate-800">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 print:bg-slate-200 print:border-slate-800">
                    <th className="p-3 border border-slate-200 print:border-slate-800 text-center w-24">اليوم</th>
                    <th className="p-3 border border-slate-200 print:border-slate-800 text-center w-28">التوقيت</th>
                    <th className="p-3 border border-slate-200 print:border-slate-800">المقياس (الوحدة التعليمية)</th>
                    <th className="p-3 border border-slate-200 print:border-slate-800 text-center w-28">نوع الحصة</th>
                    <th className="p-3 border border-slate-200 print:border-slate-800">القاعة / المدرج / المخبر</th>
                    <th className="p-3 border border-slate-200 print:border-slate-800">الأستاذ المحاضر / المؤطر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-400 font-sans text-slate-800">
                  {SCHEDULE_DATABASE
                    .filter(s => scheduleDay === 'all' || s.day === scheduleDay)
                    .map((session) => (
                      <tr key={session.id} className="hover:bg-slate-50 print:hover:bg-transparent transition-colors">
                        <td className="p-3 border border-slate-200 print:border-slate-800 text-center font-bold text-slate-900 bg-slate-50/50 print:bg-slate-100/50">
                          {session.day}
                        </td>
                        <td className="p-3 border border-slate-200 print:border-slate-800 text-center font-mono font-bold text-teal-900 dir-ltr">
                          {session.timeSlot}
                        </td>
                        <td className="p-3 border border-slate-200 print:border-slate-800 font-bold text-slate-900">
                          {session.moduleName}
                        </td>
                        <td className="p-3 border border-slate-200 print:border-slate-800 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            session.type === 'محاضرة'
                              ? 'bg-blue-50 text-blue-800 print:border print:border-blue-300'
                              : session.type.includes('TP')
                              ? 'bg-purple-50 text-purple-800 print:border print:border-purple-300'
                              : 'bg-emerald-50 text-emerald-800 print:border print:border-emerald-300'
                          }`}>
                            {session.type}
                          </span>
                        </td>
                        <td className="p-3 border border-slate-200 print:border-slate-800 font-medium text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 print:hidden" />
                            <span>{session.room}</span>
                          </div>
                        </td>
                        <td className="p-3 border border-slate-200 print:border-slate-800 text-slate-800 font-semibold">
                          {session.teacher}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Print Footer with Official Seal Placeholder */}
            <div className="hidden print:grid grid-cols-2 gap-8 pt-6 mt-4 border-t border-slate-300 text-xs">
              <div>
                <div className="font-bold text-slate-800">ملاحظات بيداغوجية هامة:</div>
                <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  • الحضور إجباري في حصص الأعمال التطبيقية (TP) والأعمال الموجهة (TD).
                  <br />
                  • يُمنع تغيير الفوج إلا بموافقة كتابية صريحة من رئيس القسم المعني.
                  <br />
                  • لا يُسمح بالدخول إلى مخابر الكيمياء والفيزياء دون المئزر الأبيض ونظارات الحماية.
                </div>
              </div>
              <div className="text-center space-y-4">
                <div className="font-bold text-slate-900">تأشيرة نيابة العمادة للدراسات وشؤون الطلبة</div>
                <div className="inline-block border border-dashed border-slate-400 text-slate-700 px-6 py-2 rounded-lg text-[11px] font-bold">
                  ختم وتأشيرة رئيس مصلحة التدريس
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Student Grades and Recourse */}
      {activeSubTab === 'grades' && (
        <div className="space-y-5">
          {/* Search by Matricule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 print:hidden">
            <form onSubmit={handleSearchGrades} className="space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    أدخل رقم التسجيل الجامعي للطالب (Matricule Bac)
                    <span className="text-rose-500 mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={searchMatricule}
                    onChange={(e) => {
                      setSearchMatricule(e.target.value);
                      if (searchMatriculeError) setSearchMatriculeError(null);
                    }}
                    placeholder="مثال: 232339011452"
                    className={`w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                      searchMatriculeError
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:ring-2 focus:ring-teal-500'
                    }`}
                  />
                </div>
                <div className="w-full sm:w-auto pt-1 sm:pt-5">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>عرض كشف النقاط</span>
                  </button>
                </div>
              </div>

              {searchMatriculeError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{searchMatriculeError}</span>
                </div>
              )}
            </form>
          </div>

          {/* Grades Output Table */}
          {foundGrades.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 print:border-none print:shadow-none print:p-0">
              {/* Official University Header for Print */}
              <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4 gap-4">
                <div className="w-20 shrink-0 flex flex-col items-center">
                  <img
                    src="/logo_univ_ouargla.png"
                    alt="شعار جامعة قاصدي مرباح ورقلة"
                    className="w-16 h-16 object-contain rounded-full border border-slate-300 p-0.5 bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[9px] font-bold text-slate-700 mt-1 font-mono">UKMO</span>
                </div>
                <div className="text-center space-y-0.5 flex-1">
                  <div className="text-xs font-bold text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية - وزارة التعليم العالي والبحث العلمي</div>
                  <div className="text-sm font-black text-slate-950">جامعة قاصدي مرباح ورقلة - كلية الرياضيات وعلوم المادة</div>
                  <div className="text-xs font-bold text-teal-900">
                    {DEPARTMENTS[foundGrades[0].departmentId]?.nameAr || 'كلية الرياضيات وعلوم المادة'}
                  </div>
                  <div className="text-[11px] font-bold text-slate-800">
                    كشف نقاط الطالب: {foundGrades[0].studentName} | رقم التسجيل: {foundGrades[0].matricule}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    المستوى: {foundGrades[0].level} | {foundGrades[0].group} | السداسي الثاني 2025/2026
                  </div>
                </div>
                <div className="w-20 shrink-0 text-left text-[9px] font-mono text-slate-600">
                  <div>FMSM-NOTES</div>
                  <div>تاريخ الإصدار:</div>
                  <div className="font-bold">{new Date().toLocaleDateString('ar-DZ')}</div>
                </div>
              </div>

              {/* On-screen Header & Print Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 print:hidden">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    كشف نقاط الطالب: {foundGrades[0].studentName}
                  </h3>
                  <div className="text-xs text-slate-500">
                    رقم التسجيل: <span className="font-mono font-bold text-slate-700">{foundGrades[0].matricule}</span> | المستوى: {foundGrades[0].level} | {foundGrades[0].group}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="طباعة الصفحة مباشرة أو حفظها بصيغة PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة الصفحة كملف PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      onGenerateDocument('releve_notes', {
                        studentName: foundGrades[0].studentName,
                        matricule: foundGrades[0].matricule,
                        level: foundGrades[0].level,
                        department: DEPARTMENTS[foundGrades[0].departmentId].nameAr,
                        grades: foundGrades
                      });
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>الشهادة الرسمية المختومة</span>
                  </button>
                  <button
                    onClick={() => setShowRecourseModal(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>تقديم طعن بيداغوجي إلكتروني</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full text-right text-xs border-collapse border border-slate-200 print:border-slate-800">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 print:bg-slate-200 print:border-slate-800">
                      <th className="p-3 border border-slate-200 print:border-slate-800">رمز المقياس</th>
                      <th className="p-3 border border-slate-200 print:border-slate-800">اسم المقياس</th>
                      <th className="p-3 text-center border border-slate-200 print:border-slate-800">المراقبة المستمرة CC</th>
                      <th className="p-3 text-center border border-slate-200 print:border-slate-800">الأعمال التطبيقية TP</th>
                      <th className="p-3 text-center border border-slate-200 print:border-slate-800">الامتحان (Examen)</th>
                      <th className="p-3 text-center bg-slate-200/50 border border-slate-200 print:border-slate-800 font-black">المعدل النهائي</th>
                      <th className="p-3 text-center border border-slate-200 print:border-slate-800">الدورة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-400 font-mono text-slate-800">
                    {foundGrades.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50 print:hover:bg-transparent transition-colors">
                        <td className="p-3 font-bold text-teal-800 border border-slate-200 print:border-slate-800">{g.moduleCode}</td>
                        <td className="p-3 font-sans font-medium text-slate-900 border border-slate-200 print:border-slate-800">{g.moduleName}</td>
                        <td className="p-3 text-center font-bold border border-slate-200 print:border-slate-800">{g.ccGrade !== undefined ? g.ccGrade.toFixed(2) : '-'}</td>
                        <td className="p-3 text-center font-bold border border-slate-200 print:border-slate-800">{g.tpGrade !== undefined ? g.tpGrade.toFixed(2) : '-'}</td>
                        <td className="p-3 text-center font-bold border border-slate-200 print:border-slate-800">{g.examGrade !== undefined ? g.examGrade.toFixed(2) : '-'}</td>
                        <td className="p-3 text-center font-bold text-emerald-800 bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-800">
                          {g.finalGrade !== undefined ? g.finalGrade.toFixed(2) : '-'}
                        </td>
                        <td className="p-3 text-center font-sans border border-slate-200 print:border-slate-800">
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold print:border print:border-emerald-300">
                            {g.session}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Print Footer Summary & Official Signature */}
              <div className="hidden print:grid grid-cols-2 gap-8 pt-6 mt-4 border-t border-slate-300 text-xs">
                <div>
                  <div className="font-bold text-slate-800">ملاحظات بيداغوجية:</div>
                  <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    • يعتبر هذا الكشف وثيقة إعلامية أولية صالحة للطعون البيداغوجية.
                    <br />
                    • يحق للطالب تقديم طعن في النقطة خلال 72 ساعة من تاريخ إعلان النتائج.
                    <br />
                    • لا تُعتمد النتائج نهائياً إلا بعد مداولات لجنة السنة الجامعية.
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <div className="font-bold text-slate-900">تأشيرة مصلحة التدريس والامتحانات</div>
                  <div className="inline-block border border-dashed border-slate-400 text-slate-700 px-6 py-2 rounded-lg text-[11px] font-bold">
                    ختم وتأشيرة رئيس مصلحة التدريس
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              لم يتم العثور على نتائج لرقم التسجيل المدخل. يرجى التأكد من الرقم أو مراجعة مصلحة التدريس بالقسم.
            </div>
          )}

          {/* Recourse Modal */}
          {showRecourseModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                      <AlertCircle className="w-5 h-5" />
                    </span>
                    <h3 className="font-bold text-base text-slate-900">إيداع طعن بيداغوجي رسمي</h3>
                  </div>
                  <button 
                    onClick={() => setShowRecourseModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitRecourse} className="space-y-3 text-xs">
                  {Object.keys(recourseErrors).length > 0 && (
                    <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>يرجى استكمال البيانات الإلزامية للطعن أدناه.</span>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      اسم المقياس المعني بالطعن
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <select
                      value={recourseModule}
                      onChange={(e) => {
                        setRecourseModule(e.target.value);
                        if (recourseErrors.module) setRecourseErrors(prev => ({ ...prev, module: undefined }));
                      }}
                      onBlur={() => setRecourseTouched(prev => ({ ...prev, module: true }))}
                      className={`w-full p-2 bg-slate-50 border rounded-xl focus:outline-none transition-all text-xs ${
                        recourseErrors.module
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                          : 'border-slate-200 focus:ring-2 focus:ring-teal-500'
                      }`}
                    >
                      <option value="">-- اختر المقياس --</option>
                      {foundGrades.map(g => (
                        <option key={g.id} value={g.moduleName}>
                          {g.moduleCode} - {g.moduleName}
                        </option>
                      ))}
                    </select>
                    {recourseErrors.module && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{recourseErrors.module}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">طبيعة الخطأ المشتبه به</label>
                    <div className="space-y-1 text-slate-700">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="recourseType" defaultChecked />
                        <span>خطأ في نقل علامة الامتحان النهائي</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="recourseType" />
                        <span>إغفال أو خطأ في نقطة الأعمال الموجهة (TD/CC)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="recourseType" />
                        <span>خطأ في احتساب نقطة الأعمال التطبيقية (TP)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      شرح مفصل لمبرر الطعن
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={recourseReason}
                      onChange={(e) => {
                        setRecourseReason(e.target.value);
                        if (recourseErrors.reason) setRecourseErrors(prev => ({ ...prev, reason: undefined }));
                      }}
                      onBlur={() => setRecourseTouched(prev => ({ ...prev, reason: true }))}
                      placeholder="اشرح بدقة النقطة التي تعتقد أن بها خطأ أو عدم تطابق مع إجابتك..."
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:outline-none transition-all text-xs ${
                        recourseErrors.reason
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                          : 'border-slate-200 focus:ring-2 focus:ring-teal-500'
                      }`}
                    />
                    {recourseErrors.reason && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{recourseErrors.reason}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRecourseModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال الطعن للجنة البيداغوجية</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 4: Administrative Documents & Requests */}
      {activeSubTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Request Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                <span>طلب وثيقة إدارية جديدة</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">استخراج فوري أو إيداع طلب للشباك الإداري</p>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              {docSuccessNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>تم تسجيل الطلب</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocSuccessNotice(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed">{docSuccessNotice}</p>
                </div>
              )}

              {Object.keys(docErrors).length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block">يرجى تصحيح الأخطاء الموضحة أدناه:</span>
                    <span className="text-[11px]">تحقق من صحة الاسم ورقم التسجيل والمستوى قبل المتابعة.</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">نوع الوثيقة المطلوبة</label>
                <select
                  value={newRequestType}
                  onChange={(e: any) => setNewRequestType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="certificat_scolarite">شهادة مدرسية (Certificat de scolarité)</option>
                  <option value="releve_de_notes">كشف نقاط رسمي (Relevé de notes)</option>
                  <option value="carte_etudiant">بطاقة الطالب الرقمية (Carte d'étudiant)</option>
                  <option value="changement_groupe">طلب تغيير الفوج (Changement de groupe)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم ولقب الطالب
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={reqStudentName}
                  onChange={(e) => {
                    setReqStudentName(e.target.value);
                    if (docErrors.studentName) setDocErrors(prev => ({ ...prev, studentName: undefined }));
                  }}
                  onBlur={() => setDocTouched(prev => ({ ...prev, studentName: true }))}
                  className={`w-full p-2 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    docErrors.studentName
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-teal-500'
                  }`}
                  placeholder="مثال: بن علي عبد الرؤوف"
                />
                {docErrors.studentName && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors.studentName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم التسجيل الجامعي (Matricule)
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={reqMatricule}
                  onChange={(e) => {
                    setReqMatricule(e.target.value);
                    if (docErrors.matricule) setDocErrors(prev => ({ ...prev, matricule: undefined }));
                  }}
                  onBlur={() => setDocTouched(prev => ({ ...prev, matricule: true }))}
                  className={`w-full p-2 font-mono bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    docErrors.matricule
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-teal-500'
                  }`}
                  placeholder="مثال: 232339011452"
                />
                {docErrors.matricule && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors.matricule}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">القسم / الفرع</label>
                <select
                  value={reqDept}
                  onChange={(e: any) => setReqDept(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  <option value="common_sm">جذع مشترك علوم المادة</option>
                  <option value="physics">قسم الفيزياء</option>
                  <option value="chemistry">قسم الكيمياء</option>
                  <option value="math">قسم الرياضيات</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المستوى والتخصص الدراسي
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={reqLevel}
                  onChange={(e) => {
                    setReqLevel(e.target.value);
                    if (docErrors.level) setDocErrors(prev => ({ ...prev, level: undefined }));
                  }}
                  onBlur={() => setDocTouched(prev => ({ ...prev, level: true }))}
                  className={`w-full p-2 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    docErrors.level
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-teal-500'
                  }`}
                  placeholder="مثال: السنة الأولى ليسانس علوم المادة (L1 SM)"
                />
                {docErrors.level && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors.level}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  سبب الطلب أو ملاحظات
                  {newRequestType === 'changement_groupe' ? (
                    <span className="text-rose-500 mr-1">* (إلزامي لتغيير الفوج)</span>
                  ) : (
                    <span className="text-slate-400 font-normal mr-1">(اختياري)</span>
                  )}
                </label>
                <textarea
                  rows={2}
                  value={reqReason}
                  onChange={(e) => {
                    setReqReason(e.target.value);
                    if (docErrors.reason) setDocErrors(prev => ({ ...prev, reason: undefined }));
                  }}
                  onBlur={() => setDocTouched(prev => ({ ...prev, reason: true }))}
                  placeholder={
                    newRequestType === 'changement_groupe'
                      ? 'وضح مبرر الرغبة في التغيير (تضارب في جدول التوقيت، مبررات استثنائية)...'
                      : 'مثال: لتقديمها لملف المنحة، الإيواء، أو التدريب الميداني...'
                  }
                  className={`w-full p-2 bg-slate-50 border rounded-xl focus:outline-none transition-all ${
                    docErrors.reason
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-teal-500'
                  }`}
                />
                {docErrors.reason && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors.reason}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الطلب للشباك</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocTouched({ studentName: true, matricule: true, level: true, reason: true });
                    if (!validateDocForm()) {
                      return;
                    }
                    onGenerateDocument(newRequestType, {
                      studentName: reqStudentName,
                      matricule: reqMatricule,
                      level: reqLevel,
                      department: DEPARTMENTS[reqDept].nameAr
                    });
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>معاينة وطباعة الوثيقة فوراً</span>
                </button>
              </div>
            </form>
          </div>

          {/* Student Requests Tracking List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">سجل الطلبات الإدارية وحالة المعالجة</h3>
                <p className="text-xs text-slate-500">تتبع جاهزية شهاداتك وكشوفك برقم القيد</p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                {studentRequests.length} طلبات مسجلة
              </span>
            </div>

            <div className="space-y-3">
              {studentRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition-all space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-teal-900 bg-teal-100/70 px-2 py-0.5 rounded">
                      {req.trackingCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      req.status === 'مقبول وجاهز للاستلام' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'قيد المعالجة' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900">
                    {req.requestType === 'certificat_scolarite' ? 'شهادة مدرسية (Certificat de scolarité)' :
                     req.requestType === 'releve_de_notes' ? 'كشف نقاط رسمي (Relevé de notes)' :
                     req.requestType === 'carte_etudiant' ? 'بطاقة الطالب الرقمية' : 'طلب تغيير الفوج'}
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                    <span>الطالب: <strong>{req.studentName}</strong></span>
                    <span>الرقم: <strong className="font-mono">{req.matricule}</strong></span>
                    <span>تاريخ الطلب: <strong className="font-mono">{req.dateSubmitted}</strong></span>
                  </div>

                  {req.notes && (
                    <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-100 text-xs text-teal-900">
                      <strong>ملاحظة الإدارة:</strong> {req.notes}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onGenerateDocument(req.requestType, {
                          studentName: req.studentName,
                          matricule: req.matricule,
                          level: req.level,
                          department: DEPARTMENTS[req.departmentId]?.nameAr || 'كلية الرياضيات وعلوم المادة'
                        });
                      }}
                      className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>عرض وطباعة الوثيقة الرسمية</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Orientation Guide for Common SM Trunk */}
      {activeSubTab === 'orientation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              دليل التوجيه لما بعد السنة الأولى ليسانس SM
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              كيف تختار تخصصك في السنة الثانية ليسانس؟
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              بعد استيفاء شروط النجاح في السنة الأولى جذع مشترك علوم المادة بجامعة ورقلة، يُفتح المجال أمام الطلبة لاختيار أحد المسارين التخصصيين:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physics Branch */}
            <div className="border border-sky-200 bg-sky-50/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                  Ph
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">مسار الفيزياء (Physique)</h4>
                  <p className="text-xs text-sky-800 font-semibold">قسم الفيزياء - FMSM ورقلة</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                يركز على دراسة الميكانيكا الكمية، الكهرومغناطيسية، الديناميكا الحرارية، وفيزياء الحالة الصلبة، ويؤهل لمسارات الماستر والدكتوراه في:
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li>ماستر فيزياء طاقوية وطاقات متجددة (Solar & Renewable Energy)</li>
                <li>ماستر فيزياء كيميائية طبية (Medical Physics & Radiotherapy)</li>
                <li>فرص عمل واعدة في قطاعات الطاقة الشمسية، سوناطراك، ومراكز علاج الأورام والتصوير الطبي.</li>
              </ul>
            </div>

            {/* Chemistry Branch */}
            <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  Ch
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">مسار الكيمياء (Chimie)</h4>
                  <p className="text-xs text-amber-800 font-semibold">قسم الكيمياء - FMSM ورقلة</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                يركز على التخليق العضوي، كيمياء المواد والبوليميرات، التحاليل الطيفية، والبيئة، ويؤهل لمسارات الماستر والدكتوراه في:
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li>ماستر كيمياء المواد والبوليميرات (Materials & Polymers)</li>
                <li>ماستر كيمياء عضوية وتثمين الموارد الطبيعية للصحراء (Natural Products)</li>
                <li>فرص عمل في مخابر التحاليل النوعية، الصناعات الدوائية، معالجة المياه، والشركات البترولية.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">معايير الترتيب والتوجيه:</div>
            <div>يعتمد التوجيه على ترتيب الاستحقاق المبني على المعدل الترتيبي السنوي (Moyenne de classement) ورغبات الطالب المعبر عنها في بطاقة الرغبات بنهاية السداسي الثاني.</div>
          </div>
        </div>
      )}

      {/* Department Head File Upload Modal */}
      <DepartmentHeadUploadModal
        isOpen={showDeptHeadUploadModal}
        onClose={() => setShowDeptHeadUploadModal(false)}
        onUpload={handleUploadResource}
        currentUser={currentUser}
        departmentHeads={departmentHeads}
      />
    </div>
  );
};
