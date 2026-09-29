import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Users, 
  GraduationCap, 
  Award, 
  BarChart3, 
  FlaskConical, 
  BookOpen, 
  FileText, 
  Calendar, 
  UserCheck, 
  Check, 
  Printer,
  Sparkles,
  Layers,
  Atom,
  Binary
} from 'lucide-react';
import { 
  DepartmentId, 
  DepartmentRealStats, 
  FacultyGeneralRealStats, 
  UserProfile 
} from '../types';

interface DepartmentStatsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: DepartmentId;
  initialStats: DepartmentRealStats;
  facultyStats: FacultyGeneralRealStats;
  currentUser: UserProfile | null;
  onSaveDepartmentStats: (deptId: DepartmentId, updatedStats: DepartmentRealStats) => void;
  onSaveFacultyStats?: (updatedStats: FacultyGeneralRealStats) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const DepartmentStatsEditorModal: React.FC<DepartmentStatsEditorModalProps> = ({
  isOpen,
  onClose,
  departmentId,
  initialStats,
  facultyStats,
  currentUser,
  onSaveDepartmentStats,
  onSaveFacultyStats,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'department' | 'faculty'>('department');
  const [targetDeptId, setTargetDeptId] = useState<DepartmentId>(departmentId);

  // Form states for department stats
  const [formStats, setFormStats] = useState<DepartmentRealStats>(initialStats);
  
  // Form states for general faculty stats
  const [formFaculty, setFormFaculty] = useState<FacultyGeneralRealStats>(facultyStats);

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.adminRole === 'super_admin';
  const isDeptHead = currentUser?.adminRole === 'dept_head';

  useEffect(() => {
    setFormStats(initialStats);
  }, [initialStats]);

  useEffect(() => {
    setFormFaculty(facultyStats);
  }, [facultyStats]);

  useEffect(() => {
    setTargetDeptId(departmentId);
  }, [departmentId]);

  if (!isOpen) return null;

  const departmentNames: Record<DepartmentId, { name: string; icon: any; color: string }> = {
    physics: { name: 'قسم الفيزياء', icon: Atom, color: 'text-sky-600 dark:text-sky-400' },
    chemistry: { name: 'قسم الكيمياء', icon: FlaskConical, color: 'text-amber-600 dark:text-amber-400' },
    math: { name: 'قسم الرياضيات', icon: Binary, color: 'text-indigo-600 dark:text-indigo-400' },
    common_sm: { name: 'جذع مشترك علوم المادة', icon: Layers, color: 'text-emerald-600 dark:text-emerald-400' }
  };

  const handleDeptNumberChange = (field: keyof DepartmentRealStats, valStr: string) => {
    const num = Math.max(0, Number(valStr) || 0);
    setFormStats(prev => ({
      ...prev,
      [field]: num
    }));
  };

  const handleFacultyNumberChange = (field: keyof FacultyGeneralRealStats, valStr: string) => {
    const num = Math.max(0, Number(valStr) || 0);
    setFormFaculty(prev => ({
      ...prev,
      [field]: num
    }));
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DepartmentRealStats = {
      ...formStats,
      departmentId: targetDeptId,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      lastUpdatedBy: currentUser?.name 
        ? `${currentUser.name} (${currentUser.adminTitle || 'مسؤول معتمد'})` 
        : formStats.lastUpdatedBy
    };

    onSaveDepartmentStats(targetDeptId, updated);
    onShowToast(
      'تم اعتماد وتحديث الإحصائيات بنجاح',
      `تم حفظ الأرقام الحقيقية المحدثة لـ ${departmentNames[targetDeptId].name} ونشرها فوراً على المنصة.`,
      'success'
    );
    onClose();
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveFacultyStats) return;

    const updated: FacultyGeneralRealStats = {
      ...formFaculty,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      lastUpdatedBy: currentUser?.name ? `${currentUser.name} (مشرف المنصة العام)` : formFaculty.lastUpdatedBy
    };

    onSaveFacultyStats(updated);
    onShowToast(
      'تم تحديث إحصائيات الكلية العامة',
      'تم تحديث الأرقام الإجمالية لكافة الأقسام والمخابر بنجاح.',
      'success'
    );
    onClose();
  };

  const DeptIcon = departmentNames[targetDeptId]?.icon || Building2;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-6 relative border-b border-emerald-800/50">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black tracking-wide">
                  نظام الإحصائيات الحقيقية
                </span>
                <span className="text-xs text-emerald-300 font-semibold">
                  جامعة قاصدي مرباح ورقلة - كلية FMSM
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                تعديل واعتماد إحصائيات وأرقام المنصة
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                يمكن لكل مسؤول إدراج الأعداد الواقعية المحينة لقسمه ونشرها فورياً في واجهات الكلية.
              </p>
            </div>
          </div>

          {/* Tab Switcher if Super Admin */}
          {isSuperAdmin && (
            <div className="flex bg-black/30 p-1 rounded-xl mt-4 max-w-sm">
              <button
                type="button"
                onClick={() => setActiveTab('department')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'department'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                إحصائيات القسم المفصلة
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('faculty')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'faculty'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                إحصائيات الكلية الإجمالية
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">

          {/* Department Selection for Super Admin */}
          {activeTab === 'department' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <DeptIcon className={`w-5 h-5 ${departmentNames[targetDeptId]?.color}`} />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    القسم المستهدف للتعديل:
                  </span>
                  <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {departmentNames[targetDeptId]?.name}
                  </span>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                    {(['physics', 'chemistry', 'math', 'common_sm'] as DepartmentId[]).map(dId => (
                      <button
                        key={dId}
                        type="button"
                        onClick={() => setTargetDeptId(dId)}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          targetDeptId === dId
                            ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-amber-300 font-bold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {dId === 'physics' && 'الفيزياء'}
                        {dId === 'chemistry' && 'الكيمياء'}
                        {dId === 'math' && 'الرياضيات'}
                        {dId === 'common_sm' && 'جذع مشترك'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Stats Form */}
              <form onSubmit={handleSaveDepartment} className="space-y-6 mt-4">
                
                {/* 1. Student Statistics Group */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-xs">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>أعداد الطلبة والمسجلين في القسم</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        إجمالي طلبة القسم
                      </label>
                      <input
                        type="number"
                        value={formStats.studentsCount}
                        onChange={(e) => handleDeptNumberChange('studentsCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        طلبة طور الليسانس
                      </label>
                      <input
                        type="number"
                        value={formStats.studentsLicence ?? Math.round(formStats.studentsCount * 0.65)}
                        onChange={(e) => handleDeptNumberChange('studentsLicence', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        طلبة طور الماستر
                      </label>
                      <input
                        type="number"
                        value={formStats.studentsMaster ?? Math.round(formStats.studentsCount * 0.3)}
                        onChange={(e) => handleDeptNumberChange('studentsMaster', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        طلبة الدكتوراه والبحث
                      </label>
                      <input
                        type="number"
                        value={formStats.studentsDoctorat ?? Math.round(formStats.studentsCount * 0.05)}
                        onChange={(e) => handleDeptNumberChange('studentsDoctorat', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Teachers Faculty Group */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-xs">
                    <GraduationCap className="w-4 h-4 text-sky-600" />
                    <span>هيئة التدريس والأساتذة الباحثين بالقسم</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        إجمالي الأساتذة الدائمين
                      </label>
                      <input
                        type="number"
                        value={formStats.teachersCount}
                        onChange={(e) => handleDeptNumberChange('teachersCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        أساتذة تعليم عالي (Professeurs)
                      </label>
                      <input
                        type="number"
                        value={formStats.professorsCount ?? Math.round(formStats.teachersCount * 0.35)}
                        onChange={(e) => handleDeptNumberChange('professorsCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        أساتذة محاضرون (MC-A / MC-B)
                      </label>
                      <input
                        type="number"
                        value={formStats.docentsCount ?? Math.round(formStats.teachersCount * 0.65)}
                        onChange={(e) => handleDeptNumberChange('docentsCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Academic Success & Attendance Rates */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-xs">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>مؤشرات ونسب النجاح والحضور (%)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        نسبة النجاح السداسي الأول S1 (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="100"
                        min="0"
                        value={formStats.successRateS1}
                        onChange={(e) => handleDeptNumberChange('successRateS1', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        نسبة النجاح السداسي الثاني S2 (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="100"
                        min="0"
                        value={formStats.successRateS2 ?? 80.0}
                        onChange={(e) => handleDeptNumberChange('successRateS2', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        نسبة حضور TD (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="100"
                        min="0"
                        value={formStats.tdAttendanceRate}
                        onChange={(e) => handleDeptNumberChange('tdAttendanceRate', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        نسبة حضور المخابر TP (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="100"
                        min="0"
                        value={formStats.tpAttendanceRate}
                        onChange={(e) => handleDeptNumberChange('tpAttendanceRate', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Infrastructure & Formations */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-xs">
                    <FlaskConical className="w-4 h-4 text-teal-600" />
                    <span>المخابر، التخصصات، وقاعات التدريس</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        عدد التخصصات المفتوحة
                      </label>
                      <input
                        type="number"
                        value={formStats.specialtiesCount}
                        onChange={(e) => handleDeptNumberChange('specialtiesCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        عدد المخابر البيداغوجية والبحثية
                      </label>
                      <input
                        type="number"
                        value={formStats.laboratoriesCount}
                        onChange={(e) => handleDeptNumberChange('laboratoriesCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        عدد مذكرات ومشاريع التخرج (PFE)
                      </label>
                      <input
                        type="number"
                        value={formStats.pfeCount}
                        onChange={(e) => handleDeptNumberChange('pfeCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        قاعات التدريس المخصصة
                      </label>
                      <input
                        type="number"
                        value={formStats.classroomsCount ?? 12}
                        onChange={(e) => handleDeptNumberChange('classroomsCount', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Official Notes & Endorsement */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ملاحظة بيداغوجية رسمية أو قرار اعتماد:
                  </label>
                  <textarea
                    rows={2}
                    value={formStats.notes || ''}
                    onChange={(e) => setFormStats(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="مثال: تم اعتماد هذه النتائج في اجتماع اللجنة البيداغوجية لقسم الفيزياء لشهر جوان 2026..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500">
                    آخر تحديث: <span className="font-semibold text-slate-700 dark:text-slate-300">{formStats.lastUpdatedDate}</span> بواسطة <span className="font-semibold text-slate-700 dark:text-slate-300">{formStats.lastUpdatedBy}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ واعتماد إحصائيات القسم</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* General Faculty Stats for Super Admin */}
          {activeTab === 'faculty' && isSuperAdmin && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  إحصائيات كلية الرياضيات وعلوم المادة العامة (الإجمالية)
                </h3>
                <p className="text-xs text-slate-500">
                  هذه الأرقام تظهر في واجهة الكلية الرئيسية وشريط المؤشرات العام.
                </p>
              </div>

              <form onSubmit={handleSaveFaculty} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      إجمالي طلبة الكلية (جميع الأقسام)
                    </label>
                    <input
                      type="number"
                      value={formFaculty.totalStudents}
                      onChange={(e) => handleFacultyNumberChange('totalStudents', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      إجمالي الأساتذة المؤطرين
                    </label>
                    <input
                      type="number"
                      value={formFaculty.totalTeachers}
                      onChange={(e) => handleFacultyNumberChange('totalTeachers', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      إجمالي المخابر المعتمدة
                    </label>
                    <input
                      type="number"
                      value={formFaculty.totalLaboratories}
                      onChange={(e) => handleFacultyNumberChange('totalLaboratories', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      إجمالي التخصصات والمسارات
                    </label>
                    <input
                      type="number"
                      value={formFaculty.totalSpecialties}
                      onChange={(e) => handleFacultyNumberChange('totalSpecialties', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نسبة النجاح العامة للكلية (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      max="100"
                      min="0"
                      value={formFaculty.overallSuccessRate}
                      onChange={(e) => handleFacultyNumberChange('overallSuccessRate', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ إحصائيات الكلية العامة</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
