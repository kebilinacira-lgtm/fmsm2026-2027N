import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  ChevronLeft,
  Layers,
  Atom,
  FlaskConical,
  Binary
} from 'lucide-react';
import { DEPARTMENTS } from '../data/facultyData';
import { DepartmentId } from '../types';

interface SpecialtiesViewProps {
  onSelectDepartment: (deptId: DepartmentId) => void;
}

export const SpecialtiesView: React.FC<SpecialtiesViewProps> = ({ onSelectDepartment }) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentId | 'all'>('all');
  const [selectedCycle, setSelectedCycle] = useState<'all' | 'Licence' | 'Master'>('all');

  // Comprehensive specialties database across all departments
  const formations = [
    // Mathematics
    {
      id: 'math-l3',
      deptId: 'math' as DepartmentId,
      deptNameAr: 'قسم الرياضيات',
      cycle: 'Licence',
      titleAr: 'ليسانس في الرياضيات الأساسية (Licence en Mathématiques)',
      titleFr: 'Licence en Mathématiques Fondamentales',
      duration: '3 سنوات (6 سداسيات)',
      credits: '180 رصيد ECTS',
      description: 'تكوين قاعدي معمق في الجبر المجرد، التحليل الحقيقي والمركب، الهندسة التفاضلية، والاحتمالات والإحصاء الرياضي.',
      careers: ['التعليم الثانوي والمتوسط', 'محلل بيانات إحصائية', 'متابعة دراسات الماستر والدكتوراه', 'البنوك والتأمينات'],
      modules: ['تحليل 1، 2، 3 و 4', 'جبر خطي وهياكل جبرية', 'طوبولوجيا عامة', 'احتمالات وإحصاء'],
      icon: Binary
    },
    {
      id: 'math-m2-app',
      deptId: 'math' as DepartmentId,
      deptNameAr: 'قسم الرياضيات',
      cycle: 'Master',
      titleAr: 'ماستر في الرياضيات التطبيقية والنمذجة (Master Mathématiques Appliquées)',
      titleFr: 'Master en Mathématiques Appliquées et Modélisation',
      duration: 'سنتان (4 سداسيات)',
      credits: '120 رصيد ECTS',
      description: 'تخصص يركز على حل المسائل المعقدة عبر المعادلات التفاضلية الجزئية، النمذجة العددية، وتحليل الأنظمة الديناميكية وخوارزميات التحسين.',
      careers: ['مراكز البحث العلمي والتطوير', 'هندسة النمذجة الحسابية بالشركات البترولية', 'التدريس بالجامعة'],
      modules: ['معادلات تفاضلية غير خطية', 'التحليل العددي للمصفوفات', 'بحوث العمليات والتحسين', 'مذكرة التخرج PFE'],
      icon: Binary
    },

    // Physics
    {
      id: 'phys-l3',
      deptId: 'physics' as DepartmentId,
      deptNameAr: 'قسم الفيزياء',
      cycle: 'Licence',
      titleAr: 'ليسانس في الفيزياء العامة والأساسية (Licence en Physique)',
      titleFr: 'Licence en Physique Fondamentale',
      duration: '3 سنوات (6 سداسيات)',
      credits: '180 رصيد ECTS',
      description: 'اكتساب المفاهيم الجوهرية في الميكانيكا الكمية، النظرية الكهرومغناطيسية، الديناميكا الحرارية، وفيزياء المواد الصلبة والمخابر.',
      careers: ['قطاع التعليم والتربية', 'مخابر القياس والمعايرة الصناعية', 'مؤسسات الطاقة والمناجم', 'متابعة الماستر'],
      modules: ['ميكانيكا الكم 1 و 2', 'كهرومغناطيسية متقدمة', 'ثيرموديناميك إحصائي', 'فيزياء ذرية ونووية'],
      icon: Atom
    },
    {
      id: 'phys-m2-ener',
      deptId: 'physics' as DepartmentId,
      deptNameAr: 'قسم الفيزياء',
      cycle: 'Master',
      titleAr: 'ماستر فيزياء طاقوية وطاقات متجددة (Master Énergétique & Renouvelables)',
      titleFr: 'Master en Physique Énergétique et Énergies Renouvelables',
      duration: 'سنتان (4 سداسيات)',
      credits: '120 رصيد ECTS',
      description: 'تخصص استراتيجي يواكب التحول الطاقوي في الجنوب الجزائري، يعنى بدراسة الطاقة الشمسية الكهروضوئية والحرارية وكفاءة الطاقة.',
      careers: ['محطات الطاقة الشمسية ومجمع سونلغاز', 'شركات حقول النفط والغاز (سوناطراك)', 'مكاتب دراسات الطاقة والبيئة'],
      modules: ['أنظمة الطاقة الشمسية', 'انتقال الحرارة والكتلة', 'تخزين الطاقة والبطاريات', 'مذكرة التخرج PFE'],
      icon: Atom
    },
    {
      id: 'phys-m2-mat',
      deptId: 'physics' as DepartmentId,
      deptNameAr: 'قسم الفيزياء',
      cycle: 'Master',
      titleAr: 'ماستر فيزياء الإشعاعات والفيزياء الطبية (Master Physique des Rayonnements)',
      titleFr: 'Master en Physique des Rayonnements et Physique Médicale',
      duration: 'سنتان (4 سداسيات)',
      credits: '120 رصيد ECTS',
      description: 'تكوين في تفاعل الإشعاع مع المادة، الوقاية الإشعاعية، والتقنيات النووية في التشخيص الطبي والعلاج الإشعاعي ومراقبة الجودة.',
      careers: ['المستشفيات ومراكز مكافحة السرطان', 'مراكز الأبحاث النووية (CRNA)', 'شركات الفحص الصناعي غير الإتلافي'],
      modules: ['فيزياء القياسات الإشعاعية', 'الوقاية من الإشعاعات', 'تصوير طبي وعلاج بالأشعة', 'مذكرة التخرج PFE'],
      icon: Atom
    },

    // Chemistry
    {
      id: 'chm-l3-org',
      deptId: 'chemistry' as DepartmentId,
      deptNameAr: 'قسم الكيمياء',
      cycle: 'Licence',
      titleAr: 'ليسانس في الكيمياء الأساسية (Licence en Chimie Fondamentale)',
      titleFr: 'Licence en Chimie Fondamentale et Appliquée',
      duration: '3 سنوات (6 سداسيات)',
      credits: '180 رصيد ECTS',
      description: 'دراسة شاملة للبنى الجزيئية، التفاعلات العضوية وغير العضوية، الكيمياء التحليلية، الكيمياء الفيزيائية وتقنيات التحليل الطيفي.',
      careers: ['مخابر التحاليل ومراقبة الجودة', 'صناعة الأدوية ومستحضرات التجميل', 'مؤسسات معالجة المياه والبيئة', 'التعليم'],
      modules: ['كيمياء عضوية معمقة', 'كيمياء لاعضوية ومعقدات', 'كيمياء تحليلية وطيفية', 'أشغال تطبيقية مخبرية'],
      icon: FlaskConical
    },
    {
      id: 'chm-m2-mat',
      deptId: 'chemistry' as DepartmentId,
      deptNameAr: 'قسم الكيمياء',
      cycle: 'Master',
      titleAr: 'ماستر كيمياء المواد والحفز (Master Chimie des Matériaux & Catalyse)',
      titleFr: 'Master en Chimie des Matériaux et Catalyse Industrielle',
      duration: 'سنتان (4 سداسيات)',
      credits: '120 رصيد ECTS',
      description: 'تصنيع وتوصيف المواد النانوية، الحفازات الصناعية، دراسة تآكل المعادن في البيئات الصحراوية وتثمين الموارد الطبيعية المحلية.',
      careers: ['الصناعات البتروكيميائية والتكرير', 'مخابر البحث وتطوير المواد', 'شركات الطلاء وحماية المعادن'],
      modules: ['توصيف المواد المتقدمة (DRX/MEB)', 'حفز كيميائي غير متجانس', 'كيمياء السطوح والتآكل', 'مذكرة التخرج PFE'],
      icon: FlaskConical
    },

    // Tronc Commun
    {
      id: 'tc-sm-l1',
      deptId: 'common_sm' as DepartmentId,
      deptNameAr: 'جذع مشترك علوم المادة',
      cycle: 'Licence',
      titleAr: 'السنة الأولى ليسانس - جذع مشترك علوم المادة (L1 TC-SM)',
      titleFr: '1ère Année Licence Tronc Commun Sciences de la Matière',
      duration: 'سنة واحدة (سداسي 1 + سداسي 2)',
      credits: '60 رصيد ECTS',
      description: 'المحطة التأسيسية التي تؤهل الطالب للالتحاق بمختلف تخصصات الكيمياء والفيزياء بتفوق وفق الرغبات والنتائج البيداغوجية المحققة.',
      careers: ['التوجيه نحو تخصصات الكيمياء والفيزياء بالكلية'],
      modules: ['ميكانيكا وفيزياء عامة', 'بنية المادة وكيمياء عامة', 'رياضيات وتحليل', 'إعلام آلي ولغة أجنبية'],
      icon: Layers
    }
  ];

  const filteredFormations = formations.filter(f => {
    const matchesDept = selectedDept === 'all' || f.deptId === selectedDept;
    const matchesCycle = selectedCycle === 'all' || f.cycle === selectedCycle;
    return matchesDept && matchesCycle;
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#0B3D91] via-slate-900 to-[#071739] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>عروض التكوين الجامعي نظام LMD المعتمدة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            دليل التخصصات والمسارات الأكاديمية
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            استكشف عروض التكوين في أطوار الليسانس والماستر بأقسام الرياضيات، الفيزياء، الكيمياء، والجذع المشترك SM بكلية الرياضيات وعلوم المادة - جامعة ورقلة.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        {/* Department Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">القسم:</span>
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-[#0B3D91] text-white'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            كافة الأقسام
          </button>
          <button
            onClick={() => setSelectedDept('math')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDept === 'math'
                ? 'bg-[#0B3D91] text-white'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            قسم الرياضيات
          </button>
          <button
            onClick={() => setSelectedDept('physics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDept === 'physics'
                ? 'bg-[#0B3D91] text-white'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            قسم الفيزياء
          </button>
          <button
            onClick={() => setSelectedDept('chemistry')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDept === 'chemistry'
                ? 'bg-[#0B3D91] text-white'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            قسم الكيمياء
          </button>
          <button
            onClick={() => setSelectedDept('common_sm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDept === 'common_sm'
                ? 'bg-[#0B3D91] text-white'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            جذع مشترك SM
          </button>
        </div>

        {/* Cycle Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">الطور:</span>
          <button
            onClick={() => setSelectedCycle('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCycle === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            الجميع
          </button>
          <button
            onClick={() => setSelectedCycle('Licence')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCycle === 'Licence'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            طور الليسانس (Licence)
          </button>
          <button
            onClick={() => setSelectedCycle('Master')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCycle === 'Master'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            طور الماستر (Master)
          </button>
        </div>
      </div>

      {/* Specialties Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFormations.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0B3D91] dark:text-blue-400 flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {item.deptNameAr}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {item.titleAr}
                    </h3>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                    item.cycle === 'Licence'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                  }`}
                >
                  {item.cycle === 'Licence' ? 'طور الليسانس LMD' : 'طور الماستر LMD'}
                </span>
              </div>

              {/* French Title */}
              <div className="text-xs text-slate-400 font-mono" dir="ltr">
                {item.titleFr}
              </div>

              {/* Duration and Credits */}
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>المدة: {item.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-500" />
                  <span>{item.credits}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Modules list */}
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                  المقاييس والوحدات التعليمية الأساسية:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.modules.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Opportunities */}
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                  الآفاق المهنية وفرص التوظيف:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {item.careers.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department CTA */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/70 flex justify-end">
                <button
                  onClick={() => onSelectDepartment(item.deptId)}
                  className="text-xs font-bold text-[#0B3D91] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>استعراض المقررات البيداغوجية لهذا القسم</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
