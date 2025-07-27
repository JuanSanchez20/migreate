// Verifica si el rol puede crear propuestas
export const canCreateProposal = (userRol) => {
    return [1, 2].includes(parseInt(userRol));
};

// Obtiene el nombre del rol
export const getRoleName = (userRol) => {
    const roles = {
        1: 'administrador',
        2: 'tutor',
        3: 'estudiante'
    };
    return roles[parseInt(userRol)] || 'desconocido';
};

// Determina el estado de aprobación automático según rol
export const getAutoApprovalStatus = (userRol) => {
    const rol = parseInt(userRol);
    if (rol === 1 || rol === 2) return 'Aprobada';
    if (rol === 3) return 'Pendiente';
    return 'Pendiente';
};