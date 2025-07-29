// Opciones centralizadas para los selects del sistema
// Opciones para el select de jornadas
export const JOURNEY_OPTIONS = [
    {
        value: 'Matutina',
        label: 'Matutina',
        description: 'Clases en horario matutino'
    },
    {
        value: 'Nocturna', 
        label: 'Nocturna',
        description: 'Clases en horario nocturno'
    }
];

// Opciones para el select de semestres
export const SEMESTER_OPTIONS = [1, 2, 3, 4, 5].map(semester => ({
    value: semester.toString(),
    label: `${semester}° Semestre`,
    key: `semester-${semester}`
}));

// Estados disponibles para asignación de materias a estudiantes
export const STUDENT_SUBJECT_STATES = [
    {
        value: 'Cursando',
        label: 'Cursando',
        description: 'Estudiante está cursando la materia actualmente',
        isDefault: true
    },
    {
        value: 'Repitiendo', 
        label: 'Repitiendo',
        description: 'Estudiante está repitiendo la materia'
    },
    {
        value: 'Aprobado',
        label: 'Aprobado', 
        description: 'Estudiante ya aprobó la materia'
    }
];

// Tipos de usuarios disponibles para listar
export const USER_LIST_MODES = [
    {
        value: 'todos',
        label: 'Todos los usuarios',
        description: 'Lista todos los usuarios del sistema'
    },
    {
        value: 'tutores',
        label: 'Solo tutores',
        description: 'Lista únicamente usuarios con rol de tutor'
    },
    {
        value: 'estudiantes', 
        label: 'Solo estudiantes',
        description: 'Lista únicamente usuarios con rol de estudiante'
    }
];

// Configuración de roles del sistema
export const USER_ROLES = {
    ADMIN: 1,
    TUTOR: 2, 
    STUDENT: 3
};

// Límites del sistema basados en validaciones del SP
export const SYSTEM_LIMITS = {
    MAX_SUBJECTS_PER_SEMESTER: 6,
    MAX_SUBJECTS_PER_STUDENT: 2,
    MIN_SEMESTER: 1,
    MAX_SEMESTER: 5
};

// Función helper para obtener la opción de jornada por valor
export const getJourneyOption = (value) => {
    return JOURNEY_OPTIONS.find(option => option.value === value) || null;
};

// Función helper para obtener la opción de semestre por valor  
export const getSemesterOption = (value) => {
    const strValue = value?.toString();
    return SEMESTER_OPTIONS.find(option => option.value === strValue) || null;
};

// Función helper para obtener el estado por defecto de estudiante
export const getDefaultStudentState = () => {
    return STUDENT_SUBJECT_STATES.find(state => state.isDefault)?.value || 'Cursando';
};