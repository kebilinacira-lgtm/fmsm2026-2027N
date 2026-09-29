export type DepartmentId = 'physics' | 'chemistry' | 'math' | 'common_sm';

export type UserRole = 'guest' | 'student' | 'teacher' | 'admin' | 'dept_head' | 'super_admin';

export type AppLanguage = 'ar' | 'fr' | 'en';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  matricule?: string;
  departmentId?: DepartmentId;
  specialty?: string;
  level?: string;
  grade?: string; // For teacher / dept head: e.g., أستاذ محاضر "أ"
  office?: string;
  phone?: string;
  avatar?: string;
  adminTitle?: string;
  adminRole?: 'super_admin' | 'dept_head';
}

export interface DepartmentRealStats {
  departmentId: DepartmentId;
  studentsCount: number;
  studentsLicence?: number;
  studentsMaster?: number;
  studentsDoctorat?: number;
  teachersCount: number;
  professorsCount?: number;
  docentsCount?: number;
  specialtiesCount: number;
  laboratoriesCount: number;
  successRateS1: number;
  successRateS2: number;
  tdAttendanceRate: number;
  tpAttendanceRate: number;
  pfeCount: number;
  classroomsCount?: number;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  notes?: string;
}

export interface FacultyGeneralRealStats {
  totalStudents: number;
  totalTeachers: number;
  totalLaboratories: number;
  totalSpecialties: number;
  overallSuccessRate: number;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
}

export interface DepartmentHeadAccount {
  id: string;
  departmentId: DepartmentId;
  name: string;
  title: string;
  grade: string;
  email: string;
  phone: string;
  office: string;
  username: string;
  password?: string;
  avatar?: string;
  assignedDate: string;
  isActive: boolean;
}

export interface AdministratorAccount {
  id: string;
  username: string;
  password: string; // Dynamic password with freedom to update
  name: string;
  role: 'super_admin' | 'dept_head';
  departmentId?: DepartmentId; // Set if dept_head
  title: string;
  grade: string;
  email: string;
  phone: string;
  office: string;
  avatar?: string;
  lastLogin?: string;
  updatedAt?: string;
  notes?: string;
}

export interface FacultyTeacher {
  id: string;
  name: string;
  grade: 'أستاذ التعليم العالي (Professeur)' | 'أستاذ محاضر "أ" (MCA)' | 'أستاذ محاضر "ب" (MCB)' | 'أستاذ مساعد "أ" (MAA)' | 'أستاذ مساعد "ب" (MAB)';
  departmentId: DepartmentId;
  email: string;
  phoneExtension?: string;
  office: string;
  modules: string[]; // e.g. ['فيزياء 1', 'ميكانيكا الكم']
  receptionHours: {
    day: string; // e.g. 'الأحد'
    time: string; // e.g. '10:00 - 12:00'
    location?: string;
  }[];
  laboratory?: string;
  specialty: string;
  avatar?: string;
  bio?: string;
  isAcceptingInquiries: boolean;
}

export interface PedagogicalInquiry {
  id: string;
  trackingCode: string;
  studentName: string;
  matricule: string;
  studentEmail: string;
  departmentId: DepartmentId;
  targetTeacherId?: string; // If null/empty -> sent to Department Head
  targetTeacherName: string;
  moduleName?: string;
  subject: string;
  question: string;
  dateSubmitted: string;
  status: 'قيد المراجعة' | 'تمت الإجابة' | 'مؤرشف';
  replyContent?: string;
  replyAuthor?: string;
  replyDate?: string;
}

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: 'super_admin' | 'dept_head';
  departmentId?: DepartmentId;
  actionType: 'login' | 'password_change' | 'head_reassigned' | 'announcement_created' | 'resource_uploaded' | 'inquiry_replied' | 'stats_updated';
  description: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp?: number;
}

export interface StudentAbsence {
  id: string;
  matricule: string;
  studentName: string;
  moduleCode: string;
  moduleName: string;
  departmentId: DepartmentId;
  totalHours: number;
  unjustifiedCount: number;
  justifiedCount: number;
  threshold: number; // max allowed before exclusion alert (e.g., 3)
  lastAbsenceDate: string;
  status: 'طبيعي' | 'إنذار أول' | 'خطر الإقصاء';
}

export interface StudentMessage {
  id: string;
  senderMatricule: string;
  senderName: string;
  recipientType: 'administration' | 'teacher';
  recipientName: string;
  subject: string;
  content: string;
  date: string;
  status: 'قيد الانتظار' | 'تم الرد';
  reply?: string;
}

export interface DepartmentInfo {
  id: DepartmentId;
  nameAr: string;
  nameFr: string;
  shortCode: string;
  headName: string;
  headTitle: string;
  headEmail: string;
  office: string;
  description: string;
  specialties: {
    cycle: 'Licence' | 'Master' | 'Doctorat';
    nameAr: string;
    nameFr: string;
    description: string;
    duration: string;
  }[];
  labs: {
    nameAr: string;
    nameFr: string;
    director: string;
    code: string;
    specialization: string;
  }[];
  stats: {
    students: number;
    teachers: number;
    specialtiesCount: number;
    laboratories: number;
  };
  colorTheme: string;
  officialPortalUrl?: string;
}

export interface ModuleItem {
  id: string;
  code: string;
  nameAr: string;
  nameFr: string;
  departmentId: DepartmentId;
  level: string; // e.g., 'L1 SM - S1', 'L1 SM - S2', 'L2 Physique - S3', 'L3 Chimie - S5', 'M1 Math - S1'
  unitType: 'fondamentale' | 'methodologique' | 'decouverte' | 'transversale';
  coefficient: number;
  credits: number;
  hasTD: boolean;
  hasTP: boolean;
  hoursLecture: number;
  hoursTD: number;
  hoursTP: number;
  responsibleTeacher: string;
  description: string;
}

export interface CourseResource {
  id: string;
  title: string;
  moduleCode: string;
  moduleName: string;
  departmentId: DepartmentId;
  level: string;
  type: 'cours' | 'td' | 'tp' | 'exam_correction' | 'resume';
  teacherName: string;
  academicYear: string;
  fileSize: string;
  fileFormat: 'PDF' | 'ZIP' | 'DOCX' | string;
  uploadDate: string;
  downloadsCount: number;
  description?: string;
  downloadUrl?: string;
  fileDataUrl?: string;
  isOfficialDeptHeadFile?: boolean;
  deptHeadTitle?: string;
}

export interface Announcement {
  id: string;
  title: string;
  departmentId: DepartmentId | 'all';
  targetAudience: 'all' | 'students' | 'teachers';
  category: 'exams' | 'pedagogical' | 'administrative' | 'scientific' | 'deliberations';
  date: string;
  isPinned: boolean;
  content: string;
  author: string;
  attachmentName?: string;
  sourceUrl?: string;
  isFromOfficialWebsite?: boolean;
  originalPostDate?: string;
}

export interface ScheduleSession {
  id: string;
  departmentId: DepartmentId;
  level: string;
  group: string;
  day: 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  timeSlot: '08:00 - 09:30' | '09:40 - 11:10' | '11:20 - 12:50' | '13:00 - 14:30' | '14:40 - 16:10';
  moduleName: string;
  type: 'محاضرة' | 'أعمال موجهة (TD)' | 'أعمال تطبيقية (TP)';
  room: string;
  teacher: string;
}

export interface GradeEntry {
  id: string;
  matricule: string;
  studentName: string;
  departmentId: DepartmentId;
  level: string;
  group: string;
  moduleCode: string;
  moduleName: string;
  ccGrade?: number;
  tpGrade?: number;
  examGrade?: number;
  finalGrade?: number;
  session: 'عادية' | 'استدراكية';
  isDeliberated: boolean;
}

export interface StudentAdministrativeRequest {
  id: string;
  trackingCode: string;
  studentName: string;
  matricule: string;
  departmentId: DepartmentId;
  level: string;
  requestType: 
    | 'certificat_scolarite' 
    | 'releve_de_notes' 
    | 'conge_academique' 
    | 'changement_groupe' 
    | 'reintegration' 
    | 'carte_etudiant' 
    | 'recours_note';
  dateSubmitted: string;
  status: 'قيد المعالجة' | 'مقبول وجاهز للاستلام' | 'مرفوض' | 'تمت المعالجة';
  notes?: string;
  moduleForRecourse?: string;
  reason?: string;
}

export interface TeacherAdministrativeRequest {
  id: string;
  trackingCode: string;
  teacherName: string;
  grade: string;
  departmentId: DepartmentId;
  requestType: 
    | 'attestation_travail' 
    | 'autorisation_absence' 
    | 'stage_court_duree' 
    | 'reservation_labo' 
    | 'ordre_mission' 
    | 'titularisation';
  dateSubmitted: string;
  status: 'قيد المعالجة' | 'موافق عليه' | 'مرفوض';
  details: string;
}

export interface PFESubject {
  id: string;
  title: string;
  departmentId: DepartmentId;
  level: 'Master 2' | 'Licence 3';
  specialty: string;
  supervisor: string;
  coSupervisor?: string;
  laboratory: string;
  description: string;
  maxStudents: number;
  enrolledStudents: string[];
  status: 'متاح للتسجيل' | 'مكتمل' | 'قيد المناقشة';
  defenseDate?: string;
}

export interface ChemicalElement {
  number: number;
  symbol: string;
  nameAr: string;
  nameFr: string;
  atomicMass: number;
  category: string;
  electronConfig: string;
  period: number;
  group: number;
  summary: string;
}

export interface PhysicalConstant {
  nameAr: string;
  nameFr: string;
  symbol: string;
  value: string;
  unit: string;
  category: 'ثوابت عامة' | 'الكهرومغناطيسية' | 'الذرية والنووية' | 'الديناميكا الحرارية';
}

export interface OfficialFacultyLink {
  id: string;
  titleAr: string;
  titleFr: string;
  category: 'department' | 'cycles' | 'admin_service' | 'documentation';
  categoryAr: string;
  url: string;
  descriptionAr: string;
  badge?: string;
  iconName: 'library' | 'admin' | 'sndl' | 'dspace' | 'grievance' | 'chemistry' | 'physics' | 'math' | 'common' | 'graduation' | 'postgrad';
  accentColor: string;
}
