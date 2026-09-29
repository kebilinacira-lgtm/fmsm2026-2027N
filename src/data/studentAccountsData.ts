import { DepartmentId } from '../types';
import { APPROVED_STUDENTS_LIST, verifyStudentMatricule } from './approvedStudentsData';

export interface RegisteredStudent {
  id: string;
  matricule: string;
  matriculeBac?: string;
  name: string;
  email: string;
  password: string;
  departmentId: DepartmentId;
  specialty: string;
  level: string;
  group: string;
  avatar?: string;
  registeredAt: string;
  isVerified: boolean;
}

// Initial students populated from approved list
export const INITIAL_REGISTERED_STUDENTS: RegisteredStudent[] = APPROVED_STUDENTS_LIST.slice(0, 8).map((st, idx) => ({
  id: `etu-init-${idx + 1}`,
  matricule: st.matriculeEtudiant,
  matriculeBac: st.matriculeBac,
  name: `${st.nomAr} ${st.prenomAr}`,
  email: `${st.prenomFr.toLowerCase()}.${st.nomFr.toLowerCase()}@etu.univ-ouargla.dz`,
  password: '123',
  departmentId: st.departmentId,
  specialty: st.specialty,
  level: `${st.level} - ${st.specialty}`,
  group: 'فوج 01',
  registeredAt: '2026-09-01',
  isVerified: true,
  avatar: `https://images.unsplash.com/photo-${1535713875002 + idx}?w=150&auto=format&fit=crop&q=80`
}));

const STUDENTS_STORAGE_KEY = 'fmsm_registered_students_database';
const SECURITY_MODE_KEY = 'fmsm_strict_security_mode';

// Load students from localStorage or defaults
export function loadRegisteredStudents(): RegisteredStudent[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_STUDENTS));
      return INITIAL_REGISTERED_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REGISTERED_STUDENTS;
  } catch {
    return INITIAL_REGISTERED_STUDENTS;
  }
}

// Save students
export function saveRegisteredStudents(students: RegisteredStudent[]): void {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students:', err);
  }
}

// Check if strict security mode is enabled (default true: only registered users with valid passwords can log in)
export function isStrictSecurityMode(): boolean {
  try {
    const val = localStorage.getItem(SECURITY_MODE_KEY);
    // If null, default to true for maximum safety
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setStrictSecurityMode(enabled: boolean): void {
  try {
    localStorage.setItem(SECURITY_MODE_KEY, String(enabled));
  } catch {}
}

// Register a new student
export function registerNewStudent(data: Omit<RegisteredStudent, 'id' | 'registeredAt' | 'isVerified'>): {
  success: boolean;
  message: string;
  student?: RegisteredStudent;
  isVisitor?: boolean;
} {
  const cleanMatricule = data.matricule.trim();

  // Strict check against approved students registry
  const verification = verifyStudentMatricule(cleanMatricule);
  if (!verification.isVerified || !verification.student) {
    return {
      success: false,
      isVisitor: true,
      message: 'رقم التسجيل غير موجود في السجل الرسمي لطلبة كلية الرياضيات وعلوم المادة لهذا العام. أنت زائر غير مسجل ولا يمكنك إنشاء حساب طالب رسمي.'
    };
  }

  const students = loadRegisteredStudents();
  
  // Check if matricule already exists
  const existing = students.find(s => 
    s.matricule.toLowerCase() === cleanMatricule.toLowerCase() ||
    (s.matriculeBac && s.matriculeBac.toLowerCase() === cleanMatricule.toLowerCase())
  );
  if (existing) {
    return {
      success: false,
      message: `رقم التسجيل الجامعي (${cleanMatricule}) مسجل مسبقاً في قاعدة بيانات الكلية باسم: ${existing.name}. يرجى تسجيل الدخول مباشرة بكلمة المرور الخاصة بك.`
    };
  }

  const approved = verification.student;
  const newStudent: RegisteredStudent = {
    id: `etu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    matricule: approved.matriculeEtudiant,
    matriculeBac: approved.matriculeBac,
    name: `${approved.nomAr} ${approved.prenomAr}`,
    email: data.email.trim().toLowerCase() || `${approved.prenomFr.toLowerCase()}.${approved.nomFr.toLowerCase()}@etu.univ-ouargla.dz`,
    password: data.password.trim(),
    departmentId: approved.departmentId,
    specialty: approved.specialty,
    level: `${approved.level} - ${approved.specialty}`,
    group: data.group.trim() || 'فوج 01',
    registeredAt: new Date().toISOString().split('T')[0],
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };

  const updated = [newStudent, ...students];
  saveRegisteredStudents(updated);

  return {
    success: true,
    message: `تم التحقق من رقم التسجيل بنجاح للطالب(ة) ${newStudent.name} وتم تفعيل الحساب الرسمي في ${approved.departmentNameAr}.`,
    student: newStudent
  };
}

// Validate student login
export function authenticateStudent(identifier: string, pass: string): {
  success: boolean;
  message: string;
  student?: RegisteredStudent;
  isVisitor?: boolean;
} {
  const trimmed = identifier.trim().toLowerCase();
  const trimmedPass = pass.trim();

  // 1. First Verify against official approved students list (The Array of registered matricules)
  const verification = verifyStudentMatricule(trimmed);
  if (!verification.isVerified || !verification.student) {
    return {
      success: false,
      isVisitor: true,
      message: 'خطأ في الدخول: رقم التسجيل غير موجود في السجل الرسمي لطلبة كلية الرياضيات وعلوم المادة لهذا العام الجامعي. أنت زائر غير مسجل ولا يمكنك الدخول كطالب نظامي.'
    };
  }

  const approved = verification.student;
  const students = loadRegisteredStudents();

  // Find if student has already initialized their credentials in the system
  let student = students.find(s => 
    s.matricule.toLowerCase() === approved.matriculeEtudiant.toLowerCase() || 
    (s.matriculeBac && s.matriculeBac.toLowerCase() === approved.matriculeBac.toLowerCase()) ||
    s.email.toLowerCase() === trimmed
  );

  // If first time accessing, auto-provision their verified student record
  if (!student) {
    student = {
      id: `etu-reg-${approved.matriculeEtudiant}`,
      matricule: approved.matriculeEtudiant,
      matriculeBac: approved.matriculeBac,
      name: `${approved.nomAr} ${approved.prenomAr}`,
      email: `${approved.prenomFr.toLowerCase()}.${approved.nomFr.toLowerCase()}@etu.univ-ouargla.dz`,
      password: trimmedPass || '123',
      departmentId: approved.departmentId,
      specialty: approved.specialty,
      level: `${approved.level} - ${approved.specialty}`,
      group: 'فوج 01',
      registeredAt: new Date().toISOString().split('T')[0],
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    saveRegisteredStudents([student, ...students]);
  } else {
    // If student has a password set and entered a password, check it
    if (student.password && trimmedPass && student.password !== trimmedPass && student.password !== '123') {
      return {
        success: false,
        message: 'كلمة المرور غير صحيحة لرقم التسجيل المدخل. كلمة المرور الافتراضية للطلبة الجدد هي 123 ما لم يتم تغييرها.'
      };
    }
  }

  return {
    success: true,
    message: `مرحباً بك الطالب(ة) ${student.name}، تم التحقق من رقم تسجيلك بنجاح في ${approved.departmentNameAr}.`,
    student
  };
}
