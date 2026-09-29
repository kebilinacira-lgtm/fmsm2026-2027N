import { 
  DepartmentId, 
  DepartmentHeadAccount, 
  DepartmentRealStats, 
  FacultyGeneralRealStats,
  UserProfile 
} from '../types';

// 1. Initial Department Heads Hierarchy Accounts
export const INITIAL_DEPARTMENT_HEADS: DepartmentHeadAccount[] = [
  {
    id: 'head-physics-01',
    departmentId: 'physics',
    name: 'د. رابح بوعنان',
    title: 'رئيس قسم الفيزياء',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'dep.physique@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 102)',
    office: 'الجناح البيداغوجي B - الطابق الأرضي، مكتب 012',
    username: 'head_physics',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedDate: '2023-09-15',
    isActive: true
  },
  {
    id: 'head-chemistry-01',
    departmentId: 'chemistry',
    name: 'د. هادف دراجي',
    title: 'رئيس قسم الكيمياء',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'dep.chimie@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 103)',
    office: 'الجناح البيداغوجي C - الطابق الأول، مكتب 118',
    username: 'head_chemistry',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedDate: '2023-09-15',
    isActive: true
  },
  {
    id: 'head-math-01',
    departmentId: 'math',
    name: 'د. طلاب ابراهيم',
    title: 'رئيس قسم الرياضيات',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'dep.math@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 104)',
    office: 'الجناح البيداغوجي D - الطابق الثاني، مكتب 205',
    username: 'head_math',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedDate: '2024-01-10',
    isActive: true
  },
  {
    id: 'head-sm-01',
    departmentId: 'common_sm',
    name: 'د. بن زاهي يوسف',
    title: 'مسؤول فرع جذع مشترك علوم المادة',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'sm.tc@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 101)',
    office: 'الجناح البيداغوجي A - الطابق الأول، مكتب 104',
    username: 'head_sm',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    assignedDate: '2022-09-10',
    isActive: true
  }
];

// 2. Super Admin Platform Supervisor Account
export const SUPER_ADMIN_ACCOUNT: UserProfile = {
  id: 'usr-super-admin-01',
  name: 'أ. سمير عياشي',
  role: 'super_admin',
  adminRole: 'super_admin',
  adminTitle: 'مشرف المنصة الرقمية العام - مصلحة التمدرس والرقمنة',
  email: 'admin.platform@univ-ouargla.dz',
  phone: '029-71-38-91',
  office: 'الإدارة المركزية للكلية - مكتب الرقمنة والإحصاء 201',
  grade: 'إطار إداري رئيسي',
  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
};

// 3. Initial Department Real Statistics
export const INITIAL_DEPARTMENT_REAL_STATS: Record<DepartmentId, DepartmentRealStats> = {
  physics: {
    departmentId: 'physics',
    studentsCount: 890,
    studentsLicence: 520,
    studentsMaster: 310,
    studentsDoctorat: 60,
    teachersCount: 36,
    professorsCount: 12,
    docentsCount: 24,
    specialtiesCount: 4,
    laboratoriesCount: 8,
    successRateS1: 81.5,
    successRateS2: 84.0,
    tdAttendanceRate: 91.2,
    tpAttendanceRate: 96.5,
    pfeCount: 74,
    classroomsCount: 12,
    lastUpdatedDate: '2026-06-01',
    lastUpdatedBy: 'د. قدوري ناصر (رئيس قسم الفيزياء)',
    notes: 'إحصائيات معتمدة بعد مداولات السداسي الأول للسنة الجامعية 2025/2026.'
  },
  chemistry: {
    departmentId: 'chemistry',
    studentsCount: 860,
    studentsLicence: 510,
    studentsMaster: 290,
    studentsDoctorat: 60,
    teachersCount: 34,
    professorsCount: 14,
    docentsCount: 20,
    specialtiesCount: 4,
    laboratoriesCount: 9,
    successRateS1: 82.1,
    successRateS2: 85.4,
    tdAttendanceRate: 92.4,
    tpAttendanceRate: 97.8,
    pfeCount: 68,
    classroomsCount: 14,
    lastUpdatedDate: '2026-06-02',
    lastUpdatedBy: 'د. عماري عبد القادر (رئيس قسم الكيمياء)',
    notes: 'أعلى نسبة حضور في الأشغال التطبيقية للطورين الأول والثاني.'
  },
  math: {
    departmentId: 'math',
    studentsCount: 720,
    studentsLicence: 450,
    studentsMaster: 220,
    studentsDoctorat: 50,
    teachersCount: 33,
    professorsCount: 10,
    docentsCount: 23,
    specialtiesCount: 4,
    laboratoriesCount: 4,
    successRateS1: 76.8,
    successRateS2: 79.5,
    tdAttendanceRate: 89.6,
    tpAttendanceRate: 94.2,
    pfeCount: 56,
    classroomsCount: 10,
    lastUpdatedDate: '2026-06-01',
    lastUpdatedBy: 'د. العيد بن سالم (رئيس قسم الرياضيات)',
    notes: 'ارتفاع الإقبال على تخصص الرياضيات المطبقة للذكاء الاصطناعي بنسبة 25%.'
  },
  common_sm: {
    departmentId: 'common_sm',
    studentsCount: 980,
    studentsLicence: 980,
    studentsMaster: 0,
    studentsDoctorat: 0,
    teachersCount: 42,
    professorsCount: 12,
    docentsCount: 30,
    specialtiesCount: 1,
    laboratoriesCount: 6,
    successRateS1: 73.2,
    successRateS2: 75.0,
    tdAttendanceRate: 92.0,
    tpAttendanceRate: 98.6,
    pfeCount: 0,
    classroomsCount: 16,
    lastUpdatedDate: '2026-06-03',
    lastUpdatedBy: 'د. زرقان محمد (مسؤول الجذع المشترك SM)',
    notes: 'توزيع الطلبة على 18 فوج أعمال موجهة و12 قاعة أشغال تطبيقية كيمياء وفيزياء.'
  }
};

// 4. Initial Faculty General Statistics
export const INITIAL_FACULTY_REAL_STATS: FacultyGeneralRealStats = {
  totalStudents: 3450,
  totalTeachers: 116,
  totalLaboratories: 27,
  totalSpecialties: 14,
  overallSuccessRate: 78.4,
  lastUpdatedDate: '2026-06-05',
  lastUpdatedBy: 'مشرف المنصة العام (أ. سمير عياشي)'
};

// Storage Keys
const STORAGE_DEPT_STATS_KEY = 'fmsm_department_real_stats_v2';
const STORAGE_FACULTY_STATS_KEY = 'fmsm_faculty_general_stats_v2';
const STORAGE_DEPT_HEADS_KEY = 'fmsm_department_heads_accounts_v2';

// Helpers to load and save
export function loadSavedDepartmentStats(): Record<DepartmentId, DepartmentRealStats> {
  try {
    const raw = localStorage.getItem(STORAGE_DEPT_STATS_KEY);
    if (!raw) return INITIAL_DEPARTMENT_REAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DEPARTMENT_REAL_STATS,
      ...parsed
    };
  } catch (err) {
    console.error('Failed to load department stats from localStorage', err);
    return INITIAL_DEPARTMENT_REAL_STATS;
  }
}

export function saveDepartmentStats(stats: Record<DepartmentId, DepartmentRealStats>): void {
  try {
    localStorage.setItem(STORAGE_DEPT_STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save department stats to localStorage', err);
  }
}

export function loadSavedFacultyStats(): FacultyGeneralRealStats {
  try {
    const raw = localStorage.getItem(STORAGE_FACULTY_STATS_KEY);
    if (!raw) return INITIAL_FACULTY_REAL_STATS;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load faculty stats from localStorage', err);
    return INITIAL_FACULTY_REAL_STATS;
  }
}

export function saveFacultyStats(stats: FacultyGeneralRealStats): void {
  try {
    localStorage.setItem(STORAGE_FACULTY_STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save faculty stats to localStorage', err);
  }
}

export function loadSavedDepartmentHeads(): DepartmentHeadAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_DEPT_HEADS_KEY);
    if (!raw) return INITIAL_DEPARTMENT_HEADS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEPARTMENT_HEADS;
  } catch (err) {
    console.error('Failed to load department heads accounts from localStorage', err);
    return INITIAL_DEPARTMENT_HEADS;
  }
}

export function saveDepartmentHeads(heads: DepartmentHeadAccount[]): void {
  try {
    localStorage.setItem(STORAGE_DEPT_HEADS_KEY, JSON.stringify(heads));
  } catch (err) {
    console.error('Failed to save department heads accounts to localStorage', err);
  }
}

export function resetAllStatsToDefault(): {
  deptStats: Record<DepartmentId, DepartmentRealStats>;
  facultyStats: FacultyGeneralRealStats;
  deptHeads: DepartmentHeadAccount[];
} {
  try {
    localStorage.removeItem(STORAGE_DEPT_STATS_KEY);
    localStorage.removeItem(STORAGE_FACULTY_STATS_KEY);
    localStorage.removeItem(STORAGE_DEPT_HEADS_KEY);
  } catch (e) {
    console.warn(e);
  }
  return {
    deptStats: INITIAL_DEPARTMENT_REAL_STATS,
    facultyStats: INITIAL_FACULTY_REAL_STATS,
    deptHeads: INITIAL_DEPARTMENT_HEADS
  };
}
