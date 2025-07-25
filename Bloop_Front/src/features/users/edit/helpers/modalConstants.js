// Opciones de roles disponibles para los usuarios
export const ROLE_OPTIONS = [
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Tutor', label: 'Tutor' },
    { value: 'Admin', label: 'Administrador' }
];

// Opciones de estado de usuario (Activo/Inactivo)
export const STATE_OPTIONS = [
    { value: '1', label: 'Activo' },
    { value: '0', label: 'Inactivo' }
];

// Opciones de semestres disponibles (1 al 5)
export const SEMESTER_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}° Semestre`
}));

// Mapeo de roles string a número para el backend
export const ROLE_MAPPING = {
    'Admin': 1,
    'Tutor': 2,
    'Estudiante': 3,
};

// Estados de asignación de materias según el tipo de usuario
export const SUBJECT_ASSIGNMENT_STATUS = {
    TUTOR: 'Encargado',
    CURRENT_SEMESTER: 'Cursando',
    REPEATING: 'Repitiendo'
};

// Configuración de validación para formularios
export const VALIDATION_CONFIG = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 100,
    MAX_EMAIL_LENGTH: 255
};

// Mensajes de notificación para diferentes acciones
export const NOTIFICATION_MESSAGES = {
    SUCCESS: {
        USER_UPDATED: 'Usuario actualizado correctamente',
        SUBJECT_ASSIGNED: 'Materia asignada exitosamente',
        SUBJECT_UNASSIGNED: 'Materia desasignada correctamente'
    },
    ERROR: {
        INVALID_EMAIL: 'El formato del correo electrónico no es válido',
        USER_UPDATE_FAILED: 'Error al actualizar el usuario',
        SUBJECT_ASSIGN_FAILED: 'Error al asignar la materia',
        SUBJECT_UNASSIGN_FAILED: 'Error al desasignar la materia',
        SUBJECT_ALREADY_ASSIGNED: 'La materia ya está asignada a este usuario',
        SUBJECT_NOT_FOUND: 'Materia no encontrada',
        SUBJECT_ID_MISSING: 'No se puede desasignar esta materia: ID no encontrado',
        LOAD_SUBJECTS_FAILED: 'Error al cargar materias disponibles',
        AUTH_USER_MISSING: 'No se pudo obtener la información del usuario autenticado'
    },
    WARNING: {
        PASSWORD_EMPTY: 'Dejar vacío si no deseas cambiar la contraseña',
        UNSAVED_CHANGES: 'Tienes cambios sin guardar'
    }
};

// Tipos de notificación disponibles
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
};

// Configuración de tiempo para notificaciones
export const NOTIFICATION_CONFIG = {
    DURATION: 2000, // 2 segundos
    FADE_DURATION: 300 // 300ms para animación
};