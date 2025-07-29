// Validaciones centralizadas para el módulo de materias
import { SYSTEM_LIMITS, JOURNEY_OPTIONS, USER_ROLES } from './selectOptions';

// Validaciones para crear materia
export const validateSubjectForm = (formData) => {
    const errors = {};

    // Validar nombre de materia
    if (!formData.name || formData.name.trim().length === 0) {
        errors.name = 'El nombre de la materia es obligatorio';
    } else if (formData.name.trim().length < 3) {
        errors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.trim().length > 150) {
        errors.name = 'El nombre no puede exceder 150 caracteres';
    }

    // Validar semestre
    if (!formData.semester) {
        errors.semester = 'El semestre es obligatorio';
    } else {
        const semesterNum = parseInt(formData.semester, 10);
        if (isNaN(semesterNum) || semesterNum < SYSTEM_LIMITS.MIN_SEMESTER || semesterNum > SYSTEM_LIMITS.MAX_SEMESTER) {
            errors.semester = `El semestre debe estar entre ${SYSTEM_LIMITS.MIN_SEMESTER} y ${SYSTEM_LIMITS.MAX_SEMESTER}`;
        }
    }

    // Validar jornada
    if (!formData.journey) {
        errors.journey = 'La jornada es obligatoria';
    } else {
        const validJourneys = JOURNEY_OPTIONS.map(j => j.value);
        if (!validJourneys.includes(formData.journey)) {
            errors.journey = 'Jornada inválida';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validaciones para asignación de tutor
export const validateTutorAssignment = (tutorData, userRole) => {
    const errors = {};

    // Validar que el usuario sea admin
    if (userRole !== USER_ROLES.ADMIN) {
        errors.permission = 'Solo administradores pueden asignar tutores';
    }

    // Validar que se haya seleccionado un tutor
    if (!tutorData || !tutorData.u_id) {
        errors.tutor = 'Debe seleccionar un tutor';
    }

    // Validar que el tutor tenga el rol correcto
    if (tutorData && tutorData.u_rol !== USER_ROLES.TUTOR) {
        errors.tutorRole = 'El usuario seleccionado no es un tutor';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validaciones para el proceso completo
export const validateCompleteProcess = (subjectData, tutorData, userRole) => {
    const subjectValidation = validateSubjectForm(subjectData);
    const tutorValidation = validateTutorAssignment(tutorData, userRole);

    return {
        isValid: subjectValidation.isValid && tutorValidation.isValid,
        errors: {
            ...subjectValidation.errors,
            ...tutorValidation.errors
        }
    };
};

// Validar datos del payload para crear materia
export const validateCreateSubjectPayload = (payload) => {
    const errors = {};

    if (!payload.subject_name || typeof payload.subject_name !== 'string') {
        errors.subject_name = 'Nombre de materia inválido';
    }

    if (!payload.semester || !Number.isInteger(payload.semester)) {
        errors.semester = 'Semestre inválido';
    }

    if (!payload.journey || typeof payload.journey !== 'string') {
        errors.journey = 'Jornada inválida';
    }

    if (payload.created_by_role !== USER_ROLES.ADMIN) {
        errors.created_by_role = 'Rol insuficiente para crear materia';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validar datos del payload para asignar materia
export const validateAssignSubjectPayload = (payload) => {
    const errors = {};

    if (!payload.user_id || !Number.isInteger(payload.user_id)) {
        errors.user_id = 'ID de usuario inválido';
    }

    if (!payload.subject_id || !Number.isInteger(payload.subject_id)) {
        errors.subject_id = 'ID de materia inválido';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validar parámetros para listar usuarios
export const validateListUsersParams = (adminId, mode) => {
    const errors = {};

    if (!adminId || !Number.isInteger(adminId)) {
        errors.adminId = 'ID de administrador inválido';
    }

    const validModes = ['todos', 'tutores', 'estudiantes'];
    if (!mode || !validModes.includes(mode)) {
        errors.mode = 'Modo de listado inválido';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Función helper para limpiar y preparar datos del formulario
export const sanitizeSubjectFormData = (formData) => {
    return {
        name: formData.name?.trim() || '',
        semester: formData.semester?.toString() || '',
        journey: formData.journey || '',
        tutor: formData.tutor || null
    };
};

// Función helper para verificar si se puede proceder con el proceso
export const canProceedWithProcess = (formData, step = 'create') => {
    const sanitized = sanitizeSubjectFormData(formData);
    const validation = validateSubjectForm(sanitized);

    if (step === 'create') {
        return validation.isValid;
    }

    if (step === 'assign') {
        return validation.isValid && sanitized.tutor !== null;
    }

    return false;
};