import { DepartmentId, DepartmentInfo, ModuleItem } from '../types';
import { DEPARTMENTS as INITIAL_DEPARTMENTS, MODULES_DATABASE as INITIAL_MODULES } from './facultyData';

const DEPARTMENTS_STORAGE_KEY = 'fmsm_custom_departments_v2';
const MODULES_STORAGE_KEY = 'fmsm_custom_modules_v2';

/**
 * Loads departments data with any custom updates made by Department Heads or Super Admins.
 */
export function loadCustomDepartments(): Record<string, DepartmentInfo> {
  try {
    const saved = localStorage.getItem(DEPARTMENTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        // Deep merge with initial to ensure no missing defaults
        return {
          ...INITIAL_DEPARTMENTS,
          ...parsed
        };
      }
    }
  } catch (err) {
    console.error('Failed to load custom departments from storage', err);
  }
  return { ...INITIAL_DEPARTMENTS };
}

/**
 * Saves updated departments dictionary to localStorage.
 */
export function saveCustomDepartments(depts: Record<string, DepartmentInfo>): void {
  try {
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(depts));
    window.dispatchEvent(new CustomEvent('fmsm-departments-updated', { detail: depts }));
  } catch (err) {
    console.error('Failed to save custom departments to storage', err);
  }
}

/**
 * Updates a single department's general presentation, head word, contact, etc.
 */
export function updateDepartmentGeneralInfo(
  deptId: DepartmentId,
  updates: Partial<DepartmentInfo> & { headWord?: string }
): Record<string, DepartmentInfo> {
  const current = loadCustomDepartments();
  const existing = current[deptId] || INITIAL_DEPARTMENTS[deptId];
  if (!existing) return current;

  current[deptId] = {
    ...existing,
    ...updates,
    specialties: updates.specialties || existing.specialties,
    labs: updates.labs || existing.labs,
    stats: {
      ...existing.stats,
      ...(updates.stats || {})
    }
  };

  saveCustomDepartments(current);
  return current;
}

/**
 * Adds a new specialty to a department.
 */
export function addDepartmentSpecialty(
  deptId: DepartmentId,
  newSpecialty: {
    cycle: 'Licence' | 'Master' | 'Doctorat';
    nameAr: string;
    nameFr: string;
    description: string;
    duration: string;
  }
): Record<string, DepartmentInfo> {
  const current = loadCustomDepartments();
  const dept = current[deptId];
  if (dept) {
    dept.specialties = [newSpecialty, ...(dept.specialties || [])];
    dept.stats = {
      ...dept.stats,
      specialtiesCount: dept.specialties.length
    };
    saveCustomDepartments(current);
  }
  return current;
}

/**
 * Deletes a specialty from a department by nameAr.
 */
export function deleteDepartmentSpecialty(
  deptId: DepartmentId,
  specialtyNameAr: string
): Record<string, DepartmentInfo> {
  const current = loadCustomDepartments();
  const dept = current[deptId];
  if (dept && dept.specialties) {
    dept.specialties = dept.specialties.filter(s => s.nameAr !== specialtyNameAr);
    dept.stats = {
      ...dept.stats,
      specialtiesCount: dept.specialties.length
    };
    saveCustomDepartments(current);
  }
  return current;
}

/**
 * Adds a new laboratory or research facility to a department.
 */
export function addDepartmentLab(
  deptId: DepartmentId,
  newLab: {
    nameAr: string;
    nameFr: string;
    director: string;
    code: string;
    specialization: string;
  }
): Record<string, DepartmentInfo> {
  const current = loadCustomDepartments();
  const dept = current[deptId];
  if (dept) {
    dept.labs = [newLab, ...(dept.labs || [])];
    dept.stats = {
      ...dept.stats,
      laboratories: dept.labs.length
    };
    saveCustomDepartments(current);
  }
  return current;
}

/**
 * Deletes a laboratory from a department by code or nameAr.
 */
export function deleteDepartmentLab(
  deptId: DepartmentId,
  labCodeOrName: string
): Record<string, DepartmentInfo> {
  const current = loadCustomDepartments();
  const dept = current[deptId];
  if (dept && dept.labs) {
    dept.labs = dept.labs.filter(l => l.code !== labCodeOrName && l.nameAr !== labCodeOrName);
    dept.stats = {
      ...dept.stats,
      laboratories: dept.labs.length
    };
    saveCustomDepartments(current);
  }
  return current;
}

/**
 * Loads custom modules database.
 */
export function loadCustomModules(): ModuleItem[] {
  try {
    const saved = localStorage.getItem(MODULES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load custom modules', err);
  }
  return [...INITIAL_MODULES];
}

/**
 * Saves custom modules database.
 */
export function saveCustomModules(modules: ModuleItem[]): void {
  try {
    localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(modules));
    window.dispatchEvent(new CustomEvent('fmsm-modules-updated', { detail: modules }));
  } catch (err) {
    console.error('Failed to save custom modules', err);
  }
}

/**
 * Adds a new module/course to a department.
 */
export function addDepartmentModule(newModule: ModuleItem): ModuleItem[] {
  const current = loadCustomModules();
  const updated = [newModule, ...current];
  saveCustomModules(updated);
  return updated;
}

/**
 * Deletes a module by ID.
 */
export function deleteDepartmentModule(moduleId: string): ModuleItem[] {
  const current = loadCustomModules();
  const updated = current.filter(m => m.id !== moduleId);
  saveCustomModules(updated);
  return updated;
}
