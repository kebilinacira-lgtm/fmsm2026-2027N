import React, { useState, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  UserCheck, 
  Shield, 
  LogIn, 
  KeyRound, 
  Mail, 
  IdCard, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Atom,
  FlaskConical,
  Binary,
  Layers,
  Crown,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Search
} from 'lucide-react';
import { UserProfile, UserRole, DepartmentId, DepartmentHeadAccount, AdministratorAccount } from '../types';
import { 
  loadSavedDepartmentHeads, 
  SUPER_ADMIN_ACCOUNT
} from '../data/statsAndAccounts';
import { loadAdministrators } from '../data/pedagogicalBridgeData';
import { 
  authenticateStudent, 
  registerNewStudent, 
  loadRegisteredStudents,
  isStrictSecurityMode,
  setStrictSecurityMode,
  RegisteredStudent
} from '../data/studentAccountsData';
import { 
  verifyStudentMatricule, 
  getSampleVerifiedMatricules,
  ApprovedStudent 
} from '../data/approvedStudentsData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  initialRole?: 'student' | 'teacher' | 'admin';
  onOpenAccountsRBAC?: (tab?: 'accounts' | 'security' | 'manual') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialRole = 'student',
  onOpenAccountsRBAC,
}) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>(initialRole);
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');
  const [adminSubRole, setAdminSubRole] = useState<'super_admin' | 'dept_head'>('dept_head');
  const [selectedDeptForHead, setSelectedDeptForHead] = useState<DepartmentId>('physics');

  // Strict security mode toggle
  const [strictMode, setStrictMode] = useState<boolean>(() => isStrictSecurityMode());
  const [showDemoButtons, setShowDemoButtons] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Loaded administrators & registered students
  const [deptHeads, setDeptHeads] = useState<DepartmentHeadAccount[]>([]);
  const [administrators, setAdministrators] = useState<AdministratorAccount[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDeptHeads(loadSavedDepartmentHeads());
      setAdministrators(loadAdministrators());
      setStrictMode(isStrictSecurityMode());
    }
  }, [isOpen]);
  
  // Login form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  // Registration form states for students
  const [regMatricule, setRegMatricule] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regDept, setRegDept] = useState<DepartmentId>('chemistry');
  const [regLevel, setRegLevel] = useState('L3 Chimie des Matériaux - S6');
  const [regSpecialty, setRegSpecialty] = useState('ليسانس كيمياء المواد');
  const [regGroup, setRegGroup] = useState('فوج 01');

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

  if (!isOpen) return null;

  const toggleStrictMode = (enabled: boolean) => {
    setStrictMode(enabled);
    setStrictSecurityMode(enabled);
  };

  const getHeadUserProfile = (deptId: DepartmentId): UserProfile => {
    const head = deptHeads.find(h => h.departmentId === deptId) || {
      id: `head-${deptId}`,
      name: deptId === 'physics' ? 'د. رابح بوعنان' :
            deptId === 'chemistry' ? 'د. هادف دراجي' :
            deptId === 'math' ? 'د. طلاب ابراهيم' : 'د. بن زاهي يوسف',
      title: deptId === 'physics' ? 'رئيس قسم الفيزياء' :
             deptId === 'chemistry' ? 'رئيس قسم الكيمياء' :
             deptId === 'math' ? 'رئيس قسم الرياضيات' : 'مسؤول فرع جذع مشترك علوم المادة',
      grade: 'أستاذ محاضر "أ"',
      email: deptId === 'physics' ? 'dep.physique@univ-ouargla.dz' :
             deptId === 'chemistry' ? 'dep.chimie@univ-ouargla.dz' :
             deptId === 'math' ? 'dep.math@univ-ouargla.dz' : 'sm.tc@univ-ouargla.dz',
      office: 'مكتب رئيس القسم',
      departmentId: deptId,
      phone: '029-71-24-68'
    };

    return {
      id: head.id,
      name: head.name,
      role: 'admin',
      adminRole: 'dept_head',
      adminTitle: head.title,
      departmentId: deptId,
      email: head.email,
      grade: head.grade,
      office: head.office,
      phone: head.phone,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    };
  };

  const handleQuickDemoLogin = (role: 'student' | 'teacher' | 'admin', targetDept?: DepartmentId) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});

    if (role === 'student') {
      const students = loadRegisteredStudents();
      const first = students[0];
      if (first) {
        onLogin({
          id: first.id,
          name: first.name,
          role: 'student',
          email: first.email,
          matricule: first.matricule,
          departmentId: first.departmentId,
          specialty: first.specialty,
          level: first.level,
          avatar: first.avatar
        });
      }
    } else if (role === 'teacher') {
      onLogin({
        id: 'usr-teacher-01',
        name: 'د. بلقاسم مرابط',
        role: 'teacher',
        email: 'b.merabet@univ-ouargla.dz',
        departmentId: 'physics',
        specialty: 'فيزياء المواد والإشعاع',
        grade: 'أستاذ محاضر "أ" (MCA)',
        office: 'الجناح B - مكتب 204',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    } else {
      if (adminSubRole === 'super_admin' && !targetDept) {
        onLogin(SUPER_ADMIN_ACCOUNT);
      } else {
        const dept = targetDept || selectedDeptForHead;
        onLogin(getHeadUserProfile(dept));
      }
    }
    onClose();
  };

  const validateLoginForm = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      if (selectedRole === 'student') {
        errors.identifier = 'يرجى إدخال رقم التسجيل الجامعي (Matricule) أو البريد الإلكتروني.';
      } else if (selectedRole === 'teacher') {
        errors.identifier = 'يرجى إدخال البريد المهني للأستاذ (@univ-ouargla.dz).';
      } else {
        errors.identifier = 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني للمسؤول.';
      }
    }

    const trimmedPass = password.trim();
    if (!trimmedPass) {
      errors.password = 'يرجى إدخال كلمة المرور المعتمدة.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Login Form
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!validateLoginForm()) {
      setErrorMsg('يرجى ملء كافة الحقول المطلوبة للمتابعة.');
      return;
    }

    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    // 1. STUDENT AUTHENTICATION
    if (selectedRole === 'student') {
      const authResult = authenticateStudent(trimmedId, trimmedPass);
      if (!authResult.success || !authResult.student) {
        setErrorMsg(authResult.message);
        return;
      }

      const st = authResult.student;
      onLogin({
        id: st.id,
        name: st.name,
        role: 'student',
        email: st.email,
        matricule: st.matricule,
        departmentId: st.departmentId,
        specialty: st.specialty,
        level: st.level,
        avatar: st.avatar
      });
      onClose();
      return;
    }

    // 2. TEACHER AUTHENTICATION
    if (selectedRole === 'teacher') {
      // Must have valid format and password
      if (trimmedPass.length < 3) {
        setErrorMsg('كلمة المرور غير صحيحة لهذا الحساب.');
        return;
      }

      onLogin({
        id: 'usr-teacher-custom',
        name: trimmedId.includes('@') ? trimmedId.split('@')[0] : `أستاذ ${trimmedId}`,
        role: 'teacher',
        email: trimmedId.includes('@') ? trimmedId : `${trimmedId}@univ-ouargla.dz`,
        departmentId: 'physics',
        specialty: 'علوم المادة',
        grade: 'أستاذ محاضر "أ" (MCA)',
        office: 'مكتب الأساتذة'
      });
      onClose();
      return;
    }

    // 3. ADMINISTRATION / DEPT HEADS AUTHENTICATION
    const currentAdmins = administrators.length > 0 ? administrators : loadAdministrators();
    
    // Check if matched in dynamic administrators by username or email
    const matchedAdmin = currentAdmins.find(a => 
      a.username.toLowerCase() === trimmedId ||
      a.email.toLowerCase() === trimmedId ||
      (a.role === 'dept_head' && a.departmentId === trimmedId)
    );

    if (matchedAdmin) {
      if (matchedAdmin.password && matchedAdmin.password !== trimmedPass) {
        setErrorMsg('كلمة المرور غير صحيحة لهذا الحساب الإداري. يرجى إدخال كلمة المرور المعتمدة.');
        return;
      }

      if (matchedAdmin.role === 'super_admin') {
        onLogin({
          id: matchedAdmin.id,
          name: matchedAdmin.name,
          role: 'super_admin',
          email: matchedAdmin.email,
          phone: matchedAdmin.phone,
          office: matchedAdmin.office,
          adminTitle: matchedAdmin.title,
          adminRole: 'super_admin',
          grade: matchedAdmin.grade,
          avatar: matchedAdmin.avatar
        });
      } else {
        onLogin({
          id: matchedAdmin.id,
          name: matchedAdmin.name,
          role: 'dept_head',
          departmentId: matchedAdmin.departmentId,
          email: matchedAdmin.email,
          phone: matchedAdmin.phone,
          office: matchedAdmin.office,
          adminTitle: matchedAdmin.title,
          adminRole: 'dept_head',
          grade: matchedAdmin.grade,
          avatar: matchedAdmin.avatar
        });
      }
      onClose();
      return;
    }

    // Direct super admin check
    if (trimmedId === 'superadmin' || trimmedId === 'admin_principal' || trimmedId === 'admin') {
      const superA = currentAdmins.find(a => a.role === 'super_admin') || SUPER_ADMIN_ACCOUNT;
      if (superA.password && superA.password !== trimmedPass) {
        setErrorMsg('كلمة المرور غير صحيحة لحساب المشرف العام.');
        return;
      }
      onLogin({
        id: superA.id,
        name: superA.name,
        role: 'super_admin',
        email: superA.email,
        adminRole: 'super_admin',
        adminTitle: superA.title,
        avatar: superA.avatar
      });
      onClose();
      return;
    }

    setErrorMsg('اسم المستخدم غير مسجل كمسؤول معتمد في المنصة. يرجى التأكد من اسم المستخدم الخاص بك أو التواصل مع المشرف العام.');
  };

  // Submit Student Registration Form (Create/Activate Account)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanMatricule = regMatricule.trim();
    if (!cleanMatricule || cleanMatricule.length < 6) {
      setErrorMsg('يرجى إدخال رقم تسجيل جامعي صحيح (Matricule) مكون من 6 أرقام على الأقل.');
      return;
    }

    if (!regName.trim()) {
      setErrorMsg('يرجى إدخال الاسم واللقب الكامل للطالب.');
      return;
    }

    if (!regPassword.trim() || regPassword.trim().length < 3) {
      setErrorMsg('يجب أن تتكون كلمة المرور من 3 خانات على الأقل.');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setErrorMsg('كلمة المرور وتأكيد كلمة المرور غير متطابقتين.');
      return;
    }

    const regResult = registerNewStudent({
      matricule: cleanMatricule,
      name: regName.trim(),
      email: regEmail.trim() || `${cleanMatricule}@etu.univ-ouargla.dz`,
      password: regPassword.trim(),
      departmentId: regDept,
      specialty: regSpecialty,
      level: regLevel,
      group: regGroup
    });

    if (!regResult.success || !regResult.student) {
      setErrorMsg(regResult.message);
      return;
    }

    // Auto-login newly registered student
    const st = regResult.student;
    onLogin({
      id: st.id,
      name: st.name,
      role: 'student',
      email: st.email,
      matricule: st.matricule,
      departmentId: st.departmentId,
      specialty: st.specialty,
      level: st.level,
      avatar: st.avatar
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs" 
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with University Identity */}
        <div className="bg-linear-to-r from-[#0B3D91] to-[#07245c] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/logo_univ_ouargla.png"
              alt="جامعة ورقلة"
              className="w-14 h-14 rounded-full object-contain p-1 bg-white shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-300 font-bold tracking-wide">
                  جامعة قاصدي مرباح ورقلة - FMSM
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>نظام مصادقة مشفر ومحمي</span>
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                بوابة تسجيل الدخول الموحدة
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                تسيير شؤون الأقسام، إدراج الإحصائيات، ومتابعة النشاطات الأكاديمية
              </p>
            </div>
          </div>

          {/* Main Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 mt-5 bg-black/30 p-1.5 rounded-2xl">
            <button
              onClick={() => { 
                setSelectedRole('student'); 
                setErrorMsg(null); 
                setFieldErrors({});
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>فضاء الطالب</span>
            </button>

            <button
              onClick={() => { 
                setSelectedRole('teacher'); 
                setErrorMsg(null); 
                setFieldErrors({});
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'teacher'
                  ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>فضاء الأستاذ</span>
            </button>

            <button
              onClick={() => { 
                setSelectedRole('admin'); 
                setErrorMsg(null); 
                setFieldErrors({});
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>إدارة الأقسام والمنصة</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* STUDENT SUB-TABS: Login vs New Registration */}
          {selectedRole === 'student' && (
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => { setStudentMode('login'); setErrorMsg(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  studentMode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-[#0B3D91] dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول (طالب مسجل)</span>
              </button>

              <button
                type="button"
                onClick={() => { setStudentMode('register'); setErrorMsg(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  studentMode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>تفعيل حساب طالب جديد (Inscription)</span>
              </button>
            </div>
          )}

          {/* Security Notice Card */}
          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
            <Lock className="w-4 h-4 text-[#0B3D91] dark:text-blue-300 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-[#0B3D91] dark:text-blue-300">
                التحقق الأكاديمي المعتمد:
              </strong>
              {selectedRole === 'student' && 'الدخول محصور بالطلبة المسجلين رسمياً في السجل المعتمد لكلية الرياضيات وعلوم المادة وفق رقم التسجيل (Matricule).'}
              {selectedRole === 'teacher' && 'فضاء الأستاذ مخصص لهيئة التدريس المعتمدة بكلية الرياضيات وعلوم المادة.'}
              {selectedRole === 'admin' && 'لوحة الإدارة مخصصة لمسؤولي أقسام الكلية والإدارة العامة.'}
            </div>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. STUDENT REGISTRATION FORM */}
          {selectedRole === 'student' && studentMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-3 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                أدخل رقم تسجيلك الجامعي المسجل في شهادة البكالوريا / بطاقة الطالب لتفعيل حسابك على المنصة وحفظه بشكل دائم.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم التسجيل الجامعي (Matricule) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regMatricule}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRegMatricule(val);
                      if (val.trim().length >= 6) {
                        const check = verifyStudentMatricule(val);
                        if (check.isVerified && check.student) {
                          setRegName(`${check.student.nomAr} ${check.student.prenomAr}`);
                          setRegDept(check.student.departmentId);
                          setRegSpecialty(check.student.specialty);
                          setRegLevel(`${check.student.level} - ${check.student.specialty}`);
                          if (!regEmail) {
                            setRegEmail(`${check.student.prenomFr.toLowerCase()}.${check.student.nomFr.toLowerCase()}@etu.univ-ouargla.dz`);
                          }
                          setErrorMsg(null);
                        }
                      }
                    }}
                    placeholder="مثال: 212139053291 أو 39053291"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                  {regMatricule.trim().length >= 6 && (() => {
                    const check = verifyStudentMatricule(regMatricule);
                    if (check.isVerified && check.student) {
                      return (
                        <div className="mt-1.5 p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-lg text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>رقم تسجيل رسمي معتمد: {check.student.nomAr} {check.student.prenomAr} ({check.student.departmentNameAr})</span>
                        </div>
                      );
                    } else {
                      return (
                        <div className="mt-1.5 p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-lg text-[11px] text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>رقم التسجيل غير موجود في السجل الرسمي (حساب زائر).</span>
                        </div>
                      );
                    }
                  })()}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم واللقب الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: بن علي عبد الرؤوف"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    القسم التابع له <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={regDept}
                    onChange={(e) => {
                      const d = e.target.value as DepartmentId;
                      setRegDept(d);
                      if (d === 'common_sm') {
                        setRegLevel('L1 SM - S2');
                        setRegSpecialty('جذع مشترك علوم المادة');
                      } else if (d === 'chemistry') {
                        setRegLevel('L3 Chimie des Matériaux - S6');
                        setRegSpecialty('ليسانس كيمياء المواد');
                      } else if (d === 'physics') {
                        setRegLevel('M1 Physique Énergétique');
                        setRegSpecialty('ماستر فيزياء طاقوية');
                      } else {
                        setRegLevel('L3 Mathématiques');
                        setRegSpecialty('ليسانس رياضيات تطبيقية');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="common_sm">جذع مشترك علوم المادة (SM)</option>
                    <option value="chemistry">قسم الكيمياء</option>
                    <option value="physics">قسم الفيزياء</option>
                    <option value="math">قسم الرياضيات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المستوى والفوج <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={regLevel}
                      onChange={(e) => setRegLevel(e.target.value)}
                      placeholder="المستوى (مثال: L3)"
                      className="w-2/3 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                    <input
                      type="text"
                      value={regGroup}
                      onChange={(e) => setRegGroup(e.target.value)}
                      placeholder="فوج 02"
                      className="w-1/3 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@etu.univ-ouargla.dz"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اختر كلمة المرور <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="كلمة مرور من اختيارك"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تأكيد كلمة المرور <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>حفظ وتفعيل الحساب الجامعي والدخول فوراً</span>
              </button>
            </form>
          )}

          {/* 2. REGULAR LOGIN FORM (For Student / Teacher / Admin) */}
          {(selectedRole !== 'student' || studentMode === 'login') && (
            <>
              {/* Optional Demo Mode Quick Card */}
              {showDemoButtons && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      معاينة سريعة
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(selectedRole)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1 rounded-lg font-bold text-xs"
                    >
                      دخول فوري
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                    {selectedRole === 'student' && 'طالب معتمد في السجل الرسمي (212139053291 - سفيان أسماء)'}
                    {selectedRole === 'teacher' && 'أستاذ محاضر بكلية الرياضيات وعلوم المادة'}
                    {selectedRole === 'admin' && 'الإدارة العامة أو مسؤولو أقسام الكلية'}
                  </p>
                </div>
              )}

              {/* Admin Department Chooser & RBAC System Hub */}
              {selectedRole === 'admin' && (
                <div className="space-y-3">
                  {/* Direct Link to Full RBAC Accounts Modal */}
                  {onOpenAccountsRBAC && (
                    <div className="p-3 bg-linear-to-r from-amber-500/20 via-blue-500/20 to-emerald-500/20 border border-amber-300 dark:border-amber-700/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div>
                          <div className="font-black text-slate-900 dark:text-white">
                            دليل الحسابات الـ 6 وإعدادات الأمان
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300">
                            تسجيل دخول مباشر بنقرة واحدة وتعديل كلمات المرور
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAccountsRBAC('accounts');
                        }}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>فتح الدليل الشامل</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        هيكل الإشراف وتسيير الأقسام
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        اختر أحد الحسابات الرسمية للتعبئة التلقائية
                      </p>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setAdminSubRole('dept_head')}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          adminSubRole === 'dept_head'
                            ? 'bg-white dark:bg-slate-700 text-[#0B3D91] dark:text-amber-300 shadow-2xs font-black'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        أقسام الكلية
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminSubRole('super_admin')}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          adminSubRole === 'super_admin'
                            ? 'bg-white dark:bg-slate-700 text-[#0B3D91] dark:text-amber-300 shadow-2xs font-black'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        الإدارة العامة
                      </button>
                    </div>
                  </div>

                  {adminSubRole === 'dept_head' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'chemistry', name: 'قسم الكيمياء', user: 'head_chemistry' },
                        { id: 'physics', name: 'قسم الفيزياء', user: 'head_physics' },
                        { id: 'math', name: 'قسم الرياضيات', user: 'head_math' },
                        { id: 'common_sm', name: 'جذع مشترك علوم المادة', user: 'head_sm' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedDeptForHead(item.id as DepartmentId);
                            setIdentifier(item.user);
                          }}
                          className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                            selectedDeptForHead === item.id && identifier === item.user
                              ? 'border-[#0B3D91] bg-blue-50/50 dark:bg-blue-950/40 text-[#0B3D91] dark:text-blue-200 font-bold shadow-2xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-bold">{item.name}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {adminSubRole === 'super_admin' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('admin_principal');
                        }}
                        className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                          identifier === 'admin_principal'
                            ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold shadow-2xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-black text-[#0B3D91] dark:text-amber-300 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          <span>المشرف الأول</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('admin_direction');
                        }}
                        className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                          identifier === 'admin_direction'
                            ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold shadow-2xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-black text-[#0B3D91] dark:text-amber-300 flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-blue-500" />
                          <span>المشرف المساعد</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Login Form Fields */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {selectedRole === 'student' 
                      ? 'رقم التسجيل الجامعي (Matricule) أو البريد' 
                      : selectedRole === 'teacher'
                      ? 'البريد المهني للأستاذ (@univ-ouargla.dz)'
                      : 'اسم المستخدم أو البريد المهني للمسؤول'}
                    <span className="text-rose-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (fieldErrors.identifier) {
                          setFieldErrors(prev => ({ ...prev, identifier: undefined }));
                        }
                      }}
                      placeholder={
                        selectedRole === 'student' 
                          ? 'أدخل رقم التسجيل الجامعي (مثال: 212139053291 أو 39053291)' 
                          : selectedRole === 'teacher'
                          ? 'b.merabet@univ-ouargla.dz'
                          : adminSubRole === 'super_admin' 
                          ? 'admin_principal أو admin@univ-ouargla.dz'
                          : 'head_chemistry أو head_physics...'
                      }
                      className={`w-full bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm rounded-xl py-2.5 pr-10 pl-3 focus:outline-none transition-all ${
                        fieldErrors.identifier
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0B3D91]'
                      }`}
                    />
                    <div className="absolute right-3 top-3 text-slate-400">
                      {selectedRole === 'student' ? <IdCard className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Real-time Student Matricule Verification Status */}
                  {selectedRole === 'student' && identifier.trim().length >= 5 && (() => {
                    const check = verifyStudentMatricule(identifier);
                    if (check.isVerified && check.student) {
                      return (
                        <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-bold">{check.student.nomAr} {check.student.prenomAr}</span>
                              <span className="mx-1 text-slate-400">•</span>
                              <span className="text-[11px]">{check.student.departmentNameAr} ({check.student.level})</span>
                            </div>
                          </div>
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                            طالب نظامي معتمد ✓
                          </span>
                        </div>
                      );
                    } else if (identifier.trim().length >= 7) {
                      return (
                        <div className="mt-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>رقم التسجيل غير متطابق مع السجل الرسمي لطلبة الكلية (زائر غير مسجل).</span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {fieldErrors.identifier && (
                    <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{fieldErrors.identifier}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة المرور (Mot de passe)
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-500 hover:text-[#0B3D91] flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'إخفاء' : 'إظهار كلمة المرور'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm rounded-xl py-2.5 pr-10 pl-3 focus:outline-none transition-all ${
                        fieldErrors.password
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0B3D91]'
                      }`}
                    />
                    <div className="absolute right-3 top-3 text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                  </div>
                  {fieldErrors.password && (
                    <div className="flex items-center gap-1.5 mt-1 text-rose-600 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0B3D91] hover:bg-[#07245c] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول والتحقق من الهوية</span>
                </button>
              </form>

              {/* Strict Mode Control & Demo helper footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={() => setShowDemoButtons(!showDemoButtons)}
                  className="text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  {showDemoButtons ? 'إخفاء الحسابات التجريبية' : 'إظهار حساب تجريبي للمعاينة'}
                </button>

                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>حماية مشفرة</span>
                </span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
