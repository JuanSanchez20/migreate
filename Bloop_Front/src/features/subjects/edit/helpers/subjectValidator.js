// src/features/subjects/helpers/subjectValidations.js

// Helper para validaciones de datos de materias

// Constantes de validación
export const VALIDATION_LIMITS = {
    SUBJECT_NAME_MIN: 3,
    SUBJECT_NAME_MAX: 50,
    DESCRIPTION_MIN: 10,
    DESCRIPTION_MAX: 1000,
    OBJECTIVE_MIN: 10,
    OBJECTIVE_MAX: 500,
    SEMESTER_MIN: 1,
    SEMESTER_MAX: 5,
    MAX_STUDENTS_CURSANDO: 2,
    CONCEPT_NAME_MAX: 100
};

export const VALID_JOURNEYS = ['matutina', 'nocturna'];
export const VALID_STUDENT_STATES = ['Aprobado', 'Repitiendo', 'Cursando'];

// Valida los datos básicos de una materia
export const validateSubjectData = (data) => {
    const errors = {};

    // Validar nombre
    if (!data.name || typeof data.name !== 'string') {
        errors.name = 'El nombre de la materia es requerido';
    } else {
        const trimmedName = data.name.trim();
        if (trimmedName.length < VALIDATION_LIMITS.SUBJECT_NAME_MIN) {
            errors.name = `El nombre debe tener al menos ${VALIDATION_LIMITS.SUBJECT_NAME_MIN} caracteres`;
        } else if (trimmedName.length > VALIDATION_LIMITS.SUBJECT_NAME_MAX) {
            errors.name = `El nombre no puede exceder ${VALIDATION_LIMITS.SUBJECT_NAME_MAX} caracteres`;
        }
    }

    // Validar semestre
    if (!data.semester || !Number.isInteger(data.semester)) {
        errors.semester = 'El semestre es requerido y debe ser un número entero';
    } else if (data.semester < VALIDATION_LIMITS.SEMESTER_MIN || data.semester > VALIDATION_LIMITS.SEMESTER_MAX) {
        errors.semester = `El semestre debe estar entre ${VALIDATION_LIMITS.SEMESTER_MIN} y ${VALIDATION_LIMITS.SEMESTER_MAX}`;
    }

    // Validar jornada
    if (!data.journey || typeof data.journey !== 'string') {
        errors.journey = 'La jornada es requerida';
    } else if (!VALID_JOURNEYS.includes(data.journey.toLowerCase())) {
        errors.journey = 'La jornada debe ser matutina o nocturna';
    }

    // Validar estado
    if (data.state === undefined || data.state === null) {
        errors.state = 'El estado es requerido';
    } else if (typeof data.state !== 'boolean') {
        errors.state = 'El estado debe ser verdadero o falso';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Valida los datos del PEA
export const validatePEAData = (data) => {
    const errors = {};

    // Validar descripción
    if (!data.description || typeof data.description !== 'string') {
        errors.description = 'La descripción es requerida';
    } else {
        const trimmed = data.description.trim();
        if (trimmed.length < VALIDATION_LIMITS.DESCRIPTION_MIN) {
            errors.description = `La descripción debe tener al menos ${VALIDATION_LIMITS.DESCRIPTION_MIN} caracteres`;
        } else if (trimmed.length > VALIDATION_LIMITS.DESCRIPTION_MAX) {
            errors.description = `La descripción no puede exceder ${VALIDATION_LIMITS.DESCRIPTION_MAX} caracteres`;
        }
    }

    // Validar objetivo
    if (!data.objective || typeof data.objective !== 'string') {
        errors.objective = 'El objetivo es requerido';
    } else {
        const trimmed = data.objective.trim();
        if (trimmed.length < VALIDATION_LIMITS.OBJECTIVE_MIN) {
            errors.objective = `El objetivo debe tener al menos ${VALIDATION_LIMITS.OBJECTIVE_MIN} caracteres`;
        } else if (trimmed.length > VALIDATION_LIMITS.OBJECTIVE_MAX) {
            errors.objective = `El objetivo no puede exceder ${VALIDATION_LIMITS.OBJECTIVE_MAX} caracteres`;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Valida la asignación de estudiantes
export const validateStudentAssignment = (students, subject) => {
    const errors = [];

    if (!Array.isArray(students) || students.length === 0) {
        errors.push('Debe seleccionar al menos un estudiante');
        return { isValid: false, errors };
    }

    const subjectSemester = parseInt(subject.semestre);
    
    students.forEach((student, index) => {
        // Validar estructura del estudiante
        if (!student.studentId || !student.state || !student.studentName) {
            errors.push(`Estudiante ${index + 1}: Datos incompletos`);
            return;
        }

        // Validar estado
        if (!VALID_STUDENT_STATES.includes(student.state)) {
            errors.push(`${student.studentName}: Estado inválido (${student.state})`);
        }

        // Validar lógica de semestre
        const studentSemester = parseInt(student.semester || 1);
        
        if (student.state === 'Cursando' && studentSemester !== subjectSemester) {
            errors.push(`${student.studentName}: Solo estudiantes del ${subjectSemester}° semestre pueden cursar`);
        }

        if (student.state === 'Repitiendo' && studentSemester <= subjectSemester) {
            errors.push(`${student.studentName}: Solo estudiantes de semestres superiores pueden repetir`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Valida la asignación de tutor
export const validateTutorAssignment = (tutorId, currentTutor) => {
    const errors = [];

    if (!tutorId || !Number.isInteger(tutorId) || tutorId <= 0) {
        errors.push('Debe seleccionar un tutor válido');
    }

    if (currentTutor && currentTutor.id === tutorId) {
        errors.push('El tutor seleccionado ya está asignado a esta materia');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Valida conceptos clave del PEA
export const validateKeyConcepts = (concepts) => {
    const errors = [];

    if (!Array.isArray(concepts) || concepts.length === 0) {
        errors.push('Debe incluir al menos un concepto clave');
        return { isValid: false, errors };
    }

    const unitCounts = { 1: 0, 2: 0, 3: 0 };

    concepts.forEach((concept, index) => {
        // Validar estructura
        if (!concept.kc_unit || !concept.kc_name) {
            errors.push(`Concepto ${index + 1}: Unidad y nombre son requeridos`);
            return;
        }

        // Validar unidad
        if (![1, 2, 3].includes(concept.kc_unit)) {
            errors.push(`Concepto ${index + 1}: La unidad debe ser 1, 2 o 3`);
            return;
        }

        unitCounts[concept.kc_unit]++;

        // Validar nombre
        if (typeof concept.kc_name !== 'string' || concept.kc_name.trim() === '') {
            errors.push(`Concepto ${index + 1}: El nombre no puede estar vacío`);
        } else if (concept.kc_name.length > VALIDATION_LIMITS.CONCEPT_NAME_MAX) {
            errors.push(`Concepto ${index + 1}: El nombre no puede exceder ${VALIDATION_LIMITS.CONCEPT_NAME_MAX} caracteres`);
        }
    });

    // Validar que hay conceptos para las 3 unidades
    [1, 2, 3].forEach(unit => {
        if (unitCounts[unit] === 0) {
            errors.push(`Debe incluir al menos un concepto para la unidad ${unit}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Valida archivo PDF para PEA
export const validatePEAFile = (file) => {
    const errors = [];

    if (!file) {
        errors.push('Debe seleccionar un archivo');
        return { isValid: false, errors };
    }

    // Validar tipo
    if (file.type !== 'application/pdf') {
        errors.push('El archivo debe ser un PDF');
    }

    // Validar extensión
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        errors.push('El archivo debe tener extensión .pdf');
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        errors.push(`Archivo muy grande. Máximo 10MB, seleccionado: ${sizeMB}MB`);
    }

    // Validar que no esté vacío
    if (file.size === 0) {
        errors.push('El archivo está vacío');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Valida ID de materia
export const validateSubjectId = (subjectId) => {
    if (!subjectId) {
        return { isValid: false, error: 'ID de materia es requerido' };
    }

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
        return { isValid: false, error: 'ID de materia debe ser un número entero positivo' };
    }

    return { isValid: true, error: null };
};

// Valida ID de usuario
export const validateUserId = (userId) => {
    if (!userId) {
        return { isValid: false, error: 'ID de usuario es requerido' };
    }

    if (!Number.isInteger(userId) || userId <= 0) {
        return { isValid: false, error: 'ID de usuario debe ser un número entero positivo' };
    }

    return { isValid: true, error: null };
};

// Sanea texto removiendo espacios extra y caracteres especiales
export const sanitizeText = (text) => {
    if (!text || typeof text !== 'string') return '';
    
    return text
        .trim()
        .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
        .replace(/[^\w\s\-.,!?()]/g, ''); // Remover caracteres especiales excepto básicos
};

// Trunca texto inteligentemente
export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
        return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
};