import { useState, useCallback } from 'react';
import { useLoadingState } from '@/hooks';

// Hook para manejar el estado de apertura/cierre del modal
const useModalState = (initialEditMode = false) => {
    // Estado para controlar si el modal está abierto
    const [isOpen, setIsOpen] = useState(false);

    // Estado para controlar el modo de edición
    const [editMode, setEditMode] = useState(initialEditMode);

    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Hook de loading para operaciones del modal
    const { loading, startLoading, stopLoading } = useLoadingState(false);

    // Abre el modal
    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    // Cierra el modal y resetea estados
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setEditMode(false);
        setShowPassword(false);
        stopLoading();
    }, [stopLoading]);

    // Activa el modo de edición
    const enableEditMode = useCallback(() => {
        setEditMode(true);
    }, []);

    // Desactiva el modo de edición
    const disableEditMode = useCallback(() => {
        setEditMode(false);
        setShowPassword(false); // También ocultar contraseña al salir de edición
    }, []);

    // Alterna entre modo vista y edición
    const toggleEditMode = useCallback(() => {
        if (editMode) {
            disableEditMode();
        } else {
            enableEditMode();
        }
    }, [editMode, enableEditMode, disableEditMode]);

    // Alterna la visibilidad de la contraseña
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Inicia el loading
    const setLoading = useCallback((isLoading) => {
        if (isLoading) {
            startLoading();
        } else {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    // Resetea completamente el estado del modal
    const resetModalState = useCallback(() => {
        setIsOpen(false);
        setEditMode(initialEditMode);
        setShowPassword(false);
        stopLoading();
    }, [initialEditMode, stopLoading]);

    // Abre el modal en modo de edición directamente
    const openInEditMode = useCallback(() => {
        setIsOpen(true);
        setEditMode(true);
    }, []);

    // Función para verificar si el modal puede cerrarse (sin cambios pendientes)
    const canClose = useCallback((hasUnsavedChanges = false) => {
        // Si está cargando, no puede cerrarse
        if (loading) {
            return false;
        }

        // Si hay cambios sin guardar, requerir confirmación
        if (hasUnsavedChanges) {
            return window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?');
        }

        return true;
    }, [loading]);

    // Función para cerrar con validación
    const closeWithValidation = useCallback((hasUnsavedChanges = false) => {
        if (canClose(hasUnsavedChanges)) {
            closeModal();
            return true;
        }
        return false;
    }, [canClose, closeModal]);

    return {
        // Estados
        isOpen,
        editMode,
        showPassword,
        loading,

        // Funciones básicas
        openModal,
        closeModal,
        enableEditMode,
        disableEditMode,
        toggleEditMode,
        togglePasswordVisibility,

        // Funciones de loading
        setLoading,
        startLoading,
        stopLoading,

        // Funciones avanzadas
        resetModalState,
        openInEditMode,
        canClose,
        closeWithValidation,

        // Estado derivado
        isInViewMode: !editMode,
        isEditing: editMode && isOpen
    };
};

export default useModalState;