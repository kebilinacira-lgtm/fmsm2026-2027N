import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Edit3, 
  Save, 
  KeyRound, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Printer, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Atom,
  FlaskConical,
  Binary,
  Layers,
  FileCheck
} from 'lucide-react';
import { DepartmentHeadAccount, DepartmentId } from '../types';

interface DepartmentHeadsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentHeads: DepartmentHeadAccount[];
  onUpdateDepartmentHead: (updated: DepartmentHeadAccount) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  currentLogoUrl?: string;
  facultyLogoUrl?: string;
}

export const DepartmentHeadsManagerModal: React.FC<DepartmentHeadsManagerModalProps> = ({
  isOpen,
  onClose,
  departmentHeads,
  onUpdateDepartmentHead,
  onShowToast,
  currentLogoUrl = '/logo_univ_ouargla.png',
  facultyLogoUrl = '/logo_faculty_fmsm.png',
}) => {
  const [editingHeadId, setEditingHeadId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DepartmentHeadAccount | null>(null);
  const [printingHead, setPrintingHead] = useState<DepartmentHeadAccount | null>(null);

  if (!isOpen) return null;

  const departmentIcons: Record<DepartmentId, any> = {
    physics: Atom,
    chemistry: FlaskConical,
    math: Binary,
    common_sm: Layers
  };

  const handleStartEdit = (head: DepartmentHeadAccount) => {
    setEditingHeadId(head.id);
    setEditForm({ ...head });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    onUpdateDepartmentHead(editForm);
    onShowToast(
      'تم تحديث بيانات المسؤول',
      `تم تحديث بيانات حساب ${editForm.title} (${editForm.name}) بنجاح.`,
      'success'
    );
    setEditingHeadId(null);
    setEditForm(null);
  };

  const handlePrintCard = (head: DepartmentHeadAccount) => {
    setPrintingHead(head);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#0B3D91] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-amber-300 font-bold">
                إدارة الحسابات والصلاحيات الإدارية
              </span>
              <h2 className="text-xl font-black text-white">
                هيكل مسؤولي الأقسام الأكاديمية
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                تحديد مسؤولي الأقسام، ضبط بيانات الدخول، وطباعة بطاقات الاعتماد الرسمية لكل مسؤول
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentHeads.map((head) => {
              const Icon = departmentIcons[head.departmentId] || Building2;
              const isEditing = editingHeadId === head.id;

              return (
                <div 
                  key={head.id}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4.5 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-xs text-[#0B3D91] dark:text-amber-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-[#0B3D91] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                          {head.title}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {head.name}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium">
                          {head.grade}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePrintCard(head)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                        title="طباعة بطاقة الاعتماد وبيانات الدخول الرسمية"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(head)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                        title="تعديل بيانات المسؤول وكلمة المرور"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Account Metadata Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        البريد المهني:
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white dir-ltr">
                        {head.email}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5" />
                        اسم المستخدم:
                      </span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {head.username}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        المكتب:
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {head.office}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        الهاتف والتحويلة:
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {head.phone}
                      </span>
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="flex items-center justify-between mt-3 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      حساب مفعّل بصلاحيات إدارة الإحصائيات
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(head)}
                      className="text-[#0B3D91] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                    >
                      تعديل البيانات
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Modal / Drawer if a head is selected for edit */}
          {editingHeadId && editForm && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 mt-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#0B3D91] dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    تعديل بيانات {editForm.title} ({editForm.name})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingHeadId(null); setEditForm(null); }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      اسم ولقب المسؤول:
                    </label>
                    <input
                      type="text"
                      value={editForm.name ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الصفة / الرتبة العلمية:
                    </label>
                    <input
                      type="text"
                      value={editForm.grade ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      البريد الإلكتروني المهني:
                    </label>
                    <input
                      type="email"
                      value={editForm.email ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-white dir-ltr"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      اسم المستخدم (Login Username):
                    </label>
                    <input
                      type="text"
                      value={editForm.username ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      كلمة المرور الجديدة (Password):
                    </label>
                    <input
                      type="text"
                      value={editForm.password ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                      placeholder="اتركها كما هي أو حدد كلمة جديدة"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رقم الهاتف / التحويلة:
                    </label>
                    <input
                      type="text"
                      value={editForm.phone ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      موقع المكتب:
                    </label>
                    <input
                      type="text"
                      value={editForm.office ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, office: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditingHeadId(null); setEditForm(null); }}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0B3D91] hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ التعديلات</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            يمكنك تسليم بطاقة الاعتماد لكل مسؤول قسم فور تعيينه للبدء في تسيير إحصائيات قسمه مباشرة.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>

      {/* Hidden Official Printable Credentials Card */}
      {printingHead && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-10 z-9999 font-serif">
          {/* Ministerial Header */}
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
            <img src={currentLogoUrl} alt="شعار الجامعة" className="w-20 h-20 object-contain" />
            <div className="text-center">
              <h3 className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
              <h4 className="font-semibold text-xs">وزارة التعليم العالي والبحث العلمي</h4>
              <h2 className="font-black text-base mt-1">جامعة قاصدي مرباح ورقلة</h2>
              <h1 className="font-black text-lg text-emerald-900">كلية الرياضيات وعلوم المادة</h1>
              <p className="text-xs mt-0.5">مصلحة الرقمنة وتطوير المنظومات الجامعية</p>
            </div>
            <img src={facultyLogoUrl} alt="شعار الكلية" className="w-20 h-20 object-contain" />
          </div>

          <div className="my-8 text-center">
            <h2 className="text-xl font-black border-2 border-slate-900 inline-block px-8 py-2 rounded-lg bg-slate-100">
              بطاقة تكليف واعتماد رسمي بحساب تسيير القسم
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              وفقاً للنظام الداخلي لمنصة كلية الرياضيات وعلوم المادة الرقمية
            </p>
          </div>

          <div className="border border-slate-400 rounded-lg p-6 space-y-4 max-w-2xl mx-auto text-sm leading-relaxed">
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div><strong>القسم المفوّض:</strong> {printingHead.title}</div>
              <div><strong>الاسم واللقب:</strong> {printingHead.name}</div>
              <div><strong>الرتبة العلمية:</strong> {printingHead.grade}</div>
              <div><strong>المكتب:</strong> {printingHead.office}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded border">
              <h4 className="font-bold mb-2 text-emerald-900">بيانات الولوج إلى لوحة التحكم:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div><strong>اسم المستخدم:</strong> {printingHead.username}</div>
                <div><strong>كلمة المرور الأولية:</strong> {printingHead.password || '123'}</div>
                <div><strong>البريد المهني:</strong> {printingHead.email}</div>
                <div><strong>صلاحية الحساب:</strong> إدراج وتعديل إحصائيات القسم</div>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-1 pt-2">
              <p>• يُخول للمسؤول إدراج وتحديث الأرقام الحقيقية لقسمه ونشر الإعلانات وتسيير الطلبات.</p>
              <p>• يتحمل المسؤول الحفاظ على سرية كلمة المرور وتحديث الإحصائيات بعد مداولات كل سداسي.</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-12 pt-8 text-center text-xs">
            <div>
              <p className="font-bold">توقيع وختم رئيس القسم</p>
              <div className="h-16"></div>
              <p>{printingHead.name}</p>
            </div>
            <div>
              <p className="font-bold">توقيع وختم عميد الكلية</p>
              <div className="h-16"></div>
              <p>أ.د. عميد كلية الرياضيات وعلوم المادة</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
