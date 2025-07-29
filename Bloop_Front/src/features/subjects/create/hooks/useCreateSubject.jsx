import { useState, useCallback } from 'react';
import { createSubjectService } from '../../services/createSubject';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useFocusStates } from '@/hooks';

import {
    validateSubjectForm,
    validateCreateSubjectPayload,
    sanitizeSubjectFormData,
    canProceedWithProcess
} from '../helpers/validation';
import {
    transformSubjectFormToPayload,
    formatApiError,
    resetFormToInitial,
    hasFormChanges
} from '../helpers/mapperOptions';

// Hook especializado para manejar el formulario de creación de materia
const useCreateSubject = () => {
    // Estados del contexto de autenticación
    const { user, userRole } = useAuth();
    
    // Estado inicial del formulario
    const initialFormData = resetFormToInitial();
    
    // Estados principales - Asegurar que formData siempre esté inicializado
    const [formData, setFormData] = useState(initialFormData);
    const [createdSubjectId, setCreatedSubjectId] = useState(null);
    
    // Hooks de estado
    const { loading, withLoading } = useLoadingState(false);
    const { error, setError, clearError } = useErrorState();
    const { focusStates, createFocusHandlers } = useFocusStates(['name', 'semester', 'journey']);

    // Manejar cambio en campos de texto
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        clearError();
    }, [clearError]);

    // Manejar cambio en campos select
    const handleSelectChange = useCallback((fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
        clearError();
    }, [clearError]);

    // Manejar cambio específico en jornada
    const handleJourneyChange = useCallback((value) => {
        handleSelectChange('journey', value);
    }, [handleSelectChange]);

    // Validar formulario actual
    const validateForm = useCallback(() => {
        const sanitizedData = sanitizeSubjectFormData(formData);
        return validateSubjectForm(sanitizedData);
    }, [formData]);

    // Crear materia solamente
    const createSubject = useCallback(async () => {
        if (!user?.id || userRole !== 1) {
            setError('Permisos insuficientes para crear materia');
            return { success: false };
        }

        // Validar formulario
        const validation = validateForm();
        if (!validation.isValid) {
            setError('Por favor complete todos los campos obligatorios');
            return { success: false };
        }

        // Preparar payload
        const payload = transformSubjectFormToPayload(formData, userRole);
        const payloadValidation = validateCreateSubjectPayload(payload);
        
        if (!payloadValidation.isValid) {
            setError('Datos del formulario inválidos');
            return { success: false };
        }

        try {
            const response = await withLoading(async () => {
                return await createSubjectService(payload);
            });

            if (response.ok && response.subject_id) {
                setCreatedSubjectId(response.subject_id);
                clearError();
                return { 
                    success: true, 
                    subjectId: response.subject_id,
                    data: response 
                };
            } else {
                setError(response.message || 'Error al crear la materia');
                return { success: false };
            }
        } catch (err) {
            const errorMessage = formatApiError(err);
            setError(errorMessage);
            return { success: false };
        }
    }, [user?.id, userRole, formData, withLoading, setError, clearError, validateForm]);

    // Resetear formulario
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setCreatedSubjectId(null);
        clearError();
    }, [clearError]);

    // Verificar si se puede enviar el formulario
    const canSubmit = canProceedWithProcess(formData, 'create');

    // Verificar si hay cambios en el formulario
    const hasUnsavedChanges = hasFormChanges(formData, initialFormData);

    // Verificar si la materia fue creada exitosamente
    const isSubjectCreated = createdSubjectId !== null;

    // Obtener errores de validación actuales
    const getValidationErrors = useCallback(() => {
        const validation = validateForm();
        return validation.errors;
    }, [validateForm]);

    // Establecer datos completos del formulario
    const setCompleteFormData = useCallback((newData) => {
        setFormData(prev => ({
            ...prev,
            ...newData
        }));
    }, []);

    // Retornar API del hook
    return {
        // Estados principales
        formData,
        loading,
        error,
        createdSubjectId,
        focusStates,
        
        // Estados computados
        canSubmit,
        hasUnsavedChanges,
        isSubjectCreated,
        
        // Acciones del formulario
        handleChange,
        handleSelectChange,
        handleJourneyChange,
        setCompleteFormData,
        
        // Acciones principales
        createSubject,
        resetForm,
        
        // Utilidades
        validateForm,
        getValidationErrors,
        createFocusHandlers,
        
        // Control de errores
        clearError
    };
};

export default useCreateSubject;