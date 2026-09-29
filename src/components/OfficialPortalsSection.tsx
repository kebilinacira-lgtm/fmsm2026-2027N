import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Globe, 
  FlaskConical, 
  Atom, 
  Binary, 
  Layers, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  MessageSquare, 
  Database, 
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { OFFICIAL_FACULTY_PORTALS } from '../data/facultyData';
import { OfficialFacultyLink } from '../types';

interface OfficialPortalsSectionProps {
  onSelectDepartment?: (deptId: string) => void;
}

export const OfficialPortalsSection: React.FC<OfficialPortalsSectionProps> = ({
  onSelectDepartment
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'department' | 'cycles' | 'admin_service' | 'documentation'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const getPortalIcon = (iconName: string) => {
    switch (iconName) {
      case 'chemistry':
        return <FlaskConical className="w-5 h-5" />;
      case 'physics':
        return <Atom className="w-5 h-5" />;
      case 'math':
        return <Binary className="w-5 h-5" />;
      case 'common':
        return <Layers className="w-5 h-5" />;
      case 'graduation':
        return <GraduationCap className="w-5 h-5" />;
      case 'postgrad':
        return <Sparkles className="w-5 h-5" />;
      case 'grievance':
        return <MessageSquare className="w-5 h-5" />;
      case 'admin':
        return <Building2 className="w-5 h-5" />;
      case 'library':
        return <BookOpen className="w-5 h-5" />;
      case 'sndl':
        return <Globe className="w-5 h-5" />;
      case 'dspace':
        return <Database className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'department':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cycles':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'admin_service':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'documentation':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredPortals = OFFICIAL_FACULTY_PORTALS.filter((portal) => {
    const matchesCategory = selectedCategory === 'all' || portal.category === selectedCategory;
    const matchesSearch = 
      portal.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-teal-900/40">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>روابط معتمدة رسمياً من كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            دليل المنصات والبوابات الرقمية الرسمية للكلية
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            بوابة الوصول المباشر لكافة الأنظمة الرقمية والخوادم المعتمدة: بوابات الأقسام (الكيمياء، الفيزياء، الرياضيات، وجذع مشترك SM)، بوابات التدرج وما بعد التدرج، منصة الانشغالات، منصة إدارتي أون لاين، ومكتبة الكلية ونظامي SNDL و DSpace.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg text-slate-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-teal-300" />
              <span>إجمالي الروابط المعتمدة: 11 منصة وبوابة</span>
            </span>
            <span className="bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-lg text-emerald-300">
              محدثة ومتوافقة مع خادم UKMO
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع المنصات (11)
            </button>
            <button
              onClick={() => setSelectedCategory('department')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'department'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <span>بوابات الأقسام (4)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('cycles')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'cycles'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              <span>أطوار التكوين (2)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('admin_service')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'admin_service'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <span>الإدارة والانشغالات (2)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('documentation')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'documentation'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
              }`}
            >
              <span>المكتبة وقواعد البيانات (3)</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منصة أو رابط أو قسم..."
              className="w-full pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => {
          const isCopied = copiedId === portal.id;
          return (
            <div
              key={portal.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div 
                className={`h-1.5 w-full absolute top-0 right-0 ${
                  portal.category === 'department' ? 'bg-blue-500' :
                  portal.category === 'cycles' ? 'bg-purple-500' :
                  portal.category === 'admin_service' ? 'bg-rose-500' : 'bg-teal-500'
                }`} 
              />

              <div className="space-y-3 pt-1">
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      {getPortalIcon(portal.iconName)}
                    </div>
                    <div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(portal.category)}`}>
                        {portal.categoryAr}
                      </span>
                    </div>
                  </div>
                  {portal.badge && (
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                      {portal.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors leading-snug">
                    {portal.titleAr}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5" dir="ltr">
                    {portal.titleFr}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                  {portal.descriptionAr}
                </p>

                {/* URL preview */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-500" dir="ltr">
                  <span className="truncate max-w-[200px] text-teal-800 font-medium">
                    {portal.url.replace('https://', '')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    HTTPS
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 text-center group-hover:shadow-sm"
                  title={`الانتقال إلى ${portal.titleAr}`}
                >
                  <span>فتح الرابط الرسمي</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleCopy(portal.id, portal.url)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                    isCopied
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="نسخ الرابط المباشر للحافظة"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPortals.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-base">لا توجد نتائج تطابق بحثك</h4>
          <p className="text-xs text-slate-400 mt-1">يرجى تجربة كلمات بحث أخرى أو إزالة عامل التصفية.</p>
        </div>
      )}

      {/* Practical Guide & Technical Advice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-amber-950 text-xs leading-relaxed space-y-2">
        <h4 className="font-bold text-amber-900 flex items-center gap-2 text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>إرشادات الولوج إلى المنصات الجامعية المعتمدة</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-amber-900/90 text-xs">
          <li>
            <strong>نظام SNDL:</strong> يتطلب حساباً مفعلاً يسلمه مسؤول مصلحة التوثيق والمكتبة بالكلية لطلبة الماستر، الدكتوراه، والأساتذة الباحثين.
          </li>
          <li>
            <strong>منصة انشغالات الكلية (Grievances):</strong> مخصصة لإرسال الطعون، الاستفسارات، ومتابعة الردود الإدارية من قبل لجان الأقسام وعمادة الكلية مباشرة.
          </li>
          <li>
            <strong>مستودع DSpace:</strong> يتيح الوصول الحر لأطروحات الدكتوراه ومذكرات الماستر المعتمدة بجامعة ورقلة للتحميل بصيغة PDF.
          </li>
          <li>
            <strong>بوابات الأقسام والتدرج:</strong> تحتوي على جداول التوقيت الرسمية وقوائم المداولات المحدثة لكل سداسي.
          </li>
        </ul>
      </div>
    </div>
  );
};
