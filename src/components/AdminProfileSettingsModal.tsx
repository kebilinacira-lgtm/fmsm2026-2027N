import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { AdministratorAccount, UserProfile } from '../types';

interface AdminProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  administrators: AdministratorAccount[];
  onUpdateAdministrator: (updated: AdministratorAccount) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AdminProfileSettingsModal: React.FC<AdminProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  administrators,
  onUpdateAdministrator,
  onShowToast,
}) => {
  // Find current admin account in administrators list
  const currentAdmin = administrators.find(a => 
    a.id === currentUser.id ||
    a.username === currentUser.email?.split('@')[0] ||
    (a.role === 'dept_head' && a.departmentId === currentUser.departmentId) ||
    (currentUser.role === 'super_admin' && a.role === 'super_admin')
  ) || administrators[0];

  const [username, setUsername] = useState(currentAdmin?.username || '');
  const [name, setName] = useState(currentAdmin?.name || currentUser.name || '');
  const [email, setEmail] = useState(currentAdmin?.email || currentUser.email || '');
  const [phone, setPhone] = useState(currentAdmin?.phone || currentUser.phone || '');
  const [office, setOffice] = useState(currentAdmin?.office || currentUser.office || '');
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !name.trim() || !email.trim()) {
      setErrorMsg('يرجى ملء اسم المستخدم، الاسم الكامل، والبريد الإلكتروني.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة المحاولة.');
      return;
    }

    setIsSaving(true);

    const updatedAccount: AdministratorAccount = {
      ...currentAdmin,
      username: username.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      office: office.trim(),
      password: newPassword ? newPassword.trim() : currentAdmin.password,
      updatedAt: new Date().toISOString()
    };

    onUpdateAdministrator(updatedAccount);
    setIsSaving(false);
    onShowToast(
      'تم تحديث بيانات الحساب وكلمة المرور بنجاح',
      `تم حفظ التغييرات الخاصة بـ (${updatedAccount.name}) على الخادم والمنصة. يمكنك تسجيل الدخول ببياناتك الجديدة فوراً.`,
      'success'
    );
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-[#0B3D91] to-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 left-5 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
              <KeyRound className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                إدارة الأمان والبيانات الشخصية
              </span>
              <h2 className="text-lg font-black text-white mt-1">
                تعديل الحساب واختيار كلمة المرور
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                حرية تامة في اختيار وتغيير كلمة المرور واسم المستخدم والبريد المهني في أي وقت.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Current Role Banner */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800 dark:text-slate-200">الرتبة الإدارية:</span>
              <span className="text-slate-600 dark:text-slate-400">
                {currentAdmin.role === 'super_admin' ? 'مشرف عام مركزي على المنصة' : currentAdmin.title}
              </span>
            </div>
            <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-md font-bold">
              ID: {currentAdmin.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم المستخدم للدخول (Username) *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الاسم الكامل واللقب *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم واللقب"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                البريد الإلكتروني الرسمي *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@univ-ouargla.dz"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الهاتف والمكتب
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="الهاتف أو التحويلة"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              موقع المكتب الجامعي
            </label>
            <input
              type="text"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              placeholder="الجناح البيداغوجي، الطابق، ورقم المكتب"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
            />
          </div>

          {/* Change Password Block */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>تعيين كلمة مرور جديدة (اختياري):</span>
              </label>
              <span className="text-[11px] text-slate-400">
                (اتركها فارغة إذا أردت الاحتفاظ بالحالية)
              </span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="اكتب كلمة المرور الجديدة التي تختارها بحرية..."
                className="w-full p-2.5 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {newPassword && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تأكيد كلمة المرور الجديدة *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور للتأكيد..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات وكلمة المرور'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
