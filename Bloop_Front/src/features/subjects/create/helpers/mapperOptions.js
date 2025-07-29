// Utilidades y transformadores de datos para el módulo de materias
import { getJourneyOption, getSemesterOption } from './selectOptions';

// Transformar datos del formulario al formato requerido por la API
export const transformSubjectFormToPayload = (formData, userRole) => {
    return {
        subject_name: formData.name?.trim(),
        semester: parseInt(formData.semester, 10),
        journey: formData.journey,
        created_by_role: userRole
    };
};

// Transformar datos de tutor para asignación
export const transformTutorAssignmentPayload = (tutorData, subjectId) => {
    return {
        user_id: tutorData.u_id,
        subject_id: subjectId
    };
};

// Formatear datos de materia para vista previa
export const formatSubjectPreview = (formData) => {
    const journeyOption = getJourneyOption(formData.journey);
    const semesterOption = getSemesterOption(formData.semester);

    return {
        name: formData.name || 'Nombre de la materia',
        semester: semesterOption?.label || 'Semestre no seleccionado',
        journey: journeyOption?.label || 'Jornada no seleccionada',
        tutorName: formData.tutor?.u_name || 'Sin tutor asignado',
        tutorEmail: formData.tutor?.u_email || null
    };
};

// Formatear lista de tutores para el componente
export const formatTutorsList = (tutorsData) => {
    if (!Array.isArray(tutorsData)) {
        console.warn('formatTutorsList: tutorsData no es un array:', tutorsData);
        return [];
    }

    return tutorsData.map(tutor => ({
        u_id: tutor.u_id,
        u_name: tutor.u_name,
        u_email: tutor.u_email,
        u_rol: tutor.u_rol,
        isAvailable: true // Puede expandirse con lógica adicional
    }));
};

// Formatear respuesta de error de la API
export const formatApiError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return 'Error desconocido en el servidor';
};

// Generar mensaje de éxito basado en la acción realizada
export const generateSuccessMessage = (action, data = {}) => {
    const messages = {
        subjectCreated: 'Materia creada exitosamente',
        tutorAssigned: `Tutor ${data.tutorName || ''} asignado exitosamente`,
        completeProcess: 'Materia creada y tutor asignado exitosamente',
        processReset: 'Formulario reiniciado correctamente'
    };

    return messages[action] || 'Operación completada exitosamente';
};

// Generar ID único para componentes
export const generateComponentId = (prefix = 'component') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Verificar si hay cambios pendientes en el formulario
export const hasFormChanges = (currentData, initialData) => {
    const current = {
        name: currentData.name?.trim() || '',
        semester: currentData.semester || '',
        journey: currentData.journey || ''
    };

    const initial = {
        name: initialData.name?.trim() || '',
        semester: initialData.semester || '',
        journey: initialData.journey || ''
    };

    return JSON.stringify(current) !== JSON.stringify(initial);
};

// Resetear datos del formulario al estado inicial
export const resetFormToInitial = () => {
    return {
        name: '',
        semester: '',
        journey: '',
        tutor: null
    };
};

// Verificar si el proceso puede continuar al siguiente paso
export const canAdvanceToNextStep = (currentStep, formData) => {
    switch (currentStep) {
        case 'create':
            return !!(formData.name && formData.semester && formData.journey);
        case 'assign':
            return !!(formData.name && formData.semester && formData.journey && formData.tutor);
        default:
            return false;
    }
};

// Obtener el título del paso actual
export const getStepTitle = (currentStep) => {
    const titles = {
        create: 'Crear Materia',
        assign: 'Asignar Tutor',
        complete: 'Proceso Completado'
    };

    return titles[currentStep] || 'Paso Desconocido';
};

// Obtener la descripción del paso actual
export const getStepDescription = (currentStep) => {
    const descriptions = {
        create: 'Define los datos básicos de la materia',
        assign: 'Selecciona un tutor para la materia',
        complete: 'El proceso se ha completado exitosamente'
    };

    return descriptions[currentStep] || '';
};

// Verificar si los datos del usuario son válidos para la operación
export const isValidUserForOperation = (userData, requiredRole) => {
    return userData && 
        userData.rol === requiredRole && 
        userData.id && 
        Number.isInteger(userData.id);
};