import { useState, useCallback, useMemo } from "react";

// Gestión de pasos de navegación
const useCreateUserStep = () => {
    // Pasos
    const STEPS = {
        USER_FORM: 1,
        ASSIGN_SUBJECTS: 2
    };

    const STEP_INFO = {
        [STEPS.USER_FORM]: {
            title: "Datos del Usuario",
            description: "Información personal y académica",
            icon: "UserIcon",
            canGoBack: false,
            showPreview: true
        },
        [STEPS.ASSIGN_SUBJECTS]: {
            title: "Asignar Materias",
            description: "Selecciona las materias para el usuario",
            icon: "AcademicCapIcon",
            canGoBack: true,
            showPreview: true
        }
    };

    // Estado del paso actual
    const [currentStep, setCurrentStep] = useState(STEPS.USER_FORM);
    const [stepHistory, setStepHistory] = useState([STEPS.USER_FORM]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Avanza el siguiente paso con validaciones opcionales
    const goToNextStep = useCallback(async (validateCurrentStep = null) => {
        // Si hay validación, ejecutarla primero
        if (validateCurrentStep) {
            setIsTransitioning(true);
            
            try {
                const isValid = await validateCurrentStep();
                
                if (!isValid) {
                    setIsTransitioning(false);
                    return false;
                }
            } catch (error) {
                console.error('Error en validación de paso:', error);
                setIsTransitioning(false);
                return false;
            }
        }

        // Determinar siguiente paso
        let nextStep;
        switch (currentStep) {
            case STEPS.USER_FORM:
                nextStep = STEPS.ASSIGN_SUBJECTS;
                break;
            case STEPS.ASSIGN_SUBJECTS:
                // Ya estamos en el último paso
                setIsTransitioning(false);
                return false;
            default:
                setIsTransitioning(false);
                return false;
        }

        // Actualizar paso actual e historial
        setCurrentStep(nextStep);
        setStepHistory(prev => [...prev, nextStep]);
        setIsTransitioning(false);

        return true;
    }, [currentStep]);

    // Retrocede al paso anterior
    const goToPreviousStep = useCallback(async (onBeforeBack = null) => {
        // Verificar si se puede retroceder
        if (!STEP_INFO[currentStep].canGoBack || stepHistory.length <= 1) {
            return false;
        }

        // Ejecutar función opcional antes de retroceder
        if (onBeforeBack) {
            setIsTransitioning(true);
            
            try {
                await onBeforeBack();
            } catch (error) {
                console.error('Error antes de retroceder:', error);
                setIsTransitioning(false);
                return false;
            }
        }

        // Obtener paso anterior del historial
        const newHistory = stepHistory.slice(0, -1);
        const previousStep = newHistory[newHistory.length - 1];

        setCurrentStep(previousStep);
        setStepHistory(newHistory);
        setIsTransitioning(false);

        return true;
    }, [currentStep, stepHistory]);

    // Direccion a un paso específico con validaciones
    const goToStep = useCallback(async (targetStep, validateTransition = null) => {
        // Verificar que el paso objetivo existe
        if (!STEP_INFO[targetStep]) {
            console.error('Paso no válido:', targetStep);
            return false;
        }

        // Si es el mismo paso, no hacer nada
        if (currentStep === targetStep) {
            return true;
        }

        // Validar transición si se proporciona función
        if (validateTransition) {
            setIsTransitioning(true);

            try {
                const canTransition = await validateTransition(currentStep, targetStep);
                
                if (!canTransition) {
                    setIsTransitioning(false);
                    return false;
                }
            } catch (error) {
                console.error('Error en validación de transición:', error);
                setIsTransitioning(false);
                return false;
            }
        }

        // Realizar transición
        setCurrentStep(targetStep);
        setStepHistory(prev => [...prev, targetStep]);
        setIsTransitioning(false);

        return true;
    }, [currentStep]);

    // Reinicio del proceso al primer paso
    const resetToFirstStep = useCallback(() => {
        setCurrentStep(STEPS.USER_FORM);
        setStepHistory([STEPS.USER_FORM]);
        setIsTransitioning(false);
    }, []);

    // Completa el proceso despues de crear un usuario
    const completeProcess = useCallback(() => {
        resetToFirstStep();
    }, [resetToFirstStep]);

    // Información del paso actual
    const currentStepInfo = useMemo(() => {
        return STEP_INFO[currentStep];
    }, [currentStep]);

    // Verifica si esta en un paso especifico
    const isStep = useCallback((step) => {
        return currentStep === step;
    }, [currentStep]);

    // Verifica si se puede acceder al siguiente paso
    const canGoNext = useMemo(() => {
        return currentStep < Math.max(...Object.keys(STEPS).map(key => STEPS[key]));
    }, [currentStep]);

    // Verificación si se puede retroceder
    const canGoBack = useMemo(() => {
        return STEP_INFO[currentStep].canGoBack && stepHistory.length > 1;
    }, [currentStep, stepHistory.length]);

    // Porcentaje de progreso del proceso
    const progress = useMemo(() => {
        const totalSteps = Object.keys(STEPS).length;
        return (currentStep / totalSteps) * 100;
    }, [currentStep]);

    // Información de la navegación
    const breadcrumb = useMemo(() => {
        return Object.values(STEPS).map(step => ({
            step,
            ...STEP_INFO[step],
            isActive: step === currentStep,
            isCompleted: step < currentStep,
            isAccessible: step <= currentStep
        }));
    }, [currentStep]);

    return {
        // Estados principales
        currentStep,
        isTransitioning,
        stepHistory,

        // Información del paso actual
        currentStepInfo,
        progress,
        breadcrumb,

        // Funciones de navegación
        goToNextStep,
        goToPreviousStep,
        goToStep,

        // Funciones de utilidad
        resetToFirstStep,
        completeProcess,
        isStep,

        // Estados calculados
        canGoNext,
        canGoBack,

        // Constantes útiles
        STEPS
    };
}

export default useCreateUserStep;