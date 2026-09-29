import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  KeyRound, 
  Crown, 
  Building2, 
  Atom, 
  FlaskConical, 
  Binary, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  LogIn, 
  Sparkles, 
  Save, 
  Phone, 
  Mail, 
  User, 
  ArrowLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { AdministratorAccount, DepartmentId, UserProfile } from '../types';
import { loadAdministrators, saveAdministrators, logAdminAction } from '../data/pedagogicalBridgeData';

interface AccountsRBACModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  currentUser: UserProfile | null;
  onUpdateAdministrator: (updated: AdministratorAccount) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  initialTab?: 'accounts' | 'security' | 'manual';
}

export const AccountsRBACModal: React.FC<AccountsRBACModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
  onUpdateAdministrator,
  onShowToast,
  initialTab = 'accounts'
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'security' | 'manual'>(initialTab);
  const [administrators, setAdministrators] = useState<AdministratorAccount[]>([]);
  
  // Security settings state for editing an account
  const [selectedAdminToEdit, setSelectedAdminToEdit] = useState<AdministratorAccount | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editOffice, setEditOffice] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Manual Login Form State
  const [manualUser, setManualUser] = useState('');
  const [manualPass, setManualPass] = useState('');
  const [manualShowPass, setManualShowPass] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  // Load fresh accounts
  useEffect(() => {
    if (isOpen) {
      const loaded = loadAdministrators();
      setAdministrators(loaded);
      
      // Default account to edit: if user logged in, use their account, else default to super-admin-01
      const defaultToEdit = currentUser 
        ? loaded.find(a => a.id === currentUser.id || a.username === currentUser.email?.split('@')[0]) || loaded[0]
        : loaded[0];
        
      if (defaultToEdit) {
        selectAccountForEdit(defaultToEdit);
      }
      setSecuritySuccess(null);
      setSecurityError(null);
      setManualError(null);
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const selectAccountForEdit = (acc: AdministratorAccount) => {
    setSelectedAdminToEdit(acc);
    setEditUsername(acc.username);
    setEditName(acc.name);
    setEditEmail(acc.email);
    setEditPhone(acc.phone || '');
    setEditOffice(acc.office || '');
    setNewPassword('');
    setConfirmPassword('');
    setSecuritySuccess(null);
    setSecurityError(null);
  };

  const handleDirectLogin = (acc: AdministratorAccount) => {
    const profile: UserProfile = {
      id: acc.id,
      name: acc.name,
      role: acc.role === 'super_admin' ? 'super_admin' : 'dept_head',
      adminRole: acc.role,
      adminTitle: acc.title,
      email: acc.email,
      departmentId: acc.departmentId,
      grade: acc.grade,
      office: acc.office,
      phone: acc.phone,
      avatar: acc.avatar
    };

    onLogin(profile);
    onShowToast(
      'تم تسجيل الدخول بنجاح',
      `مرحباً بك: ${acc.name} (${acc.role === 'super_admin' ? 'الإدارة العامة - صلاحيات شاملة' : acc.title})`,
      'success'
    );
    onClose();
  };

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (!selectedAdminToEdit) return;

    if (!editUsername.trim() || !editName.trim() || !editEmail.trim()) {
      setSecurityError('يرجى ملء كافة الحقول الأساسية: اسم المستخدم، الاسم واللقب، والبريد الإلكتروني.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityError('كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة المحاولة.');
      return;
    }

    if (newPassword && newPassword.length < 3) {
      setSecurityError('يجب أن تتكون كلمة المرور من 3 خانات على الأقل.');
      return;
    }

    const updatedAccount: AdministratorAccount = {
      ...selectedAdminToEdit,
      username: editUsername.trim(),
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      office: editOffice.trim(),
      password: newPassword ? newPassword.trim() : selectedAdminToEdit.password,
      updatedAt: new Date().toISOString()
    };

    onUpdateAdministrator(updatedAccount);
    
    // Update local list
    setAdministrators(prev => prev.map(a => a.id === updatedAccount.id ? updatedAccount : a));
    setSelectedAdminToEdit(updatedAccount);
    setNewPassword('');
    setConfirmPassword('');
    
    setSecuritySuccess(`تم تحديث بيانات الحساب وكلمة المرور لـ (${updatedAccount.name}) بنجاح. البيانات محفّوظة دائماً.`);
    onShowToast(
      'تم حفظ إعدادات الأمان بنجاح',
      `تم تحديث كلمة المرور والبريد لـ ${updatedAccount.name}.`,
      'success'
    );
  };

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    const cleanUser = manualUser.trim().toLowerCase();
    const cleanPass = manualPass.trim();

    if (!cleanUser || !cleanPass) {
      setManualError('يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة.');
      return;
    }

    const matched = administrators.find(a => 
      a.username.toLowerCase() === cleanUser || 
      a.email.toLowerCase() === cleanUser ||
      (a.role === 'dept_head' && a.departmentId === cleanUser)
    );

    if (!matched) {
      setManualError('اسم المستخدم غير مسجل كمسؤول معتمد في المنصة.');
      return;
    }

    if (matched.password && matched.password !== cleanPass) {
      setManualError('كلمة المرور غير صحيحة لهذا الحساب. تأكد من كلمة المرور أو اختر تعديلها في تبويب إعدادات الأمان.');
      return;
    }

    handleDirectLogin(matched);
  };

  // Group Accounts
  const generalAdmins = administrators.filter(a => a.role === 'super_admin');
  const deptHeads = administrators.filter(a => a.role === 'dept_head');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-linear-to-r from-[#0B3D91] via-slate-900 to-[#071739] text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-1">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl shadow-md border border-amber-300">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                    نظام المصادقة والصلاحيات المعتمد
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold hidden md:inline">
                    حسابات الإدارة والأقسام
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  حسابات الإدارة العامة وأقسام الكلية
                </h2>
                <p className="text-xs text-blue-100/90 mt-0.5 max-w-2xl leading-relaxed">
                  توزيع الصلاحيات: حساب الإدارة العامة وحسابات مسؤولي أقسام الكلية مع إمكانية تعديل كلمات المرور والبيانات الشخصية.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs inside Modal */}
          <div className="grid grid-cols-3 gap-2 mt-5 bg-black/40 p-1.5 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('accounts')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>الحسابات الـ 6 المعتمدة</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>إعدادات الأمان وكلمة المرور</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول اليدوي</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: ACCOUNTS DIRECTORY & DIRECT LOGIN */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              
              {/* CURRENT LOGIN STATUS */}
              {currentUser && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                        أنت مسجل حالياً باسم: {currentUser.name}
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-400">
                        الرتبة: {currentUser.role === 'super_admin' ? 'مشرف المنصة العام - الإدارة العامة' : currentUser.adminTitle || 'مسؤول قسم معتمد'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const myAcc = administrators.find(a => a.id === currentUser.id) || administrators[0];
                        selectAccountForEdit(myAcc);
                        setActiveTab('security');
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>تغيير كلمة المرور والبريد</span>
                    </button>
                  </div>
                </div>
              )}
              {/* 1. GENERAL ADMINISTRATION SECTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    1. حساب الإدارة العامة
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generalAdmins.map((acc, idx) => (
                    <div 
                      key={acc.id}
                      className="bg-linear-to-br from-slate-900 to-[#0B3D91] text-white p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col justify-between relative group hover:border-amber-400/60 transition-all"
                    >
                      <div className="absolute top-4 left-4 flex items-center gap-1">
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                          {idx === 0 ? 'المشرف الأول' : 'المشرف الثاني'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
                            <Crown className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-base text-white">
                              {acc.name}
                            </h4>
                            <p className="text-xs text-amber-300 font-semibold">
                              {acc.title}
                            </p>
                          </div>
                        </div>

                        {/* Account Details */}
                        <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1.5 text-xs">
                          <div className="flex justify-between items-center text-slate-200">
                            <span>البريد الإلكتروني:</span>
                            <span className="font-mono text-blue-200 text-xs truncate max-w-[200px]" title={acc.email}>{acc.email}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-200">
                            <span>اسم الدخول:</span>
                            <span className="font-mono font-bold text-amber-300 text-xs">{acc.username}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            selectAccountForEdit(acc);
                            setActiveTab('security');
                          }}
                          className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="تعديل كلمة المرور أو البريد لهذا الحساب"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                          <span>إعدادات الأمان</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectLogin(acc)}
                          className="px-4 py-2 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer transform hover:scale-102"
                        >
                          <LogIn className="w-3.5 h-3.5 text-slate-950" />
                          <span>تسجيل الدخول</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. THE DEPARTMENT HEADS ACCOUNTS */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    2. حسابات مسؤولي أقسام الكلية
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deptHeads.map((head) => {
                    const isChem = head.departmentId === 'chemistry';
                    const isPhys = head.departmentId === 'physics';
                    const isMath = head.departmentId === 'math';
                    const isSm = head.departmentId === 'common_sm';

                    const iconColor = isChem ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' :
                                      isPhys ? 'text-teal-600 bg-teal-50 dark:bg-teal-950/50' :
                                      isMath ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50' :
                                      'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50';

                    const borderColor = isChem ? 'border-amber-200 dark:border-amber-800/60' :
                                        isPhys ? 'border-teal-200 dark:border-teal-800/60' :
                                        isMath ? 'border-cyan-200 dark:border-cyan-800/60' :
                                        'border-emerald-200 dark:border-emerald-800/60';

                    return (
                      <div 
                        key={head.id}
                        className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border ${borderColor} shadow-xs flex flex-col justify-between hover:shadow-md transition-all`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${iconColor}`}>
                                {isChem && <FlaskConical className="w-6 h-6" />}
                                {isPhys && <Atom className="w-6 h-6" />}
                                {isMath && <Binary className="w-6 h-6" />}
                                {isSm && <Layers className="w-6 h-6" />}
                              </div>
                              <div>
                                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                                  {head.name}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                  {head.title}
                                </p>
                              </div>
                            </div>

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {head.departmentId === 'chemistry' && 'قسم الكيمياء'}
                              {head.departmentId === 'physics' && 'قسم الفيزياء'}
                              {head.departmentId === 'math' && 'قسم الرياضيات'}
                              {head.departmentId === 'common_sm' && 'جذع مشترك SM'}
                            </span>
                          </div>

                          {/* Account Details */}
                          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                              <span>البريد الإلكتروني:</span>
                              <span className="font-mono text-blue-700 dark:text-blue-300 text-xs truncate max-w-[180px]" title={head.email}>{head.email}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                              <span>اسم الدخول:</span>
                              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{head.username}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              selectAccountForEdit(head);
                              setActiveTab('security');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="تعديل كلمة المرور أو البريد لهذا الحساب"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                            <span>إعدادات الأمان</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDirectLogin(head)}
                            className="px-3.5 py-2 bg-[#0B3D91] hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:shadow-md"
                          >
                            <LogIn className="w-3.5 h-3.5 text-amber-300" />
                            <span>الدخول بهذا الحساب</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL SECURITY SETTINGS & PASSWORD CHANGE */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl flex items-start gap-3 text-xs">
                <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">
                    صفحة إعدادات الأمان وتغيير كلمة المرور والبريد لأي مسؤول في أي وقت
                  </h4>
                  <p className="text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                    اختر الحساب المراد تعديله من القائمة أدناه، وقم بتعيين كلمة المرور الجديدة أو البريد أو اسم المستخدم بكل حرية. يتم حفظ التعديلات فورياً في المنصة.
                  </p>
                </div>
              </div>

              {/* Account Selector Pill Row */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  اختر الحساب الإداري المراد تعديل أمانه وكلمة مروره:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {administrators.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => selectAccountForEdit(acc)}
                      className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                        selectedAdminToEdit?.id === acc.id
                          ? 'border-[#0B3D91] dark:border-amber-400 bg-blue-50 dark:bg-slate-800 text-[#0B3D91] dark:text-amber-300 font-bold shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold truncate">{acc.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {acc.role === 'super_admin' ? '👑 إدارة عامة' : `🏛️ ${acc.title}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status messages */}
              {securityError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{securityError}</span>
                </div>
              )}

              {securitySuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{securitySuccess}</span>
                </div>
              )}

              {/* Edit Form */}
              {selectedAdminToEdit && (
                <form onSubmit={handleSaveSecuritySettings} className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">الحساب المختار:</span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {selectedAdminToEdit.name} ({selectedAdminToEdit.title})
                      </h4>
                    </div>
                    <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 px-2 py-0.5 rounded font-bold">
                      {selectedAdminToEdit.role === 'super_admin' ? 'الإدارة العامة' : selectedAdminToEdit.departmentId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        اسم المستخدم للدخول (Username) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#0B3D91]"
                        placeholder="اسم المستخدم"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الاسم واللقب الكامل *
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#0B3D91]"
                        placeholder="الاسم واللقب"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        البريد الإلكتروني الرسمي *
                      </label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#0B3D91]"
                        placeholder="admin@univ-ouargla.dz"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم الهاتف الداخلي / المباشر
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#0B3D91]"
                        placeholder="029-71-24-68"
                      />
                    </div>
                  </div>

                  {/* Password Modification Box */}
                  <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                        <Lock className="w-4 h-4 text-amber-600" />
                        <span>تغيير كلمة المرور (Password):</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        كلمة المرور الحالية: <code className="bg-white dark:bg-black/30 px-1.5 py-0.5 rounded font-mono font-bold text-amber-700 dark:text-amber-400">{selectedAdminToEdit.password || '123'}</code>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                          كلمة المرور الجديدة:
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="اترك فارغاً للاحتفاظ بكلمة المرور الحالية"
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 pr-3 pl-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                          تأكيد كلمة المرور الجديدة:
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="أعد كتابة كلمة المرور الجديدة للتأكيد"
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ إعدادات الأمان وكلمة المرور الآن</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: MANUAL LOGIN FORM */}
          {activeTab === 'manual' && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  تسجيل الدخول اليدوي ببياناتك المعتمدة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  أدخل اسم المستخدم أو البريد الإلكتروني للمسؤول مع كلمة المرور.
                </p>
              </div>

              {manualError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{manualError}</span>
                </div>
              )}

              <form onSubmit={handleManualLoginSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم المستخدم أو البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={manualUser}
                    onChange={(e) => setManualUser(e.target.value)}
                    placeholder="مثال: admin_principal أو head_chemistry"
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    كلمة المرور <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={manualShowPass ? 'text' : 'password'}
                      required
                      value={manualPass}
                      onChange={(e) => setManualPass(e.target.value)}
                      placeholder="كلمة المرور المعتمدة"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#0B3D91] pr-3 pl-9"
                    />
                    <button
                      type="button"
                      onClick={() => setManualShowPass(!manualShowPass)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {manualShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>تسجيل الدخول إلى الفضاء الإداري</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>نظام محمي: الإدارة العامة ومسؤولو أقسام الكلية</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
