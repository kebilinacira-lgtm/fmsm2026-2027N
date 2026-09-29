import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Award, 
  HelpCircle, 
  FileText,
  Printer
} from 'lucide-react';
import { MODULES_DATABASE } from '../data/facultyData';

interface CalcModuleState {
  id: string;
  code: string;
  nameAr: string;
  nameFr: string;
  coeff: number;
  credits: number;
  hasTD: boolean;
  hasTP: boolean;
  ccGrade: string;
  examGrade: string;
  tpGrade: string;
}

export const LmdCalculator: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<'L1_S1' | 'L1_S2' | 'custom'>('L1_S1');

  // Prepopulate modules based on semester
  const initialModules = useMemo(() => {
    const levelKey = selectedSemester === 'L1_S1' ? 'L1 SM - S1' : 'L1 SM - S2';
    const mods = MODULES_DATABASE.filter(m => m.level === levelKey);

    return mods.map(m => ({
      id: m.id,
      code: m.code,
      nameAr: m.nameAr,
      nameFr: m.nameFr,
      coeff: m.coefficient,
      credits: m.credits,
      hasTD: m.hasTD,
      hasTP: m.hasTP,
      ccGrade: '',
      examGrade: '',
      tpGrade: ''
    }));
  }, [selectedSemester]);

  const [modules, setModules] = useState<CalcModuleState[]>(initialModules);

  // Sync when selectedSemester changes
  React.useEffect(() => {
    setModules(initialModules);
  }, [initialModules]);

  const handleGradeChange = (id: string, field: 'ccGrade' | 'examGrade' | 'tpGrade', val: string) => {
    // Validate value between 0 and 20
    const num = parseFloat(val);
    if (val !== '' && (isNaN(num) || num < 0 || num > 20)) return;

    setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const handleReset = () => {
    setModules(prev => prev.map(m => ({ ...m, ccGrade: '', examGrade: '', tpGrade: '' })));
  };

  // Calculation logic
  const calculationResults = useMemo(() => {
    let totalWeightedSum = 0;
    let totalCoeffs = 0;
    let earnedCreditsWithoutComp = 0;
    let modulesWithGradesCount = 0;

    const moduleEvaluations = modules.map(m => {
      const exam = parseFloat(m.examGrade);
      const cc = parseFloat(m.ccGrade);
      const tp = parseFloat(m.tpGrade);

      let finalGrade: number | null = null;

      if (!isNaN(exam) || !isNaN(cc) || !isNaN(tp)) {
        modulesWithGradesCount++;
        
        if (m.hasTP && !m.hasTD && isNaN(exam)) {
          // TP only module
          finalGrade = !isNaN(tp) ? tp : null;
        } else if (m.hasTD && m.hasTP) {
          // Both TD and TP
          const validExam = !isNaN(exam) ? exam : 0;
          const validCC = !isNaN(cc) ? cc : 0;
          const validTP = !isNaN(tp) ? tp : 0;
          // Standard Algerian SM formula: Exam 60% + CC 20% + TP 20%
          finalGrade = (validExam * 0.60) + (validCC * 0.20) + (validTP * 0.20);
        } else if (m.hasTD) {
          // Exam + TD (CC)
          const validExam = !isNaN(exam) ? exam : 0;
          const validCC = !isNaN(cc) ? cc : 0;
          // Exam 60% + CC 40%
          finalGrade = (validExam * 0.60) + (validCC * 0.40);
        } else {
          // Exam only
          finalGrade = !isNaN(exam) ? exam : 0;
        }
      }

      if (finalGrade !== null) {
        totalWeightedSum += finalGrade * m.coeff;
        totalCoeffs += m.coeff;
        if (finalGrade >= 10.0) {
          earnedCreditsWithoutComp += m.credits;
        }
      }

      return {
        ...m,
        finalGrade: finalGrade !== null ? Number(finalGrade.toFixed(2)) : null,
        isPassed: finalGrade !== null ? finalGrade >= 10.0 : false
      };
    });

    const average = totalCoeffs > 0 ? Number((totalWeightedSum / totalCoeffs).toFixed(2)) : 0;
    const isSemesterPassed = average >= 10.0;
    const finalEarnedCredits = isSemesterPassed ? 30 : earnedCreditsWithoutComp;

    let appreciation = 'غير مكتمل التقييم';
    let appreciationColor = 'text-slate-500';

    if (modulesWithGradesCount > 0) {
      if (average >= 16) {
        appreciation = 'ناجح بامتياز (Très Bien)';
        appreciationColor = 'text-emerald-700 font-extrabold';
      } else if (average >= 14) {
        appreciation = 'ناجح بجيد جداً (Bien)';
        appreciationColor = 'text-teal-700 font-extrabold';
      } else if (average >= 12) {
        appreciation = 'ناجح بجيد (Assez Bien)';
        appreciationColor = 'text-sky-700 font-bold';
      } else if (average >= 10) {
        appreciation = 'ناجح ومكتسب للسداسي بالتعويض (Admis par compensation)';
        appreciationColor = 'text-emerald-800 font-bold';
      } else {
        appreciation = 'مؤجل للدورة الاستدراكية (Ajourné - Session Rattrapage)';
        appreciationColor = 'text-rose-700 font-bold';
      }
    }

    return {
      moduleEvaluations,
      average,
      totalCoeffs,
      finalEarnedCredits,
      isSemesterPassed,
      appreciation,
      appreciationColor,
      modulesWithGradesCount
    };
  }, [modules]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              حاسبة معدل السداسي بنظام LMD
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            معايرة رسمية دقيقة وفق معاملات وأرصدة كلية الرياضيات وعلوم المادة - جامعة ورقلة
          </p>
        </div>

        {/* Semester selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSelectedSemester('L1_S1')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedSemester === 'L1_S1' ? 'bg-white text-teal-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            L1 SM - السداسي 1
          </button>
          <button
            onClick={() => setSelectedSemester('L1_S2')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedSemester === 'L1_S2' ? 'bg-white text-teal-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            L1 SM - السداسي 2
          </button>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Average Card */}
        <div className={`p-5 rounded-2xl border text-center transition-all ${
          calculationResults.average >= 10
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : calculationResults.modulesWithGradesCount > 0
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="text-xs font-semibold text-slate-600">المعدل السداسي التقريبي</div>
          <div className="text-3xl sm:text-4xl font-black font-mono mt-1">
            {calculationResults.average > 0 ? calculationResults.average.toFixed(2) : '--'}
            <span className="text-sm font-bold text-slate-500 mr-1">/ 20</span>
          </div>
          <div className={`text-xs mt-2 ${calculationResults.appreciationColor}`}>
            {calculationResults.appreciation}
          </div>
        </div>

        {/* Credits Card */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
          <div className="text-xs font-semibold text-slate-600">مجموع الأرصدة المكتسبة (Crédits)</div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-teal-800 mt-1">
            {calculationResults.finalEarnedCredits}
            <span className="text-sm font-bold text-slate-400 mr-1">/ 30</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {calculationResults.isSemesterPassed 
              ? 'تم اكتساب كافة الأرصدة بالتعويض' 
              : `تبقى ${30 - calculationResults.finalEarnedCredits} رصيد للاستدراك`}
          </div>
        </div>

        {/* Total Coefficients Card */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
          <div className="text-xs font-semibold text-slate-600">مجموع المعاملات (Coefficients)</div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-900 mt-1">
            {calculationResults.totalCoeffs}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            حسب شبكة التقييم الوزارية
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-center gap-2">
          <button
            onClick={handleReset}
            className="w-full py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تفريغ الدرجات</span>
          </button>
          <button
            onClick={() => window.print()}
            className="w-full py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة بطاقة التقييم</span>
          </button>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3">المقياس</th>
              <th className="p-3 text-center">المعامل</th>
              <th className="p-3 text-center">الرصيد</th>
              <th className="p-3 text-center">نقطة الامتحان (60%)</th>
              <th className="p-3 text-center">المراقبة المستمرة CC (TD)</th>
              <th className="p-3 text-center">الأعمال التطبيقية TP</th>
              <th className="p-3 text-center bg-slate-200/60">المعدل النهائي للمقياس</th>
              <th className="p-3 text-center">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {calculationResults.moduleEvaluations.map((mod) => (
              <tr key={mod.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-slate-900">{mod.nameAr}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{mod.code} - {mod.nameFr}</div>
                </td>
                <td className="p-3 text-center font-mono font-bold">{mod.coeff}</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-700">{mod.credits}</td>
                
                {/* Exam Input */}
                <td className="p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    placeholder="00.00"
                    value={mod.examGrade ?? ''}
                    onChange={(e) => handleGradeChange(mod.id, 'examGrade', e.target.value)}
                    className="w-20 px-2 py-1.5 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                  />
                </td>

                {/* CC (TD) Input */}
                <td className="p-2 text-center">
                  {mod.hasTD ? (
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      placeholder="00.00"
                      value={mod.ccGrade ?? ''}
                      onChange={(e) => handleGradeChange(mod.id, 'ccGrade', e.target.value)}
                      className="w-20 px-2 py-1.5 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  ) : (
                    <span className="text-slate-400 font-mono">-</span>
                  )}
                </td>

                {/* TP Input */}
                <td className="p-2 text-center">
                  {mod.hasTP ? (
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      placeholder="00.00"
                      value={mod.tpGrade ?? ''}
                      onChange={(e) => handleGradeChange(mod.id, 'tpGrade', e.target.value)}
                      className="w-20 px-2 py-1.5 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  ) : (
                    <span className="text-slate-400 font-mono">-</span>
                  )}
                </td>

                {/* Final module calculated grade */}
                <td className="p-3 text-center bg-slate-50 font-mono font-extrabold text-sm">
                  {mod.finalGrade !== null ? (
                    <span className={mod.finalGrade >= 10 ? 'text-emerald-700' : 'text-rose-600'}>
                      {mod.finalGrade.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-slate-400">--</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="p-3 text-center whitespace-nowrap">
                  {mod.finalGrade !== null ? (
                    mod.finalGrade >= 10 ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        مكتسب ({mod.credits} رصيد)
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        استدراك
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400 text-[11px]">في الانتظار</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LMD Academic Regulations Guidance */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-4 text-xs text-teal-950 space-y-1.5 leading-relaxed">
        <div className="font-bold text-teal-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-teal-700" />
          <span>تذكير بقوانين التقييم والانتقال والتعويض بنظام LMD بكلية الرياضيات وعلوم المادة ورقلة:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-700 pr-2">
          <li><strong>التعويض السداسي:</strong> إذا كان معدل السداسي العام 10.00/20 أو أكثر، يكتسب الطالب السداسي كاملاً ويحصل على 30 رصيداً آلياً حتى لو كانت بعض المقاييس دون 10.</li>
          <li><strong>التعويض السنوي:</strong> يعوض السداسي الأول السداسي الثاني إذا كان المعدل السنوي (S1 + S2)/2 أكبر من أو يساوي 10.00/20، ويكتسب الطالب 60 رصيداً وينتقل مباشرة للسنة الثانية.</li>
          <li><strong>الانتقال بالدين (Dette):</strong> ينتقل الطالب من L1 إلى L2 بالدين إذا حاز على 30 رصيداً على الأقل في مجموع السداسيين، أو اكتسب أحد السداسيين بالكامل.</li>
        </ul>
      </div>
    </div>
  );
};
