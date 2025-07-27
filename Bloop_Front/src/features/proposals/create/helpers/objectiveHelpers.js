// Valida que exista al menos un objetivo general completo
export const hasValidGeneralObjective = (objectives) => {
    return objectives.some(obj => 
        obj.type === 'General' && 
        obj.name?.trim() && 
        obj.description?.trim()
    );
};

// Cuenta objetivos por tipo
export const getObjectiveStats = (objectives) => {
    const general = objectives.filter(obj => obj.type === 'General').length;
    const specific = objectives.filter(obj => obj.type === 'Específico').length;
    
    return {
        general,
        specific,
        total: general + specific
    };
};

// Verifica si se puede agregar más objetivos específicos
export const canAddSpecificObjective = (objectives) => {
    const specificCount = objectives.filter(obj => obj.type === 'Específico').length;
    return specificCount < 3;
};

// Verifica si se puede agregar objetivo general
export const canAddGeneralObjective = (objectives) => {
    const generalCount = objectives.filter(obj => obj.type === 'General').length;
    return generalCount === 0;
};