import { useCallback, useEffect } from 'react';
import { updateUserService } from '../../services/updateUser';
import useModalState from './useModalState';
import useUserEdit from './useUserEdit';
import useSubjectManagement from './useSubjectManagement';
import { NOTIFICATION_MESSAGES } from '../helpers/modalConstants';

const useUserModalModule = (user, onUserUpdate, showSuccess, showError, hideNotification) => {
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

    const canManageSubjects = user?.rol_name?.toLowerCase() !== 'admin';

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
        clearError: clearSubjectError
    } = useSubjectManagement(
        canManageSubjects ? user : null,
        (message) => showSuccess(message),
        (message) => showError(message, 3000) // 3 segundos para errores como solicitaste
    );

    const isLoading = modalLoading || (canManageSubjects ? subjectLoading : false);
    const moduleError = editError || (canManageSubjects ? subjectError : null);

    const handleSaveUser = useCallback(async () => {
        try {
            setModalLoading(true);
            clearEditError();

            const validation = validateCurrentUser();
            if (!validation.isValid) {
                showError(validation.errors.join('. '), 3000);
                return;
            }

            const payload = prepareDataForService();
            const response = await updateUserService(payload);

            if (response.ok) {
                disableEditMode();
                showSuccess(response.message || NOTIFICATION_MESSAGES.SUCCESS.USER_UPDATED);

                if (onUserUpdate) {
                    onUserUpdate();
                }
            } else {
                throw new Error(response.message || NOTIFICATION_MESSAGES.ERROR.USER_UPDATE_FAILED);
            }

        } catch (err) {
            console.error('Error al guardar cambios:', err);
            showError(err.message || NOTIFICATION_MESSAGES.ERROR.USER_UPDATE_FAILED, 3000);
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

    const handleCancelEdit = useCallback(() => {
        resetChanges();
        disableEditMode();
        clearEditError();
    }, [resetChanges, disableEditMode, clearEditError]);

    const handleCloseModal = useCallback(() => {
        hideNotification?.();
        if (canManageSubjects && hasSubjectChanges) {
            showSuccess('Cambios aplicados correctamente');

            if (onUserUpdate) {
                onUserUpdate();
            }

            closeModal();
            return;
        }

        const canClose = closeWithValidation(hasUnsavedChanges);
        if (canClose) {
            closeModal();
            resetModalState();
            if (canManageSubjects) {
                resetSubjectChanges();
                clearSelection();
            }
        }
    }, [
        hideNotification,
        canManageSubjects,
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

    const handleToggleEdit = useCallback(() => {
        if (editMode) {
            handleCancelEdit();
        } else {
            enableEditMode();
        }
    }, [editMode, handleCancelEdit, enableEditMode]);

    const handleAddSubject = useCallback(async () => {
        if (!canManageSubjects) return false;
        
        const success = await assignSubjectFunction();
        if (success) {
            showSuccess(NOTIFICATION_MESSAGES.SUCCESS.SUBJECT_ASSIGNED);
        }
        return success;
    }, [canManageSubjects, assignSubjectFunction, showSuccess]);

    const handleRemoveSubject = useCallback(async (subject) => {
        if (!canManageSubjects) return false;
        
        const success = await unassignSubjectFunction(subject);
        if (success) {
            showSuccess(NOTIFICATION_MESSAGES.SUCCESS.SUBJECT_UNASSIGNED);
        }
        return success;
    }, [canManageSubjects, unassignSubjectFunction, showSuccess]);

    const clearAllErrors = useCallback(() => {
        clearEditError();
        if (canManageSubjects) {
            clearSubjectError();
        }
    }, [clearEditError, clearSubjectError, canManageSubjects]);

    const getModuleState = useCallback(() => {
        const editState = getEditState();
        const subjectStats = canManageSubjects ? getSubjectStats() : { hasChanges: false };

        return {
            isOpen,
            editMode,
            showPassword,
            isLoading,
            hasUnsavedChanges,
            canSave: canSave(),
            ...editState,
            hasSubjectChanges: canManageSubjects ? hasSubjectChanges : false,
            assignedSubjectsCount: canManageSubjects ? assignedSubjects.length : 0,
            availableSubjectsCount: canManageSubjects ? subjectsToShow.length : 0,
            ...subjectStats,
            hasErrors: Boolean(moduleError),
            error: moduleError,
            canManageSubjects
        };
    }, [
        isOpen,
        editMode,
        showPassword,
        isLoading,
        hasUnsavedChanges,
        canSave,
        getEditState,
        canManageSubjects,
        hasSubjectChanges,
        assignedSubjects?.length,
        subjectsToShow?.length,
        getSubjectStats,
        moduleError
    ]);

    const resetModule = useCallback(() => {
        resetModalState();
        resetChanges();
        if (canManageSubjects) {
            resetSubjectChanges();
            clearSelection();
        }
        clearAllErrors();
    }, [resetModalState, resetChanges, resetSubjectChanges, clearSelection, clearAllErrors, canManageSubjects]);

    useEffect(() => {
        clearAllErrors();
    }, [user?.u_id, clearAllErrors]);

    return {
        isOpen,
        editMode,
        showPassword,
        loading: isLoading,
        error: moduleError,
        editedUser,
        hasUnsavedChanges,
        assignedSubjects: canManageSubjects ? assignedSubjects : [],
        subjectsToShow: canManageSubjects ? subjectsToShow : [],
        selectedSubjectToAdd: canManageSubjects ? selectedSubjectToAdd : '',
        hasSubjectChanges: canManageSubjects ? hasSubjectChanges : false,
        canManageSubjects,
        openModal,
        closeModal: handleCloseModal,
        openInEditMode,
        toggleEditMode: handleToggleEdit,
        togglePasswordVisibility,
        updateUserField,
        updateUserFields,
        saveUser: handleSaveUser,
        cancelEdit: handleCancelEdit,
        canSave,
        setSelectedSubjectToAdd: canManageSubjects ? setSelectedSubjectToAdd : () => {},
        addSubject: handleAddSubject,
        removeSubject: handleRemoveSubject,
        getModuleState,
        resetModule,
        clearAllErrors,
        canClose: !hasUnsavedChanges || !editMode,
        hasChanges: hasUnsavedChanges || (canManageSubjects ? hasSubjectChanges : false),
        isEditing: editMode && isOpen,
        hasErrors: Boolean(moduleError)
    };
};

export default useUserModalModule;