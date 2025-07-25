import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts';
import useErrorState from '@/hooks/useErrorState';
import { normalizeUserState, formatUserForService } from '../helpers/userMappers';
import { validateUserData, hasUserChanges } from '../helpers/userValidator';
import { NOTIFICATION_MESSAGES } from '../helpers/modalConstants';

// Hook para manejar la lógica de edición de usuarios
const useUserEdit = (originalUser) => {
    // Contexto de autenticación
    const { user: currentUser } = useAuth();

    // Estado del usuario editado
    const [editedUser, setEditedUser] = useState(() => 
        originalUser ? normalizeUserState(originalUser) : null
    );

    // Estado para controlar si hay cambios sin guardar
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Hook de manejo de errores
    const { error, setError, clearError, hasError } = useErrorState();

    // Actualiza el usuario editado cuando cambia el usuario original
    useEffect(() => {
        if (originalUser) {
            const normalized = normalizeUserState(originalUser);
            setEditedUser(normalized);
            setHasUnsavedChanges(false);
            clearError();
        }
    }, [originalUser, clearError]);

    // Verifica si hay cambios comparando con el usuario original
    useEffect(() => {
        if (originalUser && editedUser) {
            const changes = hasUserChanges(normalizeUserState(originalUser), editedUser);
            setHasUnsavedChanges(changes);
        }
    }, [originalUser, editedUser]);

    // Actualiza un campo específico del usuario
    const updateUserField = useCallback((fieldName, value) => {
        setEditedUser(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                [fieldName]: value
            };
        });

        // Limpiar errores al hacer cambios
        if (hasError()) {
            clearError();
        }
    }, [hasError, clearError]);

    // Actualiza múltiples campos del usuario a la vez
    const updateUserFields = useCallback((fields) => {
        setEditedUser(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                ...fields
            };
        });

        // Limpiar errores al hacer cambios
        if (hasError()) {
            clearError();
        }
    }, [hasError, clearError]);

    // Valida los datos del usuario editado
    const validateCurrentUser = useCallback(() => {
        if (!editedUser) {
            const error = 'No hay datos de usuario para validar';
            setError(error);
            return { isValid: false, errors: [error] };
        }

        const validation = validateUserData(editedUser);

        if (!validation.isValid) {
            setError(validation.errors.join('. '));
        } else {
            clearError();
        }

        return validation;
    }, [editedUser, setError, clearError]);

    // Prepara los datos para envío al servicio
    const prepareDataForService = useCallback(() => {
        if (!editedUser) {
            throw new Error('No hay datos de usuario para preparar');
        }

        if (!currentUser?.id) {
            throw new Error(NOTIFICATION_MESSAGES.ERROR.AUTH_USER_MISSING);
        }

        // Validar antes de preparar
        const validation = validateCurrentUser();
        if (!validation.isValid) {
            throw new Error(validation.errors.join('. '));
        }

        // Formatear para el servicio
        return formatUserForService(editedUser, currentUser.id);
    }, [editedUser, currentUser?.id, validateCurrentUser]);

    // Resetea los cambios al estado original
    const resetChanges = useCallback(() => {
        if (originalUser) {
            const normalized = normalizeUserState(originalUser);
            setEditedUser(normalized);
            setHasUnsavedChanges(false);
            clearError();
        }
    }, [originalUser, clearError]);

    // Verifica si el usuario puede ser guardado
    const canSave = useCallback(() => {
        return editedUser && 
                hasUnsavedChanges && 
                !hasError() && 
                currentUser?.id;
    }, [editedUser, hasUnsavedChanges, hasError, currentUser?.id]);

    // Obtiene información del estado actual de edición
    const getEditState = useCallback(() => {
        return {
            hasChanges: hasUnsavedChanges,
            hasErrors: hasError(),
            canSave: canSave(),
            isValid: editedUser ? validateUserData(editedUser).isValid : false,
            isDirty: hasUnsavedChanges
        };
    }, [hasUnsavedChanges, hasError, canSave, editedUser]);

    // Función para obtener solo los campos que cambiaron
    const getChangedFields = useCallback(() => {
        if (!originalUser || !editedUser) return {};

        const original = normalizeUserState(originalUser);
        const changed = {};

        Object.keys(editedUser).forEach(key => {
            if (original[key] !== editedUser[key]) {
                changed[key] = {
                    old: original[key],
                    new: editedUser[key]
                };
            }
        });
        
        return changed;
    }, [originalUser, editedUser]);

    return {
        // Estados principales
        editedUser,
        hasUnsavedChanges,
        error,

        // Funciones de actualización
        updateUserField,
        updateUserFields,
        resetChanges,

        // Funciones de validación
        validateCurrentUser,
        canSave,

        // Funciones de preparación
        prepareDataForService,

        // Funciones de estado
        getEditState,
        getChangedFields,

        // Estados derivados
        hasError: hasError(),
        isValid: editedUser ? validateUserData(editedUser).isValid : false,
        isDirty: hasUnsavedChanges,

        // Funciones de error
        setError,
        clearError
    };
};

export default useUserEdit;