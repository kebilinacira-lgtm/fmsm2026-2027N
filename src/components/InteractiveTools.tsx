import React, { useState } from 'react';
import { 
  FlaskConical, 
  Atom, 
  Search, 
  BookOpen, 
  ShieldAlert, 
  Copy, 
  Check, 
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { CHEMICAL_ELEMENTS, PHYSICAL_CONSTANTS, INITIAL_PFE_SUBJECTS } from '../data/facultyData';
import { ChemicalElement, PhysicalConstant } from '../types';

export const InteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'periodic' | 'constants' | 'safety' | 'theses'>('periodic');

  // Periodic table state
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(CHEMICAL_ELEMENTS[0]);
  const [elementSearch, setElementSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Constants state
  const [constantSearch, setConstantSearch] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const filteredElements = CHEMICAL_ELEMENTS.filter(el => {
    const matchesSearch = el.nameAr.includes(elementSearch) || 
                          el.nameFr.toLowerCase().includes(elementSearch.toLowerCase()) || 
                          el.symbol.toLowerCase().includes(elementSearch.toLowerCase()) ||
                          el.number.toString() === elementSearch;
    const matchesCat = selectedCategory === 'all' || el.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredConstants = PHYSICAL_CONSTANTS.filter(c => {
    return c.nameAr.includes(constantSearch) ||
           c.nameFr.toLowerCase().includes(constantSearch.toLowerCase()) ||
           c.symbol.toLowerCase().includes(constantSearch.toLowerCase()) ||
           c.category.includes(constantSearch);
  });

  const handleCopy = (value: string, symbol: string) => {
    navigator.clipboard.writeText(value);
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-1">
            <Atom className="w-4 h-4 text-teal-600" />
            <span>المكتبة العلمية والأدوات التخصصية لعلوم المادة والرياضيات</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            الجدول الدوري، الثوابت الفيزيائية، وقواعد السلامة المخبرية
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مراجع وأدوات علمية دقيقة تخدم طلبة وأساتذة الفيزياء، الكيمياء، والرياضيات بجامعة قاصدي مرباح ورقلة
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('periodic')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'periodic'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>الجدول الدوري للعناصر (Mendeleev)</span>
        </button>

        <button
          onClick={() => setActiveTab('constants')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'constants'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>دليل الثوابت الفيزيائية الكونية</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'safety'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>دليل السلامة والأمن في مخابر الكلية</span>
        </button>

        <button
          onClick={() => setActiveTab('theses')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'theses'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>أرشيف مذكرات التخرج بالكلية</span>
        </button>
      </div>

      {/* Tab 1: Periodic Table */}
      {activeTab === 'periodic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Elements Selector List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، الرمز، أو العدد الذري..."
                    value={elementSearch}
                    onChange={(e) => setElementSearch(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="all">كافة العائلات الكيميائية</option>
                  <option value="لا فلز">لا فلزات (Non-métaux)</option>
                  <option value="غاز نبيل">غازات نبيلة (Gaz nobles)</option>
                  <option value="فلز قلوي">فلزات قلوية (Métaux alcalins)</option>
                  <option value="فلز قلوي ترابي">فلزات قلوية ترابية</option>
                  <option value="شبه فلز">أشباه فلزات (Métalloïdes)</option>
                  <option value="هالوجين">هالوجينات (Halogènes)</option>
                  <option value="فلز انتقالي">فلزات انتقالية (Métaux de transition)</option>
                </select>
              </div>

              {/* Elements grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-[460px] overflow-y-auto p-1">
                {filteredElements.map((elem) => {
                  const isSelected = selectedElement.number === elem.number;
                  return (
                    <button
                      key={elem.number}
                      onClick={() => setSelectedElement(elem)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105 z-10'
                          : 'bg-slate-50/80 hover:bg-teal-50 border-slate-200 text-slate-900 hover:border-teal-300'
                      }`}
                    >
                      <span className="text-[10px] font-mono absolute top-1.5 right-2 opacity-70">
                        {elem.number}
                      </span>
                      <span className="text-xl font-black font-mono mt-2">{elem.symbol}</span>
                      <span className="text-xs font-bold truncate max-w-full">{elem.nameAr}</span>
                      <span className="text-[10px] font-mono opacity-80">{elem.atomicMass.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Element Detail Inspector */}
            <div className="bg-linear-to-br from-slate-900 to-teal-950 text-white rounded-2xl border border-teal-900/50 p-6 space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-400 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                      {selectedElement.category}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">
                      {selectedElement.nameAr}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono">{selectedElement.nameFr}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                    <span className="text-xs text-teal-300 font-mono">{selectedElement.number}</span>
                    <span className="text-2xl font-black font-mono text-white leading-none">{selectedElement.symbol}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/10">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <div className="text-slate-400">الكتلة الذرية:</div>
                    <div className="font-mono font-bold text-teal-200 mt-0.5">{selectedElement.atomicMass} g/mol</div>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <div className="text-slate-400">الدورة / العمود:</div>
                    <div className="font-mono font-bold text-teal-200 mt-0.5">P: {selectedElement.period} | G: {selectedElement.group}</div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
                  <div className="text-slate-400 mb-1 font-semibold">التوزيع الإلكتروني (Configuration):</div>
                  <div className="font-mono font-bold text-amber-300">{selectedElement.electronConfig}</div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <div className="font-bold text-white mb-1">الخواص والأهمية العلمية:</div>
                  {selectedElement.summary}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 text-center">
                مقرر كيمياء 1 (بنية المادة) - فرع جذع مشترك SM وقسم الكيمياء
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Physical Constants */}
      {activeTab === 'constants' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">جدول الثوابت الفيزيائية العالمية (CODATA)</h3>
              <p className="text-xs text-slate-500">القيم المعتمدة دولياً لحل المسائل الفيزيائية والأشغال التطبيقية</p>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="ابحث عن ثابت (مثال: بلانك، الضوء، الغازات...)"
                value={constantSearch}
                onChange={(e) => setConstantSearch(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">اسم الثابت</th>
                  <th className="p-3 text-center">الرمز</th>
                  <th className="p-3 font-mono">القيمة العددية</th>
                  <th className="p-3">الوحدة في الجملة الدولية (SI)</th>
                  <th className="p-3">التصنيف</th>
                  <th className="p-3 text-center">نسخ القيمة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredConstants.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{c.nameAr}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.nameFr}</div>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-teal-800 text-sm">{c.symbol}</td>
                    <td className="p-3 font-mono font-bold text-slate-900" dir="ltr">{c.value}</td>
                    <td className="p-3 font-mono text-slate-600" dir="ltr">{c.unit}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleCopy(c.value, c.symbol)}
                        className="p-1.5 bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg transition-colors"
                        title="نسخ القيمة"
                      >
                        {copiedSymbol === c.symbol ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Lab Safety Guide */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              دليل الصحة والسلامة المهنية
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              قواعد السلامة والأمن في مخابر الفيزياء والكيمياء - كلية FMSM
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              إرشادات ملزمة لجميع طلبة وأساتذة وباحثي الكلية قبل الدخول للمخابر البيداغوجية والبحثية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                🥼
              </div>
              <h4 className="font-bold text-slate-900 text-sm">معدات الوقاية الفردية الإجبارية</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                يمنع منعاً باتاً دخول أي طالب إلى مخابر الكيمياء والأشغال التطبيقية دون المئزر القطني الأبيض (Blouse en coton) بنسبة 100% ونظارات الحماية ضد تناثر الأحماض.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                ⚠️
              </div>
              <h4 className="font-bold text-slate-900 text-sm">التعامل مع الأحماض والمذيبات العضوية</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                يجب سحب السوائل دائماً باستخدام الإجاصة الماصة (Poire à pipeter) وتجنب المَص بالفم قطعاً. وتجرى التفاعلات المطلقة للأبخرة تحت الساحبة الهوائية (Hotte aspirante).
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                ⚡
              </div>
              <h4 className="font-bold text-slate-900 text-sm">السلامة في مخابر الكهرباء والضوء</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                التأكد من قطع التيار الكهربائي قبل تركيب أو تعديل الدارات، واستخدام مولدات الجهد المنخفض، وعدم لمس أشعة الليزر في تجارب البصريات بالعين المجردة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Theses Archive */}
      {activeTab === 'theses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">أرشيف مذكرات التخرج ومشاريع PFE المودعة</h3>
              <p className="text-xs text-slate-500">قاعدة بيانات بحوث الماستر والدكتوراه المجازة بكلية FMSM ورقلة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_PFE_SUBJECTS.map((pfe) => (
              <div key={pfe.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {pfe.specialty}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{pfe.level}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{pfe.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{pfe.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>المشرف: {pfe.supervisor}</span>
                  <button
                    onClick={() => alert(`جاري عرض ملخص المذكرة في مكتبة الكلية الرقمية: ${pfe.title}`)}
                    className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>قراءة المستخلص</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
