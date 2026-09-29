import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle, 
  Printer, 
  Filter, 
  CheckCircle2, 
  BarChart3, 
  PieChart as PieIcon,
  Download,
  BookOpen
} from 'lucide-react';

interface StudentPerformanceChartsProps {
  currentLogoUrl?: string;
}

export const StudentPerformanceCharts: React.FC<StudentPerformanceChartsProps> = ({
  currentLogoUrl = '/logo_univ_ouargla.png'
}) => {
  const [selectedModule, setSelectedModule] = useState('SM111');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedSession, setSelectedSession] = useState<'normal' | 'rattrapage'>('normal');

  // Modules metadata
  const modules = [
    { code: 'SM111', name: 'تحليل رياضي 1 (Analyse 1)', coef: 3, credit: 6, dept: 'قسم الرياضيات' },
    { code: 'SM112', name: 'جبر 1 (Algèbre 1)', coef: 3, credit: 6, dept: 'قسم الرياضيات' },
    { code: 'SM121', name: 'بنية المادة (Structure de la Matière)', coef: 3, credit: 6, dept: 'قسم الكيمياء' },
    { code: 'SM131', name: 'ميكانيك النقطة المادية (Mécanique)', coef: 3, credit: 6, dept: 'قسم الفيزياء' },
    { code: 'SM132', name: 'كيمياء حرارية (Thermodynamique)', coef: 2, credit: 4, dept: 'قسم الفيزياء' },
    { code: 'SM141', name: 'إعلام آلي وخوارزميات (Informatique 1)', coef: 2, credit: 4, dept: 'الجذع المشترك' },
  ];

  // Groups roster mock data for deep analytics
  const rawRosterData = useMemo(() => [
    { id: 1, matricule: '232339011452', name: 'بن علي عبد الرؤوف', group: 'الفوج 01', cc: 14.5, tp: 15.0, exam: 13.5, module: 'SM111' },
    { id: 2, matricule: '232339088219', name: 'عثماني خولة', group: 'الفوج 01', cc: 12.5, tp: 14.0, exam: 10.5, module: 'SM111' },
    { id: 3, matricule: '232339045610', name: 'قدوري سيف الدين', group: 'الفوج 01', cc: 16.0, tp: 17.0, exam: 15.0, module: 'SM111' },
    { id: 4, matricule: '232339077112', name: 'بلقاسم أسماء', group: 'الفوج 01', cc: 11.0, tp: 13.5, exam: 9.0, module: 'SM111' },
    { id: 5, matricule: '232339091244', name: 'زايدي محمد الأمين', group: 'الفوج 01', cc: 13.5, tp: 14.5, exam: 12.0, module: 'SM111' },
    { id: 6, matricule: '232339055431', name: 'تواتي مروة', group: 'الفوج 01', cc: 9.5, tp: 12.0, exam: 7.5, module: 'SM111' },
    { id: 7, matricule: '232339066782', name: 'حركات ياسين', group: 'الفوج 01', cc: 15.0, tp: 16.5, exam: 14.0, module: 'SM111' },
    { id: 8, matricule: '232339033421', name: 'بوسعيد هبة الرحمان', group: 'الفوج 01', cc: 17.0, tp: 18.0, exam: 16.5, module: 'SM111' },
    
    // Group 2
    { id: 9, matricule: '232339022341', name: 'مباركي وليد', group: 'الفوج 02', cc: 13.0, tp: 14.0, exam: 11.0, module: 'SM111' },
    { id: 10, matricule: '232339099812', name: 'دراجي نادية', group: 'الفوج 02', cc: 10.0, tp: 11.5, exam: 8.5, module: 'SM111' },
    { id: 11, matricule: '232339044567', name: 'قرفي حمزة', group: 'الفوج 02', cc: 14.0, tp: 15.5, exam: 13.0, module: 'SM111' },
    { id: 12, matricule: '232339088190', name: 'سلطاني سمية', group: 'الفوج 02', cc: 16.5, tp: 17.0, exam: 15.5, module: 'SM111' },
    { id: 13, matricule: '232339066345', name: 'شعباني إلياس', group: 'الفوج 02', cc: 8.5, tp: 11.0, exam: 6.0, module: 'SM111' },
    { id: 14, matricule: '232339077889', name: 'لعريبي إيمان', group: 'الفوج 02', cc: 12.0, tp: 13.5, exam: 11.5, module: 'SM111' },
    { id: 15, matricule: '232339011990', name: 'عيساوي كريم', group: 'الفوج 02', cc: 15.5, tp: 16.0, exam: 14.5, module: 'SM111' },

    // Group 3
    { id: 16, matricule: '232339055123', name: 'روابح سلمى', group: 'الفوج 03', cc: 14.0, tp: 14.5, exam: 12.5, module: 'SM111' },
    { id: 17, matricule: '232339033876', name: 'خرشي فاروق', group: 'الفوج 03', cc: 11.5, tp: 12.5, exam: 10.0, module: 'SM111' },
    { id: 18, matricule: '232339077221', name: 'مقراني أحلام', group: 'الفوج 03', cc: 17.5, tp: 18.0, exam: 17.0, module: 'SM111' },
    { id: 19, matricule: '232339099443', name: 'بن زيان أيمن', group: 'الفوج 03', cc: 9.0, tp: 10.5, exam: 7.0, module: 'SM111' },
    { id: 20, matricule: '232339044119', name: 'دحماني زهرة', group: 'الفوج 03', cc: 13.5, tp: 14.0, exam: 12.0, module: 'SM111' },
    { id: 21, matricule: '232339088654', name: 'عابد طارق', group: 'الفوج 03', cc: 15.0, tp: 15.5, exam: 13.5, module: 'SM111' },
  ], []);

  // Filter students
  const filteredStudents = useMemo(() => {
    return rawRosterData.filter(s => {
      if (selectedGroup !== 'all' && s.group !== selectedGroup) return false;
      return true;
    }).map(s => {
      // Calculate final grade: 40% CC + TP average and 60% Exam (Standard Algerian University Rule)
      const ccTpAvg = (s.cc + s.tp) / 2;
      const finalGrade = Number(((ccTpAvg * 0.4) + (s.exam * 0.6)).toFixed(2));
      return {
        ...s,
        finalGrade,
        status: finalGrade >= 10 ? 'ناجح' : 'راسب'
      };
    });
  }, [rawRosterData, selectedGroup]);

  // Performance Statistics calculations
  const stats = useMemo(() => {
    if (filteredStudents.length === 0) {
      return { total: 0, passed: 0, failed: 0, passRate: 0, avg: 0, max: 0, min: 0 };
    }
    const total = filteredStudents.length;
    const passed = filteredStudents.filter(s => s.finalGrade >= 10).length;
    const failed = total - passed;
    const passRate = Number(((passed / total) * 100).toFixed(1));
    const grades = filteredStudents.map(s => s.finalGrade);
    const sum = grades.reduce((a, b) => a + b, 0);
    const avg = Number((sum / total).toFixed(2));
    const max = Math.max(...grades);
    const min = Math.min(...grades);

    return { total, passed, failed, passRate, avg, max, min };
  }, [filteredStudents]);

  // Distribution Data for BarChart (LMD Grade Categories)
  const distributionData = useMemo(() => {
    let fail = 0; // < 10 (Ajourné)
    let passable = 0; // 10 - 11.99 (Passable)
    let assezBien = 0; // 12 - 13.99 (Assez Bien)
    let bien = 0; // 14 - 15.99 (Bien)
    let tresBien = 0; // 16 - 20 (Très Bien)

    filteredStudents.forEach(s => {
      if (s.finalGrade < 10) fail++;
      else if (s.finalGrade < 12) passable++;
      else if (s.finalGrade < 14) assezBien++;
      else if (s.finalGrade < 16) bien++;
      else tresBien++;
    });

    return [
      { category: 'راسب (<10)', count: fail, fill: '#C8102E', label: 'أقل من 10' },
      { category: 'مقبول (10-12)', count: passable, fill: '#D97706', label: '10.00 - 11.99' },
      { category: 'جيد (12-14)', count: assezBien, fill: '#0284C7', label: '12.00 - 13.99' },
      { category: 'جيد جداً (14-16)', count: bien, fill: '#059669', label: '14.00 - 15.99' },
      { category: 'ممتاز (≥16)', count: tresBien, fill: '#006633', label: '16.00 - 20.00' },
    ];
  }, [filteredStudents]);

  // Pass vs Fail for PieChart
  const pieData = useMemo(() => [
    { name: 'ناجح (معدل ≥ 10)', value: stats.passed, color: '#006633' },
    { name: 'راسب (معدل < 10)', value: stats.failed, color: '#C8102E' }
  ], [stats]);

  // Assessment breakdown averages
  const breakdownData = useMemo(() => {
    if (filteredStudents.length === 0) return [];
    const avgCC = (filteredStudents.reduce((acc, s) => acc + s.cc, 0) / filteredStudents.length).toFixed(2);
    const avgTP = (filteredStudents.reduce((acc, s) => acc + s.tp, 0) / filteredStudents.length).toFixed(2);
    const avgExam = (filteredStudents.reduce((acc, s) => acc + s.exam, 0) / filteredStudents.length).toFixed(2);
    const avgFinal = stats.avg;

    return [
      { component: 'المراقبة المستمرة CC', average: parseFloat(avgCC), target: 12.0 },
      { component: 'الأعمال التطبيقية TP', average: parseFloat(avgTP), target: 14.0 },
      { component: 'الامتحان النهائي (60%)', average: parseFloat(avgExam), target: 11.5 },
      { component: 'المعدل العام النهائي', average: avgFinal, target: 12.0 },
    ];
  }, [filteredStudents, stats.avg]);

  const currentModObj = modules.find(m => m.code === selectedModule) || modules[0];

  return (
    <div className="space-y-6">
      {/* Printable Header (Visible only when printing) */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4 gap-4">
        <div className="w-20 shrink-0 flex flex-col items-center">
          <img
            src={currentLogoUrl}
            alt="شعار جامعة قاصدي مرباح ورقلة"
            className="w-16 h-16 object-contain rounded-full border border-slate-300 p-0.5 bg-white"
            referrerPolicy="no-referrer"
          />
          <span className="text-[9px] font-bold text-slate-700 mt-1 font-mono">UKMO</span>
        </div>
        <div className="text-center space-y-0.5 flex-1">
          <div className="text-xs font-bold text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية - وزارة التعليم العالي والبحث العلمي</div>
          <div className="text-sm font-black text-slate-950">جامعة قاصدي مرباح ورقلة - كلية الرياضيات وعلوم المادة</div>
          <div className="text-xs font-bold text-emerald-800">
            تقرير التحليل الإحصائي لأداء الطلبة والمداولات البيداغوجية
          </div>
          <div className="text-[11px] font-semibold text-slate-700">
            المقياس: {currentModObj.name} ({currentModObj.code}) | الفوج: {selectedGroup === 'all' ? 'جميع الأفواج' : selectedGroup}
          </div>
          <div className="text-[10px] text-slate-500">
            السداسي الثاني - الموسم الجامعي 2025/2026 | أستاذ المادة: أ. د. بوقرة عبد الحليم
          </div>
        </div>
        <div className="w-24 shrink-0 text-left text-[9px] font-mono text-slate-600">
          <div>FMSM-STAT-PV</div>
          <div>تاريخ الإصدار:</div>
          <div className="font-bold">{new Date().toLocaleDateString('ar-DZ')}</div>
        </div>
      </div>

      {/* Control & Filter Panel (Screen only) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <span>لوحة التحليل الإحصائي لأداء الطلبة</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  إحصائيات مباشرة
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                رسوم بيانية تفاعلية لمعدلات ونسب نجاح الطلبة وفق معايير نظام LMD الجزائري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="طباعة التقرير الإحصائي بصيغة PDF"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير (PDF)</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>المقياس الدراسي:</span>
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {modules.map(m => (
                <option key={m.code} value={m.code}>
                  {m.code} - {m.name} (معامل {m.coef})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>الفوج التربوي (Groupe):</span>
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">جميع الأفواج (الفوج 1 + 2 + 3)</option>
              <option value="الفوج 01">الفوج 01 (Groupe 1)</option>
              <option value="الفوج 02">الفوج 02 (Groupe 2)</option>
              <option value="الفوج 03">الفوج 03 (Groupe 3)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>الدورة الامتحانية:</span>
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="normal">الدورة العادية (Session Normale)</option>
              <option value="rattrapage">الدورة الاستدراكية (Rattrapage)</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>إجمالي الطلبة</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">طالب مسجل</div>
        </div>

        {/* Success Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>نسبة النجاح</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            %{stats.passRate}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {stats.passed} من أصل {stats.total} طالب
          </div>
        </div>

        {/* Group Average */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>معدل الفوج العام</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {stats.avg} <span className="text-xs font-normal text-slate-500">/ 20</span>
          </div>
          <div className={`text-[11px] font-semibold mt-1 ${stats.avg >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stats.avg >= 10 ? 'فوق العتبة المطلوبة' : 'تحت العتبة'}
          </div>
        </div>

        {/* Highest Grade */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>أعلى نقطة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            {stats.max} <span className="text-xs font-normal text-slate-500">/ 20</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">أفضل أداء</div>
        </div>

        {/* Lowest Grade */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>أدنى نقطة</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 font-mono">
            {stats.min} <span className="text-xs font-normal text-slate-500">/ 20</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-1">بحاجة لاستدراك</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Grade Distribution (BarChart) - Takes 2 cols */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>توزيع الطلبة حسب فئات التقدير (LMD Grade Distribution)</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                توزيع عدد الطلبة في كل شريحة تقييمية
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {currentModObj.code}
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <Tooltip 
                  formatter={(val: number) => [`${val} طلبة`, 'العدد']}
                  labelFormatter={(label) => `الفئة: ${label}`}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Color Key */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#C8102E]"></span>
              <span>راسب (&lt;10)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D97706]"></span>
              <span>مقبول (10-12)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0284C7]"></span>
              <span>جيد (12-14)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#059669]"></span>
              <span>جيد جداً (14-16)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#006633]"></span>
              <span>ممتاز (≥16)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Pass vs Fail Ratio (PieChart) - Takes 1 col */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-700" />
              <span>نسبة النجاح مقابل الرسوب</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              الحصيلة الإجمالية لاستيفاء المقياس
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => [`${val} طلبة`, 'العدد']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#006633]"></span>
                <span>الناجحون (≥ 10/20):</span>
              </div>
              <span className="font-mono">{stats.passed} طالب ({stats.passRate}%)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C8102E]"></span>
                <span>الراسبون (&lt; 10/20):</span>
              </div>
              <span className="font-mono">{stats.failed} طالب ({(100 - stats.passRate).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 3: Assessment Breakdown Analysis */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              مقارنة متوسطات عناصر التقييم (CC مقابل TP مقابل الامتحان النهائي)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مقارنة أداء الطلبة في الحصص التطبيقية مقابل أوراق الامتحانات الكتابية
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            العتبة المطلوبة: 10.00/20
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {breakdownData.map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {item.component}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {item.average.toFixed(2)}
                </span>
                <span className={`text-xs font-bold ${item.average >= item.target ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {item.average >= item.target ? 'أداء مرضي' : 'متوسط منخفض'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.average >= item.target ? 'bg-emerald-600' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, (item.average / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Student Roster for the Selected Group */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              قائمة الطلبة والدرجات التفصيلية ({filteredStudents.length} طالب)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              المقياس: {currentModObj.name} | {selectedGroup === 'all' ? 'جميع الأفواج' : selectedGroup}
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            حساب المعدل: (معدل CC و TP × 0.4) + (الامتحان × 0.6)
          </span>
        </div>

        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-right text-xs border-collapse border border-slate-200 dark:border-slate-800 print:border-slate-800">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700 print:bg-slate-200 print:border-slate-800">
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-12">#</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-32">رقم التسجيل</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800">اسم ولقب الطالب</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-24">الفوج</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-24">مستمر CC</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-24">تطبيقي TP</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-24">امتحان (60%)</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-28 font-black">المعدل النهائي</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center w-24">النتيجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-400 font-sans text-slate-800 dark:text-slate-200">
              {filteredStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center font-mono text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                    {s.matricule}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center text-slate-600 dark:text-slate-400">
                    {s.group}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center font-mono font-bold">
                    {s.cc.toFixed(2)}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center font-mono font-bold">
                    {s.tp.toFixed(2)}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center font-mono font-bold">
                    {s.exam.toFixed(2)}
                  </td>
                  <td className={`p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center font-mono font-black text-sm ${
                    s.finalGrade >= 10 
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30' 
                      : 'text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
                  }`}>
                    {s.finalGrade.toFixed(2)}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 print:border-slate-800 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      s.finalGrade >= 10
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Signature Footer */}
        <div className="hidden print:grid grid-cols-2 gap-8 pt-6 mt-4 border-t border-slate-300 text-xs">
          <div>
            <div className="font-bold text-slate-800">توقيع أستاذ المادة المحاضر:</div>
            <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              الأستاذ الدكتور بوقرة عبد الحليم
              <br />
              التوقيع: .......................................
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="font-bold text-slate-900">تأشيرة رئيس القسم ولجنة المداولات</div>
            <div className="inline-block border border-dashed border-slate-400 text-slate-700 px-6 py-2 rounded-lg text-[11px] font-bold">
              ختم وتأشيرة رئيس قسم الرياضيات
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
