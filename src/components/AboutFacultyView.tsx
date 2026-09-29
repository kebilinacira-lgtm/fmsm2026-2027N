import React from 'react';
import { 
  Building2, 
  FlaskConical, 
  Atom, 
  Binary, 
  Layers, 
  Award, 
  CheckCircle2, 
  Mail, 
  Users, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { FACULTY_GENERAL_INFO, DEPARTMENTS } from '../data/facultyData';
import { DepartmentId } from '../types';

interface AboutFacultyViewProps {
  onSelectDepartment: (deptId: DepartmentId) => void;
}

export const AboutFacultyView: React.FC<AboutFacultyViewProps> = ({ onSelectDepartment }) => {
  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Hero Section */}
      <div className="bg-linear-to-r from-[#0B3D91] via-slate-900 to-[#071739] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نبذة تعريفية شاملة عن الكلية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            كلية الرياضيات وعلوم المادة
            <span className="block text-amber-300 text-lg sm:text-2xl font-bold mt-1">
              جامعة قاصدي مرباح - ورقلة (FMSM - UKMO)
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            تأسست الكلية لتكون قطباً علمياً وبيداغوجياً رائداً في الجنوب الجزائري، مساهمةً في تكوين الكفاءات الوطنية المتخصصة في العلوم الدقيقة والتطبيقية، ومواكبةً لرهانات التحول الطاقوي والتكنولوجي من خلال تكوينات بيداغوجية رصينة ومشاريع بحثية متقدمة بمخابرها المعتمدة.
          </p>
        </div>
      </div>

      {/* Vision, Mission, and Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0B3D91] dark:text-blue-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">الرسالة البيداغوجية</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            تقديم تكوين أكاديمي نوعي في إطار نظام (ليسانس - ماستر - دكتوراه LMD) يجمع بين المعارف النظرية العميقة والتدريب المخبري التطبيقي المكثف.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">البحث العلمي والتثمين</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            تطوير بحوث مبتكرة تركز على الطاقات المتجددة، كيمياء المواد والموارد الصحراوية، والنمذجة الرياضية التطبيقية لخدمة الاقتصاد الوطني.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">الرقمنة وجودة التعليم</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            تفعيل منصات التعليم الإلكتروني ومتابعة المسار البيداغوجي للطلبة رقمياً وفق معايير الجودة والشفافية المعتمدة بوزارة التعليم العالي.
          </p>
        </div>
      </div>

      {/* The 3 Departments + Tronc Commun */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            الأقسام البيداغوجية بالكلية
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تضم الكلية ثلاثة أقسام كبرى بالإضافة إلى فرع الجذع المشترك لعلوم المادة:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dept 1: Mathematics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                <Binary className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">قسم الرياضيات (Mathématiques)</h3>
                <span className="text-xs text-slate-400 font-mono">Département de Mathématiques</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {DEPARTMENTS.math.description}
            </p>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500">رئيس القسم: {DEPARTMENTS.math.headName}</span>
              <button
                onClick={() => onSelectDepartment('math')}
                className="text-[#0B3D91] dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                استعراض المقررات والتخصصات &larr;
              </button>
            </div>
          </div>

          {/* Dept 2: Physics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                <Atom className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">قسم الفيزياء (Physique)</h3>
                <span className="text-xs text-slate-400 font-mono">Département de Physique</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {DEPARTMENTS.physics.description}
            </p>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500">رئيس القسم: {DEPARTMENTS.physics.headName}</span>
              <button
                onClick={() => onSelectDepartment('physics')}
                className="text-[#0B3D91] dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                استعراض المقررات والتخصصات &larr;
              </button>
            </div>
          </div>

          {/* Dept 3: Chemistry */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">قسم الكيمياء (Chimie)</h3>
                <span className="text-xs text-slate-400 font-mono">Département de Chimie</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {DEPARTMENTS.chemistry.description}
            </p>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500">رئيس القسم: {DEPARTMENTS.chemistry.headName}</span>
              <button
                onClick={() => onSelectDepartment('chemistry')}
                className="text-[#0B3D91] dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                استعراض المقررات والتخصصات &larr;
              </button>
            </div>
          </div>

          {/* Dept 4: Tronc Commun */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">جذع مشترك علوم المادة (TC-SM)</h3>
                <span className="text-xs text-slate-400 font-mono">Tronc Commun Sciences de la Matière</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {DEPARTMENTS.common_sm.description}
            </p>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500">مسؤول الفرع: {DEPARTMENTS.common_sm.headName}</span>
              <button
                onClick={() => onSelectDepartment('common_sm')}
                className="text-[#0B3D91] dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                استعراض المقررات والتخصصات &larr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accredited Research Laboratories */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-500" />
            <span>مخابر البحث العلمي المعتمدة بالكلية</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تضم الكلية مخابر بحثية معتمدة من وزارة التعليم العالي والبحث العلمي تعمل على أحدث الابتكارات:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full font-mono">
              LDER
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              مخبر تطوير الطاقات المتجددة في الأقاليم الصحراوية
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              مدير المخبر: أ. د. عبد القادر بوعزة • تخصص: الخلايا الكهروضوئية والحرارة الشمسية.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full font-mono">
              LCMNS
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              مخبر كيمياء وتثمين الموارد الطبيعية والمواد الصحراوية
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              مديرة المخبر: أ. د. فاطمة زهرة لعروسي • تخصص: الكيمياء العضوية ومعالجة المياه.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-full font-mono">
              LMA
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              مخبر الرياضيات التطبيقية والمعادلات التفاضلية
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              مدير المخبر: أ. د. رابح قطاف • تخصص: التحليل العددي والديناميكا الرياضية.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full font-mono">
              LPM
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              مخبر فيزياء المواد والأغشية الرقيقة
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              مدير المخبر: د. ناصر قدوري • تخصص: المواد النانوية وأشباه الموصلات.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-mono">
              LCP
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              مخبر الكيمياء الفيزيائية والتحفيز الصناعي
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              مدير المخبر: أ. د. بوقرة عبد الحليم • تخصص: الحفز الكيميائي والتآكل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
