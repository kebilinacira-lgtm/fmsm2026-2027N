import React, { useRef, useEffect, useState } from 'react';
import { 
  Printer, 
  X, 
  Award, 
  CheckCircle2, 
  Shield, 
  AlertCircle, 
  FileText, 
  Edit3, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  Calendar, 
  HelpCircle,
  Eye
} from 'lucide-react';

interface OfficialDocumentModalProps {
  isOpen?: boolean;
  documentType: string;
  data?: any;
  documentData?: any;
  onClose: () => void;
  onUpdateData?: (updatedData: any) => void;
  currentLogoUrl?: string;
  facultyLogoUrl?: string;
}

export const OfficialDocumentModal: React.FC<OfficialDocumentModalProps> = ({
  isOpen = false,
  documentType,
  data,
  documentData,
  onClose,
  onUpdateData,
  currentLogoUrl = '/logo_univ_ouargla.png',
  facultyLogoUrl = '/logo_faculty_fmsm.png',
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const initialData = data || documentData || {};

  // Active view: 'preview' (printable view) or 'form' (request & validation form)
  const [activeView, setActiveView] = useState<'preview' | 'form'>('preview');

  // Document Type State
  const [docType, setDocType] = useState<string>(documentType || 'certificat_scolarite');

  // Form Fields in React State
  const [fullName, setFullName] = useState<string>(
    initialData.studentName || initialData.teacherName || 'بن علي عبد الرؤوف'
  );
  const [matricule, setMatricule] = useState<string>(
    initialData.matricule || '232339011452'
  );
  const [department, setDepartment] = useState<string>(
    initialData.department || 'جذع مشترك علوم المادة'
  );
  const [level, setLevel] = useState<string>(
    initialData.level || 'السنة الأولى ليسانس علوم المادة (L1 SM)'
  );
  const [specialty, setSpecialty] = useState<string>(
    initialData.specialty || 'علوم المادة'
  );
  const [grade, setGrade] = useState<string>(
    initialData.grade || 'أستاذ محاضر "أ" (MCA)'
  );
  const [academicYear, setAcademicYear] = useState<string>(
    initialData.academicYear || '2025 - 2026'
  );
  const [purpose, setPurpose] = useState<string>(
    initialData.purpose || initialData.notes || 'ملف إداري وبيداغوجي رسمي'
  );

  // Validation State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formSuccessNotice, setFormSuccessNotice] = useState<string | null>(null);

  // Sync state when incoming data or documentType changes
  useEffect(() => {
    if (documentType) {
      setDocType(documentType);
    }
    const current = data || documentData || {};
    if (current.studentName || current.teacherName) {
      setFullName(current.studentName || current.teacherName);
    }
    if (current.matricule) {
      setMatricule(current.matricule);
    }
    if (current.department) {
      setDepartment(current.department);
    }
    if (current.level) {
      setLevel(current.level);
    }
    if (current.specialty) {
      setSpecialty(current.specialty);
    }
    if (current.grade) {
      setGrade(current.grade);
    }
    if (current.purpose || current.notes) {
      setPurpose(current.purpose || current.notes);
    }
    setFormErrors({});
    setTouched({});
    setFormSuccessNotice(null);
  }, [documentType, data, documentData]);

  // Handle keyboard Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isTeacherDoc = docType === 'attestation_travail';

  // Comprehensive Form Validation using React state
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Full Name Validation
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      errors.fullName = isTeacherDoc
        ? 'يرجى إدخال اسم ولقب الأستاذ بالكامل.'
        : 'يرجى إدخال اسم ولقب الطالب(ة) بالكامل باللغة العربية.';
    } else if (trimmedName.length < 3) {
      errors.fullName = 'يجب أن يتكون الاسم واللقب من 3 أحرف على الأقل.';
    }

    // 2. Matricule Validation (for student docs)
    if (!isTeacherDoc) {
      const trimmedMat = matricule.trim();
      if (!trimmedMat) {
        errors.matricule = 'يرجى إدخال رقم التسجيل الجامعي (Matricule).';
      } else if (trimmedMat.length < 6) {
        errors.matricule = 'رقم التسجيل يجب أن يتكون من 6 أرقام على الأقل (مثال: 232339011452).';
      }
    }

    // 3. Department Validation
    const trimmedDept = department.trim();
    if (!trimmedDept) {
      errors.department = 'يرجى تحديد القسم أو الشعبة الأكاديمية.';
    }

    // 4. Level Validation (for student docs)
    if (!isTeacherDoc) {
      const trimmedLevel = level.trim();
      if (!trimmedLevel) {
        errors.level = 'يرجى تحديد المستوى الدراسي (مثال: السنة الأولى ليسانس L1).';
      }
    }

    // 5. Grade Validation (for teacher docs)
    if (isTeacherDoc) {
      const trimmedGrade = grade.trim();
      if (!trimmedGrade) {
        errors.grade = 'يرجى تحديد الرتبة الأكاديمية للأستاذ (مثال: أستاذ محاضر "أ").';
      }
    }

    // 6. Purpose / Justification Validation
    const trimmedPurpose = purpose.trim();
    if (!trimmedPurpose) {
      errors.purpose = 'يرجى تحديد الغرض والمبرر الإداري لطلب هذه الوثيقة (ملف منحة، إقامة، توظيف...).';
    } else if (trimmedPurpose.length < 4) {
      errors.purpose = 'يرجى تقديم تفاصيل كافية للغرض من الوثيقة (4 أحرف على الأقل).';
    }

    // 7. Academic Year Validation
    if (!academicYear.trim()) {
      errors.academicYear = 'يرجى إدخال السنة الجامعية (مثال: 2025 - 2026).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyFormChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      matricule: true,
      department: true,
      level: true,
      grade: true,
      purpose: true,
      academicYear: true
    });

    if (!validateForm()) {
      setFormSuccessNotice(null);
      return;
    }

    // Prepare updated data package
    const updated = {
      ...(data || documentData || {}),
      studentName: !isTeacherDoc ? fullName.trim() : undefined,
      teacherName: isTeacherDoc ? fullName.trim() : undefined,
      matricule: matricule.trim(),
      department: department.trim(),
      level: level.trim(),
      specialty: specialty.trim(),
      grade: grade.trim(),
      academicYear: academicYear.trim(),
      purpose: purpose.trim(),
      notes: purpose.trim()
    };

    if (onUpdateData) {
      onUpdateData(updated);
    }

    setFormErrors({});
    setFormSuccessNotice('تم التحقق من صحة جميع البيانات وتحديث الوثيقة بنجاح! تم اعتماد البيانات للطباعة الرسمية.');
    
    // Auto switch to preview after short confirmation or let the user choose
    setTimeout(() => {
      setActiveView('preview');
    }, 1200);
  };

  const handlePrint = () => {
    // If currently in form view with errors, validate first
    if (activeView === 'form') {
      if (!validateForm()) {
        return;
      }
    }
    window.print();
  };

  const todayDate = new Date().toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto print:static print:bg-white print:p-0 print:overflow-visible print:z-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden my-6 transition-all print:my-0 print:border-none print:shadow-none print:max-w-none print:rounded-none print:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls & Tab Switcher Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          
          {/* Document Title & View Switcher */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <span className="font-black text-sm block">منظومة الوثائق الإدارية المعتمدة</span>
                <span className="text-[10px] text-slate-400">كلية الرياضيات وعلوم المادة - ورقلة</span>
              </div>
            </div>

            {/* Navigation Pills: Form vs Preview */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setActiveView('form');
                  setFormSuccessNotice(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'form'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>استمارة وتدقيق البيانات</span>
                {Object.keys(formErrors).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'preview'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة الوثيقة الرسمية</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              title="طباعة الوثيقة الرسمية"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الوثيقة (Print)</span>
            </button>
            
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-colors cursor-pointer border border-slate-700"
              title="إغلاق (Esc)"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: DATA EDITING & VALIDATION FORM */}
        {activeView === 'form' && (
          <div className="p-6 sm:p-8 space-y-5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 max-h-[82vh] overflow-y-auto">
            
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>استمارة طلب وتدقيق بيانات الوثيقة الإدارية</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  قم بمراجعة وتعديل بيانات الوثيقة. يتحقق النظام آلياً من اكتمال كافة الحقول الإلزامية قبل اعتمادها للطباعة.
                </p>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-lg">
                FMSM-DOC-VAL
              </span>
            </div>

            {/* Error Banner if any field is invalid */}
            {Object.keys(formErrors).length > 0 && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-sm">بيانات الوثيقة غير مكتملة</div>
                  <div className="mt-0.5 leading-relaxed text-rose-700 dark:text-rose-300">
                    يرجى تصحيح وملء الحقول المحددة باللون الأحمر أدناه لإتمام التحقق من صحة الوثيقة واعتمادها للطباعة.
                  </div>
                </div>
              </div>
            )}

            {/* Success Banner */}
            {formSuccessNotice && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">تم التحقق من صحة البيانات بنجاح</span>
                    <span className="text-emerald-700 dark:text-emerald-300">{formSuccessNotice}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('preview')}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  معاينة الوثيقة الآن
                </button>
              </div>
            )}

            <form onSubmit={handleApplyFormChanges} className="space-y-4 text-xs">
              
              {/* Document Type Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  نوع الوثيقة الإدارية المطلوبة
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <select
                  value={docType}
                  onChange={(e) => {
                    setDocType(e.target.value);
                    setFormErrors({});
                    setFormSuccessNotice(null);
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  <option value="certificat_scolarite">شهادة مدرسية رسمية (Certificat de Scolarité)</option>
                  <option value="releve_de_notes">كشف النقاط السنوي المعتمد (Relevé de Notes)</option>
                  <option value="attestation_travail">شهادة عمل للأستاذ (Attestation de Travail)</option>
                  <option value="carte_etudiant">بطاقة الطالب المؤقتة (Carte d'étudiant)</option>
                  <option value="bordereau_notes">محضر مداولات ونقاط الامتحانات (Bordereau)</option>
                </select>
              </div>

              {/* Row: Name and Matricule/Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isTeacherDoc ? 'اسم ولقب الأستاذ' : 'اسم ولقب الطالب(ة)'}
                    <span className="text-rose-500 mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (formErrors.fullName) {
                        setFormErrors(prev => ({ ...prev, fullName: '' }));
                      }
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
                    placeholder={isTeacherDoc ? 'مثال: أ. د. بوقرة عبد الحليم' : 'مثال: بن علي عبد الرؤوف'}
                    className={`w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all ${
                      formErrors.fullName
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-600'
                    }`}
                    aria-invalid={Boolean(formErrors.fullName)}
                  />
                  {formErrors.fullName && (
                    <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Matricule or Teacher Grade */}
                {!isTeacherDoc ? (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رقم التسجيل الجامعي (Matricule)
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={matricule}
                      onChange={(e) => {
                        setMatricule(e.target.value);
                        if (formErrors.matricule) {
                          setFormErrors(prev => ({ ...prev, matricule: '' }));
                        }
                      }}
                      onBlur={() => setTouched(prev => ({ ...prev, matricule: true }))}
                      placeholder="مثال: 232339011452"
                      className={`w-full p-2.5 font-mono bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all ${
                        formErrors.matricule
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-600'
                      }`}
                      aria-invalid={Boolean(formErrors.matricule)}
                    />
                    {formErrors.matricule && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.matricule}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الرتبة الأكاديمية للأستاذ
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => {
                        setGrade(e.target.value);
                        if (formErrors.grade) {
                          setFormErrors(prev => ({ ...prev, grade: '' }));
                        }
                      }}
                      onBlur={() => setTouched(prev => ({ ...prev, grade: true }))}
                      placeholder="مثال: أستاذ محاضر قسم أ (MCA)"
                      className={`w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all ${
                        formErrors.grade
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-600'
                      }`}
                      aria-invalid={Boolean(formErrors.grade)}
                    />
                    {formErrors.grade && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.grade}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Row: Department and Level/Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    القسم / الفرع الأكاديمي
                    <span className="text-rose-500 mr-1">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (formErrors.department) {
                        setFormErrors(prev => ({ ...prev, department: '' }));
                      }
                    }}
                    className={`w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all ${
                      formErrors.department
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-600'
                    }`}
                  >
                    <option value="جذع مشترك علوم المادة">جذع مشترك علوم المادة (Tronc Commun SM)</option>
                    <option value="قسم الفيزياء">قسم الفيزياء (Département de Physique)</option>
                    <option value="قسم الكيمياء">قسم الكيمياء (Département de Chimie)</option>
                    <option value="قسم الرياضيات">قسم الرياضيات (Département de Mathématiques)</option>
                  </select>
                  {formErrors.department && (
                    <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.department}</span>
                    </div>
                  )}
                </div>

                {/* Level (for student) or Academic Year */}
                {!isTeacherDoc ? (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      المستوى والتدرج الدراسي
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={level}
                      onChange={(e) => {
                        setLevel(e.target.value);
                        if (formErrors.level) {
                          setFormErrors(prev => ({ ...prev, level: '' }));
                        }
                      }}
                      onBlur={() => setTouched(prev => ({ ...prev, level: true }))}
                      placeholder="مثال: السنة الأولى ليسانس علوم المادة (L1 SM)"
                      className={`w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all ${
                        formErrors.level
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-600'
                      }`}
                      aria-invalid={Boolean(formErrors.level)}
                    />
                    {formErrors.level && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.level}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      السنة الجامعية
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => {
                        setAcademicYear(e.target.value);
                        if (formErrors.academicYear) {
                          setFormErrors(prev => ({ ...prev, academicYear: '' }));
                        }
                      }}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Purpose / Justification Field */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الغرض والمبرر الإداري لطلب الوثيقة
                  <span className="text-rose-500 mr-1">*</span>
                </label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => {
                    setPurpose(e.target.value);
                    if (formErrors.purpose) {
                      setFormErrors(prev => ({ ...prev, purpose: '' }));
                    }
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, purpose: true }))}
                  placeholder="مثال: تقديمها لمصلحة المنحة الجامعية، ملف السكن الجامعي، تدريب ميداني بشركة سوناطراك، أو ملف ترقية إدارية..."
                  className={`w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none transition-all ${
                    formErrors.purpose
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-600'
                  }`}
                  aria-invalid={Boolean(formErrors.purpose)}
                />
                {formErrors.purpose && (
                  <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.purpose}</span>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveView('preview')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة الوثيقة الحالية دون حفظ</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>التحقق وتحديث الوثيقة الرسمية المعتمدة</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 2: CERTIFIED PRINTABLE DOCUMENT */}
        {activeView === 'preview' && (
          <div className="relative">
            {/* Quick Banner on top of preview to allow jumping back to edit */}
            <div className="bg-teal-50 dark:bg-teal-950/40 border-b border-teal-200 dark:border-teal-800 px-6 py-2.5 flex items-center justify-between text-xs print:hidden">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>الوثيقة جاهزة ومعتمدة رسمياً برقم تتبع إلكتروني مشفر</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('form')}
                className="text-teal-700 dark:text-teal-300 hover:text-teal-900 font-bold flex items-center gap-1.5 underline cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>تعديل بيانات واستمارة الوثيقة</span>
              </button>
            </div>

            {/* Printable Document Body */}
            <div 
              ref={printRef} 
              className="p-8 sm:p-12 space-y-6 text-slate-900 bg-white font-serif selection:bg-teal-100 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0"
            >
              {/* Header of the Algerian Ministry & University with Both Official Seals */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
                {/* 1. University Seal (UKMO) */}
                <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center">
                  <img
                    src={currentLogoUrl}
                    alt="شعار جامعة قاصدي مرباح ورقلة"
                    className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-full border border-slate-300 p-0.5 bg-white shadow-xs"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                    }}
                  />
                  <span className="text-[9px] font-bold text-slate-700 mt-1 font-mono">UKMO</span>
                </div>

                {/* Central Ministerial & University Headings */}
                <div className="text-center space-y-1 flex-1">
                  <div className="text-sm sm:text-base font-bold text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-700">وزارة التعليم العالي والبحث العلمي</div>
                  <div className="text-sm sm:text-lg font-black text-slate-950">جامعة قاصدي مرباح ورقلة</div>
                  <div className="text-xs sm:text-sm font-bold text-teal-900">كلية الرياضيات وعلوم المادة</div>
                  <div className="text-[11px] text-slate-600 font-sans">
                    نيابة العمادة المكلفة بالدراسات والمسائل المرتبطة بالطلبة
                  </div>
                </div>

                {/* 2. Faculty Seal (FMSM) */}
                <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center text-center">
                  <img
                    src={facultyLogoUrl}
                    alt="شعار كلية الرياضيات وعلوم المادة"
                    className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-full border border-slate-300 p-0.5 bg-white shadow-xs"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                    }}
                  />
                  <span className="text-[9px] font-bold text-teal-900 mt-1 font-mono">FMSM</span>
                </div>
              </div>

              {/* Document Dynamic Title */}
              <div className="text-center my-6">
                <span className="inline-block px-8 py-2.5 border-2 border-slate-900 text-base sm:text-xl font-black bg-slate-50 uppercase tracking-wide">
                  {docType === 'certificat_scolarite' && 'شهادة مدرسية (CERTIFICAT DE SCOLARITÉ)'}
                  {docType === 'releve_de_notes' && 'كشف النقاط السنوي الرسمي (RELEVÉ DE NOTES)'}
                  {docType === 'attestation_travail' && 'شهادة عمل للأستاذ (ATTESTATION DE TRAVAIL)'}
                  {docType === 'carte_etudiant' && 'بطاقة الطالب المؤقتة'}
                  {docType === 'bordereau_notes' && 'محضر مداولات ونقاط الامتحانات (BORDEREAU)'}
                  {!['certificat_scolarite', 'releve_de_notes', 'attestation_travail', 'carte_etudiant', 'bordereau_notes'].includes(docType) && 'وثيقة إدارية رسمية'}
                </span>
                <div className="text-xs font-mono text-slate-500 mt-2">
                  الرقم المرجعي: FMSM/UKMO/2026/{Math.floor(1000 + Math.random() * 9000)}
                </div>
              </div>

              {/* Certificate of Enrollment (شهادة مدرسية) */}
              {docType === 'certificat_scolarite' && (
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>يشهد عميد كلية الرياضيات وعلوم المادة بجامعة قاصدي مرباح ورقلة، بأنّ الطالب(ة):</p>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div><strong>الاسم واللقب:</strong> {fullName}</div>
                      <div><strong>رقم التسجيل (Matricule):</strong> <span className="font-mono">{matricule}</span></div>
                      <div><strong>الكلية:</strong> كلية الرياضيات وعلوم المادة</div>
                      <div><strong>القسم / الفرع:</strong> {department}</div>
                      <div><strong>المستوى التكويني:</strong> {level}</div>
                      <div><strong>السنة الجامعية:</strong> {academicYear}</div>
                      <div><strong>النظام البيداغوجي:</strong> ليسانس - ماستر - دكتوراه (LMD)</div>
                      <div><strong>الغرض من الوثيقة:</strong> {purpose}</div>
                    </div>
                  </div>

                  <p className="text-justify text-sm">
                    مُسجل بصفة منتظمة ورسمية بالكلية برسم السنة الجامعية الحالية {academicYear}، وقد سُلمت له هذه الشهادة للإدلاء بها وتقديمها في حدود ما يسمح به القانون.
                  </p>
                </div>
              )}

              {/* Transcript (كشف النقاط) */}
              {docType === 'releve_de_notes' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                    <div><strong>الطالب(ة):</strong> {fullName}</div>
                    <div><strong>رقم التسجيل:</strong> <span className="font-mono">{matricule}</span></div>
                    <div><strong>القسم:</strong> {department}</div>
                    <div><strong>المستوى:</strong> {level}</div>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-800">
                        <th className="border border-slate-300 p-2 text-right">المقياس</th>
                        <th className="border border-slate-300 p-2 text-center">المعامل</th>
                        <th className="border border-slate-300 p-2 text-center">الرصيد</th>
                        <th className="border border-slate-300 p-2 text-center">العلامة / 20</th>
                        <th className="border border-slate-300 p-2 text-center">النتيجة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(initialData?.grades || [
                        { moduleName: 'فيزياء 1 (ميكانيكا النقطة المادية)', coeff: 3, credits: 6, finalGrade: 13.80 },
                        { moduleName: 'كيمياء 1 (بنية المادة والذرة)', coeff: 3, credits: 6, finalGrade: 12.20 },
                        { moduleName: 'رياضيات 1 (تحليل وجبر 1)', coeff: 3, credits: 6, finalGrade: 14.50 },
                        { moduleName: 'أعمال تطبيقية فيزياء 1 (TP)', coeff: 1, credits: 2, finalGrade: 15.00 },
                        { moduleName: 'أعمال تطبيقية كيمياء 1 (TP)', coeff: 1, credits: 2, finalGrade: 14.00 },
                        { moduleName: 'إعلام آلي ومنهجية وتاريخ العلوم', coeff: 2, credits: 4, finalGrade: 16.00 },
                      ]).map((item: any, i: number) => (
                        <tr key={i} className="text-slate-800">
                          <td className="border border-slate-300 p-2">{item.moduleName}</td>
                          <td className="border border-slate-300 p-2 text-center font-mono">{item.coeff || 3}</td>
                          <td className="border border-slate-300 p-2 text-center font-mono">{item.credits || 6}</td>
                          <td className="border border-slate-300 p-2 text-center font-mono font-bold">{item.finalGrade?.toFixed(2) || '14.00'}</td>
                          <td className="border border-slate-300 p-2 text-center text-emerald-800 font-bold">مكتسب</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="p-3 bg-slate-100 rounded border border-slate-300 flex justify-between font-bold text-sm">
                    <span>المعدل العام السداسي: 13.85 / 20</span>
                    <span>الأرصدة المكتسبة: 30 / 30 رصيد</span>
                    <span>القرار: ناجح بالاستحقاق</span>
                  </div>
                </div>
              )}

              {/* Teacher Attestation (شهادة عمل) */}
              {docType === 'attestation_travail' && (
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>يشهد عميد كلية الرياضيات وعلوم المادة بجامعة قاصدي مرباح ورقلة، بأنّ السيد(ة):</p>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2 text-sm">
                    <div><strong>الأستاذ(ة):</strong> {fullName}</div>
                    <div><strong>الرتبة العلمية:</strong> {grade}</div>
                    <div><strong>القسم التابع له:</strong> {department}</div>
                    <div><strong>طبيعة العمل:</strong> أستاذ دائم ممارس لمهام التدريس والبحث العلمي</div>
                    <div><strong>السنة الجامعية:</strong> {academicYear}</div>
                    <div><strong>الغرض من الوثيقة:</strong> {purpose}</div>
                  </div>

                  <p className="text-justify text-sm">
                    يمارس مهامه بالكلية بكل انضباط ومواظبة حتى تاريخ تحرير هذه الشهادة، وقد سُلمت له هذه الوثيقة بناءً على طلبه لاستعمالها في الأغراض الإدارية والنظامية المعمول بها.
                  </p>
                </div>
              )}

              {/* Student Card (بطاقة طالب) */}
              {docType === 'carte_etudiant' && (
                <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-[#0B3D91] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <span className="font-bold text-[#0B3D91]">بطاقة الطالب المؤقتة 2025/2026</span>
                    <span className="font-mono text-xs">{matricule}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><strong>الاسم واللقب:</strong> {fullName}</div>
                    <div><strong>القسم:</strong> {department}</div>
                    <div><strong>المستوى:</strong> {level}</div>
                    <div><strong>حالة التسجيل:</strong> منتظم (Regulier)</div>
                  </div>
                </div>
              )}

              {/* Bordereau (محضر المداولات) */}
              {docType === 'bordereau_notes' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between">
                    <div>المقياس: <strong>{initialData?.moduleCode || 'SM111'}</strong></div>
                    <div>الفوج: <strong>{initialData?.group || 'الفوج 01'}</strong></div>
                    <div>الأستاذ المسؤول: <strong>{fullName}</strong></div>
                    <div>السنة الجامعية: <strong>{academicYear}</strong></div>
                  </div>

                  <p>جدول علامات المداولات الرسمية للمقياس بعد استيفاء فترة الطعون القانونية ومصادقة اللجنة البيداغوجية.</p>
                </div>
              )}

              {/* Signatures & Official Stamp section */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-slate-800">حرر بورقلة في: {todayDate}</div>
                  <div className="mt-1 text-slate-500">رئيس مصلحة التدريس والشؤون البيداغوجية</div>
                </div>

                <div className="space-y-8">
                  <div className="font-bold text-slate-900">عميد كلية الرياضيات وعلوم المادة</div>
                  <div className="inline-block border-2 border-teal-800 text-teal-900 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider -rotate-6">
                    جامعة ورقلة - كلية FMSM
                    <br />
                    ختم وتوقيع العمادة
                  </div>
                </div>
              </div>

              {/* Footer Barcode / Security strip */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-700" />
                  <span>وثيقة رسمية مؤمنة برمز تحقق إلكتروني صادرة عن المنصة الرقمية لكلية الرياضيات وعلوم المادة ورقلة</span>
                </div>
                <div className="font-mono font-bold tracking-widest text-slate-800">
                  ||| | |||| | ||||| || ||| | |||
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
