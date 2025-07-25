// Helper minimalista para manejo de roles - Reemplaza roleMapper.js gigante

// Mapeo simple de roles
const ROLE_NAMES = {
    1: 'Admin',
    2: 'Tutor', 
    3: 'Estudiante'
};

// Obtiene el nombre para mostrar en UI basado en tu context AuthContext
export const getRoleDisplayName = (role) => {
    if (!role) return 'Sin rol';

    // Manejar tanto número como string que viene de tu context
    const roleId = typeof role === 'string' ? parseInt(role) : role;
    return ROLE_NAMES[roleId] || 'Sin rol';
};

// Verifica si un rol es de estudiante (para lógica de permisos)
export const isStudentRole = (role) => {
    const roleId = typeof role === 'string' ? parseInt(role) : role;
    return roleId === 3;
};

// Verifica si un rol es de admin
export const isAdminRole = (role) => {
    const roleId = typeof role === 'string' ? parseInt(role) : role;
    return roleId === 1;
};

// Verifica si un rol es de tutor (para lógica de permisos)
export const isTutorRole = (role) => {
    const roleId = typeof role === 'string' ? parseInt(role) : role;
    return roleId === 2;
};

// Verifica si un rol puede ver estadísticas (Admin y Tutor)
export const canViewStats = (role) => {
    return isAdminRole(role) || isTutorRole(role);
};