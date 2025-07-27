import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts';

// Hook para manejar las acciones disponibles en la modal de propuestas
const useProposalActions = () => {
    const { user } = useAuth();

    // Estados de la modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'

    // Estados de loading para acciones específicas
    const [editingProposal, setEditingProposal] = useState(false);
    const [approvingProposal, setApprovingProposal] = useState(false);
    const [rejectingProposal, setRejectingProposal] = useState(false);
    const [applyingToProposal, setApplyingToProposal] = useState(false);

    // Abre la modal con una propuesta específica
    const openModal = useCallback((proposal, mode = 'view') => {
        if (!proposal) {
            console.warn('Intento de abrir modal sin propuesta');
            return;
        }

        setSelectedProposal(proposal);
        setModalMode(mode);
        setIsModalOpen(true);
    }, []);

    // Cierra la modal y limpia estados
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedProposal(null);
        setModalMode('view');
        
        // Resetear estados de loading
        setEditingProposal(false);
        setApprovingProposal(false);
        setRejectingProposal(false);
        setApplyingToProposal(false);
    }, []);

    // Cambia el modo de la modal
    const changeModalMode = useCallback((newMode) => {
        const validModes = ['view', 'edit'];
        if (validModes.includes(newMode)) {
            setModalMode(newMode);
        } else {
            console.warn(`Modo de modal inválido: ${newMode}`);
        }
    }, []);

    // Acción para editar propuesta (placeholder - se implementará cuando tengas el endpoint)
    const handleEditProposal = useCallback(async (proposalData) => {
        try {
            setEditingProposal(true);
            
            console.log('Editando propuesta:', {
                proposalId: proposalData.id,
                updatedData: proposalData,
                user: user.id
            });

            // TODO: Implementar llamada al servicio de edición cuando esté listo
            // const response = await updateProposalService(proposalData);
            
            // Simular delay de red por ahora
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // TODO: Manejar respuesta exitosa
            console.log('Propuesta editada exitosamente');
            
            // Cambiar de vuelta a modo vista
            setModalMode('view');
            
            return { success: true, message: 'Propuesta actualizada correctamente' };

        } catch (error) {
            console.error('Error al editar propuesta:', error);
            throw new Error(error.message || 'Error al actualizar la propuesta');
        } finally {
            setEditingProposal(false);
        }
    }, [user?.id]);

    // Acción para aprobar propuesta (placeholder - se implementará cuando tengas el endpoint)
    const handleApproveProposal = useCallback(async (proposalId) => {
        try {
            setApprovingProposal(true);
            
            console.log('Aprobando propuesta:', {
                proposalId,
                approvedBy: user.id,
                userRole: user.rol
            });

            // TODO: Implementar llamada al servicio de aprobación cuando esté listo
            // const response = await approveProposalService(proposalId);
            
            // Simular delay de red por ahora
            await new Promise(resolve => setTimeout(resolve, 800));
            
            console.log('Propuesta aprobada exitosamente');
            
            return { success: true, message: 'Propuesta aprobada correctamente' };

        } catch (error) {
            console.error('Error al aprobar propuesta:', error);
            throw new Error(error.message || 'Error al aprobar la propuesta');
        } finally {
            setApprovingProposal(false);
        }
    }, [user?.id, user?.rol]);

    // Acción para rechazar propuesta (placeholder - se implementará cuando tengas el endpoint)
    const handleRejectProposal = useCallback(async (proposalId, reason = '') => {
        try {
            setRejectingProposal(true);
            
            console.log('Rechazando propuesta:', {
                proposalId,
                rejectedBy: user.id,
                userRole: user.rol,
                reason
            });

            // TODO: Implementar llamada al servicio de rechazo cuando esté listo
            // const response = await rejectProposalService(proposalId, reason);
            
            // Simular delay de red por ahora
            await new Promise(resolve => setTimeout(resolve, 800));
            
            console.log('Propuesta rechazada exitosamente');
            
            return { success: true, message: 'Propuesta rechazada correctamente' };

        } catch (error) {
            console.error('Error al rechazar propuesta:', error);
            throw new Error(error.message || 'Error al rechazar la propuesta');
        } finally {
            setRejectingProposal(false);
        }
    }, [user?.id, user?.rol]);

    // Acción para aplicar a propuesta (placeholder - se implementará cuando tengas el endpoint)
    const handleApplyToProposal = useCallback(async (proposalId) => {
        try {
            setApplyingToProposal(true);
            
            console.log('Aplicando a propuesta:', {
                proposalId,
                studentId: user.id,
                userRole: user.rol
            });

            // TODO: Implementar llamada al servicio de aplicación cuando esté listo
            // const response = await applyToProposalService(proposalId);
            
            // Simular delay de red por ahora
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Aplicación enviada exitosamente');
            
            return { success: true, message: 'Aplicación enviada correctamente' };

        } catch (error) {
            console.error('Error al aplicar a propuesta:', error);
            throw new Error(error.message || 'Error al enviar la aplicación');
        } finally {
            setApplyingToProposal(false);
        }
    }, [user?.id, user?.rol]);

    // Verifica si alguna acción está en proceso
    const isAnyActionLoading = useCallback(() => {
        return editingProposal || approvingProposal || rejectingProposal || applyingToProposal;
    }, [editingProposal, approvingProposal, rejectingProposal, applyingToProposal]);

    return {
        // Estados de la modal
        isModalOpen,
        selectedProposal,
        modalMode,

        // Estados de loading específicos
        editingProposal,
        approvingProposal,
        rejectingProposal,
        applyingToProposal,

        // Acciones de modal
        openModal,
        closeModal,
        changeModalMode,

        // Acciones de propuestas
        handleEditProposal,
        handleApproveProposal,
        handleRejectProposal,
        handleApplyToProposal,

        // Estados derivados para UI
        isViewMode: modalMode === 'view',
        isEditMode: modalMode === 'edit',
        hasSelectedProposal: !!selectedProposal,
        isAnyActionLoading: isAnyActionLoading(),
        canInteract: !isAnyActionLoading()
    };
};

export default useProposalActions;