import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FlaskConical, 
  Atom, 
  Binary, 
  Layers, 
  Calendar, 
  Bell, 
  Bot, 
  UserCheck, 
  User, 
  ExternalLink,
  Phone,
  FileText,
  Search,
  Globe,
  MessageSquare,
  Building2,
  Shield,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Award,
  Mail,
  Camera,
  School,
  Sliders,
  ZoomIn,
  ZoomOut,
  BarChart3,
  Users,
  KeyRound,
  Radio,
  Sparkles
} from 'lucide-react';
import { FACULTY_GENERAL_INFO } from '../data/facultyData';
import { UserProfile, UserRole, AppLanguage } from '../types';
import { getTranslation } from '../data/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  selectedDeptId?: string;
  setSelectedDeptId?: (dept: string) => void;
  currentUser: UserProfile | null;
  onOpenLoginModal: (role?: 'student' | 'teacher' | 'admin') => void;
  onLogout: () => void;
  onOpenAIAdvisor?: () => void;
  onOpenSearch?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  currentLogoUrl?: string;
  facultyLogoUrl?: string;
  logoSize?: number;
  facultyLogoSize?: number;
  logoDisplayMode?: 'single' | 'both';
  singleLogoChoice?: 'faculty' | 'university';
  onOpenLogoManager?: (target?: 'university' | 'faculty') => void;
  onChangeLogoSize?: (delta: number) => void;
  onOpenStatsEditor?: () => void;
  onOpenPedagogicalBridge?: () => void;
  onOpenProfileSettings?: () => void;
  onOpenAccountsRBAC?: (tab?: 'accounts' | 'security' | 'manual') => void;
  onOpenAcademicChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  selectedDeptId = 'common_sm',
  setSelectedDeptId,
  currentUser,
  onOpenLoginModal,
  onLogout,
  onOpenAIAdvisor,
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode,
  language,
  onChangeLanguage,
  currentLogoUrl = '/logo_univ_ouargla.png',
  facultyLogoUrl = '/logo_faculty_fmsm.png',
  logoSize = 54,
  facultyLogoSize = 54,
  logoDisplayMode = 'single',
  singleLogoChoice = 'faculty',
  onOpenLogoManager,
  onChangeLogoSize,
  onOpenStatsEditor,
  onOpenPedagogicalBridge,
  onOpenProfileSettings,
  onOpenAccountsRBAC,
  onOpenAcademicChat,
}) => {
  const t = getTranslation(language);

  const handleTabClick = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const handleDeptClick = (deptId: string) => {
    if (setSelectedDeptId) setSelectedDeptId(deptId);
    handleTabClick('departments');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Ministerial & University Banner - Algerian National Academic Colors */}
      <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-emerald-950 text-slate-200 text-xs py-1.5 px-4 sm:px-6 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="font-bold text-amber-300">{t.republicTitle}</span>
            <span className="hidden md:inline text-emerald-700">|</span>
            <span className="hidden md:inline text-slate-300">{t.ministryTitle}</span>
            <span className="hidden md:inline text-emerald-700">|</span>
            <span className="font-bold text-white">{t.universityName}</span>
          </div>

          <div className="flex items-center gap-3 text-xs flex-wrap">
            {/* Direct Official Links */}
            <a 
              href="https://fmsm-grievances-platform.vercel.app/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-1 font-semibold"
              title={t.grievancePlatform}
            >
              <MessageSquare className="w-3 h-3 text-rose-400" />
              <span>{t.grievancePlatform}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            {/* Direct Official Website Icon & Link */}
            <a 
              href="https://fmsm.univ-ouargla.dz/ar/" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1.5 font-bold hover:scale-105"
              title={t.officialSite}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>{t.officialSite}</span>
              <ExternalLink className="w-2.5 h-2.5 text-emerald-300" />
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a 
              href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1314&tmpl=component" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sky-300 hover:text-sky-200 transition-colors flex items-center gap-1 font-semibold"
              title={t.myAdminOnline}
            >
              <Building2 className="w-3 h-3 text-sky-400" />
              <span>{t.myAdminOnline}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a 
              href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=609&tmpl=component" 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1"
              title={t.facultyLibrary}
            >
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span>{t.facultyLibrary}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Phone className="w-3 h-3 text-amber-400" />
              <span dir="ltr">029 71 38 91</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Identity Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo and Faculty Identity */}
          <div 
            className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group"
            onClick={() => handleTabClick('home')}
          >
            {/* Official Logo Display: Single Logo (Default) or Dual Logos */}
            {logoDisplayMode === 'single' ? (
              /* Single Primary Logo */
              (() => {
                const isFaculty = singleLogoChoice === 'faculty';
                const activeUrl = isFaculty ? facultyLogoUrl : currentLogoUrl;
                const activeSize = isFaculty ? facultyLogoSize : logoSize;
                const activeTarget: 'faculty' | 'university' = isFaculty ? 'faculty' : 'university';
                const activeLabel = isFaculty ? 'شعار كلية الرياضيات وعلوم المادة' : 'شعار جامعة قاصدي مرباح ورقلة';

                return (
                  <div 
                    className="relative group/singlelogo"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLogoManager?.(activeTarget);
                    }}
                    title={`${activeLabel} (انقر للتغيير أو لتعديل الحجم)`}
                  >
                    <div 
                      style={{ width: `${activeSize}px`, height: `${activeSize}px` }}
                      className="rounded-full bg-white p-0.5 border-2 border-emerald-800 dark:border-emerald-600 shadow-md group-hover/singlelogo:scale-105 transition-all duration-200 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={activeUrl}
                        alt={activeLabel}
                        className="w-full h-full object-contain rounded-full"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                        }}
                      />
                    </div>
                    {onOpenLogoManager && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLogoManager(activeTarget);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-800 hover:bg-emerald-900 border-2 border-white text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="تغيير الشعار أو تعديل الحجم"
                      >
                        <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                      </button>
                    )}
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-800 border border-white flex items-center justify-center text-white shadow-xs">
                      {isFaculty ? (
                        <Atom className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 animate-spin-slow" />
                      ) : (
                        <School className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Both Official Logos: University (UKMO) + Faculty (FMSM) */
              <div className="flex items-center gap-2">
                {/* 1. University Official Logo (UKMO) */}
                <div 
                  className="relative group/logo1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLogoManager?.('university');
                  }}
                  title="شعار جامعة قاصدي مرباح ورقلة (انقر للتغيير أو لتعديل الحجم)"
                >
                  <div 
                    style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                    className="rounded-full bg-white p-0.5 border-2 border-emerald-800 shadow-md group-hover/logo1:scale-105 transition-all duration-200 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={currentLogoUrl}
                      alt="شعار جامعة قاصدي مرباح ورقلة"
                      className="w-full h-full object-contain rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                      }}
                    />
                  </div>
                  {onOpenLogoManager && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLogoManager('university');
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-800 hover:bg-emerald-900 border-2 border-white text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="تغيير شعار الجامعة أو تعديل الحجم"
                    >
                      <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                    </button>
                  )}
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-800 border border-white flex items-center justify-center text-white shadow-xs">
                    <School className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                  </div>
                </div>

                {/* 2. Faculty Official Logo (FMSM) */}
                <div 
                  className="relative group/logo2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLogoManager?.('faculty');
                  }}
                  title="شعار كلية الرياضيات وعلوم المادة (انقر للتغيير أو لتعديل الحجم)"
                >
                  <div 
                    style={{ width: `${facultyLogoSize}px`, height: `${facultyLogoSize}px` }}
                    className="rounded-full bg-white p-0.5 border-2 border-teal-700 shadow-md group-hover/logo2:scale-105 transition-all duration-200 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={facultyLogoUrl}
                      alt="شعار كلية الرياضيات وعلوم المادة"
                      className="w-full h-full object-contain rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                      }}
                    />
                  </div>
                  {onOpenLogoManager && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLogoManager('faculty');
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-800 hover:bg-teal-900 border-2 border-white text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="تغيير شعار الكلية أو تعديل الحجم"
                    >
                      <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                    </button>
                  )}
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-teal-800 border border-white flex items-center justify-center text-white shadow-xs">
                    <Atom className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 animate-spin-slow" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {t.fmsmCode}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
                  {t.universityName}
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {t.facultyName}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                {t.facultySubtitle}
              </p>
            </div>
          </div>

          {/* Quick Actions, Theme, Language, Chat & Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Telegram-Style Academic Chat Quick Button */}
            {onOpenAcademicChat && (
              <button
                type="button"
                onClick={onOpenAcademicChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all hover:scale-105 cursor-pointer border border-teal-400/30"
                title={t.academicChatDesc}
              >
                <Radio className="w-4 h-4 text-emerald-200 animate-pulse" />
                <span className="hidden md:inline">{t.tabChat}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              </button>
            )}

            {/* Prominent Direct Official Faculty Site Icon Button */}
            <a
              href="https://fmsm.univ-ouargla.dz/ar/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all hover:scale-105"
              title={t.officialSite}
            >
              <Globe className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span className="hidden lg:inline">{t.officialSite}</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </a>

            {/* The ONLY Prominent Account Icon Button beside Official Faculty Website */}
            {onOpenAccountsRBAC && (
              <button
                type="button"
                onClick={() => onOpenAccountsRBAC('accounts')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer border border-amber-300"
                title={t.adminAccountTitle}
              >
                <Shield className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">{t.adminAccount}</span>
              </button>
            )}

            {/* Search Quick Button */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title={t.search}
              >
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline">{t.search}</span>
              </button>
            )}

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? t.themeDay : t.themeNight}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => onChangeLanguage('ar')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'ar'
                    ? 'bg-white dark:bg-slate-700 text-[#0B3D91] dark:text-amber-300 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="العربية (Arabic)"
              >
                {language === 'ar' ? 'عربي' : language === 'fr' ? 'Arabe' : 'Arabic'}
              </button>
              <button
                onClick={() => onChangeLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'fr'
                    ? 'bg-white dark:bg-slate-700 text-[#0B3D91] dark:text-amber-300 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Français (French)"
              >
                {language === 'ar' ? 'فرنسية' : language === 'fr' ? 'Français' : 'French'}
              </button>
              <button
                onClick={() => onChangeLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-[#0B3D91] dark:text-amber-300 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="English"
              >
                {language === 'ar' ? 'إنجليزية' : language === 'fr' ? 'Anglais' : 'English'}
              </button>
            </div>

            {/* Pedagogical Bridge Button */}
            {onOpenPedagogicalBridge && (
              <button
                type="button"
                onClick={onOpenPedagogicalBridge}
                className="bg-linear-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-500/30"
                title={t.pedagogicalBridge}
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span className="hidden md:inline">{t.pedagogicalBridge}</span>
              </button>
            )}

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAIAdvisor}
              className="bg-linear-to-r from-[#0B3D91] to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">{t.aiAdvisor}</span>
            </button>

            {/* User Login / Profile State */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 py-1 px-2.5 rounded-xl">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-amber-300 font-semibold mt-0.5">
                    {currentUser.role === 'student' && 'طالب LMD'}
                    {currentUser.role === 'teacher' && 'أستاذ محاضر'}
                    {(currentUser.role === 'super_admin' || currentUser.adminRole === 'super_admin') && '👑 المشرف العام (الإدارة العامة)'}
                    {(currentUser.role === 'dept_head' || currentUser.adminRole === 'dept_head') && (
                      currentUser.adminTitle || (
                        currentUser.departmentId === 'physics' ? 'رئيس قسم الفيزياء' :
                        currentUser.departmentId === 'chemistry' ? 'رئيس قسم الكيمياء' :
                        currentUser.departmentId === 'math' ? 'رئيس قسم الرياضيات' :
                        'مسؤول جذع مشترك SM'
                      )
                    )}
                    {currentUser.role === 'admin' && !currentUser.adminRole && 'مسؤول إداري'}
                  </div>
                </div>

                {/* Personal Security Settings (Password & Email change) for any Admin */}
                {(currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'dept_head') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAccountsRBAC) {
                        onOpenAccountsRBAC('security');
                      } else if (onOpenProfileSettings) {
                        onOpenProfileSettings();
                      }
                    }}
                    className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors cursor-pointer"
                    title="إعدادات الأمان وتغيير كلمة المرور والبريد في أي وقت"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                )}

                {/* Quick Stats Edit Button for Admins & Dept Heads */}
                {(currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'dept_head') && onOpenStatsEditor && (
                  <button
                    onClick={onOpenStatsEditor}
                    className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors cursor-pointer"
                    title="تعديل الأرقام والإحصائيات الحقيقية المعتمدة"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenLoginModal('student')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 sm:py-2 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title={t.loginPortals}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.loginPortals}</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-2 scrollbar-none">
          <button
            onClick={() => handleTabClick('home')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{t.tabHome}</span>
          </button>

          <button
            onClick={() => handleTabClick('about')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'about'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.tabAbout}</span>
          </button>

          <button
            onClick={() => handleTabClick('specialties')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'specialties'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.tabSpecialties}</span>
          </button>

          {/* Departments direct navigation */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleDeptClick('common_sm')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'departments' && selectedDeptId === 'common_sm'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.tabCommonSM}</span>
            </button>
            <button
              onClick={() => handleDeptClick('physics')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'departments' && selectedDeptId === 'physics'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-teal-700'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>{t.tabPhysics}</span>
            </button>
            <button
              onClick={() => handleDeptClick('chemistry')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'departments' && selectedDeptId === 'chemistry'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-700'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{t.tabChemistry}</span>
            </button>
            <button
              onClick={() => handleDeptClick('math')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'departments' && selectedDeptId === 'math'
                  ? 'bg-cyan-800 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-800'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>{t.tabMath}</span>
            </button>
          </div>

          {/* Telegram Academic Chat Tab */}
          <button
            onClick={() => {
              if (onOpenAcademicChat) onOpenAcademicChat();
              else handleTabClick('chat');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-linear-to-r from-teal-700 to-emerald-700 text-white shadow-md'
                : 'text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-teal-500/30'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>{t.tabChat}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          <button
            onClick={() => handleTabClick('announcements')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.tabAnnouncements}</span>
          </button>

          {/* Role Portals */}
          <button
            onClick={() => {
              if (!currentUser) onOpenLoginModal('student');
              handleTabClick('student');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'student'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t.tabStudent}</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) onOpenLoginModal('teacher');
              handleTabClick('teacher');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-teal-800 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.tabTeacher}</span>
          </button>

          {/* Dedicated Pedagogical Bridge Navigation Item */}
          {onOpenPedagogicalBridge && (
            <button
              onClick={onOpenPedagogicalBridge}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:from-teal-100 hover:to-emerald-100 dark:hover:from-teal-900/60 dark:hover:to-emerald-900/60 border border-emerald-300/60 dark:border-emerald-700/60 shadow-2xs"
              title="همزة الوصل بين الأستاذ والطالب - ساعات الاستقبال والتواصل المباشر"
            >
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.pedagogicalBridge}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}

          <button
            onClick={() => {
              if (!currentUser) onOpenLoginModal('admin');
              handleTabClick('admin');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-emerald-950 text-white shadow-xs'
                : 'text-emerald-900 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{t.tabAdmin}</span>
          </button>

          {/* Official Portals Tab */}
          <button
            onClick={() => handleTabClick('portals')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'portals'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>{t.tabPortals}</span>
          </button>

          <button
            onClick={() => handleTabClick('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t.tabContact}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
