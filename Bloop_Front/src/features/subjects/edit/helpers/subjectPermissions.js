// Helper para manejar permisos de materias según rol del usuario
// Constantes de roles
export const ROLES = {
    ADMIN: 1,
    TUTOR: 2,
    ESTUDIANTE: 3
};

// Constantes de permisos
export const PERMISSIONS = {
    // Materia
    EDIT_SUBJECT: 'edit_subject',
    VIEW_SUBJECT_DETAILS: 'view_subject_details',

    // PEA
    CREATE_PEA: 'create_pea',
    EDIT_PEA: 'edit_pea',
    VIEW_PEA_FULL: 'view_pea_full',
    VIEW_PEA_STUDENT: 'view_pea_student',

    // Usuarios
    ASSIGN_TUTOR: 'assign_tutor',
    REMOVE_TUTOR: 'remove_tutor',
    ASSIGN_STUDENTS: 'assign_students',
    REMOVE_STUDENTS: 'remove_students',

    // Vista
    VIEW_ACTIVE_SUBJECTS_ONLY: 'view_active_subjects_only'
};

// Verifica si un usuario tiene un permiso específico
export const hasPermission = (userRole, permission) => {
    if (!userRole || !permission) return false;

    const rolePermissions = getRolePermissions(userRole);
    return rolePermissions.includes(permission);
};

// Obtiene todos los permisos de un rol específico
export const getRolePermissions = (userRole) => {
    switch (userRole) {
        case ROLES.ADMIN:
            return [
                PERMISSIONS.EDIT_SUBJECT,
                PERMISSIONS.VIEW_SUBJECT_DETAILS,
                PERMISSIONS.CREATE_PEA,
                PERMISSIONS.EDIT_PEA,
                PERMISSIONS.VIEW_PEA_FULL,
                PERMISSIONS.ASSIGN_TUTOR,
                PERMISSIONS.REMOVE_TUTOR,
                PERMISSIONS.ASSIGN_STUDENTS,
                PERMISSIONS.REMOVE_STUDENTS
            ];

        case ROLES.TUTOR:
            return [
                PERMISSIONS.VIEW_SUBJECT_DETAILS,
                PERMISSIONS.CREATE_PEA,
                PERMISSIONS.EDIT_PEA,
                PERMISSIONS.VIEW_PEA_FULL,
                PERMISSIONS.VIEW_ACTIVE_SUBJECTS_ONLY
            ];

        case ROLES.ESTUDIANTE:
            return [
                PERMISSIONS.VIEW_SUBJECT_DETAILS,
                PERMISSIONS.VIEW_PEA_STUDENT,
                PERMISSIONS.VIEW_ACTIVE_SUBJECTS_ONLY
            ];

        default:
            return [];
    }
};

// Verifica si un usuario puede editar información de materia
export const canEditSubject = (userRole) => {
    return hasPermission(userRole, PERMISSIONS.EDIT_SUBJECT);
};

// Verifica si un usuario puede gestionar PEA (crear/editar)
export const canManagePEA = (userRole) => {
    return hasPermission(userRole, PERMISSIONS.CREATE_PEA) && 
        hasPermission(userRole, PERMISSIONS.EDIT_PEA);
};

// Verifica si un usuario puede ver PEA completo o solo versión estudiante
export const getPEAViewLevel = (userRole) => {
    if (hasPermission(userRole, PERMISSIONS.VIEW_PEA_FULL)) {
        return 'full';
    }
    if (hasPermission(userRole, PERMISSIONS.VIEW_PEA_STUDENT)) {
        return 'student';
    }
    return 'none';
};

// Verifica si un usuario puede gestionar tutores
export const canManageTutors = (userRole) => {
    return hasPermission(userRole, PERMISSIONS.ASSIGN_TUTOR) && 
        hasPermission(userRole, PERMISSIONS.REMOVE_TUTOR);
};

// Verifica si un usuario puede gestionar estudiantes
export const canManageStudents = (userRole) => {
    return hasPermission(userRole, PERMISSIONS.ASSIGN_STUDENTS) && 
        hasPermission(userRole, PERMISSIONS.REMOVE_STUDENTS);
};

// Verifica si un usuario solo puede ver materias activas
export const shouldViewActiveSubjectsOnly = (userRole) => {
    return hasPermission(userRole, PERMISSIONS.VIEW_ACTIVE_SUBJECTS_ONLY);
};

// Obtiene el nombre del rol
export const getRoleName = (roleId) => {
    switch (roleId) {
        case ROLES.ADMIN: return 'Administrador';
        case ROLES.TUTOR: return 'Tutor';
        case ROLES.ESTUDIANTE: return 'Estudiante';
        default: return 'Desconocido';
    }
};

// Verifica múltiples permisos a la vez
export const hasMultiplePermissions = (userRole, permissions, mode = 'all') => {
    if (!Array.isArray(permissions) || permissions.length === 0) return false;

    const checks = permissions.map(permission => hasPermission(userRole, permission));

    if (mode === 'all') {
        return checks.every(check => check === true);
    } else {
        return checks.some(check => check === true);
    }
};

// Obtiene las acciones disponibles para un usuario en el modal
export const getAvailableActions = (userRole) => {
    return {
        canEdit: canEditSubject(userRole),
        canManagePEA: canManagePEA(userRole),
        canManageTutors: canManageTutors(userRole),
        canManageStudents: canManageStudents(userRole),
        peaViewLevel: getPEAViewLevel(userRole),
        viewActiveOnly: shouldViewActiveSubjectsOnly(userRole),
        roleName: getRoleName(userRole)
    };
};