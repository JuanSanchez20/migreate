import { useState, useCallback } from 'react';
import { useModalClickOutside } from '@/hooks';

// Hook para manejar los estados y navegación de la modal de propuestas
const useProjectModal = () => {
    // Estados principales de la modal
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState('details'); // 'details' | 'edit' | 'actions'
    const [selectedProposal, setSelectedProposal] = useState(null);

    // Hook para manejar clic fuera de la modal
    const modalRef = useModalClickOutside(() => {
        closeModal();
    }, isOpen, true);

    // Abre la modal con una propuesta específica
    const openModal = useCallback((proposal, view = 'details') => {
        if (!proposal) {
            console.warn('No se puede abrir modal sin propuesta');
            return;
        }

        setSelectedProposal(proposal);
        setCurrentView(view);
        setIsOpen(true);
    }, []);

    // Cierra la modal y limpia el estado
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setCurrentView('details');
        setSelectedProposal(null);
    }, []);

    // Navega entre vistas dentro de la modal
    const navigateToView = useCallback((view) => {
        if (!isOpen || !selectedProposal) {
            console.warn('No se puede navegar sin modal abierta');
            return;
        }

        setCurrentView(view);
    }, [isOpen, selectedProposal]);

    // Navega a la vista de detalles
    const showDetails = useCallback(() => {
        navigateToView('details');
    }, [navigateToView]);

    // Navega a la vista de edición
    const showEdit = useCallback(() => {
        navigateToView('edit');
    }, [navigateToView]);

    // Navega a la vista de acciones
    const showActions = useCallback(() => {
        navigateToView('actions');
    }, [navigateToView]);

    // Verifica si la modal está en una vista específica
    const isViewActive = useCallback((view) => {
        return currentView === view;
    }, [currentView]);

    // Obtiene información de la vista actual
    const getCurrentViewInfo = useCallback(() => {
        const viewsInfo = {
            details: {
                title: 'Detalles de la Propuesta',
                canGoBack: false,
                showCloseButton: true
            },
            edit: {
                title: 'Editar Propuesta',
                canGoBack: true,
                showCloseButton: true
            },
            actions: {
                title: 'Acciones de la Propuesta',
                canGoBack: true,
                showCloseButton: true
            }
        };

        return viewsInfo[currentView] || viewsInfo.details;
    }, [currentView]);

    // Vuelve a la vista anterior o detalles por defecto
    const goBack = useCallback(() => {
        setCurrentView('details');
    }, []);

    // Reinicia la modal a su estado inicial
    const resetModal = useCallback(() => {
        setCurrentView('details');
        setSelectedProposal(null);
        setIsOpen(false);
    }, []);

    // Verifica si hay una propuesta seleccionada
    const hasSelectedProposal = useCallback(() => {
        return selectedProposal !== null;
    }, [selectedProposal]);

    return {
        // Estados
        isOpen,
        currentView,
        selectedProposal,
        modalRef,

        // Funciones de navegación principal
        openModal,
        closeModal,
        resetModal,

        // Funciones de navegación entre vistas
        navigateToView,
        showDetails,
        showEdit,
        showActions,
        goBack,

        // Funciones de verificación
        isViewActive,
        hasSelectedProposal,
        getCurrentViewInfo
    };
};

export default useProjectModal;