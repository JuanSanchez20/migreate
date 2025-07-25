import { ROLE_MAPPING } from './modalConstants';

// Normaliza el estado del usuario para asegurar consistencia
// Convierte boolean/string a número para el backend
export const normalizeUserState = (userData) => {
    let normalizedState;

    if (userData.u_state === true || userData.u_state === 1 || userData.u_state === "1") {
        normalizedState = 1;
    } else if (userData.u_state === false || userData.u_state === 0 || userData.u_state === "0") {
        normalizedState = 0;
    } else {
        normalizedState = 1; // valor por defecto
    }

    // Mapear el número de rol a string para el formulario
    let rolString = 'Estudiante'; // valor por defecto
    if (userData.u_rol === 1) rolString = 'Admin';
    else if (userData.u_rol === 2) rolString = 'Tutor';
    else if (userData.u_rol === 3) rolString = 'Estudiante';

    return {
        ...userData,
        u_state: normalizedState,
        rol: rolString // Campo requerido para el formulario
    };
};

// Convierte rol string a número para el backend
export const mapRoleToNumber = (roleString) => {
    return ROLE_MAPPING[roleString] || 3; // Por defecto Estudiante
};

// Convierte rol número a string para mostrar en UI
export const mapRoleToString = (roleNumber) => {
    const roleMap = {
        1: 'Admin',
        2: 'Tutor', 
        3: 'Estudiante'
    };
    return roleMap[roleNumber] || 'Estudiante';
};

// Prepara los datos del usuario para envío al backend
export const formatUserForService = (editedUser, currentUserId) => {
    return {
        admin_id: currentUserId,
        user_id: parseInt(editedUser.u_id),
        name_user: editedUser.u_name,
        email_user: editedUser.u_email,
        password_user: editedUser.u_password || undefined,
        semester_user: parseInt(editedUser.u_semester) || (editedUser.u_rol === 3 ? 1 : 0),
        rol_user: mapRoleToNumber(editedUser.rol),
        state_user: parseInt(editedUser.u_state) || 0
    };
};

// Procesa los datos del usuario recibidos del backend
export const formatUserFromService = (userData) => {
    return {
        ...userData,
        // Normalizar estado
        u_state: userData.u_state === true || userData.u_state === 1,
        // Mapear rol
        rol_name: mapRoleToString(userData.u_rol),
        // Asegurar que el semestre sea número
        u_semester: parseInt(userData.u_semester) || 1
    };
};

// Obtiene el color del rol para mostrar en UI
export const getRoleColor = (roleName) => {
    const roleColors = {
        'admin': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        'tutor': 'text-teal-600 bg-teal-600/10 border-teal-600/20', 
        'estudiante': 'text-teal-400 bg-teal-400/10 border-teal-400/20'
    };

    const normalizedRole = roleName?.toLowerCase() || 'estudiante';
    return roleColors[normalizedRole] || roleColors.estudiante;
};

// Obtiene el color del estado para mostrar en UI
export const getStateColor = (isActive) => {
    return isActive 
        ? 'text-green-400 bg-green-400/10 border-green-400/20'
        : 'text-red-400 bg-red-400/10 border-red-400/20';
};