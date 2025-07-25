import { useCallback, useEffect } from 'react';
import { updateUserService } from '../../services/updateUser';
import useModalState from './useModalState';
import useUserEdit from './useUserEdit';
import useSubjectManagement from './useSubjectManagement';
import { NOTIFICATION_MESSAGES } from '../helpers/modalConstants';

// Hook orquestador principal del módulo de modal de usuario
// Unifica todos los hooks específicos y maneja la coordinación entre ellos
const useUserModalModule = (user, onUserUpdate, showSuccess, showError) => {
    // Hook de estado del modal
    const {
        isOpen,
        editMode,
        showPassword,
        loading: modalLoading,
        openModal,
        closeModal,
        enableEditMode,
        disableEditMode,
        toggleEditMode,
        togglePasswordVisibility,
        setLoading: setModalLoading,
        resetModalState,
        openInEditMode,
        closeWithValidation
    } = useModalState();

    // Hook de edición de usuario
    const {
        editedUser,
        hasUnsavedChanges,
        error: editError,
        updateUserField,
        updateUserFields,
        resetChanges,
        validateCurrentUser,
        canSave,
        prepareDataForService,
        getEditState,
        setError: setEditError,
        clearError: clearEditError
    } = useUserEdit(user);

    // Hook de gestión de materias
    const {
        assignedSubjects,
        selectedSubjectToAdd,
        hasSubjectChanges,
        loading: subjectLoading,
        error: subjectError,
        assignSubjectFunction,
        unassignSubjectFunction,
        setSelectedSubjectToAdd,
        clearSelection,
        resetSubjectChanges,
        getSubjectStats,
        subjectsToShow,
        setError: setSubjectError,
        clearError: clearSubjectError
    } = useSubjectManagement(user);

    // Loading global del módulo
    const isLoading = modalLoading || subjectLoading;

    // Error global del módulo
    const moduleError = editError || subjectError;

    // Maneja el guardado del usuario
    const handleSaveUser = useCallback(async () => {
        try {
            setModalLoading(true);
            clearEditError();

            // Validar datos antes de guardar
            const validation = validateCurrentUser();
            if (!validation.isValid) {
                showError(validation.errors.join('. '));
                return;
            }

            // Preparar datos para el servicio
            const payload = prepareDataForService();

            // Llamar al servicio de actualización
            const response = await updateUserService(payload);

            if (response.ok) {
                disableEditMode();
                showSuccess(response.message || NOTIFICATION_MESSAGES.SUCCESS.USER_UPDATED);

                // Notificar actualización al componente padre
                if (onUserUpdate) {
                    onUserUpdate();
                }
            } else {
                throw new Error(response.message || NOTIFICATION_MESSAGES.ERROR.USER_UPDATE_FAILED);
            }

        } catch (err) {
            console.error('Error al guardar cambios:', err);
            showError(err.message || NOTIFICATION_MESSAGES.ERROR.USER_UPDATE_FAILED);
        } finally {
            setModalLoading(false);
        }
    }, [
        setModalLoading,
        clearEditError,
        validateCurrentUser,
        prepareDataForService,
        disableEditMode,
        showSuccess,
        showError,
        onUserUpdate
    ]);

    // Maneja la cancelación de edición
    const handleCancelEdit = useCallback(() => {
        resetChanges();
        disableEditMode();
        clearEditError();
    }, [resetChanges, disableEditMode, clearEditError]);

    // Maneja el cierre del modal con validación de cambios
    const handleCloseModal = useCallback(() => {
        // Si hay cambios en materias, refrescar datos sin recargar página
        if (hasSubjectChanges) {
            showSuccess('Cambios aplicados correctamente');

            // Refrescar los datos de la lista desde el backend
            if (onUserUpdate) {
                onUserUpdate(); // Esto refresca la lista de usuarios
            }

            // Cerrar modal normalmente
            closeModal();
            return;
        }

        // Si hay cambios sin guardar en usuario, confirmar
        const canClose = closeWithValidation(hasUnsavedChanges);
        if (canClose) {
            closeModal();
            resetModalState();
            resetSubjectChanges();
            clearSelection();
        }
    }, [
        hasSubjectChanges,
        hasUnsavedChanges,
        showSuccess,
        onUserUpdate,
        closeWithValidation,
        closeModal,
        resetModalState,
        resetSubjectChanges,
        clearSelection
    ]);

    // Maneja el toggle entre modo vista y edición
    const handleToggleEdit = useCallback(() => {
        if (editMode) {
            handleCancelEdit();
        } else {
            enableEditMode();
        }
    }, [editMode, handleCancelEdit, enableEditMode]);

    // Maneja la adición de materias
    const handleAddSubject = useCallback(async () => {
        const success = await assignSubjectFunction();
        if (success) {
            showSuccess(NOTIFICATION_MESSAGES.SUCCESS.SUBJECT_ASSIGNED);
        }
    }, [assignSubjectFunction, showSuccess]);

    // Maneja la eliminación de materias
    const handleRemoveSubject = useCallback(async (subject) => {
        const success = await unassignSubjectFunction(subject);
        if (success) {
            showSuccess(NOTIFICATION_MESSAGES.SUCCESS.SUBJECT_UNASSIGNED);
        }
    }, [unassignSubjectFunction, showSuccess]);

    // Limpia todos los errores del módulo
    const clearAllErrors = useCallback(() => {
        clearEditError();
        clearSubjectError();
    }, [clearEditError, clearSubjectError]);

    // Obtiene el estado completo del módulo
    const getModuleState = useCallback(() => {
        const editState = getEditState();
        const subjectStats = getSubjectStats();

        return {
            // Estados del modal
            isOpen,
            editMode,
            showPassword,
            isLoading,

            // Estados de edición
            hasUnsavedChanges,
            canSave: canSave(),
            ...editState,

            // Estados de materias
            hasSubjectChanges,
            assignedSubjectsCount: assignedSubjects.length,
            availableSubjectsCount: subjectsToShow.length,
            ...subjectStats,

            // Estados de error
            hasErrors: Boolean(moduleError),
            error: moduleError
        };
    }, [
        isOpen,
        editMode,
        showPassword,
        isLoading,
        hasUnsavedChanges,
        canSave,
        getEditState,
        hasSubjectChanges,
        assignedSubjects.length,
        subjectsToShow.length,
        getSubjectStats,
        moduleError
    ]);

    // Resetea completamente el módulo
    const resetModule = useCallback(() => {
        resetModalState();
        resetChanges();
        resetSubjectChanges();
        clearSelection();
        clearAllErrors();
    }, [resetModalState, resetChanges, resetSubjectChanges, clearSelection, clearAllErrors]);

    // Efecto para limpiar errores cuando se cambia de usuario
    useEffect(() => {
        clearAllErrors();
    }, [user?.u_id, clearAllErrors]);

    return {
        // Estados principales
        isOpen,
        editMode,
        showPassword,
        loading: isLoading,
        error: moduleError,

        // Datos del usuario
        editedUser,
        hasUnsavedChanges,

        // Datos de materias
        assignedSubjects,
        subjectsToShow,
        selectedSubjectToAdd,
        hasSubjectChanges,

        // Funciones del modal
        openModal,
        closeModal: handleCloseModal,
        openInEditMode,
        toggleEditMode: handleToggleEdit,
        togglePasswordVisibility,

        // Funciones de edición
        updateUserField,
        updateUserFields,
        saveUser: handleSaveUser,
        cancelEdit: handleCancelEdit,
        canSave,

        // Funciones de materias
        setSelectedSubjectToAdd,
        addSubject: handleAddSubject,
        removeSubject: handleRemoveSubject,

        // Funciones de utilidad
        getModuleState,
        resetModule,
        clearAllErrors,

        // Estados derivados
        canClose: !hasUnsavedChanges || !editMode,
        hasChanges: hasUnsavedChanges || hasSubjectChanges,
        isEditing: editMode && isOpen,
        hasErrors: Boolean(moduleError)
    };
};

export default useUserModalModule;