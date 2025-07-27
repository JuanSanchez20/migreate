import { isValidDifficultyLevel } from './proposalValidate';
import { hasValidGeneralObjective } from './objectiveHelpers';

// Valida campos obligatorios básicos
export const validateBasicFields = (data) => {
    const errors = [];
    
    if (!data.name?.trim()) {
        errors.push('El título de la propuesta es obligatorio');
    }
    
    if (!data.description?.trim()) {
        errors.push('La descripción es obligatoria');
    }
    
    if (!data.projectType || isNaN(parseInt(data.projectType))) {
        errors.push('Debe seleccionar un tipo de proyecto válido');
    }
    
    if (!data.subject || isNaN(parseInt(data.subject))) {
        errors.push('Debe seleccionar una materia válida');
    }
    
    if (!data.difficultyLevel || !isValidDifficultyLevel(data.difficultyLevel)) {
        errors.push('Debe seleccionar un nivel de dificultad válido');
    }
    
    return errors;
};

// Valida objetivos
export const validateObjectives = (objectives) => {
    const errors = [];
    
    if (!objectives || objectives.length === 0) {
        errors.push('Debe incluir al menos un objetivo');
    }
    
    if (!hasValidGeneralObjective(objectives)) {
        errors.push('Debe incluir al menos un objetivo general completo');
    }
    
    return errors;
};

// Valida propuesta grupal
export const validateGroupProposal = (data) => {
    const errors = [];
    
    if (data.grupal && (!data.integrants || parseInt(data.integrants) <= 1)) {
        errors.push('Las propuestas grupales deben tener un número válido de integrantes (mayor a 1)');
    }
    
    return errors;
};

// Valida requerimientos
export const validateRequirements = (requirements) => {
    const errors = [];
    
    if (requirements.length > 0) {
        const invalidRequirements = requirements.filter(req => !req.name?.trim());
        if (invalidRequirements.length > 0) {
            errors.push('Todos los requerimientos deben tener un nombre válido');
        }
    }
    
    return errors;
};

// Validación completa de la propuesta
export const validateProposal = (data) => {
    return [
        ...validateBasicFields(data),
        ...validateObjectives(data.objectives),
        ...validateGroupProposal(data),
        ...validateRequirements(data.requirements || [])
    ];
};