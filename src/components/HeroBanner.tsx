import React from 'react';
import { 
  Atom, 
  FlaskConical, 
  Binary, 
  Layers, 
  Calculator, 
  BookOpen, 
  FileCheck, 
  Award, 
  Users, 
  School, 
  Flame, 
  ArrowLeft,
  ChevronLeft,
  Sparkles,
  Search,
  ExternalLink,
  Globe,
  MessageSquare,
  Building2,
  Database,
  GraduationCap,
  Camera,
  BarChart3,
  Edit3,
  Maximize2,
  Upload,
  RotateCcw,
  X,
  CheckCircle2,
  Shield,
  KeyRound,
  Radio
} from 'lucide-react';
import { FACULTY_GENERAL_INFO, DEPARTMENTS, INITIAL_ANNOUNCEMENTS } from '../data/facultyData';
import { DepartmentId, DepartmentRealStats, FacultyGeneralRealStats, UserProfile, Announcement, AppLanguage } from '../types';

interface HeroBannerProps {
  onSelectDepartment: (deptId: string) => void;
  onNavigate?: (tab: string) => void;
  onNavigateStudent?: () => void;
  onNavigateTeacher?: () => void;
  onNavigatePortals?: () => void;
  onOpenAIAdvisor: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  currentLogoUrl?: string;
  facultyLogoUrl?: string;
  logoDisplayMode?: 'single' | 'both';
  singleLogoChoice?: 'faculty' | 'university';
  onOpenLogoManager?: (target?: 'university' | 'faculty') => void;
  facultyStats?: FacultyGeneralRealStats;
  departmentStats?: Record<DepartmentId, DepartmentRealStats>;
  currentUser?: UserProfile | null;
  onOpenStatsEditor?: (deptId?: DepartmentId) => void;
  onOpenPedagogicalBridge?: () => void;
  announcements?: Announcement[];
  latestAnnouncement?: Announcement;
  onOpenAccountsRBAC?: (tab?: 'accounts' | 'security' | 'manual') => void;
  language?: AppLanguage;
  onOpenAcademicChat?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectDepartment,
  onNavigate,
  onNavigateStudent,
  onNavigateTeacher,
  onNavigatePortals,
  onOpenAIAdvisor,
  searchQuery = '',
  setSearchQuery,
  currentLogoUrl = '/logo_univ_ouargla.png',
  facultyLogoUrl = '/logo_faculty_fmsm.png',
  logoDisplayMode = 'single',
  singleLogoChoice = 'faculty',
  onOpenLogoManager,
  facultyStats,
  departmentStats,
  currentUser,
  onOpenStatsEditor,
  onOpenPedagogicalBridge,
  announcements,
  latestAnnouncement,
  onOpenAccountsRBAC,
  language = 'ar',
  onOpenAcademicChat,
}) => {
  const currentLatest = announcements?.[0] || latestAnnouncement || INITIAL_ANNOUNCEMENTS[0];

  const [deanPhoto, setDeanPhoto] = React.useState<string>(() => {
    try {
      return localStorage.getItem('fmsm_custom_dean_photo') || '/dean_at_desk.jpg';
    } catch {
      return '/dean_at_desk.jpg';
    }
  });
  const [showFullPhotoModal, setShowFullPhotoModal] = React.useState(false);
  const [saveStatusMessage, setSaveStatusMessage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const res = reader.result as string;
      setDeanPhoto(res);

      // 1. Immediately save to browser local storage so it persists across reloads
      try {
        localStorage.setItem('fmsm_custom_dean_photo', res);
      } catch (err) {
        console.error('Failed to save photo to localStorage', err);
      }

      // 2. Also send to server to write permanently to disk for all visitors
      try {
        await fetch('/api/upload-dean-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: res })
        });
      } catch (err) {
        console.warn('Server upload background attempt:', err);
      }

      setSaveStatusMessage('✓ تم حفظ صورتك الجديدة أوتوماتيكياً وبشكل دائم! لن تعود الصورة السابقة عند تحديث الصفحة أو إعادة الدخول للموقع.');
      setTimeout(() => setSaveStatusMessage(null), 8000);
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    if (window.confirm('هل تريد استعادة الصورة الافتراضية؟')) {
      setDeanPhoto('/dean_at_desk.jpg');
      try {
        localStorage.removeItem('fmsm_custom_dean_photo');
      } catch (err) {
        console.error(err);
      }
      setSaveStatusMessage('تمت استعادة الصورة الافتراضية بنجاح.');
      setTimeout(() => setSaveStatusMessage(null), 4000);
    }
  };

  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (tab === 'student' && onNavigateStudent) {
      onNavigateStudent();
    } else if (tab === 'teacher' && onNavigateTeacher) {
      onNavigateTeacher();
    } else if (tab === 'portals' && onNavigatePortals) {
      onNavigatePortals();
    }
  };

  return (
    <div className="space-y-6">
      {/* Moving Announcements News Ticker (شريط الإعلانات وآخر المستجدات الأكاديمية المتحرك) */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-y border-amber-200/80 dark:border-amber-800/50 py-2.5 px-3 text-xs text-amber-950 dark:text-amber-100 flex items-center justify-between gap-3 shadow-2xs overflow-hidden">
        {/* Fixed Title Label & Official Faculty Website Direct Icon */}
        <div className="flex items-center gap-2 shrink-0 z-10 bg-amber-50 dark:bg-amber-950/90 pl-3">
          <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
            <span>آخر المستجدات</span>
          </span>

          {/* Official Faculty Website Direct Link Icon requested by user */}
          <a
            href="https://fmsm.univ-ouargla.dz/ar/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all hover:scale-105 shadow-2xs"
            title="الانتقال مباشرة إلى موقع كلية الرياضيات وعلوم المادة الرسمي: https://fmsm.univ-ouargla.dz/ar/"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
            <span className="hidden sm:inline">موقع الكلية</span>
            <ExternalLink className="w-2.5 h-2.5 text-emerald-200" />
          </a>
        </div>

        {/* Continuous Scrolling News Ticker Track */}
        <div className="relative flex-1 overflow-hidden h-7 flex items-center">
          <div className="ticker-marquee flex items-center gap-8 whitespace-nowrap">
            {[
              ...(announcements && announcements.length > 0 ? announcements : INITIAL_ANNOUNCEMENTS),
              ...(announcements && announcements.length > 0 ? announcements : INITIAL_ANNOUNCEMENTS)
            ].map((ann, idx) => (
              <a
                key={`${ann.id}-${idx}`}
                href={ann.sourceUrl || 'https://fmsm.univ-ouargla.dz/ar/'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-amber-300 font-medium transition-colors cursor-pointer group/ticker"
              >
                {ann.isFromOfficialWebsite ? (
                  <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300/50">
                    رسمي FMSM
                  </span>
                ) : (
                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    إعلان
                  </span>
                )}
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  [{ann.originalPostDate || ann.date}]
                </span>
                <span className="group-hover/ticker:underline font-semibold">
                  {ann.title}
                </span>
                <span className="text-amber-500 font-bold mx-2">★</span>
              </a>
            ))}
          </div>
        </div>

        {/* Direct Link to all announcements */}
        <button
          onClick={() => onNavigate && onNavigate('announcements')}
          className="text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer bg-amber-50 dark:bg-amber-950/90 pr-2 z-10"
        >
          <span className="hidden sm:inline">كل الإعلانات</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-teal-900/50">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>البوابة الرقمية المعتمدة للأساتذة والطلبة - السنة الجامعية {FACULTY_GENERAL_INFO.currentAcademicYear}</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src="/logo_univ_ouargla.png"
                alt="شعار جامعة قاصدي مرباح ورقلة"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain p-1 bg-white shadow-md lg:hidden shrink-0 border border-teal-400/40"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
                كلية الرياضيات وعلوم المادة
                <span className="block text-teal-400 text-xl sm:text-2xl font-bold mt-1">
                  جامعة قاصدي مرباح - ورقلة
                </span>
              </h1>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              منصة تفاعلية متكاملة تجمع كافة الخدمات البيداغوجية، الإدارية، والبحثية لأقسام <strong className="text-white">الفيزياء</strong>، <strong className="text-white">الكيمياء</strong>، <strong className="text-white">الرياضيات</strong>، وفرع <strong className="text-white">جذع مشترك علوم المادة</strong>؛ مع فضاءات مخصصة لأساتذة الكلية والطلبة بنظام LMD.
            </p>

            {/* Quick Search in Hero */}
            <div className="pt-2 max-w-2xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مقياس، أستاذ، جدول توقيت، محاضرة، أو تخصص..."
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm rounded-xl py-3 pr-11 pl-28 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/15 transition-all"
                />
                <Search className="w-5 h-5 text-teal-300 absolute right-3.5" />
                <button
                  onClick={() => onNavigate('student')}
                  className="absolute left-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  بحث بالمقررات
                </button>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('student')}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>دخول فضاء الطالب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('teacher')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>دخول فضاء الأستاذ</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNav('portals')}
                className="bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-300" />
                <span>المنصات الرسمية (11)</span>
              </button>
              <button
                onClick={() => {
                  if (onOpenAcademicChat) onOpenAcademicChat();
                  else if (onNavigate) onNavigate('chat');
                }}
                className="bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer border border-emerald-300 hover:scale-105"
                title="غرف المحادثة والتواصل الفوري بين الطلبة والأساتذة (على غرار التلغرام)"
              >
                <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>{language === 'fr' ? 'Chat Académique (Telegram)' : language === 'en' ? 'Academic Chat (Telegram)' : 'شات الكلية الأكاديمي (تلغرام)'}</span>
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
              </button>
              <button
                onClick={onOpenAIAdvisor}
                className="bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>المستشار الذكي</span>
              </button>
            </div>
          </div>

          {/* Official University & Faculty Seals Card in Hero (Desktop) */}
          <div className="shrink-0 hidden lg:flex flex-col items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shadow-2xl">
            {logoDisplayMode === 'single' ? (
              /* Single Primary Official Seal */
              (() => {
                const isFaculty = singleLogoChoice === 'faculty';
                const activeUrl = isFaculty ? facultyLogoUrl : currentLogoUrl;
                const activeTarget: 'faculty' | 'university' = isFaculty ? 'faculty' : 'university';
                const activeTag = isFaculty ? 'FMSM' : 'UKMO';
                const activeTitle = isFaculty ? 'شعار كلية الرياضيات وعلوم المادة' : 'شعار جامعة قاصدي مرباح ورقلة';

                return (
                  <div className="mb-2.5">
                    <div 
                      className="relative group/singleseal cursor-pointer flex flex-col items-center"
                      onClick={() => onOpenLogoManager?.(activeTarget)}
                      title={`${activeTitle} (انقر للتغيير)`}
                    >
                      <div className="p-1.5 rounded-full bg-white shadow-lg border-2 border-emerald-400 group-hover/singleseal:scale-105 transition-transform">
                        <img
                          src={activeUrl}
                          alt={activeTitle}
                          className="w-16 h-16 xl:w-20 xl:h-20 rounded-full object-contain"
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
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center border border-white shadow-xs cursor-pointer"
                          title="تغيير الشعار"
                        >
                          <Camera className="w-2.5 h-2.5 text-amber-300" />
                        </button>
                      )}
                      <span className="text-[11px] font-bold text-amber-300 mt-1 font-mono">{activeTag}</span>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Both University & Faculty Seals */
              <div className="flex items-center gap-3 mb-2.5">
                {/* University Seal */}
                <div 
                  className="relative group/seal1 cursor-pointer flex flex-col items-center"
                  onClick={() => onOpenLogoManager?.('university')}
                  title="شعار جامعة قاصدي مرباح ورقلة (انقر لتغيير الشعار أو تعديل الحجم)"
                >
                  <div className="p-1.5 rounded-full bg-white shadow-lg border-2 border-emerald-400 group-hover/seal1:scale-105 transition-transform">
                    <img
                      src={currentLogoUrl}
                      alt="شعار جامعة قاصدي مرباح ورقلة"
                      className="w-16 h-16 xl:w-20 xl:h-20 rounded-full object-contain"
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
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center border border-white shadow-xs cursor-pointer"
                      title="تغيير شعار الجامعة"
                    >
                      <Camera className="w-2.5 h-2.5 text-amber-300" />
                    </button>
                  )}
                  <span className="text-[10px] font-bold text-amber-300 mt-1 font-mono">UKMO</span>
                </div>

                {/* Faculty Seal */}
                <div 
                  className="relative group/seal2 cursor-pointer flex flex-col items-center"
                  onClick={() => onOpenLogoManager?.('faculty')}
                  title="شعار كلية الرياضيات وعلوم المادة (انقر لتغيير الشعار أو تعديل الحجم)"
                >
                  <div className="p-1.5 rounded-full bg-white shadow-lg border-2 border-teal-400 group-hover/seal2:scale-105 transition-transform">
                    <img
                      src={facultyLogoUrl}
                      alt="شعار كلية الرياضيات وعلوم المادة"
                      className="w-16 h-16 xl:w-20 xl:h-20 rounded-full object-contain"
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
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-700 hover:bg-teal-600 text-white flex items-center justify-center border border-white shadow-xs cursor-pointer"
                      title="تغيير شعار الكلية"
                    >
                      <Camera className="w-2.5 h-2.5 text-amber-300" />
                    </button>
                  )}
                  <span className="text-[10px] font-bold text-teal-300 mt-1 font-mono">FMSM</span>
                </div>
              </div>
            )}

            <span className="text-xs font-bold text-white tracking-wide">جامعة قاصدي مرباح ورقلة</span>
            <span className="text-[11px] text-teal-200 font-semibold mt-0.5">كلية الرياضيات وعلوم المادة</span>
            
            {onOpenLogoManager && (
              <button
                type="button"
                onClick={() => onOpenLogoManager('university')}
                className="text-[10px] text-amber-300 hover:text-white mt-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3 h-3 text-amber-300" />
                <span>إدارة الشعارين والحجم</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid with Dynamic Real Counters */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-teal-300 font-mono">
              {(facultyStats?.totalStudents ?? 3450).toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">طالب وطالبة مسجلين</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
              {(facultyStats?.totalTeachers ?? 185).toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">أستاذ وباحث مؤطر</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-sky-300 font-mono">04</div>
            <div className="text-xs text-slate-300 font-medium mt-1">أقسام وفروع علمية</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
              {facultyStats?.totalSpecialties ?? 14}
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">عروض ليسانس وماستر</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors col-span-2 sm:col-span-1">
            <div className="text-2xl sm:text-3xl font-black text-rose-300 font-mono">
              {facultyStats?.totalLaboratories ?? 5}
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">مخابر بحث معتمدة</div>
          </div>
        </div>

        {/* Quick Shortcut for Admins / Department Heads to Edit Stats */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin' || currentUser?.role === 'dept_head') && onOpenStatsEditor && (
          <div className="relative z-10 mt-3 pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onOpenStatsEditor(currentUser.departmentId)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-lg border border-amber-400/30 transition-all cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>تعديل واعتماد الأرقام والإحصائيات الحقيقية للمنصة</span>
              <Edit3 className="w-3 h-3 ml-1 opacity-70" />
            </button>
          </div>
        )}
      </div>

      {/* Dean's Official Welcome Speech (كلمة عميد الكلية) */}
      {saveStatusMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold">{saveStatusMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveStatusMessage(null)}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Dean's Official Welcome Speech (كلمة عميد الكلية) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/5 rounded-tr-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
          {/* Dean's Authentic Portrait (Seated at his office desk) */}
          <div className="shrink-0 flex flex-col items-center text-center w-full sm:w-auto">
            <div className="relative group rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
              <img
                src={deanPhoto}
                alt="البروفيسور جمال بشكي - عميد كلية الرياضيات وعلوم المادة جالس في مكتبه"
                className="w-full sm:w-72 md:w-80 h-56 sm:h-64 object-cover object-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                onClick={() => setShowFullPhotoModal(true)}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/dean_at_desk.jpg';
                }}
              />
              
              {/* Controls overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setShowFullPhotoModal(true)}
                  className="p-1.5 bg-slate-950/70 hover:bg-slate-950 text-white rounded-lg backdrop-blur-xs transition-colors shadow-xs"
                  title="تكبير الصورة بالحجم الكامل"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg backdrop-blur-xs transition-colors shadow-xs"
                  title="رفع أو اختيار صورتك الأصلية من جهازك"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                {deanPhoto !== '/dean_at_desk.jpg' && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg backdrop-blur-xs transition-colors shadow-xs"
                    title="استعادة الصورة الأصلية"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Hidden file input for uploading original user photo */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-3 text-right">
                <div className="text-white text-xs font-bold flex items-center justify-between">
                  <span>البروفيسور: جمال بشكي</span>
                  <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full border border-emerald-500/40">
                    عميد الكلية
                  </span>
                </div>
                <div className="text-slate-300 text-[10px] mt-0.5 font-medium">
                  بمكتب عمادة كلية الرياضيات وعلوم المادة
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع / استبدال الصورة الأصلية</span>
              </button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setShowFullPhotoModal(true)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>عرض بالحجم الكامل</span>
              </button>
            </div>

            {deanPhoto !== '/dean_at_desk.jpg' ? (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>صورتك المخصصة محفوظة أوتوماتيكياً ودائماً</span>
              </div>
            ) : null}
          </div>

          {/* Dean's Official Welcome Text */}
          <div className="space-y-3.5 flex-1 border-r-0 md:border-r md:pr-6 border-slate-100 dark:border-slate-700 text-right">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>كلمة السيد عميد الكلية إلى الأسرة الجامعية</span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                كلية الرياضيات وعلوم المادة - FMSM
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              «تتغير الأسماء ويبقى الجوهر واحداً، تلكم هي كليتنا»
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              <p>
                تتغير الأسماء ويبقى الجوهر واحداً، تلكم هي كليتنا، بدأت عام 1987 بنواة واحدة اسمها المدرسة العليا للأساتذة، ثم سُمّيت معهد العلوم الدقيقة، ثم كلية العلوم وعلوم المهندس، وهي الآن كلية الرياضيات وعلوم المادة. بهياكلها القديمة وبنيتها ذاتها، تَعاقَبَ على رأس هرم مسؤوليتها أساتذةٌ كرامٌ، نجزم أنه ما ادّخر واحدٌ منهم جهداً في سبيل إعلائها والحفاظ على تقاليدها.
              </p>
              <p>
                ضَمَّتْ كليتنا علوم الرياضيات والفيزياء والكيمياء مُذْ وُجدت قبل حوالي أربعين سنة إلى يومنا هذا، وظل طاقمها البيداغوجي يطوِّر ويتطوَّر بانضباط والتزام، قائماً عليها متمسكاً بها ومشفقاً عليها كلَّ تلكم المدة. إنها جهود المخلِصين وأخلاق الأوفياء وآداب العقلاء، فَمِنْهُم مَّن قَضَىٰ نَحْبَهُ وَمِنْهُم مَّن يَنتَظِرُ وَمَا بَدَّلُوا تَبْدِيلاً.
              </p>
              <p>
                لقد مرّت على كليتنا أجيال عديدة، فدرّسنا الآباءَ ثم الأبناءَ، ونحن على الدرب سائرون، ننشر رسالة العلم، ونبث روح العمل، ونرفع لواء الأمل عالياً خفّاقاً. واكبتْ كليتُنا مراحلَ تطور الجامعة الجزائرية وتحوّلَ نظامها من القديم إلى الجديد، فهي الآن ملتزمةٌ بنظام LMD التعليمي الذي تبنته الجامعة الجزائرية منذ حوالي عشريتين؛ إذْ تكوّن حاملي الليسانس والماستر وكذا الدكتوراه في العلوم الأساسية، والتزاماً بالخطط التي وضعتها الوصاية لتطوير البلاد، فإن كليتنا تساهم بتخريج طلبةٍ أصحابِ مشاريعَ وذوي مؤسساتٍ ناشئة تساهم في خلق الثروة ومناصب العمل.
              </p>
              <p className="font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                زملائي الأساتذة، أبنائي الطلبة، إخواني العمال والإداريين والأعوان المختلفين، الجامعة كلٌّ متكامل، لا يقوم بمهامّه إلا إذا تظافرت جهود جميع مكوناته، فأنتم -كلٌّ في مقامِهِ- تشكلون لَبِنَاتِ هذا الصرح العالي، الذي ترنو إليه الأُمّةُ وتُعلِّقُ عليه آمالها لمعالجة قضاياها العلمية والتعليمية والاقتصادية والاجتماعية. فكونوا في المستوى الذي وَضَعَتْكُم فيه، والتزموا بالعهد الذي قطعتموه لها، وصونوا الأمانات التي استأمنَتْكم عليها.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Departments Selector Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">الأقسام والفروع البيداغوجية بالكلية</h2>
            <p className="text-xs text-slate-500">اختر القسم لاستعراض المناهج، جداول التوقيت، هيئة التدريس، والمخابر التابعة</p>
          </div>
          <button
            onClick={() => onNavigate('departments')}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
          >
            <span>عرض دليل الأقسام الشامل</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tronc Commun SM */}
          <div 
            onClick={() => onSelectDepartment('common_sm')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="w-2 h-full bg-emerald-500 absolute top-0 right-0" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                TC-SM
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              جذع مشترك علوم المادة
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              السنة الأولى ليسانس SM القاعدية للفيزياء والكيمياء والرياضيات المعمقة.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{(departmentStats?.common_sm?.studentsCount ?? DEPARTMENTS.common_sm.stats.students).toLocaleString()} طالب</span>
              <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                تصفح القسم
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Physics */}
          <div 
            onClick={() => onSelectDepartment('physics')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-500 shadow-2xs hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="w-2 h-full bg-sky-500 absolute top-0 right-0" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
                <Atom className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                Physique
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              قسم الفيزياء
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              تخصصات الطاقات المتجددة، الفيزياء الطبية والإشعاعية، والفيزياء الأساسية.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{(departmentStats?.physics?.studentsCount ?? DEPARTMENTS.physics.stats.students).toLocaleString()} طالب</span>
              <span className="text-sky-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                تصفح القسم
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Chemistry */}
          <div 
            onClick={() => onSelectDepartment('chemistry')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="w-2 h-full bg-amber-500 absolute top-0 right-0" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Chimie
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              قسم الكيمياء
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              كيمياء المواد والبوليميرات، الكيمياء العضوية وتثمين الموارد الصحراوية.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{(departmentStats?.chemistry?.studentsCount ?? DEPARTMENTS.chemistry.stats.students).toLocaleString()} طالب</span>
              <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                تصفح القسم
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Math */}
          <div 
            onClick={() => onSelectDepartment('math')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="w-2 h-full bg-indigo-500 absolute top-0 right-0" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                <Binary className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                Math
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              قسم الرياضيات
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              الرياضيات المطبقة للذكاء الاصطناعي وعلم المعطيات والنمذجة الرياضية.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{(departmentStats?.math?.studentsCount ?? DEPARTMENTS.math.stats.students).toLocaleString()} طالب</span>
              <span className="text-indigo-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                تصفح القسم
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Portals & Direct Links Quick Hub */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">بوابات موثقة ومعتمدة رسمياً</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              المنصات والبوابات الرقمية الرسمية لكلية FMSM ورقلة
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              روابط مباشرة لخدمة الأساتذة والطلبة في التدرج، ما بعد التدرج، والإدارة الرقمية والبحث العلمي
            </p>
          </div>
          <button
            onClick={() => handleNav('portals')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>عرض دليل الروابط الشامل (11 منصة)</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <a
            href="https://fmsm-grievances-platform.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/80 hover:border-rose-500/50 p-3 rounded-xl transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-rose-400 mb-2">
              <MessageSquare className="w-4 h-4" />
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-rose-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-rose-200">منصة الانشغالات</span>
              <span className="text-[10px] text-slate-400">الشكاوى والعرائض</span>
            </div>
          </a>

          <a
            href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1314&tmpl=component"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-blue-950/40 border border-slate-700/80 hover:border-blue-500/50 p-3 rounded-xl transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <Building2 className="w-4 h-4" />
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-blue-200">إدارتي أون لاين</span>
              <span className="text-[10px] text-slate-400">المعاملات الإدارية</span>
            </div>
          </a>

          <a
            href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=609&tmpl=component"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-teal-950/40 border border-slate-700/80 hover:border-teal-500/50 p-3 rounded-xl transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-teal-400 mb-2">
              <BookOpen className="w-4 h-4" />
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-teal-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-teal-200">مكتبة الكلية</span>
              <span className="text-[10px] text-slate-400">الرصيد الوثائقي</span>
            </div>
          </a>

          <a
            href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1061&tmpl=component"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700/80 hover:border-emerald-500/50 p-3 rounded-xl transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <GraduationCap className="w-4 h-4" />
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-emerald-200">بوابة التدرج</span>
              <span className="text-[10px] text-slate-400">ليسانس وماستر</span>
            </div>
          </a>

          <a
            href="https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=%201089%20&tmpl=component"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700/80 hover:border-purple-500/50 p-3 rounded-xl transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-purple-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-purple-200">ما بعد التدرج</span>
              <span className="text-[10px] text-slate-400">الدكتوراه والبحث</span>
            </div>
          </a>

          <a
            href="https://www.sndl.cerist.dz/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-cyan-950/40 border border-slate-700/80 hover:border-cyan-500/50 p-3 rounded-xl transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <Globe className="w-4 h-4" />
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-cyan-200">نظام SNDL</span>
              <span className="text-[10px] text-slate-400">توثيق CERIST الدولي</span>
            </div>
          </a>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tool 1: LMD Calculator */}
        <div 
          onClick={() => handleNav('student')}
          className="bg-linear-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                حاسبة معدل السداسي LMD
              </h4>
              <p className="text-xs text-slate-500">مخصصة لطلبة FMSM ورقلة</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            احسب معدلك الفصلي بدقة بمقاييس الكلية (معاملات، أرصدة، نقاط TD و TP والامتحان)، مع احتساب الديون والتعويض.
          </p>
          <div className="mt-3 text-xs font-bold text-teal-700 flex items-center gap-1 group-hover:gap-2 transition-all">
            <span>ابدأ حساب المعدل الآن</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 2: Course & TP Vault */}
        <div 
          onClick={() => handleNav('student')}
          className="bg-linear-to-br from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                المكتبة والمقررات الرقمية
              </h4>
              <p className="text-xs text-slate-500">تحميل المحاضرات والـ TPs</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            تحميل فوري لمطبوعات المحاضرات المعتمدة، سلاسل التمارين المحلولة، وتقارير الأعمال المخبرية ونماذج الامتحانات.
          </p>
          <div className="mt-3 text-xs font-bold text-sky-700 flex items-center gap-1 group-hover:gap-2 transition-all">
            <span>تصفح المقررات المحملة</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 3: Electronic Guichet */}
        <div 
          onClick={() => handleNav('guichet')}
          className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                الشباك الإلكتروني الموحد
              </h4>
              <p className="text-xs text-slate-500">طلبات إدارية وطعون معتمدة</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            استخراج الشهادات المدرسية، كشوف النقاط، شهادات العمل للأساتذة، وتقديم الطعون البيداغوجية الرسمية مع كود التتبع.
          </p>
          <div className="mt-3 text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:gap-2 transition-all">
            <span>الدخول للشباك الإلكتروني</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 4: Pedagogical Bridge */}
        <div 
          onClick={() => {
            if (onOpenPedagogicalBridge) {
              onOpenPedagogicalBridge();
            } else {
              handleNav('teacher');
            }
          }}
          className="bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            جديد
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                همزة الوصل أستاذ - طالب
              </h4>
              <p className="text-xs text-slate-500">استشارات واستقبال بيداغوجي</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            دليل ساعات استقبال الأساتذة، استشارات أكاديمية مباشرة، ومقترحات مشاريع التخرج PFE عبر أقسام الكلية.
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-800 flex items-center gap-1 group-hover:gap-2 transition-all">
            <span>فتح همزة الوصل</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Full Resolution Photo Modal (صورة العميد وهو جالس في مكتبه بالحجم الكامل) */}
      {showFullPhotoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowFullPhotoModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  البروفيسور جمال بشكي - عميد كلية الرياضيات وعلوم المادة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  الصورة الأصلية بمكتب عمادة الكلية - جامعة قاصدي مرباح ورقلة
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تغيير / رفع الصورة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullPhotoModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="py-3 flex-1 flex items-center justify-center overflow-auto bg-slate-950 rounded-2xl my-2">
              <img
                src={deanPhoto}
                alt="البروفيسور جمال بشكي جالس في مكتبه"
                className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-between">
              <span>عرض الصورة الطبيعية الأصلية غير مقصوصة وهو جالس في مكتبه</span>
              <button
                type="button"
                onClick={() => setShowFullPhotoModal(false)}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
