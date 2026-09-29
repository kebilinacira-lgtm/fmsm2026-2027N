import React, { useState } from 'react';
import { 
  Bell, 
  Download, 
  FileText, 
  Pin, 
  Search, 
  ExternalLink,
  Globe,
  Radio,
  CheckCircle2,
  Calendar,
  Layers,
  PlusCircle,
  Share2,
  Flame,
  ArrowUpRight,
  School
} from 'lucide-react';
import { DEPARTMENTS } from '../data/facultyData';
import { Announcement, DepartmentId, UserProfile } from '../types';
import { OFFICIAL_PORTAL_URL } from '../data/officialAnnouncementsData';

interface AnnouncementsSectionProps {
  announcements?: Announcement[];
  onSelectDepartment: (deptId: string) => void;
  onOpenAIAdvisor?: () => void;
  onSyncOfficial?: () => Promise<void> | void;
  isSyncingOfficial?: boolean;
  onAddAnnouncement?: (ann: Announcement) => void;
  currentUser?: UserProfile | null;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements = [],
  onSelectDepartment,
  onOpenAIAdvisor,
  onAddAnnouncement,
  currentUser,
  onShowToast
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form for adding an announcement (for authenticated staff)
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDept, setNewDept] = useState<DepartmentId | 'all'>('all');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('pedagogical');
  const [newAudience, setNewAudience] = useState<Announcement['targetAudience']>('all');
  const [newSourceUrl, setNewSourceUrl] = useState(OFFICIAL_PORTAL_URL);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newIsPinned, setNewIsPinned] = useState(false);

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesDept = selectedDeptFilter === 'all' || item.departmentId === selectedDeptFilter || item.departmentId === 'all';
    const matchesAudience = selectedAudience === 'all' || item.targetAudience === selectedAudience || item.targetAudience === 'all';
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDept && matchesAudience && matchesCategory && matchesSearch;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      if (onShowToast) onShowToast('تنبيه', 'يرجى كتابة عنوان وتفاصيل الإعلان.', 'warning');
      return;
    }

    const created: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      departmentId: newDept,
      targetAudience: newAudience,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      isPinned: newIsPinned,
      author: currentUser?.name || 'إدارة الكلية',
      attachmentName: newAttachmentName.trim() || undefined,
      sourceUrl: newSourceUrl.trim() || undefined,
      isFromOfficialWebsite: true,
      originalPostDate: new Date().toLocaleDateString('ar-DZ')
    };

    if (onAddAnnouncement) {
      onAddAnnouncement(created);
    }
    if (onShowToast) {
      onShowToast('تم نشر الإعلان', 'تمت إضافة ونشر الإعلان بنجاح.', 'success');
    }
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewAttachmentName('');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Header with Official Faculty Website Direct Icon */}
      <div className="bg-linear-to-r from-[#0B3D91] via-[#082a66] to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-400/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold">
              <School className="w-3.5 h-3.5 text-amber-300" />
              <span>جامعة قاصدي مرباح ورقلة - كلية الرياضيات وعلوم المادة</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              لوحة الإعلانات وآخر المستجدات الأكاديمية
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              متابعة مباشرة ومستمرة لكافة إعلانات ومستجدات الكلية، جداول الامتحانات، المداولات الرسمية، ومذكرات التخرج الصادرة عن نيابة العمادة وموقع الكلية.
            </p>
          </div>

          {/* Prominent Direct Official Faculty Website Icon Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={OFFICIAL_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 border border-emerald-400/30 cursor-pointer"
              title="الانتقال المباشر إلى موقع كلية الرياضيات وعلوم المادة الرسمي: https://fmsm.univ-ouargla.dz/ar/"
            >
              <Globe className="w-5 h-5 text-emerald-200 animate-pulse" />
              <span>زيارة موقع الكلية الرسمي (fmsm.univ-ouargla.dz)</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-200" />
            </a>

            {currentUser && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة إعلان جديد</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Moving News Ticker (شريط الإعلانات المتحرك) */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-2.5 shadow-xs overflow-hidden flex items-center gap-3">
        {/* Fixed Ticker Label */}
        <div className="flex items-center gap-1.5 shrink-0 bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-xl text-xs shadow-2xs z-10">
          <Flame className="w-3.5 h-3.5 animate-bounce" />
          <span>شريط المستجدات المتحرك</span>
        </div>

        {/* Continuous Scrolling Track */}
        <div className="relative flex-1 overflow-hidden h-7 flex items-center">
          <div className="ticker-marquee flex items-center gap-8 whitespace-nowrap">
            {[...announcements, ...announcements].map((ann, idx) => (
              <a
                key={`${ann.id}-${idx}`}
                href={ann.sourceUrl || OFFICIAL_PORTAL_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-amber-300 font-medium transition-colors cursor-pointer group/item"
              >
                {ann.isFromOfficialWebsite ? (
                  <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300/50">
                    رسمي
                  </span>
                ) : (
                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    إعلان
                  </span>
                )}
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  [{ann.originalPostDate || ann.date}]
                </span>
                <span className="group-hover/item:underline font-semibold">
                  {ann.title}
                </span>
                <span className="text-amber-500 font-bold mx-2">★</span>
              </a>
            ))}
          </div>
        </div>

        {/* Official Faculty Website Link on the left */}
        <a
          href={OFFICIAL_PORTAL_URL}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 font-bold text-xs flex items-center gap-1 z-10 pr-2"
          title="موقع الكلية"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">fmsm.univ-ouargla.dz</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث في نص الإعلانات، القرارات، أو المستجدات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter by Department */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none font-semibold cursor-pointer"
            >
              <option value="all">كل الأقسام والتخصصات</option>
              <option value="common_sm">جذع مشترك علوم المادة</option>
              <option value="physics">قسم الفيزياء</option>
              <option value="chemistry">قسم الكيمياء</option>
              <option value="math">قسم الرياضيات</option>
            </select>

            {/* Filter by Target Audience */}
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none font-semibold cursor-pointer"
            >
              <option value="all">الفئة المستهدفة: الكل</option>
              <option value="students">خاص بالطلبة</option>
              <option value="teachers">خاص بالأساتذة</option>
            </select>

            {/* Filter by Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none font-semibold cursor-pointer"
            >
              <option value="all">كل الفئات</option>
              <option value="pedagogical">بيداغوجي وتدريس</option>
              <option value="exams">امتحانات ومداولات</option>
              <option value="administrative">إداري وتنظيمي</option>
              <option value="scientific">علمي وتظاهرات</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Announcements Grid / List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">لا توجد إعلانات مطابقة لمعايير البحث</h3>
            <p className="text-xs text-slate-500 mt-1">يرجى تعديل خيارات التصفية أو مسح عبارة البحث.</p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const deptName = item.departmentId === 'all' 
              ? 'كلية الرياضيات وعلوم المادة' 
              : DEPARTMENTS[item.departmentId]?.nameAr || item.departmentId;

            return (
              <div 
                key={item.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all hover:shadow-md p-5 sm:p-6 space-y-4 ${
                  item.isPinned 
                    ? 'border-amber-300 dark:border-amber-700/60 bg-linear-to-r from-amber-50/20 to-transparent' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Announcement Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs">
                          <Pin className="w-3 h-3" />
                          <span>مثبّت</span>
                        </span>
                      )}

                      {item.isFromOfficialWebsite && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>الموقع الرسمي fmsm.univ-ouargla.dz</span>
                        </span>
                      )}

                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {deptName}
                      </span>

                      <span className="text-slate-400 text-xs font-mono">
                        {item.originalPostDate || item.date}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h2>
                  </div>

                  {/* Direct Link to Official Website Source Article */}
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all shadow-2xs hover:scale-105 shrink-0"
                      title="فتح الخبر الأصلي في موقع الكلية"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>قراءة في موقع الكلية الأصلي</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Announcement Body Content */}
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {item.content}
                </div>

                {/* Announcement Card Footer: Attachment and Author */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-slate-400">الجهة الناشرة:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.author || 'إدارة الكلية'}</span>
                  </div>

                  {item.attachmentName && (
                    <a
                      href={`/downloads/${item.attachmentName}`}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        if (onShowToast) {
                          onShowToast('تحميل الوثيقة المرفقة', `جاري تحميل ملف "${item.attachmentName}" بصيغة PDF المعتمدة...`, 'info');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#0B3D91] dark:text-blue-300" />
                      <span>{item.attachmentName}</span>
                      <Download className="w-3 h-3 text-[#0B3D91] dark:text-blue-300" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Add Announcement Modal (For Staff) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>نشر إعلان جديد بالمنصة</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان الإعلان *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: إعلان استلام بطاقات الطالب الرقمية..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تفاصيل ونص الإعلان *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="نص الإعلان الرسمي والتوجيهات..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    القسم
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    <option value="all">كل الكلية</option>
                    <option value="common_sm">جذع مشترك علوم المادة</option>
                    <option value="physics">قسم الفيزياء</option>
                    <option value="chemistry">قسم الكيمياء</option>
                    <option value="math">قسم الرياضيات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الفئة المستهدفة
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    <option value="all">الجميع</option>
                    <option value="students">الطلبة</option>
                    <option value="teachers">الأساتذة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رابط المقال في موقع الكلية الرسمي (اختياري)
                </label>
                <input
                  type="url"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newIsPinned}
                  onChange={(e) => setNewIsPinned(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <label htmlFor="pinCheck" className="text-slate-700 dark:text-slate-300 font-bold">
                  تثبيت الإعلان في أعلى اللوحة
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  نشر الإعلان
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
