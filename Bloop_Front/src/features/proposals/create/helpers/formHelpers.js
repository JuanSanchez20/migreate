import { getAutoApprovalStatus } from './roleVerificate';
import { getObjectiveStats } from './objectiveHelpers';

// Transforma datos del formulario para envío al backend
export const transformProposalData = (formData, userInfo) => {
    return {
        name: formData.name?.trim(),
        user: userInfo.id,
        userRol: userInfo.rol,
        projectType: parseInt(formData.projectType),
        subject: parseInt(formData.subject),
        description: formData.description?.trim(),
        approvalStatus: getAutoApprovalStatus(userInfo.rol),
        difficultyLevel: formData.difficultyLevel,
        grupal: formData.grupal || false,
        integrants: formData.grupal ? parseInt(formData.integrants) || null : null,
        dateLimit: formData.dateLimit || null,
        objectives: formData.objectives || [],
        requirements: formData.requirements || []
    };
};

// Obtiene estadísticas para mensaje de confirmación
export const getProposalStats = (formData) => {
    const objectiveStats = getObjectiveStats(formData.objectives || []);
    const requirements = formData.requirements?.length || 0;
    const modalidad = formData.grupal 
        ? `Grupal (${formData.integrants} integrantes)` 
        : 'Individual';
    
    return {
        ...objectiveStats,
        requirements,
        modalidad
    };
};