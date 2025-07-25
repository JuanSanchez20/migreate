import { VALIDATION_CONFIG } from './modalConstants';

// Valida el formato del correo electrónico
export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return { isValid: false, error: 'El correo electrónico es requerido' };
    }

    if (!VALIDATION_CONFIG.EMAIL_REGEX.test(email)) {
        return { isValid: false, error: 'El formato del correo electrónico no es válido' };
    }

    if (email.length > VALIDATION_CONFIG.MAX_EMAIL_LENGTH) {
        return { isValid: false, error: `El correo no puede exceder ${VALIDATION_CONFIG.MAX_EMAIL_LENGTH} caracteres` };
    }

    return { isValid: true, error: null };
};

// Valida el nombre del usuario
export const validateName = (name) => {
    if (!name || !name.trim()) {
        return { isValid: false, error: 'El nombre es requerido' };
    }

    if (name.trim().length < 2) {
        return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
    }

    if (name.length > VALIDATION_CONFIG.MAX_NAME_LENGTH) {
        return { isValid: false, error: `El nombre no puede exceder ${VALIDATION_CONFIG.MAX_NAME_LENGTH} caracteres` };
    }

    return { isValid: true, error: null };
};

// Valida la contraseña (solo si se proporciona)
export const validatePassword = (password) => {
    // Si no se proporciona contraseña, es válido (no cambiar)
    if (!password || password.trim() === '') {
        return { isValid: true, error: null };
    }

    if (password.length < VALIDATION_CONFIG.MIN_PASSWORD_LENGTH) {
        return { isValid: false, error: `La contraseña debe tener al menos ${VALIDATION_CONFIG.MIN_PASSWORD_LENGTH} caracteres` };
    }

    return { isValid: true, error: null };
};

// Valida el rol del usuario
export const validateRole = (role) => {
    const validRoles = ['Admin', 'Tutor', 'Estudiante'];

    if (!role || !role.trim()) {
        return { isValid: false, error: 'El rol es requerido' };
    }

    if (!validRoles.includes(role)) {
        return { isValid: false, error: 'El rol seleccionado no es válido' };
    }

    return { isValid: true, error: null };
};

// Valida el estado del usuario
export const validateState = (state) => {
    const validStates = [0, 1, '0', '1', true, false];

    if (state === null || state === undefined) {
        return { isValid: false, error: 'El estado es requerido' };
    }

    if (!validStates.includes(state)) {
        return { isValid: false, error: 'El estado seleccionado no es válido' };
    }

    return { isValid: true, error: null };
};

// Valida el semestre (solo para estudiantes)
export const validateSemester = (semester, role) => {
    // Si no es estudiante, el semestre no es requerido
    if (role !== 'Estudiante') {
        return { isValid: true, error: null };
    }

    if (!semester) {
        return { isValid: false, error: 'El semestre es requerido para estudiantes' };
    }

    const semesterNum = parseInt(semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 5) {
        return { isValid: false, error: 'El semestre debe estar entre 1 y 5' };
    }

    return { isValid: true, error: null };
};

// Validación completa de los datos del usuario
export const validateUserData = (userData) => {
    const errors = [];

    // Validar nombre
    const nameValidation = validateName(userData.u_name);
    if (!nameValidation.isValid) {
        errors.push(nameValidation.error);
    }

    // Validar email
    const emailValidation = validateEmail(userData.u_email);
    if (!emailValidation.isValid) {
        errors.push(emailValidation.error);
    }

    // Validar contraseña
    const passwordValidation = validatePassword(userData.u_password);
    if (!passwordValidation.isValid) {
        errors.push(passwordValidation.error);
    }

    // Validar rol
    const roleValidation = validateRole(userData.rol);
    if (!roleValidation.isValid) {
        errors.push(roleValidation.error);
    }

    // Validar estado
    const stateValidation = validateState(userData.u_state);
    if (!stateValidation.isValid) {
        errors.push(stateValidation.error);
    }

    // Validar semestre (si es estudiante)
    const semesterValidation = validateSemester(userData.u_semester, userData.rol);
    if (!semesterValidation.isValid) {
        errors.push(semesterValidation.error);
    }

    return {
        isValid: errors.length === 0,
        errors,
        hasErrors: errors.length > 0
    };
};

// Valida si hay cambios entre dos objetos de usuario
export const hasUserChanges = (originalUser, editedUser) => {
    if (!originalUser || !editedUser) return false;

    // Campos a comparar
    const fieldsToCompare = [
        'u_name',
        'u_email', 
        'rol',
        'u_state',
        'u_semester'
    ];

    return fieldsToCompare.some(field => {
        const original = originalUser[field];
        const edited = editedUser[field];

        // Comparación especial para estado (puede ser boolean o number)
        if (field === 'u_state') {
            return Boolean(original) !== Boolean(edited);
        }

        return original !== edited;
    });
};