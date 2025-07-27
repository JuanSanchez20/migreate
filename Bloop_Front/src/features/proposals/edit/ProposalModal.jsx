import React, { useEffect } from 'react';
import useProposalModalModule from './hooks/useProposalModalModule';

// Subcomponentes principales
import ProposalBasicInfo from './subcomponents/ProposalBasicInfo';
import ProposalObjectives from './subcomponents/ProposalObjectives';
import ProposalRequirements from './subcomponents/ProposalRequirements';
import ProposalActions from './subcomponents/ProposalActions';

// Estados de la modal
import { ErrorState, LoadingState, ModalHeader } from './subcomponents/ProposalStates';

const ProposalModal = ({ selectedProposal, onClose, className = '' }) => {
    const modalModule = useProposalModalModule();
    const isOpen = !!selectedProposal;

    // Cargar datos cuando se selecciona una propuesta
    useEffect(() => {
        if (!selectedProposal) return;

        const selectedId = selectedProposal.pp_id || selectedProposal.id;
        const loadedId = modalModule.modalData?.proposal?.id;

        // Si no hay datos cargados O si cambió la propuesta, cargar nuevos datos
        if (!modalModule.modalData || selectedId !== loadedId) {
            modalModule.actions.open(selectedProposal, 'view');
        }
    }, [selectedProposal]);

    // Manejar cierre de modal
    const handleClose = () => {
        modalModule.actions.close();
        onClose?.();
    };

    // Handlers de acciones
    const handleEditProposal = async (proposalData) => {
        try {
            const result = await modalModule.proposalActions.edit(proposalData);
            if (result.success) await modalModule.actions.refresh();
        } catch (error) {
            console.error('Error al editar propuesta:', error);
        }
    };

    const handleApproveProposal = async (proposalId) => {
        try {
            const result = await modalModule.proposalActions.approve(proposalId);
            if (result.success) await modalModule.actions.refresh();
        } catch (error) {
            console.error('Error al aprobar propuesta:', error);
        }
    };

    const handleRejectProposal = async (proposalId, reason) => {
        try {
            const result = await modalModule.proposalActions.reject(proposalId, reason);
            if (result.success) await modalModule.actions.refresh();
        } catch (error) {
            console.error('Error al rechazar propuesta:', error);
        }
    };

    const handleApplyToProposal = async (proposalId) => {
        try {
            await modalModule.proposalActions.apply(proposalId);
        } catch (error) {
            console.error('Error al aplicar a propuesta:', error);
        }
    };

    // Cerrar modal con Escape y prevenir scroll
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) handleClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) handleClose();
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${className}`}
            onClick={handleBackdropClick}
        >
            <div 
                className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl transform transition-all"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <ModalHeader 
                    modalData={modalModule.modalData}
                    mode={modalModule.mode}
                    onClose={handleClose}
                />

                <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
                    <div className="p-6">
                        {modalModule.error ? (
                            <ErrorState 
                                error={modalModule.error} 
                                onClose={handleClose}
                                onRetry={() => modalModule.actions.refresh()} 
                            />
                        ) : !modalModule.modalData || modalModule.isLoading ? (
                            <LoadingState />
                        ) : (
                            <div className="space-y-6">
                                <ProposalBasicInfo
                                    proposal={modalModule.modalData.proposal}
                                    currentUser={modalModule.currentUser}
                                    isLoading={modalModule.isLoading}
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <ProposalObjectives
                                        objectives={modalModule.modalData.objectives}
                                        isLoading={modalModule.loading?.modal}
                                        error={null}
                                    />

                                    <ProposalRequirements
                                        requirements={modalModule.modalData.requirements}
                                        isLoading={modalModule.loading?.modal}
                                        error={null}
                                    />
                                </div>

                                <div className="border-t border-gray-600 pt-6">
                                    <ProposalActions
                                        proposal={modalModule.modalData.proposal}
                                        currentUser={modalModule.currentUser}
                                        permissions={modalModule.modalData.permissions}
                                        availableActions={modalModule.modalData.actions}
                                        loading={modalModule.loading}
                                        mode={modalModule.mode}
                                        onEdit={() => modalModule.actions.enterEditMode()}
                                        onApprove={handleApproveProposal}
                                        onReject={handleRejectProposal}
                                        onApply={handleApplyToProposal}
                                        onClose={handleClose}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalModal;