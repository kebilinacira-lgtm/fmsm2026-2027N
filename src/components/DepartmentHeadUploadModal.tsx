import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  File, 
  Sparkles,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { CourseResource, DepartmentId, UserProfile, DepartmentHeadAccount } from '../types';

interface DepartmentHeadUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (resource: CourseResource) => void;
  currentUser?: UserProfile | null;
  departmentHeads?: DepartmentHeadAccount[];
}

const DEFAULT_HEADS: Record<DepartmentId, { name: string; title: string }> = {
  physics: { name: 'د. رابح بوعنان', title: 'رئيس قسم الفيزياء' },
  chemistry: { name: 'د. هادف دراجي', title: 'رئيس قسم الكيمياء' },
  math: { name: 'د. طلاب ابراهيم', title: 'رئيس قسم الرياضيات' },
  common_sm: { name: 'د. بن زاهي يوسف', title: 'مسؤول فرع جذع مشترك علوم المادة' }
};

export const DepartmentHeadUploadModal: React.FC<DepartmentHeadUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  currentUser,
  departmentHeads
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine initial department
  const initialDept: DepartmentId = (currentUser?.departmentId as DepartmentId) || 'physics';

  const [departmentId, setDepartmentId] = useState<DepartmentId>(initialDept);
  const [title, setTitle] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [level, setLevel] = useState('L1 SM - S2');
  const [resourceType, setResourceType] = useState<'cours' | 'td' | 'tp' | 'exam_correction' | 'resume'>('cours');
  const [description, setDescription] = useState('');
  const [academicYear, setAcademicYear] = useState('2025 - 2026');

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial department when opening
  useEffect(() => {
    if (isOpen) {
      if (currentUser?.departmentId) {
        setDepartmentId(currentUser.departmentId as DepartmentId);
      }
      setErrorMsg(null);
    }
  }, [isOpen, currentUser]);

  // Find department head details
  const getHeadInfo = (dept: DepartmentId) => {
    const headAccount = departmentHeads?.find(h => h.departmentId === dept);
    if (headAccount) {
      return {
        name: headAccount.name,
        title: headAccount.title
      };
    }
    return DEFAULT_HEADS[dept] || { name: 'رئيس القسم', title: 'رئيس القسم الأكاديمي' };
  };

  const currentHead = getHeadInfo(departmentId);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    
    // Format size
    const sizeKB = file.size / 1024;
    if (sizeKB > 1024) {
      setFileSizeStr(`${(sizeKB / 1024).toFixed(1)} MB`);
    } else {
      setFileSizeStr(`${Math.round(sizeKB)} KB`);
    }

    // Format extension
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    setFileFormat(ext);

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUrl(e.target?.result as string || '');
    };
    reader.readAsDataURL(file);
    setErrorMsg(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMsg('يرجى كتابة عنوان الملف أو المطبوعة الرسمية.');
      return;
    }

    setIsSubmitting(true);

    // If no local file selected, generate a default official syllabus DataURL
    let finalDataUrl = fileDataUrl;
    let finalFormat = fileFormat;
    let finalSize = fileSizeStr || '1.5 MB';

    if (!finalDataUrl) {
      const generatedContent = `الجمهورية الجزائرية الديمقراطية الشعبية
وزارة التعليم العالي والبحث العلمي
جامعة قاصدي مرباح ورقلة
كلية الرياضيات وعلوم المادة
${currentHead.title}

==============================================================
وثيقة بيداغوجية رسمية معتمدة وموجهة لطلبة الكلية
==============================================================
العنوان: ${trimmedTitle}
القسم المصدر: ${departmentId === 'physics' ? 'قسم الفيزياء' : departmentId === 'chemistry' ? 'قسم الكيمياء' : departmentId === 'math' ? 'قسم الرياضيات' : 'فرع جذع مشترك علوم المادة'}
المسؤول المعتمد: ${currentHead.name} (${currentHead.title})
المقياس / المادة: ${moduleName.trim() || 'مقرر رسمي'} (${moduleCode.trim() || 'FMSM-DEP'})
المستوى الدراسي: ${level}
السنة الجامعية: ${academicYear}
تاريخ الاعتماد والنشر: ${new Date().toLocaleDateString('ar-DZ')}

توجيهات وملاحظات رئيس القسم:
${description.trim() || 'يُطلب من جميع الطلبة المعنيين الاطلاع على هذا الملف والالتزام بما ورد فيه.'}

==============================================================
تم إصدار هذه الوثيقة إلكترونياً عبر المنصة الرقمية لكلية الرياضيات وعلوم المادة
جامعة قاصدي مرباح ورقلة`;

      const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
      finalDataUrl = URL.createObjectURL(blob);
      finalFormat = 'TXT';
      finalSize = '120 KB';
    }

    const newResource: CourseResource = {
      id: `dept-head-file-${Date.now()}`,
      title: trimmedTitle,
      moduleCode: moduleCode.trim() || (departmentId === 'physics' ? 'PHYS-DEP' : departmentId === 'chemistry' ? 'CHIM-DEP' : departmentId === 'math' ? 'MATH-DEP' : 'SM-DEP'),
      moduleName: moduleName.trim() || 'مقرر رسمي معتمد',
      departmentId: departmentId,
      level: level.trim() || 'جميع أطوار القسم',
      type: resourceType,
      teacherName: `${currentHead.name} (${currentHead.title})`,
      deptHeadTitle: currentHead.title,
      isOfficialDeptHeadFile: true,
      academicYear: academicYear,
      fileSize: finalSize,
      fileFormat: finalFormat,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      description: description.trim() || `ملف بيداغوجي صادر ومعتمد رسمياً من ${currentHead.title} لطلبة كلية الرياضيات وعلوم المادة.`,
      fileDataUrl: finalDataUrl
    };

    onUpload(newResource);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-5 rounded-t-3xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono bg-teal-500/20 text-teal-200 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                  فضاء رؤساء الأقسام البيداغوجية
                </span>
                <span className="text-[10px] text-teal-200/70">FMSM Portal</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">رفع ونشر ملف بيداغوجي للطلبة</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Department Selection & Head Identity Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              القسم المصدر للملف (بصفتك رئيساً للقسم):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDepartmentId('physics')}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  departmentId === 'physics'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">قسم الفيزياء</div>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1">
                  رئيس القسم: د. رابح بوعنان
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDepartmentId('chemistry')}
                className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                  departmentId === 'chemistry'
                    ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">قسم الكيمياء</div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1">
                    رئيس القسم: د. هادف دراجي
                  </div>
                </div>
                <img
                  src={localStorage.getItem('fmsm_custom_chem_head_photo') || '/head_chemistry_dept.jpg'}
                  alt="د. هادف دراجي"
                  className="w-9 h-10 object-cover object-center rounded-lg border border-amber-300 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/head_chemistry_dept.jpg';
                  }}
                />
              </button>

              <button
                type="button"
                onClick={() => setDepartmentId('math')}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  departmentId === 'math'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">قسم الرياضيات</div>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1">
                  رئيس القسم: د. طلاب ابراهيم
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDepartmentId('common_sm')}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  departmentId === 'common_sm'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">جذع مشترك علوم المادة</div>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1">
                  المسؤول: د. بن زاهي يوسف
                </div>
              </button>
            </div>

            {/* Official seal badge */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>سيتم ختم ونشر الملف رسمياً باسم: <strong className="text-slate-900 dark:text-white">{currentHead.name}</strong> ({currentHead.title}).</span>
            </div>
          </div>

          {/* File Meta Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان الملف أو المطبوعة الرسمية: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: مطبوعة محاضرات ميكانيكا الكم - السداسي الثاني"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المقياس أو المادة الدراسية:
              </label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="مثال: فيزياء نووية / تحليل رياضي 2"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المستوى الدراسي المستهدف:
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="L1 SM - S1/S2">السنة الأولى جذع مشترك (L1 SM)</option>
                <option value="L2 Licence">السنة الثانية ليسانس (L2)</option>
                <option value="L3 Licence">السنة الثالثة ليسانس (L3)</option>
                <option value="Master 1 (M1)">السنة الأولى ماستر (Master 1)</option>
                <option value="Master 2 (M2)">السنة الثانية ماستر (Master 2)</option>
                <option value="Doctorat LMD">طور الدكتوراه والبحث العلمي</option>
                <option value="جميع المستويات">عام - موجه لكافة طلبة القسم</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نوع وطبيعة الملف:
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="cours">محاضرة رسمية (Cours Officiel)</option>
                <option value="td">سلسلة أعمال موجهة (Série TD)</option>
                <option value="tp">دليل أعمال تطبيقية (TP Guide)</option>
                <option value="exam_correction">موضوع امتحان مع الحل النموذجي</option>
                <option value="resume">ملخص بيداغوجي / دليل الطالب</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                السنة الجامعية:
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2025 - 2026"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Description & Teacher Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              توجيهات وملاحظات رئيس القسم للطلبة:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب هنا أي تعليمات بيداغوجية، مواعيد تسليم التقارير، أو محاور المحاضرة..."
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              الملف المراد رفعه (PDF, Word, Excel, ZIP, TXT):
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20'
                  : selectedFile
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-teal-400 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    الحجم: {fileSizeStr} | الصيغة: {fileFormat}
                  </div>
                  <div className="text-[10px] text-teal-600 font-bold hover:underline mt-1">
                    انقر لاختيار ملف آخر
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    اسحب الملف وأفلته هنا، أو انقر للاستعراض
                  </div>
                  <div className="text-[11px] text-slate-400">
                    يدعم جميع الامتدادات (PDF, DOCX, XLSX, PPTX, ZIP, TXT)
                  </div>
                  <div className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold bg-teal-100/50 dark:bg-teal-900/40 px-2 py-0.5 rounded-full">
                    ملاحظة: في حال عدم اختيار ملف محلي، سيتم إنشاء وثيقة رسمية معتمدة تلقائياً
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <FileUp className="w-4 h-4" />
              <span>نشر الملف في فضاء الطالب الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
