// Valida los niveles de dificultad permitidos
export const isValidDifficultyLevel = (level) => {
    const validLevels = ['Bajo', 'Medio', 'Alto'];
    return validLevels.includes(level);
};

// Valida los estados de aprobación permitidos
export const isValidApprovalStatus = (status) => {
    const validStatuses = ['Pendiente', 'Aprobado', 'Rechazado'];
    return validStatuses.includes(status);
};

// Genera el mensaje de éxito según el rol
export const getSuccessMessage = (proposalName, userRol, stats) => {
    const isAdmin = parseInt(userRol) === 1 || parseInt(userRol) === 2;
    const status = isAdmin ? 'Aprobada automáticamente' : 'Pendiente de aprobación';
    
    return `Propuesta "${proposalName}" creada exitosamente.
Estado: ${status}
Objetivos: ${stats.general} general, ${stats.specific} específicos
Requerimientos: ${stats.requirements}
Modalidad: ${stats.modalidad}`;
};