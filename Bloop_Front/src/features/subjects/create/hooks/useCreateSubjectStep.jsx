import { useState, useCallback } from 'react';

import { canAdvanceToNextStep, getStepTitle, getStepDescription } from '../helpers/mapperOptions';

// Definir los pasos disponibles
const STEPS = {
    CREATE: 'create',
    ASSIGN: 'assign', 
    COMPLETE: 'complete'
};

// Hook especializado para manejar los pasos del proceso de creación de materia
const useCreateSubjectStep = () => {
    // Estado del paso actual
    const [currentStep, setCurrentStep] = useState(STEPS.CREATE);
    const [completedSteps, setCompletedSteps] = useState([]);

    // Avanzar al siguiente paso
    const nextStep = useCallback((formData = {}) => {
        switch (currentStep) {
            case STEPS.CREATE:
                if (canAdvanceToNextStep(STEPS.CREATE, formData)) {
                    setCurrentStep(STEPS.ASSIGN);
                    setCompletedSteps(prev => [...prev, STEPS.CREATE]);
                    return true;
                }
                return false;

            case STEPS.ASSIGN:
                if (canAdvanceToNextStep(STEPS.ASSIGN, formData)) {
                    setCurrentStep(STEPS.COMPLETE);
                    setCompletedSteps(prev => [...prev, STEPS.ASSIGN]);
                    return true;
                }
                return false;

            default:
                return false;
        }
    }, [currentStep]);

    // Retroceder al paso anterior
    const previousStep = useCallback(() => {
        switch (currentStep) {
            case STEPS.ASSIGN:
                setCurrentStep(STEPS.CREATE);
                setCompletedSteps(prev => prev.filter(step => step !== STEPS.CREATE));
                return true;

            case STEPS.COMPLETE:
                setCurrentStep(STEPS.ASSIGN);
                setCompletedSteps(prev => prev.filter(step => step !== STEPS.ASSIGN));
                return true;

            default:
                return false;
        }
    }, [currentStep]);

    // Ir directamente a un paso específico
    const goToStep = useCallback((step, formData = {}) => {
        if (!Object.values(STEPS).includes(step)) {
            return false;
        }

        // Validar si se puede ir al paso solicitado
        switch (step) {
            case STEPS.CREATE:
                setCurrentStep(STEPS.CREATE);
                setCompletedSteps([]);
                return true;

            case STEPS.ASSIGN:
                if (canAdvanceToNextStep(STEPS.CREATE, formData)) {
                    setCurrentStep(STEPS.ASSIGN);
                    setCompletedSteps([STEPS.CREATE]);
                    return true;
                }
                return false;

            case STEPS.COMPLETE:
                if (canAdvanceToNextStep(STEPS.ASSIGN, formData)) {
                    setCurrentStep(STEPS.COMPLETE);
                    setCompletedSteps([STEPS.CREATE, STEPS.ASSIGN]);
                    return true;
                }
                return false;

            default:
                return false;
        }
    }, []);

    // Reiniciar al primer paso
    const resetSteps = useCallback(() => {
        setCurrentStep(STEPS.CREATE);
        setCompletedSteps([]);
    }, []);

    // Verificar si se puede avanzar al siguiente paso
    const canGoNext = useCallback((formData = {}) => {
        return canAdvanceToNextStep(currentStep, formData);
    }, [currentStep]);

    // Verificar si se puede retroceder
    const canGoBack = currentStep !== STEPS.CREATE;

    // Verificar si un paso específico está completado
    const isStepCompleted = useCallback((step) => {
        return completedSteps.includes(step);
    }, [completedSteps]);

    // Verificar si el paso actual es específico
    const isCurrentStep = useCallback((step) => {
        return currentStep === step;
    }, [currentStep]);

    // Obtener información del paso actual
    const getCurrentStepInfo = useCallback(() => {
        return {
            step: currentStep,
            title: getStepTitle(currentStep),
            description: getStepDescription(currentStep),
            isFirst: currentStep === STEPS.CREATE,
            isLast: currentStep === STEPS.COMPLETE,
            canGoNext: false, // Se debe calcular externamente con datos del formulario
            canGoBack
        };
    }, [currentStep, canGoBack]);

    // Obtener progreso del proceso
    const getProgress = useCallback(() => {
        const allSteps = Object.values(STEPS);
        const currentIndex = allSteps.indexOf(currentStep);
        const totalSteps = allSteps.length;

        return {
            current: currentIndex + 1,
            total: totalSteps,
            percentage: Math.round(((currentIndex + 1) / totalSteps) * 100),
            completed: completedSteps.length,
            remaining: totalSteps - (currentIndex + 1)
        };
    }, [currentStep, completedSteps.length]);

    // Obtener lista de todos los pasos con su estado
    const getAllStepsStatus = useCallback(() => {
        return Object.values(STEPS).map(step => ({
            step,
            title: getStepTitle(step),
            description: getStepDescription(step),
            isCompleted: isStepCompleted(step),
            isCurrent: isCurrentStep(step),
            isAccessible: step === STEPS.CREATE || isStepCompleted(getPreviousStep(step))
        }));
    }, [isStepCompleted, isCurrentStep]);

    // Función auxiliar para obtener el paso anterior
    const getPreviousStep = (step) => {
        const steps = Object.values(STEPS);
        const currentIndex = steps.indexOf(step);
        return currentIndex > 0 ? steps[currentIndex - 1] : null;
    };

    // Retornar API del hook
    return {
        // Estados principales
        currentStep,
        completedSteps,

        // Información del paso actual
        getCurrentStepInfo,
        getProgress,
        getAllStepsStatus,

        // Navegación
        nextStep,
        previousStep,
        goToStep,
        resetSteps,

        // Verificaciones de estado
        canGoNext,
        canGoBack,
        isStepCompleted,
        isCurrentStep,

        // Constantes de pasos
        STEPS
    };
};

export default useCreateSubjectStep;