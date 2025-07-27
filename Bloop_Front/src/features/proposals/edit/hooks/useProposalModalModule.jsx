import { useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts';
import useProposalDetails from './useProposalDetails';
import useProposalModalActions from './useProposalAction';
import { prepareModalData } from '../helpers/proposalModalMapper';

// Hook unificador que orquesta toda la funcionalidad de la modal de propuestas
const useProposalModalModule = () => {
    const { user } = useAuth();

    // Inicializar hooks especializados
    const proposalDetails = useProposalDetails();
    const modalActions = useProposalModalActions();

    // Datos procesados para la modal usando el helper
    const modalData = useMemo(() => {
        if (!proposalDetails.proposalDetails || !user) {
            return null;
        }

        return prepareModalData(
            proposalDetails.proposalDetails,
            proposalDetails.objectives,
            proposalDetails.requirements,
            user
        );
    }, [
        proposalDetails.proposalDetails,
        proposalDetails.objectives,
        proposalDetails.requirements,
        user
    ]);

    // Función unificada para abrir la modal con una propuesta
    const openProposalModal = useCallback(async (proposal, mode = 'view') => {
        try {
            // Abrir la modal inmediatamente para mostrar loading
            modalActions.openModal(proposal, mode);

            // Obtener detalles completos en paralelo
            await proposalDetails.fetchProposalDetails(proposal.pp_id || proposal.id);

        } catch (error) {
            console.error('Error al abrir modal de propuesta:', error);
            // Cerrar modal si hay error
            modalActions.closeModal();
            throw error;
        }
    }, [modalActions.openModal, proposalDetails.fetchProposalDetails]);

    // Función unificada para cerrar la modal
    const closeProposalModal = useCallback(() => {
        modalActions.closeModal();
        // Mantener los detalles cargados por si se vuelve a abrir
        // proposalDetails.clearProposalDetails(); // Opcional: descomentar si quieres limpiar
    }, [modalActions.closeModal]);

    // Función para cambiar a modo edición
    const enterEditMode = useCallback(() => {
        modalActions.changeModalMode('edit');
    }, [modalActions.changeModalMode]);

    // Función para salir del modo edición
    const exitEditMode = useCallback(() => {
        modalActions.changeModalMode('view');
    }, [modalActions.changeModalMode]);

    // Función unificada para editar propuesta
    const editProposal = useCallback(async (proposalData) => {
        try {
            const result = await modalActions.handleEditProposal(proposalData);
            
            // Refrescar datos después de editar
            if (result.success) {
                await proposalDetails.refreshProposalDetails();
            }
            
            return result;
        } catch (error) {
            console.error('Error en editProposal:', error);
            throw error;
        }
    }, [modalActions.handleEditProposal, proposalDetails.refreshProposalDetails]);

    // Función unificada para aprobar propuesta
    const approveProposal = useCallback(async (proposalId) => {
        try {
            const result = await modalActions.handleApproveProposal(proposalId);
            
            // Refrescar datos después de aprobar
            if (result.success) {
                await proposalDetails.refreshProposalDetails();
            }
            
            return result;
        } catch (error) {
            console.error('Error en approveProposal:', error);
            throw error;
        }
    }, [modalActions.handleApproveProposal, proposalDetails.refreshProposalDetails]);

    // Función unificada para rechazar propuesta
    const rejectProposal = useCallback(async (proposalId, reason) => {
        try {
            const result = await modalActions.handleRejectProposal(proposalId, reason);
            
            // Refrescar datos después de rechazar
            if (result.success) {
                await proposalDetails.refreshProposalDetails();
            }
            
            return result;
        } catch (error) {
            console.error('Error en rejectProposal:', error);
            throw error;
        }
    }, [modalActions.handleRejectProposal, proposalDetails.refreshProposalDetails]);

    // Función unificada para aplicar a propuesta
    const applyToProposal = useCallback(async (proposalId) => {
        try {
            const result = await modalActions.handleApplyToProposal(proposalId);
            
            // No necesita refrescar los detalles de la propuesta, 
            // pero podría necesitar actualizar el estado de aplicación del usuario
            
            return result;
        } catch (error) {
            console.error('Error en applyToProposal:', error);
            throw error;
        }
    }, [modalActions.handleApplyToProposal]);

    // Función para refrescar todos los datos
    const refreshModalData = useCallback(async () => {
        if (modalActions.selectedProposal) {
            return await proposalDetails.refreshProposalDetails();
        }
    }, [modalActions.selectedProposal, proposalDetails.refreshProposalDetails]);

    // API unificada y limpia para usar en componentes
    return {
        // Datos principales procesados
        modalData,
        
        // Estados de la modal
        isOpen: modalActions.isModalOpen,
        isLoading: proposalDetails.loading,
        error: proposalDetails.error,
        mode: modalActions.modalMode,

        // Datos raw para casos especiales
        rawData: {
            proposal: proposalDetails.proposalDetails,
            objectives: proposalDetails.objectives,
            requirements: proposalDetails.requirements
        },

        // Acciones principales de modal
        actions: {
            open: openProposalModal,
            close: closeProposalModal,
            enterEditMode,
            exitEditMode,
            refresh: refreshModalData
        },

        // Acciones de propuestas
        proposalActions: {
            edit: editProposal,
            approve: approveProposal,
            reject: rejectProposal,
            apply: applyToProposal
        },

        // Estados de loading específicos
        loading: {
            modal: proposalDetails.loading,
            editing: modalActions.editingProposal,
            approving: modalActions.approvingProposal,
            rejecting: modalActions.rejectingProposal,
            applying: modalActions.applyingToProposal,
            anyAction: modalActions.isAnyActionLoading
        },

        // Estados derivados para UI
        ui: {
            // Estados de modal
            hasData: !!modalData,
            isViewMode: modalActions.isViewMode,
            isEditMode: modalActions.isEditMode,
            canInteract: modalActions.canInteract,
            
            // Estados de contenido
            hasObjectives: proposalDetails.hasObjectives,
            hasRequirements: proposalDetails.hasRequirements,
            objectivesCount: proposalDetails.objectivesCount,
            requirementsCount: proposalDetails.requirementsCount,
            
            // Estados de error
            hasError: !!proposalDetails.error,
            isEmpty: proposalDetails.isEmpty
        },

        // Información del usuario actual (útil para permisos)
        currentUser: user,

        // Estados de permisos (desde modalData)
        permissions: modalData?.permissions || {
            canEdit: false,
            canManageApproval: false,
            canApply: false
        }
    };
};

export default useProposalModalModule;