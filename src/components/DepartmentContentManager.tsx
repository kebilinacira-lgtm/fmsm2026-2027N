import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Microscope, 
  Users, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  X,
  Sparkles
} from 'lucide-react';
import { DepartmentId, DepartmentInfo, ModuleItem, FacultyTeacher, UserProfile } from '../types';
import { 
  updateDepartmentGeneralInfo, 
  addDepartmentSpecialty, 
  deleteDepartmentSpecialty, 
  addDepartmentLab, 
  deleteDepartmentLab,
  addDepartmentModule,
  deleteDepartmentModule,
  saveCustomDepartments
} from '../data/departmentContentManager';

interface DepartmentContentManagerProps {
  deptId: DepartmentId;
  departments: Record<string, DepartmentInfo>;
  onSaveDepartments: (depts: Record<string, DepartmentInfo>) => void;
  modules: ModuleItem[];
  onSaveModules: (modules: ModuleItem[]) => void;
  facultyTeachers: FacultyTeacher[];
  onSaveFacultyTeachers: (teachers: FacultyTeacher[]) => void;
  currentUser?: UserProfile | null;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const DepartmentContentManager: React.FC<DepartmentContentManagerProps> = ({
  deptId,
  departments,
  onSaveDepartments,
  modules,
  onSaveModules,
  facultyTeachers,
  onSaveFacultyTeachers,
  currentUser,
  onShowToast,
  isModal = false,
  onClose
}) => {
  const currentDept = departments[deptId] || {
    id: deptId,
    nameAr: 'القسم',
    nameFr: 'Département',
    shortCode: deptId.toUpperCase(),
    headName: 'رئيس القسم',
    headTitle: 'رئيس القسم',
    headEmail: '',
    office: '',
    description: '',
    specialties: [],
    labs: [],
    stats: { students: 0, teachers: 0, specialtiesCount: 0, laboratories: 0 },
    colorTheme: 'blue'
  };

  const [activeTab, setActiveTab] = useState<'identity' | 'specialties' | 'labs' | 'teachers' | 'modules'>('identity');

  // --- Sub-Tab 1: Identity & General Info Form ---
  const [identityForm, setIdentityForm] = useState({
    nameAr: currentDept.nameAr,
    nameFr: currentDept.nameFr,
    headName: currentDept.headName,
    headTitle: currentDept.headTitle,
    headEmail: currentDept.headEmail,
    office: currentDept.office,
    description: currentDept.description
  });

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...departments,
      [deptId]: {
        ...currentDept,
        ...identityForm
      }
    };
    onSaveDepartments(updated);
    saveCustomDepartments(updated);
    onShowToast?.(
      'تم حفظ وتحديث بيانات القسم',
      `تم تحديث التعريف وبيانات التواصل الخاصة بـ ${identityForm.nameAr} بنجاح وستظهر لكافة الزوار والطلبة.`,
      'success'
    );
  };

  // --- Sub-Tab 2: Specialties Management ---
  const [newSpecialtyCycle, setNewSpecialtyCycle] = useState<'Licence' | 'Master' | 'Doctorat'>('Licence');
  const [newSpecialtyNameAr, setNewSpecialtyNameAr] = useState('');
  const [newSpecialtyNameFr, setNewSpecialtyNameFr] = useState('');
  const [newSpecialtyDuration, setNewSpecialtyDuration] = useState('3 سنوات');
  const [newSpecialtyDesc, setNewSpecialtyDesc] = useState('');

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialtyNameAr.trim()) return;

    const newSpec = {
      cycle: newSpecialtyCycle,
      nameAr: newSpecialtyNameAr.trim(),
      nameFr: newSpecialtyNameFr.trim() || newSpecialtyNameAr.trim(),
      description: newSpecialtyDesc.trim() || 'عرض تكوين معتمد بالقسم.',
      duration: newSpecialtyDuration.trim()
    };

    const updatedSpecialties = [newSpec, ...(currentDept.specialties || [])];
    const updatedDepts = {
      ...departments,
      [deptId]: {
        ...currentDept,
        specialties: updatedSpecialties,
        stats: {
          ...currentDept.stats,
          specialtiesCount: updatedSpecialties.length
        }
      }
    };

    onSaveDepartments(updatedDepts);
    saveCustomDepartments(updatedDepts);
    setNewSpecialtyNameAr('');
    setNewSpecialtyNameFr('');
    setNewSpecialtyDesc('');

    onShowToast?.(
      'تمت إضافة التخصص بنجاح',
      `تم إدراج تخصص "${newSpec.nameAr}" في عروض تكوين القسم.`,
      'success'
    );
  };

  const handleDeleteSpecialty = (nameAr: string) => {
    if (!confirm(`هل أنت متأكد من حذف تخصص "${nameAr}" من القسم؟`)) return;

    const updatedSpecialties = (currentDept.specialties || []).filter(s => s.nameAr !== nameAr);
    const updatedDepts = {
      ...departments,
      [deptId]: {
        ...currentDept,
        specialties: updatedSpecialties,
        stats: {
          ...currentDept.stats,
          specialtiesCount: updatedSpecialties.length
        }
      }
    };

    onSaveDepartments(updatedDepts);
    saveCustomDepartments(updatedDepts);
    onShowToast?.('تم حذف التخصص', `تم حذف تخصص "${nameAr}" من القسم.`, 'info');
  };

  // --- Sub-Tab 3: Labs Management ---
  const [newLabNameAr, setNewLabNameAr] = useState('');
  const [newLabNameFr, setNewLabNameFr] = useState('');
  const [newLabDirector, setNewLabDirector] = useState('');
  const [newLabCode, setNewLabCode] = useState('');
  const [newLabSpec, setNewLabSpec] = useState('');

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabNameAr.trim()) return;

    const newLab = {
      nameAr: newLabNameAr.trim(),
      nameFr: newLabNameFr.trim() || newLabNameAr.trim(),
      director: newLabDirector.trim() || 'مدير المخبر',
      code: newLabCode.trim() || `LAB-${deptId.toUpperCase()}-${Date.now().toString().slice(-3)}`,
      specialization: newLabSpec.trim() || 'أبحاث ودراسات متقدمة'
    };

    const updatedLabs = [newLab, ...(currentDept.labs || [])];
    const updatedDepts = {
      ...departments,
      [deptId]: {
        ...currentDept,
        labs: updatedLabs,
        stats: {
          ...currentDept.stats,
          laboratories: updatedLabs.length
        }
      }
    };

    onSaveDepartments(updatedDepts);
    saveCustomDepartments(updatedDepts);
    setNewLabNameAr('');
    setNewLabNameFr('');
    setNewLabDirector('');
    setNewLabCode('');
    setNewLabSpec('');

    onShowToast?.(
      'تمت إضافة المخبر بنجاح',
      `تم إدراج مخبر "${newLab.nameAr}" ضمن الهياكل البحثية للقسم.`,
      'success'
    );
  };

  const handleDeleteLab = (labCode: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المخبر من القسم؟')) return;

    const updatedLabs = (currentDept.labs || []).filter(l => l.code !== labCode && l.nameAr !== labCode);
    const updatedDepts = {
      ...departments,
      [deptId]: {
        ...currentDept,
        labs: updatedLabs,
        stats: {
          ...currentDept.stats,
          laboratories: updatedLabs.length
        }
      }
    };

    onSaveDepartments(updatedDepts);
    saveCustomDepartments(updatedDepts);
    onShowToast?.('تم حذف المخبر', 'تم حذف المخبر من القسم.', 'info');
  };

  // --- Sub-Tab 4: Teachers Management ---
  const deptTeachers = facultyTeachers.filter(t => t.departmentId === deptId);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherGrade, setNewTeacherGrade] = useState<FacultyTeacher['grade']>('أستاذ محاضر "أ" (MCA)');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherOffice, setNewTeacherOffice] = useState('');
  const [newTeacherModules, setNewTeacherModules] = useState('');
  const [newTeacherReceptionDay, setNewTeacherReceptionDay] = useState('الثلاثاء');
  const [newTeacherReceptionTime, setNewTeacherReceptionTime] = useState('10:00 - 12:00');

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const newTeacher: FacultyTeacher = {
      id: `tch-${deptId}-${Date.now()}`,
      name: newTeacherName.trim(),
      grade: newTeacherGrade,
      departmentId: deptId,
      email: newTeacherEmail.trim() || `${newTeacherName.trim().replace(/\s+/g, '.')}@univ-ouargla.dz`,
      office: newTeacherOffice.trim() || currentDept.office || 'مكتب الأساتذة',
      modules: newTeacherModules ? newTeacherModules.split(',').map(m => m.trim()).filter(Boolean) : ['مقاييس التخصص'],
      receptionHours: [
        {
          day: newTeacherReceptionDay,
          time: newTeacherReceptionTime,
          location: newTeacherOffice.trim() || 'مكتب الأستاذ'
        }
      ],
      specialty: currentDept.nameAr,
      isAcceptingInquiries: true
    };

    const nextTeachers = [newTeacher, ...facultyTeachers];
    onSaveFacultyTeachers(nextTeachers);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherOffice('');
    setNewTeacherModules('');

    onShowToast?.(
      'تمت إضافة الأستاذ بنجاح',
      `تم إدراج الأستاذ(ة) "${newTeacher.name}" في دليل هيئة تدريس ${currentDept.nameAr}.`,
      'success'
    );
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الأستاذ(ة) "${name}" من هيئة تدريس القسم؟`)) return;
    const nextTeachers = facultyTeachers.filter(t => t.id !== id);
    onSaveFacultyTeachers(nextTeachers);
    onShowToast?.('تم حذف الأستاذ', `تم حذف الأستاذ(ة) "${name}".`, 'info');
  };

  // --- Sub-Tab 5: Modules Management ---
  const deptModules = modules.filter(m => m.departmentId === deptId);
  const [newModCode, setNewModCode] = useState('');
  const [newModNameAr, setNewModNameAr] = useState('');
  const [newModNameFr, setNewModNameFr] = useState('');
  const [newModLevel, setNewModLevel] = useState('L2 S3');
  const [newModUnit, setNewModUnit] = useState<ModuleItem['unitType']>('fondamentale');
  const [newModCoeff, setNewModCoeff] = useState<number>(3);
  const [newModCredits, setNewModCredits] = useState<number>(6);
  const [newModHasTD, setNewModHasTD] = useState(true);
  const [newModHasTP, setNewModHasTP] = useState(false);

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModNameAr.trim()) return;

    const newMod: ModuleItem = {
      id: `mod-${deptId}-${Date.now()}`,
      code: newModCode.trim() || `MOD-${Date.now().toString().slice(-3)}`,
      nameAr: newModNameAr.trim(),
      nameFr: newModNameFr.trim() || newModNameAr.trim(),
      departmentId: deptId,
      level: newModLevel,
      unitType: newModUnit,
      coefficient: Number(newModCoeff) || 1,
      credits: Number(newModCredits) || 1,
      hasTD: newModHasTD,
      hasTP: newModHasTP,
      hoursLecture: 3,
      hoursTD: newModHasTD ? 1.5 : 0,
      hoursTP: newModHasTP ? 1.5 : 0,
      responsibleTeacher: currentDept.headName || 'أستاذ المقياس',
      description: 'مقرر رسمي معتمد في المنهاج البيداغوجي للقسم.'
    };

    const nextModules = addDepartmentModule(newMod);
    onSaveModules(nextModules);
    setNewModCode('');
    setNewModNameAr('');
    setNewModNameFr('');

    onShowToast?.(
      'تمت إضافة المقياس بنجاح',
      `تم إدراج مقياس "${newMod.nameAr}" في المنهاج البيداغوجي للقسم.`,
      'success'
    );
  };

  const handleDeleteModule = (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف مقياس "${name}" من القسم؟`)) return;
    const nextModules = deleteDepartmentModule(id);
    onSaveModules(nextModules);
    onShowToast?.('تم حذف المقياس', `تم حذف مقياس "${name}".`, 'info');
  };

  return (
    <div className={`space-y-6 ${isModal ? 'p-6 bg-white dark:bg-slate-900 rounded-3xl max-w-5xl mx-auto shadow-2xl border border-slate-300 dark:border-slate-700' : ''}`} dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B3D91] via-slate-900 to-[#071739] text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl font-black">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                صلاحيات كاملة مطلقة
              </span>
              <span className="text-xs text-blue-200 font-bold">
                {currentDept.nameAr}
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              محرر إدارة وتخصيص محتويات {currentDept.nameAr}
            </h2>
            <p className="text-xs text-blue-100/90 mt-0.5 max-w-2xl leading-relaxed">
              بصفتك مسؤولاً عن القسم، يمكنك تغيير أي نص أو معلومة، وإضافة وحذف التخصصات والمخابر والأساتذة والمقاييس مباشرة.
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'identity'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. تعريف القسم وبيانات الاتصال</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specialties')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'specialties'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>2. عروض التكوين والتخصصات ({currentDept.specialties?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('labs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'labs'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>3. مخابر البحث والتجارب ({currentDept.labs?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. هيئة التدريس وساعات الاستقبال ({deptTeachers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>5. المقاييس والوحدات البيداغوجية ({deptModules.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: IDENTITY & CONTACT */}
      {activeTab === 'identity' && (
        <form onSubmit={handleSaveIdentity} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-750">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0B3D91]" />
              <span>تعديل بطاقة وهوية {currentDept.nameAr}</span>
            </h3>
            <span className="text-xs text-slate-400">تظهر هذه البيانات مباشرة في صفحة القسم للزوار والطلبة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                اسم القسم (بالعربية) *
              </label>
              <input
                type="text"
                value={identityForm.nameAr}
                onChange={(e) => setIdentityForm(prev => ({ ...prev, nameAr: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                اسم القسم (بالفرنسية) *
              </label>
              <input
                type="text"
                value={identityForm.nameFr}
                onChange={(e) => setIdentityForm(prev => ({ ...prev, nameFr: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                اسم وصفة رئيس القسم
              </label>
              <input
                type="text"
                value={identityForm.headName}
                onChange={(e) => setIdentityForm(prev => ({ ...prev, headName: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                البريد الإلكتروني الرسمي للقسم
              </label>
              <input
                type="email"
                value={identityForm.headEmail}
                onChange={(e) => setIdentityForm(prev => ({ ...prev, headEmail: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                مقر ومكتب رئاسة القسم
              </label>
              <input
                type="text"
                value={identityForm.office}
                onChange={(e) => setIdentityForm(prev => ({ ...prev, office: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              النبذة التعريفية ورسالة القسم البيداغوجية والعلمية *
            </label>
            <textarea
              rows={4}
              value={identityForm.description}
              onChange={(e) => setIdentityForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-750">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>💾 حفظ وتحديث بطاقة القسم فوراً</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: SPECIALTIES & TRAINING OFFERS */}
      {activeTab === 'specialties' && (
        <div className="space-y-6">
          {/* Add Specialty Form */}
          <form onSubmit={handleAddSpecialty} className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-blue-950/30 p-5 rounded-3xl border-2 border-[#0B3D91]/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-blue-100 dark:border-blue-900/40">
              <Plus className="w-4 h-4 text-[#0B3D91]" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                إضافة تخصص جديد إلى عروض تكوين {currentDept.nameAr}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الطور الدراسي *
                </label>
                <select
                  value={newSpecialtyCycle}
                  onChange={(e) => setNewSpecialtyCycle(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-bold"
                >
                  <option value="Licence">طور الليسانس (Licence)</option>
                  <option value="Master">طور الماستر (Master)</option>
                  <option value="Doctorat">طور الدكتوراه والبحث (Doctorat)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  اسم التخصص (بالعربية) *
                </label>
                <input
                  type="text"
                  value={newSpecialtyNameAr}
                  onChange={(e) => setNewSpecialtyNameAr(e.target.value)}
                  placeholder="مثال: ليسانس فيزياء طاقوية وطاقات متجددة..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  مدة التكوين *
                </label>
                <input
                  type="text"
                  value={newSpecialtyDuration}
                  onChange={(e) => setNewSpecialtyDuration(e.target.value)}
                  placeholder="مثال: 3 سنوات (6 سداسيات)..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الوصف والأهداف والآفاق المهنية للتخصص *
                </label>
                <input
                  type="text"
                  value={newSpecialtyDesc}
                  onChange={(e) => setNewSpecialtyDesc(e.target.value)}
                  placeholder="مثال: يؤهل هذا المسار للعمل في قطاعات الطاقة الشمسية، ومخابر التحاليل..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  اسم التخصص (بالفرنسية)
                </label>
                <input
                  type="text"
                  value={newSpecialtyNameFr}
                  onChange={(e) => setNewSpecialtyNameFr(e.target.value)}
                  placeholder="Ex: Master Physique Énergétique..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0B3D91] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>+ إضافة هذا التخصص للقسم فوراً</span>
              </button>
            </div>
          </form>

          {/* Existing Specialties List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              التخصصات المعتمدة حالياً في {currentDept.nameAr} ({currentDept.specialties?.length || 0}):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(currentDept.specialties || []).map((spec, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        spec.cycle === 'Master' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {spec.cycle}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {spec.nameAr}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{spec.nameFr} • {spec.duration}</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSpecialty(spec.nameAr)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg cursor-pointer transition-colors shrink-0"
                    title="حذف هذا التخصص"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LABORATORIES & RESEARCH */}
      {activeTab === 'labs' && (
        <div className="space-y-6">
          {/* Add Lab Form */}
          <form onSubmit={handleAddLab} className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-indigo-950/30 p-5 rounded-3xl border-2 border-indigo-500/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-indigo-100 dark:border-indigo-900/40">
              <Microscope className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                إضافة مخبر بحث أو قاعة تجارب جديدة إلى {currentDept.nameAr}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  اسم المخبر أو قاعة التجارب (بالعربية) *
                </label>
                <input
                  type="text"
                  value={newLabNameAr}
                  onChange={(e) => setNewLabNameAr(e.target.value)}
                  placeholder="مثال: مخبر الطاقة الشمسية والأغشية الرقيقة..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  رمز المخبر الرسمي (Code)
                </label>
                <input
                  type="text"
                  value={newLabCode}
                  onChange={(e) => setNewLabCode(e.target.value)}
                  placeholder="Ex: LAB-PH-01"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  مدير المخبر / المشرف
                </label>
                <input
                  type="text"
                  value={newLabDirector}
                  onChange={(e) => setNewLabDirector(e.target.value)}
                  placeholder="مثال: أ. د. عبد الحميد..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  مجال الاختصاص ومحاور البحث
                </label>
                <input
                  type="text"
                  value={newLabSpec}
                  onChange={(e) => setNewLabSpec(e.target.value)}
                  placeholder="مثال: فيزياء البوليميرات، تحضير الخلايا الشمسية..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة هذا المخبر فوراً</span>
              </button>
            </div>
          </form>

          {/* Existing Labs List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              المخابر التابعة للقسم حالياً ({currentDept.labs?.length || 0}):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(currentDept.labs || []).map((lab, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                        {lab.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {lab.nameAr}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">الإشراف: {lab.director}</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {lab.specialization}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteLab(lab.code)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg cursor-pointer transition-colors shrink-0"
                    title="حذف هذا المخبر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TEACHERS & RECEPTION HOURS */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          {/* Add Teacher Form */}
          <form onSubmit={handleAddTeacher} className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-emerald-950/30 p-5 rounded-3xl border-2 border-emerald-500/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                إضافة أستاذ جديد إلى هيئة تدريس {currentDept.nameAr}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  اسم ولقب الأستاذ *
                </label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="مثال: د. عبد القادر بن عيسى..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الرتبة العلمية *
                </label>
                <select
                  value={newTeacherGrade}
                  onChange={(e) => setNewTeacherGrade(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2.5 text-xs font-semibold"
                >
                  <option value="أستاذ التعليم العالي (Professeur)">أستاذ التعليم العالي (Professeur)</option>
                  <option value="أستاذ محاضر &quot;أ&quot; (MCA)">أستاذ محاضر "أ" (MCA)</option>
                  <option value="أستاذ محاضر &quot;ب&quot; (MCB)">أستاذ محاضر "ب" (MCB)</option>
                  <option value="أستاذ مساعد &quot;أ&quot; (MAA)">أستاذ مساعد "أ" (MAA)</option>
                  <option value="أستاذ مساعد &quot;ب&quot; (MAB)">أستاذ مساعد "ب" (MAB)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المكتب / الجناح
                </label>
                <input
                  type="text"
                  value={newTeacherOffice}
                  onChange={(e) => setNewTeacherOffice(e.target.value)}
                  placeholder="مثال: جناح B، مكتب 114..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المقاييس التي يدرسها (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={newTeacherModules}
                  onChange={(e) => setNewTeacherModules(e.target.value)}
                  placeholder="مثال: فيزياء 1، ميكانيكا الكم..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  يوم استقبال الطلبة
                </label>
                <select
                  value={newTeacherReceptionDay}
                  onChange={(e) => setNewTeacherReceptionDay(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2.5 text-xs"
                >
                  <option value="الأحد">الأحد</option>
                  <option value="الاثنين">الاثنين</option>
                  <option value="الثلاثاء">الثلاثاء</option>
                  <option value="الأربعاء">الأربعاء</option>
                  <option value="الخميس">الخميس</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  توقيت الاستقبال
                </label>
                <input
                  type="text"
                  value={newTeacherReceptionTime}
                  onChange={(e) => setNewTeacherReceptionTime(e.target.value)}
                  placeholder="10:00 - 12:00"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة الأستاذ لهيئة تدريس القسم</span>
              </button>
            </div>
          </form>

          {/* Existing Teachers List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              أساتذة القسم المسجلين ({deptTeachers.length}):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deptTeachers.map((t) => (
                <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {t.grade}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{t.email} • {t.office}</div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      المقاييس: {t.modules.join(', ')}
                    </div>
                    {t.receptionHours?.[0] && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>ساعات الاستقبال: {t.receptionHours[0].day} ({t.receptionHours[0].time})</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTeacher(t.id, t.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg cursor-pointer transition-colors shrink-0"
                    title="حذف الأستاذ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: MODULES & PEDAGOGICAL UNITS */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Add Module Form */}
          <form onSubmit={handleAddModule} className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-amber-950/30 p-5 rounded-3xl border-2 border-amber-500/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-100 dark:border-amber-900/40">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                إضافة مقياس جديد إلى المنهاج البيداغوجي لـ {currentDept.nameAr}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  رمز المقياس (Code) *
                </label>
                <input
                  type="text"
                  value={newModCode}
                  onChange={(e) => setNewModCode(e.target.value)}
                  placeholder="Ex: PHY-301"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  اسم المقياس (بالعربية) *
                </label>
                <input
                  type="text"
                  value={newModNameAr}
                  onChange={(e) => setNewModNameAr(e.target.value)}
                  placeholder="مثال: ميكانيكا الكم المعمقة..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المستوى والسداسي *
                </label>
                <input
                  type="text"
                  value={newModLevel}
                  onChange={(e) => setNewModLevel(e.target.value)}
                  placeholder="مثال: L2 Physique - S3"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  طبيعة الوحدة
                </label>
                <select
                  value={newModUnit}
                  onChange={(e) => setNewModUnit(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-2 text-xs"
                >
                  <option value="fondamentale">أساسية (Fondamentale)</option>
                  <option value="methodologique">منهجية (Méthodologique)</option>
                  <option value="decouverte">استكشافية (Découverte)</option>
                  <option value="transversale">أفقية (Transversale)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المعامل (Coeff)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newModCoeff}
                  onChange={(e) => setNewModCoeff(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الأرصدة (Crédits)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newModCredits}
                  onChange={(e) => setNewModCredits(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-4 pt-5">
                <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newModHasTD}
                    onChange={(e) => setNewModHasTD(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>أعمال موجهة TD</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newModHasTP}
                    onChange={(e) => setNewModHasTP(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>مخبر TP</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة هذا المقياس للقسم</span>
              </button>
            </div>
          </form>

          {/* Existing Modules Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              المقاييس المسجلة في {currentDept.nameAr} ({deptModules.length}):
            </h4>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">الرمز</th>
                    <th className="p-3">اسم المقياس</th>
                    <th className="p-3">المستوى</th>
                    <th className="p-3">الوحدة</th>
                    <th className="p-3">المعامل / الأرصدة</th>
                    <th className="p-3">TD / TP</th>
                    <th className="p-3 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {deptModules.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-[#0B3D91]">{m.code}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{m.nameAr}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{m.level}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {m.unitType}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        معامل {m.coefficient} • {m.credits} أرصدة
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 text-[10px] font-bold">
                          {m.hasTD && <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">TD</span>}
                          {m.hasTP && <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">TP</span>}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteModule(m.id, m.nameAr)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="حذف المقياس"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
