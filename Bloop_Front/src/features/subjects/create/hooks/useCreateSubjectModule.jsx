import { useCallback } from 'react';
import useCreateSubjectProcess from './useCreateSubjectProcess';
import useCreateSubjectStep from './useCreateSubjectStep';
import { formatSubjectPreview } from '../helpers/mapperOptions';

// Hook unificador que orquesta todos los hooks del módulo de creación de materias
const useCreateSubjectModule = () => {
    // Hook principal del proceso
    const processHook = useCreateSubjectProcess();
    
    // Hook de manejo de pasos
    const stepHook = useCreateSubjectStep();

    // Referencias directas a hooks especializados
    const {
        createSubjectHook,
        assignSubjectHook,
        tutorListHook
    } = processHook;

    // Función helper para verificar pasos
    const isStep = useCallback((step) => {
        return stepHook.isCurrentStep(step);
    }, [stepHook]);

    // Acciones combinadas que integran pasos y proceso

    // Crear materia solamente
    const createSubjectOnly = useCallback(async () => {
        const result = await processHook.createSubjectOnly();
        return result;
    }, [processHook]);

    // Avanzar al paso de asignación de tutor
    const goToNextStep = useCallback(() => {
        const canAdvance = stepHook.nextStep(createSubjectHook.formData);
        return canAdvance;
    }, [stepHook, createSubjectHook.formData]);

    // Volver al paso anterior
    const goToPreviousStep = useCallback(() => {
        tutorListHook.clearSelection();
        stepHook.previousStep();
    }, [tutorListHook, stepHook]);

    // Crear materia con tutor (proceso completo)
    const createSubjectWithTutor = useCallback(async () => {
        const result = await processHook.createSubjectAndAssignTutor();
        return result;
    }, [processHook]);

    // Reiniciar todo el módulo
    const resetModule = useCallback(() => {
        processHook.resetProcess();
        stepHook.resetSteps();
    }, [processHook, stepHook]);

    // Obtener datos para vista previa
    const getSubjectPreview = useCallback(() => {
        return formatSubjectPreview(createSubjectHook.formData);
    }, [createSubjectHook.formData]);

    // Obtener estado completo del módulo
    const getModuleState = useCallback(() => {
        const stepInfo = stepHook.getCurrentStepInfo();
        const processStatus = processHook.getProcessStatus();
        
        return {
            // Información del paso actual
            currentStep: stepHook.currentStep,
            stepInfo,
            progress: stepHook.getProgress(),
            
            // Estado del proceso
            processState: processStatus.state,
            isProcessing: processStatus.isProcessing,
            isCompleted: processStatus.isCompleted,
            hasError: processStatus.hasError,
            
            // Datos del formulario - IMPORTANTE: Siempre debe existir
            formData: createSubjectHook.formData || {
                name: '',
                semester: '',
                journey: '',
                tutor: null
            },
            
            // Estados de datos
            hasFormData: createSubjectHook.canSubmit,
            hasTutorSelected: tutorListHook.hasTutorSelected,
            hasTutors: tutorListHook.hasTutors,
            
            // Estados de carga
            isFormLoading: createSubjectHook.loading,
            isTutorListLoading: tutorListHook.loading,
            isProcessLoading: processHook.globalLoading,
            
            // Errores
            formError: createSubjectHook.error,
            tutorError: tutorListHook.error,
            processError: processHook.globalError,
            
            // Capacidades
            capabilities: {
                canCreateOnly: processStatus.canCreateOnly,
                canGoToAssign: stepHook.canGoNext(createSubjectHook.formData || {}),
                canCreateWithTutor: processStatus.canCreateWithTutor,
                canCancelAssignment: stepHook.canGoBack && !processStatus.isProcessing,
                canReset: processStatus.isCompleted || processStatus.hasError
            }
        };
    }, [stepHook, processHook, createSubjectHook, tutorListHook]);

    // API del módulo siguiendo el patrón del ejemplo
    return {
        // Estados principales
        formData: createSubjectHook.formData,
        currentStep: stepHook.currentStep,
        isStep,
        STEPS: stepHook.STEPS,
        
        // Estados de tutores
        tutorsList: tutorListHook.tutors,
        selectedTutor: tutorListHook.selectedTutor,
        isLoadingTutors: tutorListHook.loading,
        tutorsError: tutorListHook.error,
        
        // Funciones de tutores (nombres específicos para el Page)
        handleTutorSelect: tutorListHook.selectTutor,
        handleClearTutorSelection: tutorListHook.clearSelection,
        refreshTutors: tutorListHook.reloadTutors,
        
        // Estados del proceso
        isCreatingSubject: processHook.isProcessing,
        isCompleted: processHook.isCompleted,
        isProcessing: processHook.isProcessing,
        hasError: processHook.hasError || createSubjectHook.error || tutorListHook.error,
        
        // Datos para componentes
        moduleState: getModuleState(),
        subjectPreview: getSubjectPreview(),
        processResult: processHook.processResult,
        
        // Funciones de manejo del formulario
        handleInputChange: createSubjectHook.handleChange,
        handleSelectChange: createSubjectHook.handleSelectChange,
        handleJourneyChange: createSubjectHook.handleJourneyChange,
        
        // Funciones de navegación
        goToNextStep,
        goToPreviousStep,
        
        // Funciones de tutores (nombres específicos para el Page)
        handleTutorSelect: tutorListHook.selectTutor,
        handleClearTutorSelection: tutorListHook.clearSelection,
        refreshTutors: tutorListHook.reloadTutors,
        
        // Acciones principales
        createSubjectOnly,
        createSubjectWithTutor,
        resetModule,
        
        // Hooks especializados (para acceso directo si es necesario)
        form: createSubjectHook,
        tutors: tutorListHook,
        assignment: assignSubjectHook,
        steps: stepHook,
        process: processHook,
        
        // Acciones agrupadas (para componentes que las necesiten)
        actions: {
            createSubject: createSubjectOnly,
            goToAssignStep: goToNextStep,
            createWithTutor: createSubjectWithTutor,
            cancelAssignment: goToPreviousStep,
            resetModule
        }
    };
};

export default useCreateSubjectModule;