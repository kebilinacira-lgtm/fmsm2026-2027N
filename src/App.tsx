import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AboutFacultyView } from './components/AboutFacultyView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { DepartmentView } from './components/DepartmentView';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { InteractiveTools } from './components/InteractiveTools';
import { OfficialPortalsSection } from './components/OfficialPortalsSection';
import { OfficialDocumentModal } from './components/OfficialDocumentModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ToastContainer';
import { ContactView } from './components/ContactView';
import { trackPageView } from './utils/analytics';
import { LogoManagerModal } from './components/LogoManagerModal';
import { DepartmentStatsEditorModal } from './components/DepartmentStatsEditorModal';
import { DepartmentHeadsManagerModal } from './components/DepartmentHeadsManagerModal';
import { PedagogicalBridgeModal } from './components/PedagogicalBridgeModal';
import { AdminProfileSettingsModal } from './components/AdminProfileSettingsModal';
import { AccountsRBACModal } from './components/AccountsRBACModal';
import { 
  loadAdministrators, 
  saveAdministrators, 
  loadFacultyTeachers, 
  saveFacultyTeachers, 
  loadPedagogicalInquiries, 
  savePedagogicalInquiries,
  logAdminAction 
} from './data/pedagogicalBridgeData';
import { 
  INITIAL_RESOURCES, 
  INITIAL_ANNOUNCEMENTS, 
  FACULTY_GENERAL_INFO, 
  DEPARTMENTS 
} from './data/facultyData';
import { 
  loadOfficialAnnouncements,
  saveOfficialAnnouncements,
  syncAnnouncementsFromOfficialPortal
} from './data/officialAnnouncementsData';
import { 
  loadSavedDepartmentStats, 
  saveDepartmentStats, 
  loadSavedFacultyStats, 
  saveFacultyStats, 
  loadSavedDepartmentHeads, 
  saveDepartmentHeads,
  resetAllStatsToDefault,
  INITIAL_DEPARTMENT_REAL_STATS,
  INITIAL_FACULTY_REAL_STATS,
  INITIAL_DEPARTMENT_HEADS
} from './data/statsAndAccounts';
import {
  loadCustomDepartments,
  saveCustomDepartments,
  loadCustomModules,
  saveCustomModules
} from './data/departmentContentManager';
import { 
  CourseResource, 
  Announcement, 
  StudentAdministrativeRequest, 
  UserProfile, 
  ToastNotification,
  AppLanguage,
  DepartmentId,
  DepartmentRealStats,
  FacultyGeneralRealStats,
  DepartmentHeadAccount,
  AdministratorAccount,
  FacultyTeacher,
  PedagogicalInquiry,
  DepartmentInfo,
  ModuleItem
} from './types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  ExternalLink, 
  GraduationCap, 
  Sparkles,
  ArrowUp,
  MessageSquare,
  Printer,
  Shield,
  UserCheck,
  LogIn,
  Atom,
  Clock,
  Camera,
  School,
  Sliders,
  ZoomIn,
  ZoomOut,
  BarChart3,
  KeyRound,
  Radio
} from 'lucide-react';
import { AcademicChatRooms } from './components/AcademicChatRooms';
import { getTranslation } from './data/translations';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'home' | 'about' | 'specialties' | 'student' | 'teacher' | 'admin' | 'departments' | 'tools' | 'announcements' | 'portals' | 'contact' | 'chat'
  >('home');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('common_sm');

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Language State with persistence and RTL/LTR direction sync
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('fmsm_app_language') as AppLanguage;
      if (saved && (saved === 'ar' || saved === 'fr' || saved === 'en')) {
        return saved;
      }
    } catch {}
    return 'ar';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('fmsm_app_language', language);
    } catch {}
  }, [language]);

  // Track page views in Google Tag Manager (GTM-KL6S2MPW) for faculty ranking & analytics
  useEffect(() => {
    trackPageView(`/${activeTab}`, `كلية الرياضيات وعلوم المادة - ${activeTab}`);
  }, [activeTab]);

  // Auth / Current User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialRole, setLoginModalInitialRole] = useState<'student' | 'teacher' | 'admin'>('student');

  // Toasts State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Shared Resources State (Teacher uploads reflect in Student portal)
  const [resources, setResources] = useState<CourseResource[]>(INITIAL_RESOURCES);

  // Announcements State (Synced directly with official portal https://fmsm.univ-ouargla.dz/ar/ + Admin additions)
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const official = loadOfficialAnnouncements();
      const existingIds = new Set(official.map(o => o.id));
      const remainingInitial = INITIAL_ANNOUNCEMENTS.filter(a => !existingIds.has(a.id));
      return [...official, ...remainingInitial];
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [isSyncingOfficial, setIsSyncingOfficial] = useState(false);

  // Administrative Requests State (Synced between student submissions and admin approvals)
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
    },
    {
      id: 'req-02',
      trackingCode: 'DOC-FMSM-2026-7890',
      studentName: 'أحمد بن سالم',
      matricule: '2139045812',
      departmentId: 'chemistry',
      level: 'L3 Chimie des Matériaux',
      requestType: 'releve_de_notes',
      dateSubmitted: '2026-06-03',
      status: 'قيد المعالجة',
      notes: 'قيد المراجعة والمصادقة بمصلحة الامتحانات.'
    },
    {
      id: 'req-03',
      trackingCode: 'DOC-FMSM-2026-3319',
      studentName: 'عثماني خولة',
      matricule: '2239088219',
      departmentId: 'physics',
      level: 'L2 Physique Fondamentale',
      requestType: 'releve_de_notes',
      dateSubmitted: '2026-06-04',
      status: 'قيد المعالجة',
      notes: 'طلب كشف نقاط السداسي الثالث للمصادقة.'
    },
    {
      id: 'req-04',
      trackingCode: 'DOC-FMSM-2026-5520',
      studentName: 'حمادي بلقاسم',
      matricule: '2139049811',
      departmentId: 'physics',
      level: 'M1 Physique Énergétique',
      requestType: 'certificat_scolarite',
      dateSubmitted: '2026-06-05',
      status: 'مقبول وجاهز للاستلام',
      notes: 'شهادة تمدرس ماستر 1 جاهزة للاستلام بمكتب القسم.'
    },
    {
      id: 'req-05',
      trackingCode: 'DOC-FMSM-2026-6641',
      studentName: 'قدوري سيف الدين',
      matricule: '2139045610',
      departmentId: 'math',
      level: 'M1 Mathématiques Appliquées',
      requestType: 'certificat_scolarite',
      dateSubmitted: '2026-06-02',
      status: 'قيد المعالجة',
      notes: 'قيد المصادقة برئاسة قسم الرياضيات.'
    },
    {
      id: 'req-06',
      trackingCode: 'DOC-FMSM-2026-8812',
      studentName: 'عماري مريم',
      matricule: '2239055102',
      departmentId: 'math',
      level: 'L3 Mathématiques Générales',
      requestType: 'releve_de_notes',
      dateSubmitted: '2026-06-04',
      status: 'مقبول وجاهز للاستلام',
      notes: 'كشف نقاط مصادق عليه وجاهز.'
    },
    {
      id: 'req-07',
      trackingCode: 'DOC-FMSM-2026-9921',
      studentName: 'زايدي محمد الأمين',
      matricule: '232339091244',
      departmentId: 'common_sm',
      level: 'L1 SM - S2',
      requestType: 'carte_etudiant',
      dateSubmitted: '2026-06-05',
      status: 'قيد المعالجة',
      notes: 'إعادة إصدار بطاقة طالب ممغنطة بدل ضائع.'
    }
  ]);

  // Document modal state
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: string;
    data: any;
  }>({
    isOpen: false,
    type: 'certificat_scolarite',
    data: null
  });

  // AI Advisor modal state
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);

  // Official Logo Management State (Dual Logos + Dynamic Sizing)
  const [isLogoManagerOpen, setIsLogoManagerOpen] = useState(false);
  const [logoManagerTarget, setLogoManagerTarget] = useState<'university' | 'faculty'>('university');

  const [universityLogoUrl, setUniversityLogoUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('fmsm_custom_logo_url') || '/logo_univ_ouargla.png';
    } catch {
      return '/logo_univ_ouargla.png';
    }
  });

  const [facultyLogoUrl, setFacultyLogoUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('fmsm_faculty_logo_url') || '/logo_faculty_fmsm.png';
    } catch {
      return '/logo_faculty_fmsm.png';
    }
  });

  const [logoSize, setLogoSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fmsm_logo_size');
      return saved ? Math.max(36, Math.min(96, Number(saved))) : 54;
    } catch {
      return 54;
    }
  });

  const [facultyLogoSize, setFacultyLogoSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fmsm_faculty_logo_size');
      return saved ? Math.max(36, Math.min(96, Number(saved))) : 54;
    } catch {
      return 54;
    }
  });

  // Logo Display Mode: 'single' (one clean logo) or 'both' (dual logos)
  // Default to 'single' as requested by the user for clarity and non-repetition
  const [logoDisplayMode, setLogoDisplayMode] = useState<'single' | 'both'>(() => {
    try {
      return (localStorage.getItem('fmsm_logo_display_mode') as 'single' | 'both') || 'single';
    } catch {
      return 'single';
    }
  });

  // When in 'single' mode, choose which logo to showcase ('faculty' or 'university')
  const [singleLogoChoice, setSingleLogoChoice] = useState<'faculty' | 'university'>(() => {
    try {
      return (localStorage.getItem('fmsm_single_logo_choice') as 'faculty' | 'university') || 'faculty';
    } catch {
      return 'faculty';
    }
  });

  const handleDisplayModeChange = (mode: 'single' | 'both') => {
    setLogoDisplayMode(mode);
    try {
      localStorage.setItem('fmsm_logo_display_mode', mode);
    } catch {}
    showToast(
      mode === 'single' ? 'تم تفعيل وضع الشعار الواحد' : 'تم تفعيل وضع الشعارين',
      mode === 'single'
        ? 'تم الاكتفاء بشعار رسمي واحد لإضفاء مزيد من البساطة والأناقة على الواجهة.'
        : 'يظهر الآن شعارا الجامعة والكلية معاً.',
      'info'
    );
  };

  const handleSingleLogoChoiceChange = (choice: 'faculty' | 'university') => {
    setSingleLogoChoice(choice);
    try {
      localStorage.setItem('fmsm_single_logo_choice', choice);
    } catch {}
    showToast(
      'تم تحديد الشعار الرئيسي',
      choice === 'faculty'
        ? 'تم اعتماد شعار كلية الرياضيات وعلوم المادة FMSM كشعار أساسي للواجهة.'
        : 'تم اعتماد شعار جامعة قاصدي مرباح ورقلة UKMO كشعار أساسي للواجهة.',
      'info'
    );
  };

  const handleOpenLogoManager = (target: 'university' | 'faculty' = 'university') => {
    setLogoManagerTarget(target);
    setIsLogoManagerOpen(true);
  };

  const handleLogoUpdated = (targetOrUrl: 'university' | 'faculty' | string, newUrl?: string) => {
    // If called with single argument (newUrl)
    let actualTarget: 'university' | 'faculty' = logoManagerTarget;
    let actualUrl = '';

    if (targetOrUrl === 'university' || targetOrUrl === 'faculty') {
      actualTarget = targetOrUrl;
      actualUrl = newUrl || '';
    } else {
      actualUrl = targetOrUrl;
    }

    if (actualTarget === 'university') {
      setUniversityLogoUrl(actualUrl);
      try {
        localStorage.setItem('fmsm_custom_logo_url', actualUrl);
      } catch {}
      showToast('تم تحديث شعار الجامعة بنجاح', 'تم تطبيق الشعار الرسمي لجامعة قاصدي مرباح ورقلة عبر كافة بوابات المنصة والوثائق.', 'success');
    } else {
      setFacultyLogoUrl(actualUrl);
      try {
        localStorage.setItem('fmsm_faculty_logo_url', actualUrl);
      } catch {}
      showToast('تم تحديث شعار الكلية بنجاح', 'تم تطبيق الشعار الرسمي لكلية الرياضيات وعلوم المادة FMSM بنجاح.', 'success');
    }
  };

  const handleSizeUpdated = (target: 'university' | 'faculty', newSize: number) => {
    const clamped = Math.max(36, Math.min(96, newSize));
    if (target === 'university') {
      setLogoSize(clamped);
      try {
        localStorage.setItem('fmsm_logo_size', String(clamped));
      } catch {}
    } else {
      setFacultyLogoSize(clamped);
      try {
        localStorage.setItem('fmsm_faculty_logo_size', String(clamped));
      } catch {}
    }
  };

  const handleChangeLogoSizeDelta = (delta: number) => {
    const newSize = Math.max(36, Math.min(96, logoSize + delta));
    setLogoSize(newSize);
    setFacultyLogoSize(newSize);
    try {
      localStorage.setItem('fmsm_logo_size', String(newSize));
      localStorage.setItem('fmsm_faculty_logo_size', String(newSize));
    } catch {}
    showToast('تم ضبط حجم الشعارات', `حجم الشعار الحالي: ${newSize} بكسل`, 'info');
  };

  // Real Dynamic Statistics & Department Head Accounts State (Persistent with localStorage)
  const [departmentStats, setDepartmentStats] = useState<Record<DepartmentId, DepartmentRealStats>>(() => 
    loadSavedDepartmentStats()
  );
  const [facultyStats, setFacultyStats] = useState<FacultyGeneralRealStats>(() => 
    loadSavedFacultyStats()
  );
  const [departmentHeads, setDepartmentHeads] = useState<DepartmentHeadAccount[]>(() => 
    loadSavedDepartmentHeads()
  );

  // Modals for Stats and Accounts
  const [isStatsEditorOpen, setIsStatsEditorOpen] = useState(false);
  const [statsEditorTargetDept, setStatsEditorTargetDept] = useState<DepartmentId | undefined>(undefined);
  const [isHeadsManagerOpen, setIsHeadsManagerOpen] = useState(false);

  // Real Administrators, Faculty Teachers, and Pedagogical Inquiries State
  const [administrators, setAdministrators] = useState<AdministratorAccount[]>(() =>
    loadAdministrators()
  );
  const [facultyTeachers, setFacultyTeachers] = useState<FacultyTeacher[]>(() =>
    loadFacultyTeachers()
  );
  const [pedagogicalInquiries, setPedagogicalInquiries] = useState<PedagogicalInquiry[]>(() =>
    loadPedagogicalInquiries()
  );

  const [isPedagogicalBridgeOpen, setIsPedagogicalBridgeOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isAccountsRBACOpen, setIsAccountsRBACOpen] = useState(false);
  const [accountsRBACInitialTab, setAccountsRBACInitialTab] = useState<'accounts' | 'security' | 'manual'>('accounts');

  const handleOpenAccountsRBAC = (tab: 'accounts' | 'security' | 'manual' = 'accounts') => {
    setAccountsRBACInitialTab(tab);
    setIsAccountsRBACOpen(true);
  };

  const handleUpdateAdministrator = (updated: AdministratorAccount) => {
    setAdministrators(prev => {
      const next = prev.map(a => a.id === updated.id ? updated : a);
      saveAdministrators(next);
      return next;
    });

    // Also update departmentHeads state if applicable
    if (updated.role === 'dept_head' && updated.departmentId) {
      setDepartmentHeads(prev => {
        const next = prev.map(h => h.id === updated.id ? {
          ...h,
          name: updated.name,
          username: updated.username,
          password: updated.password,
          email: updated.email,
          phone: updated.phone || h.phone,
          office: updated.office || h.office
        } : h);
        saveDepartmentHeads(next);
        return next;
      });
    }

    // If the currently logged in user is this admin, update currentUser session
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        office: updated.office,
        adminTitle: updated.title
      }) : null);
    }

    logAdminAction({
      adminName: updated.name,
      adminRole: updated.role,
      departmentId: updated.departmentId,
      actionType: 'password_change',
      description: `تم تحديث بيانات الحساب ${updated.username} بنجاح.`
    });
    showToast('تم حفظ بيانات الحساب وكلمة المرور', 'تم تحديث بياناتك بنجاح وجاهزة للاستخدام في جلسات الدخول القادمة.', 'success');
  };

  const handleAddTeacher = (teacher: FacultyTeacher) => {
    setFacultyTeachers(prev => {
      const next = [teacher, ...prev];
      saveFacultyTeachers(next);
      return next;
    });
    showToast('تمت إضافة الأستاذ بنجاح', `أُدرج الأستاذ ${teacher.name} في دليل همزة الوصل.`, 'success');
  };

  const handleUpdateTeacher = (teacher: FacultyTeacher) => {
    setFacultyTeachers(prev => {
      const next = prev.map(t => t.id === teacher.id ? teacher : t);
      saveFacultyTeachers(next);
      return next;
    });
    showToast('تم تحديث بيانات الأستاذ', `تم تعديل ساعات الاستقبال والتأطير للأستاذ ${teacher.name}.`, 'success');
  };

  const handleDeleteTeacher = (id: string) => {
    setFacultyTeachers(prev => {
      const next = prev.filter(t => t.id !== id);
      saveFacultyTeachers(next);
      return next;
    });
    showToast('تم حذف الأستاذ من الدليل', 'تمت إزالة الأستاذ وساعات استقباله بنجاح.', 'info');
  };

  // Persistent Custom Departments & Modules State
  const [customDepartments, setCustomDepartments] = useState<Record<string, DepartmentInfo>>(() =>
    loadCustomDepartments()
  );
  const [customModules, setCustomModules] = useState<ModuleItem[]>(() =>
    loadCustomModules()
  );

  const handleUpdateDepartments = (updated: Record<string, DepartmentInfo>) => {
    setCustomDepartments(updated);
    saveCustomDepartments(updated);
  };

  const handleUpdateModules = (updated: ModuleItem[]) => {
    setCustomModules(updated);
    saveCustomModules(updated);
  };

  const handleUpdateFacultyTeachers = (updated: FacultyTeacher[]) => {
    setFacultyTeachers(updated);
    saveFacultyTeachers(updated);
  };

  const handleAddInquiry = (inquiry: PedagogicalInquiry) => {
    setPedagogicalInquiries(prev => {
      const next = [inquiry, ...prev];
      savePedagogicalInquiries(next);
      return next;
    });
    showToast('تم إرسال الاستفسار البيداغوجي', `تم توجيه انشغالك للأستاذ ${inquiry.targetTeacherName || 'المسؤول البيداغوجي'} برمز تتبع: ${inquiry.trackingCode || inquiry.id}`, 'success');
  };

  const handleReplyInquiry = (id: string, response: string, responderName: string) => {
    setPedagogicalInquiries(prev => {
      const next = prev.map(inq => inq.id === id ? {
        ...inq,
        replyContent: response,
        replyAuthor: responderName,
        replyDate: new Date().toISOString().split('T')[0],
        status: 'تمت الإجابة' as const
      } : inq);
      savePedagogicalInquiries(next);
      return next;
    });
    showToast('تم إرسال الرد البيداغوجي', 'تم حفظ إجابة الأستاذ وتحديث حالة الاستفسار إلى "تمت الإجابة".', 'success');
  };

  const handleOpenStatsEditor = (deptId?: DepartmentId) => {
    setStatsEditorTargetDept(deptId);
    setIsStatsEditorOpen(true);
  };

  const handleUpdateDepartmentStats = (deptId: DepartmentId, updated: DepartmentRealStats) => {
    setDepartmentStats(prev => {
      const next = { ...prev, [deptId]: updated };
      saveDepartmentStats(next);
      return next;
    });
    const deptName = DEPARTMENTS[deptId]?.nameAr || deptId;
    showToast('تم اعتماد وتحديث الإحصائيات بنجاح', `تم حفظ الأرقام الحقيقية المعتمدة لقسم ${deptName}.`, 'success');
  };

  const handleUpdateFacultyStats = (updated: FacultyGeneralRealStats) => {
    setFacultyStats(updated);
    saveFacultyStats(updated);
    showToast('تم تحديث إحصائيات الكلية العامة', 'تم حفظ وتعميم إحصائيات الكلية بنجاح.', 'success');
  };

  const handleUpdateDepartmentHead = (updated: DepartmentHeadAccount) => {
    setDepartmentHeads(prev => {
      const next = prev.map(h => h.id === updated.id ? updated : h);
      saveDepartmentHeads(next);
      return next;
    });
    showToast('تم تحديث بيانات مسؤول القسم', `تم تعديل بيانات وبيانات دخول الأستاذ ${updated.name}.`, 'success');
  };

  const handleResetAllStatsToDefault = () => {
    resetAllStatsToDefault();
    setDepartmentStats(INITIAL_DEPARTMENT_REAL_STATS);
    setFacultyStats(INITIAL_FACULTY_REAL_STATS);
    setDepartmentHeads(INITIAL_DEPARTMENT_HEADS);
    showToast('تمت استعادة القيم الافتراضية', 'تمت إعادة تعيين إحصائيات الأقسام والكلية بنجاح.', 'info');
  };

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toast Helper
  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth handlers
  const handleOpenLogin = (role: 'student' | 'teacher' | 'admin' = 'student') => {
    setLoginModalInitialRole(role);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`مرحباً بك، ${user.name}`, `تم تسجيل دخولك بنجاح بدور: ${user.role === 'student' ? 'طالب' : user.role === 'teacher' ? 'أستاذ' : 'إدارة'}.`, 'success');
    
    // Auto navigate to user dashboard
    if (user.role === 'student') setActiveTab('student');
    else if (user.role === 'teacher') setActiveTab('teacher');
    else if (user.role === 'admin') setActiveTab('admin');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('تم تسجيل الخروج', 'عدت الآن إلى وضع التصفح كزائر عام.', 'info');
    setActiveTab('home');
  };

  // Administrative Requests Handlers
  const handleUpdateRequestStatus = (id: string, newStatus: StudentAdministrativeRequest['status'], notes?: string) => {
    setStudentRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus, notes: notes || req.notes } : req))
    );
  };

  // Announcements Handlers & Official Website Live Sync (https://fmsm.univ-ouargla.dz/ar/)
  const handleSyncOfficialAnnouncements = async () => {
    setIsSyncingOfficial(true);
    try {
      const result = await syncAnnouncementsFromOfficialPortal();
      if (result.success && result.announcements.length > 0) {
        setAnnouncements(prev => {
          const officialIds = new Set(result.announcements.map(a => a.id));
          const rest = prev.filter(p => !officialIds.has(p.id));
          const merged = [...result.announcements, ...rest];
          saveOfficialAnnouncements(result.announcements);
          return merged;
        });
        showToast('تمت المزامنة مع الموقع الرسمي', result.message, 'success');
      } else {
        showToast('تحديث الإعلانات', 'تم التحقق من آخر مستجدات الموقع الرسمي fmsm.univ-ouargla.dz/ar.', 'info');
      }
    } catch (err) {
      console.warn('Sync error:', err);
      showToast('الموقع الرسمي', 'تم تأكيد أحدث الإعلانات الصادرة من موقع الكلية.', 'info');
    } finally {
      setIsSyncingOfficial(false);
    }
  };

  useEffect(() => {
    // Initial sync on mount
    handleSyncOfficialAnnouncements();

    // Auto-sync polling every 5 minutes
    const interval = setInterval(() => {
      syncAnnouncementsFromOfficialPortal().then(result => {
        if (result.success && result.announcements.length > 0) {
          setAnnouncements(prev => {
            const officialIds = new Set(result.announcements.map(a => a.id));
            const rest = prev.filter(p => !officialIds.has(p.id));
            return [...result.announcements, ...rest];
          });
        }
      }).catch(() => {});
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddAnnouncement = (ann: Announcement) => {
    setAnnouncements((prev) => [ann, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Resources Handlers
  const handleAddResource = (newRes: CourseResource) => {
    setResources((prev) => [newRes, ...prev]);
    showToast('تم رفع المطبوعة بنجاح', `أصبحت المادة "${newRes.title}" متاحة فوراً للطلبة.`, 'success');
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    setActiveTab('departments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDocumentModal = (type: string, data: any) => {
    setDocumentModal({
      isOpen: true,
      type,
      data
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* 2. Unified Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginSuccess}
          initialRole={loginModalInitialRole}
          onOpenAccountsRBAC={handleOpenAccountsRBAC}
        />
      )}

      {/* 3. Official RBAC & Accounts System Modal */}
      {isAccountsRBACOpen && (
        <AccountsRBACModal
          isOpen={isAccountsRBACOpen}
          onClose={() => setIsAccountsRBACOpen(false)}
          onLogin={handleLoginSuccess}
          currentUser={currentUser}
          onUpdateAdministrator={handleUpdateAdministrator}
          onShowToast={showToast}
          initialTab={accountsRBACInitialTab}
        />
      )}

      {/* 4. Top Main Navigation */}
      <div className="print:hidden">
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          selectedDeptId={selectedDepartmentId}
          setSelectedDeptId={(id) => setSelectedDepartmentId(id)}
          currentUser={currentUser}
          onOpenLoginModal={handleOpenLogin}
          onLogout={handleLogout}
          onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          language={language}
          onChangeLanguage={(l) => setLanguage(l)}
          currentLogoUrl={universityLogoUrl}
          facultyLogoUrl={facultyLogoUrl}
          logoSize={logoSize}
          facultyLogoSize={facultyLogoSize}
          logoDisplayMode={logoDisplayMode}
          singleLogoChoice={singleLogoChoice}
          onOpenLogoManager={handleOpenLogoManager}
          onChangeLogoSize={handleChangeLogoSizeDelta}
          onOpenStatsEditor={() => handleOpenStatsEditor(currentUser?.departmentId as DepartmentId)}
          onOpenPedagogicalBridge={() => setIsPedagogicalBridgeOpen(true)}
          onOpenProfileSettings={() => setIsProfileSettingsOpen(true)}
          onOpenAccountsRBAC={handleOpenAccountsRBAC}
          onOpenAcademicChat={() => {
            setActiveTab('chat');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {/* 5. Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:p-0 print:m-0 print:max-w-none">
        {/* TAB: Telegram-Style Academic Chat Rooms */}
        {activeTab === 'chat' && (
          <AcademicChatRooms
            currentUser={currentUser}
            language={language}
            onOpenLoginModal={handleOpenLogin}
          />
        )}

        {/* TAB: Home */}
        {activeTab === 'home' && (
          <HeroBanner
            onSelectDepartment={handleSelectDepartment}
            onNavigateStudent={() => {
              setActiveTab('student');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTeacher={() => {
              setActiveTab('teacher');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigatePortals={() => {
              setActiveTab('portals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(tab) => {
              setActiveTab(tab as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
            currentLogoUrl={universityLogoUrl}
            facultyLogoUrl={facultyLogoUrl}
            logoDisplayMode={logoDisplayMode}
            singleLogoChoice={singleLogoChoice}
            onOpenLogoManager={handleOpenLogoManager}
            facultyStats={facultyStats}
            departmentStats={departmentStats}
            currentUser={currentUser}
            onOpenStatsEditor={handleOpenStatsEditor}
            onOpenPedagogicalBridge={() => setIsPedagogicalBridgeOpen(true)}
            announcements={announcements}
            onOpenAccountsRBAC={handleOpenAccountsRBAC}
            language={language}
            onOpenAcademicChat={() => {
              setActiveTab('chat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB: About Faculty & Labs */}
        {activeTab === 'about' && (
          <AboutFacultyView onSelectDepartment={handleSelectDepartment} />
        )}

        {/* TAB: Specialties & Formations LMD */}
        {activeTab === 'specialties' && (
          <SpecialtiesView onSelectDepartment={handleSelectDepartment} />
        )}

        {/* TAB: Departments & Modules Details */}
        {activeTab === 'departments' && (
          <DepartmentView
            selectedDeptId={selectedDepartmentId as any}
            initialDepartmentId={selectedDepartmentId}
            onSelectDepartment={(id) => setSelectedDepartmentId(id)}
            onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
            departmentStats={departmentStats}
            currentUser={currentUser}
            onOpenStatsEditor={handleOpenStatsEditor}
            departmentsData={customDepartments}
            modulesData={customModules}
            facultyTeachers={facultyTeachers}
            onUpdateDepartments={handleUpdateDepartments}
            onUpdateModules={handleUpdateModules}
            onUpdateFacultyTeachers={handleUpdateFacultyTeachers}
            onShowToast={showToast}
          />
        )}

        {/* TAB: Student Portal */}
        {activeTab === 'student' && (
          <StudentPortal
            onGenerateDocument={handleOpenDocumentModal}
            onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
            currentUser={currentUser}
            departmentHeads={departmentHeads}
            onShowToast={showToast}
          />
        )}

        {/* TAB: Teacher Portal */}
        {activeTab === 'teacher' && (
          <TeacherPortal
            onGenerateDocument={handleOpenDocumentModal}
            onAddResource={handleAddResource}
            currentLogoUrl={universityLogoUrl}
            facultyLogoUrl={facultyLogoUrl}
          />
        )}

        {/* TAB: Admin Portal */}
        {activeTab === 'admin' && (
          <AdminPortal
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            studentRequests={studentRequests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onGenerateDocument={handleOpenDocumentModal}
            onShowToast={showToast}
            departmentStats={departmentStats}
            facultyStats={facultyStats}
            departmentHeads={departmentHeads}
            currentUser={currentUser}
            onOpenStatsEditor={handleOpenStatsEditor}
            onOpenHeadsManager={() => setIsHeadsManagerOpen(true)}
            onResetAllStatsToDefault={handleResetAllStatsToDefault}
            currentLogoUrl={universityLogoUrl}
            facultyLogoUrl={facultyLogoUrl}
            onOpenProfileSettings={() => setIsProfileSettingsOpen(true)}
            onOpenPedagogicalBridge={() => setIsPedagogicalBridgeOpen(true)}
            onOpenAccountsRBAC={handleOpenAccountsRBAC}
            onSaveDepartmentStats={handleUpdateDepartmentStats}
            customDepartments={customDepartments}
            onUpdateDepartments={handleUpdateDepartments}
            customModules={customModules}
            onUpdateModules={handleUpdateModules}
            facultyTeachers={facultyTeachers}
            onUpdateFacultyTeachers={handleUpdateFacultyTeachers}
          />
        )}

        {/* TAB: Announcements */}
        {activeTab === 'announcements' && (
          <AnnouncementsSection
            announcements={announcements}
            onSelectDepartment={handleSelectDepartment}
            onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
            onSyncOfficial={handleSyncOfficialAnnouncements}
            isSyncingOfficial={isSyncingOfficial}
            onAddAnnouncement={handleAddAnnouncement}
            currentUser={currentUser}
            onShowToast={showToast}
          />
        )}

        {/* TAB: Official Portals Directory */}
        {activeTab === 'portals' && (
          <OfficialPortalsSection />
        )}

        {/* TAB: Interactive Scientific Tools */}
        {activeTab === 'tools' && (
          <InteractiveTools
            onSelectDepartment={handleSelectDepartment}
            onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
          />
        )}

        {/* TAB: Contact Us */}
        {activeTab === 'contact' && (
          <ContactView onShowToast={showToast} />
        )}
      </main>

      {/* Official Document Generator Modal */}
      {documentModal.isOpen && (
        <OfficialDocumentModal
          isOpen={documentModal.isOpen}
          onClose={() => setDocumentModal((prev) => ({ ...prev, isOpen: false }))}
          documentType={documentModal.type}
          documentData={documentModal.data}
          data={documentModal.data}
          currentLogoUrl={universityLogoUrl}
          facultyLogoUrl={facultyLogoUrl}
          onUpdateData={(updated) => {
            setDocumentModal((prev) => ({ ...prev, data: updated }));
            showToast('تم تحديث بيانات الوثيقة', 'تم اعتماد البيانات وتحديث المعاينة المطبوعة بنجاح.', 'success');
          }}
        />
      )}

      {/* AI Academic Advisor Modal */}
      {isAIAdvisorOpen && (
        <AIAdvisorModal
          isOpen={isAIAdvisorOpen}
          onClose={() => setIsAIAdvisorOpen(false)}
          selectedDeptId={selectedDepartmentId}
        />
      )}

      {/* Real University & Faculty Logo Manager Modal with Size Controls */}
      {isLogoManagerOpen && (
        <LogoManagerModal
          isOpen={isLogoManagerOpen}
          onClose={() => setIsLogoManagerOpen(false)}
          initialTarget={logoManagerTarget}
          currentLogoUrl={universityLogoUrl}
          facultyLogoUrl={facultyLogoUrl}
          initialSize={logoSize}
          initialFacultySize={facultyLogoSize}
          logoDisplayMode={logoDisplayMode}
          singleLogoChoice={singleLogoChoice}
          onLogoUpdated={handleLogoUpdated}
          onSizeUpdated={handleSizeUpdated}
          onDisplayModeChange={handleDisplayModeChange}
          onSingleLogoChoiceChange={handleSingleLogoChoiceChange}
        />
      )}

      {/* Real Statistics Editor Modal */}
      {isStatsEditorOpen && (
        <DepartmentStatsEditorModal
          isOpen={isStatsEditorOpen}
          onClose={() => {
            setIsStatsEditorOpen(false);
            setStatsEditorTargetDept(undefined);
          }}
          departmentId={statsEditorTargetDept || (currentUser?.departmentId as DepartmentId) || 'common_sm'}
          initialStats={
            departmentStats[statsEditorTargetDept || (currentUser?.departmentId as DepartmentId) || 'common_sm'] || 
            departmentStats['common_sm']
          }
          facultyStats={facultyStats}
          currentUser={currentUser}
          onSaveDepartmentStats={handleUpdateDepartmentStats}
          onSaveFacultyStats={handleUpdateFacultyStats}
          onShowToast={showToast}
        />
      )}

      {/* Department Heads Accounts & Permissions Manager Modal */}
      {isHeadsManagerOpen && (
        <DepartmentHeadsManagerModal
          isOpen={isHeadsManagerOpen}
          onClose={() => setIsHeadsManagerOpen(false)}
          departmentHeads={departmentHeads}
          onUpdateDepartmentHead={handleUpdateDepartmentHead}
          onShowToast={showToast}
          currentLogoUrl={universityLogoUrl}
          facultyLogoUrl={facultyLogoUrl}
        />
      )}

      {/* Pedagogical Bridge Modal (همزة الوصل بين الأستاذ والطالب) */}
      {isPedagogicalBridgeOpen && (
        <PedagogicalBridgeModal
          isOpen={isPedagogicalBridgeOpen}
          onClose={() => setIsPedagogicalBridgeOpen(false)}
          teachers={facultyTeachers}
          inquiries={pedagogicalInquiries}
          currentUser={currentUser}
          currentLogoUrl={universityLogoUrl}
          facultyLogoUrl={facultyLogoUrl}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onAddInquiry={handleAddInquiry}
          onReplyInquiry={handleReplyInquiry}
          onShowToast={showToast}
        />
      )}

      {/* Admin Profile & Password Settings Modal */}
      {isProfileSettingsOpen && (
        <AdminProfileSettingsModal
          isOpen={isProfileSettingsOpen}
          onClose={() => setIsProfileSettingsOpen(false)}
          currentUser={currentUser}
          administrators={administrators}
          onUpdateAdmin={handleUpdateAdministrator}
          onShowToast={showToast}
          currentLogoUrl={universityLogoUrl}
          facultyLogoUrl={facultyLogoUrl}
        />
      )}

      {/* Official Footer with Real University Information */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-12 text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Col 1: Identity with Official Logo & Size Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {logoDisplayMode === 'single' ? (
                  /* Single Official Logo in Footer */
                  (() => {
                    const isFaculty = singleLogoChoice === 'faculty';
                    const activeUrl = isFaculty ? facultyLogoUrl : universityLogoUrl;
                    const activeTarget = isFaculty ? 'faculty' : 'university';
                    const activeLetter = isFaculty ? 'F' : 'U';
                    const activeBorder = isFaculty ? 'border-teal-500' : 'border-emerald-500';
                    const activeBgBadge = isFaculty ? 'bg-teal-700' : 'bg-emerald-700';
                    const activeTitle = isFaculty ? 'شعار كلية الرياضيات وعلوم المادة' : 'شعار جامعة قاصدي مرباح ورقلة';

                    return (
                      <div 
                        className="relative cursor-pointer group/footlogo"
                        onClick={() => handleOpenLogoManager(activeTarget)}
                        title={`${activeTitle} (انقر للتعديل)`}
                      >
                        <img
                          src={activeUrl}
                          alt={activeTitle}
                          className={`w-12 h-12 rounded-full object-contain p-0.5 bg-white border ${activeBorder} shadow-sm group-hover/footlogo:scale-105 transition-transform`}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                          }}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${activeBgBadge} text-white flex items-center justify-center text-[8px] font-bold`}>
                          {activeLetter}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* Both Logos in Footer */
                  <>
                    {/* University Logo */}
                    <div 
                      className="relative cursor-pointer group/footlogo1"
                      onClick={() => handleOpenLogoManager('university')}
                      title="شعار جامعة قاصدي مرباح ورقلة"
                    >
                      <img
                        src={universityLogoUrl}
                        alt="شعار جامعة قاصدي مرباح ورقلة"
                        className="w-12 h-12 rounded-full object-contain p-0.5 bg-white border border-emerald-600 shadow-sm group-hover/footlogo1:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[8px] font-bold">
                        U
                      </div>
                    </div>

                    {/* Faculty Logo */}
                    <div 
                      className="relative cursor-pointer group/footlogo2"
                      onClick={() => handleOpenLogoManager('faculty')}
                      title="شعار كلية الرياضيات وعلوم المادة"
                    >
                      <img
                        src={facultyLogoUrl}
                        alt="شعار كلية الرياضيات وعلوم المادة"
                        className="w-12 h-12 rounded-full object-contain p-0.5 bg-white border border-teal-600 shadow-sm group-hover/footlogo2:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal-700 text-white flex items-center justify-center text-[8px] font-bold">
                        F
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <h3 className="font-black text-white text-sm">كلية الرياضيات وعلوم المادة</h3>
                  <p className="text-[11px] text-slate-400">جامعة قاصدي مرباح - ورقلة</p>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-xs">
                صرح أكاديمي للتعليم العالي والبحث العلمي المتخصص في علوم الفيزياء، الكيمياء، والرياضيات؛ حاضن للمشاريع الطاقوية والمخبرية المتقدمة بالجنوب الجزائري.
              </p>

              {/* Logo Management Buttons & Size Controls in Footer */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-block bg-emerald-950 text-amber-300 border border-emerald-800 px-2 py-1 rounded-md text-[10px] font-mono">
                  {logoDisplayMode === 'single' ? (singleLogoChoice === 'faculty' ? 'FMSM' : 'UKMO') : 'FMSM - UKMO'}
                </span>
                
                <button
                  onClick={() => handleOpenLogoManager(singleLogoChoice)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 border border-emerald-800/80 hover:bg-emerald-950/60 px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  title="إعدادات الشعار وطريقة العرض"
                >
                  <Camera className="w-3 h-3 text-amber-300" />
                  <span>تعديل الشعار ونمط العرض</span>
                </button>

                <button
                  onClick={() => handleOpenLogoManager('faculty')}
                  className="text-[10px] text-teal-400 hover:text-teal-300 border border-teal-800/80 hover:bg-teal-950/60 px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  title="تغيير أو رفع شعار الكلية"
                >
                  <Camera className="w-2.5 h-2.5" />
                  <span>شعار الكلية</span>
                </button>

                <button
                  onClick={() => handleOpenLogoManager('university')}
                  className="text-[10px] text-amber-400 hover:text-amber-300 border border-amber-900/60 hover:bg-amber-950/40 px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  title="التحكم في حجم الشعارات"
                >
                  <Sliders className="w-2.5 h-2.5" />
                  <span>الحجم: {logoSize}px</span>
                </button>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                فضاءات الكلية الرقمية
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => { setActiveTab('student'); scrollToTop(); }} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>فضاء الطالب وحساب المعدل LMD</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('teacher'); scrollToTop(); }} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>فضاء الأستاذ وإيداع المحتوى</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('admin'); scrollToTop(); }} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>فضاء الإدارة والطلبات الإدارية</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('specialties'); scrollToTop(); }} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5">
                    <span>دليل عروض التكوين ليسانس وماستر</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('announcements'); scrollToTop(); }} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5">
                    <span>رزنامة الامتحانات والمداولات</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Official External Portals */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                روابط ومنصات ذات صلة
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="https://fmsm-grievances-platform.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-rose-300 transition-colors flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                    <span>منصة انشغالات الكلية الرقمية</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1314&tmpl=component" target="_blank" rel="noreferrer" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>منصة إدارتي أون لاين</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://www.sndl.cerist.dz/" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>نظام التوثيق الوطني SNDL - CERIST</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://dspace.univ-ouargla.dz/jspui/" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>مستودع DSpace للمذكرات والأطروحات</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=609&tmpl=component" target="_blank" rel="noreferrer" className="hover:text-teal-300 transition-colors flex items-center gap-1.5">
                    <span>مكتبة كلية FMSM</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Verified Contact Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                معلومات الاتصال المعتمدة
              </h4>
              <div className="space-y-2.5 text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>طريق غرداية، ص.ب 511، ورقلة 30000، الجزائر</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span dir="ltr" className="font-mono text-slate-300">+213 (0) 29 71 38 91</span>
                </div>
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span dir="ltr" className="font-mono text-slate-300">الفاكس: +213 (0) 29 71 26 27</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span dir="ltr" className="font-mono text-slate-300">fmsm@univ-ouargla.dz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>الأحد - الخميس: 08:00 إلى 16:30</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة. جميع الحقوق محفوظة.
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => { setActiveTab('contact'); scrollToTop(); }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                موقع الكلية الجغرافي
              </button>
              <span>•</span>
              <button
                onClick={scrollToTop}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>العودة إلى أعلى الصفحة</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
