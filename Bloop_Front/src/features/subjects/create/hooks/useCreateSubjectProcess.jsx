import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';
import useCreateSubject from './useCreateSubject';
import useAssignSubject from './useAssignSubject';
import useTutorList from './useTutorList';

import { 
    validateCompleteProcess,
    canProceedWithProcess
} from '../helpers/validation';
import {
    generateSuccessMessage,
    formatApiError
} from '../helpers/mapperOptions';

// Hook principal que maneja todo el proceso de creación de materia y asignación de tutor
const useCreateSubjectProcess = () => {
    // Estados del contexto de autenticación
    const { user, userRole } = useAuth();

    // Estados del proceso
    const [processState, setProcessState] = useState('idle'); // idle, creating, assigning, completed, error
    const [processResult, setProcessResult] = useState(null);

    // Hooks de estado globales
    const { loading: globalLoading, withLoading } = useLoadingState(false);
    const { error: globalError, setError: setGlobalError, clearError: clearGlobalError } = useErrorState();
    const { showSuccess, showError } = useNotification();

    // Hooks especializados
    const createSubjectHook = useCreateSubject();
    const assignSubjectHook = useAssignSubject();
    const tutorListHook = useTutorList();

    // Crear materia solamente (sin asignar tutor)
    const createSubjectOnly = useCallback(async () => {
        if (!user?.id || userRole !== 1) {
            setGlobalError('Permisos insuficientes');
            showError('Permisos insuficientes para crear materia');
            return { success: false };
        }

        if (!canProceedWithProcess(createSubjectHook.formData, 'create')) {
            setGlobalError('Complete todos los campos obligatorios');
            showError('Complete todos los campos obligatorios');
            return { success: false };
        }

        try {
            setProcessState('creating');
            clearGlobalError();

            const result = await withLoading(async () => {
                return await createSubjectHook.createSubject();
            });

            if (result.success) {
                setProcessState('completed');
                setProcessResult({
                    type: 'subject_only',
                    subjectId: result.subjectId,
                    subjectData: createSubjectHook.formData,
                    completedAt: new Date().toISOString()
                });

                const successMessage = generateSuccessMessage('subjectCreated');
                showSuccess(successMessage);

                return { success: true, data: result };
            } else {
                setProcessState('error');
                const errorMessage = createSubjectHook.error || 'Error al crear materia';
                setGlobalError(errorMessage);
                showError(errorMessage);
                return { success: false };
            }
        } catch (err) {
            setProcessState('error');
            const errorMessage = formatApiError(err);
            setGlobalError(errorMessage);
            showError(errorMessage);
            return { success: false };
        }
    }, [user?.id, userRole, createSubjectHook, withLoading, setGlobalError, clearGlobalError, showSuccess, showError]);

    // Crear materia y asignar tutor (proceso completo)
    const createSubjectAndAssignTutor = useCallback(async () => {
        if (!user?.id || userRole !== 1) {
            setGlobalError('Permisos insuficientes');
            showError('Permisos insuficientes para el proceso completo');
            return { success: false };
        }

        // Validar datos completos
        const validation = validateCompleteProcess(
            createSubjectHook.formData,
            tutorListHook.selectedTutor,
            userRole
        );

        if (!validation.isValid) {
            const errorMessages = Object.values(validation.errors).join(', ');
            setGlobalError(errorMessages);
            showError(errorMessages);
            return { success: false };
        }

        try {
            setProcessState('creating');
            clearGlobalError();

            const completeResult = await withLoading(async () => {
                // Paso 1: Crear la materia
                const subjectResult = await createSubjectHook.createSubject();
                
                if (!subjectResult.success) {
                    throw new Error('Error al crear la materia');
                }

                setProcessState('assigning');

                // Paso 2: Asignar el tutor
                const assignResult = await assignSubjectHook.assignTutor(
                    tutorListHook.selectedTutor,
                    subjectResult.subjectId
                );

                if (!assignResult.success) {
                    throw new Error('Materia creada pero error al asignar tutor');
                }

                return {
                    subjectResult,
                    assignResult
                };
            });

            setProcessState('completed');
            setProcessResult({
                type: 'complete_process',
                subjectId: completeResult.subjectResult.subjectId,
                subjectData: createSubjectHook.formData,
                tutorData: tutorListHook.selectedTutor,
                assignmentData: completeResult.assignResult.assignment,
                completedAt: new Date().toISOString()
            });

            const successMessage = generateSuccessMessage('completeProcess', {
                tutorName: tutorListHook.selectedTutor.u_name
            });
            showSuccess(successMessage);

            return { success: true, data: completeResult };

        } catch (err) {
            setProcessState('error');
            const errorMessage = formatApiError(err);
            setGlobalError(errorMessage);
            showError(errorMessage);
            return { success: false };
        }
    }, [
        user?.id, 
        userRole, 
        createSubjectHook, 
        assignSubjectHook, 
        tutorListHook.selectedTutor,
        withLoading, 
        setGlobalError, 
        clearGlobalError, 
        showSuccess, 
        showError
    ]);

    // Reiniciar todo el proceso
    const resetProcess = useCallback(() => {
        setProcessState('idle');
        setProcessResult(null);
        clearGlobalError();

        createSubjectHook.resetForm();
        assignSubjectHook.clearAssignment();
        tutorListHook.clearSelection();

        const resetMessage = generateSuccessMessage('processReset');
        showSuccess(resetMessage);
    }, [createSubjectHook, assignSubjectHook, tutorListHook, clearGlobalError, showSuccess]);

    // Verificar si se puede proceder con operaciones
    const canCreateSubjectOnly = useCallback(() => {
        return processState === 'idle' && 
            canProceedWithProcess(createSubjectHook.formData, 'create') &&
            !globalLoading;
    }, [processState, createSubjectHook.formData, globalLoading]);

    const canCreateWithTutor = useCallback(() => {
        return processState === 'idle' && 
            canProceedWithProcess(createSubjectHook.formData, 'assign') &&
            tutorListHook.hasTutorSelected &&
            !globalLoading;
    }, [processState, createSubjectHook.formData, tutorListHook.hasTutorSelected, globalLoading]);

    // Estados computados
    const isProcessing = ['creating', 'assigning'].includes(processState);
    const isCompleted = processState === 'completed';
    const hasError = processState === 'error' || globalError !== null;
    const isIdle = processState === 'idle';

    // Obtener información del resultado del proceso
    const getProcessResult = useCallback(() => {
        return processResult;
    }, [processResult]);

    // Obtener estado actual del proceso
    const getProcessStatus = useCallback(() => {
        return {
            state: processState,
            isProcessing,
            isCompleted,
            hasError,
            isIdle,
            canCreateOnly: canCreateSubjectOnly(),
            canCreateWithTutor: canCreateWithTutor()
        };
    }, [processState, isProcessing, isCompleted, hasError, isIdle, canCreateSubjectOnly, canCreateWithTutor]);

    // Retornar API del hook
    return {
        // Estados principales
        processState,
        processResult,
        globalLoading,
        globalError,

        // Estados computados
        isProcessing,
        isCompleted,
        hasError,
        isIdle,

        // Hooks especializados
        createSubjectHook,
        assignSubjectHook,
        tutorListHook,

        // Acciones principales
        createSubjectOnly,
        createSubjectAndAssignTutor,
        resetProcess,

        // Verificaciones
        canCreateSubjectOnly,
        canCreateWithTutor,

        // Utilidades
        getProcessResult,
        getProcessStatus,

        // Control de errores
        clearGlobalError
    };
};

export default useCreateSubjectProcess;