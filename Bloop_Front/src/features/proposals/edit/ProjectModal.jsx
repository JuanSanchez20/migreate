import React from 'react';
import { 
    XMarkIcon, 
    ArrowLeftIcon,
    PencilIcon,
    EyeIcon,
    BookOpenIcon
} from '@heroicons/react/24/solid';
import { Button } from '@/components/common';
import { NotificationBanner } from '@/components/common';
import useProjectModule from '../hooks/useProjectModule';
import ProjectBasicInfo from '../subcomponents/ProjectBasicInfo';
import ProjectDetails from '../subcomponents/ProjectDetails';
import ProjectEditForm from '../subcomponents/ProjectEditForm';
import ProjectActions from '../subcomponents/ProjectActions';
import { getModalViewConfig } from '../helpers/projectConfig';
import { mapProposalToModal } from '../helpers/projectMappers';

// Componente modal principal que orquesta toda la funcionalidad de propuestas
const ProjectModal = ({ 
    proposal, 
    onClose, 
    initialView = 'details' 
}) => {
    // Hook unificado que maneja toda la lógica
    const {
        userInfo,
        isLoading,
        hasError,
        errorMessage,
        modal,
        edit,
        actions,
        permissions,
        openModalSafely,
        startEditSafely,
        applyToProposalSafely,
        loadApplicantsSafely,
        closeModal,
        resetAll
    } = useProjectModule();

    // Abrir modal automáticamente cuando se pasa una propuesta
    React.useEffect(() => {
        if (proposal && !modal.isOpen) {
            const mappedProposal = mapProposalToModal(proposal);
            openModalSafely(mappedProposal, initialView);
        }
    }, [proposal, initialView]);

    // Cerrar modal cuando se llama onClose desde el padre
    React.useEffect(() => {
        if (!proposal && modal.isOpen) {
            handleClose();
        }
    }, [proposal]);

    // Cierra la modal y resetea estados
    const handleClose = () => {
        closeModal();
        resetAll();
        onClose?.();
    };

    // Inicia edición con datos completos
    const handleStartEdit = () => {
        if (!modal.selectedProposal) return;
        
        // Aquí cargarías objetivos y requerimientos si los necesitas
        const objectives = []; // Cargar desde API
        const requirements = []; // Cargar desde API
        
        startEditSafely(modal.selectedProposal, objectives, requirements);
    };

    // Guarda cambios y vuelve a vista de detalles
    const handleSaveEdit = async () => {
        const success = await edit.saveChanges();
        if (success) {
            modal.showDetails();
        }
    };

    // Cancela edición y vuelve a vista de detalles
    const handleCancelEdit = () => {
        edit.cancelEdit();
        modal.showDetails();
    };

    // Obtiene la configuración de la vista actual
    const currentViewConfig = getModalViewConfig(modal.currentView);

    // No renderizar si no hay modal abierta
    if (!modal.isOpen || !modal.selectedProposal) {
        return null;
    }

    // Contenido según la vista actual
    const renderViewContent = () => {
        switch (modal.currentView) {
            case 'edit':
                return (
                    <ProjectEditForm
                        editData={edit.editData}
                        onUpdateBasicField={edit.updateBasicField}
                        onAddObjective={edit.addObjective}
                        onUpdateObjective={edit.updateObjective}
                        onRemoveObjective={edit.removeObjective}
                        onAddRequirement={edit.addRequirement}
                        onUpdateRequirement={edit.updateRequirement}
                        onRemoveRequirement={edit.removeRequirement}
                        errors={edit.validateForm()}
                    />
                );
            
            case 'actions':
                return (
                    <ProjectActions
                        proposal={modal.selectedProposal}
                        permissions={permissions}
                        actions={actions}
                        loading={isLoading}
                        error={errorMessage}
                    />
                );
            
            default: // 'details'
                return (
                    <div className="space-y-6">
                        <ProjectBasicInfo proposal={modal.selectedProposal} />
                        <ProjectDetails proposal={modal.selectedProposal} />
                    </div>
                );
        }
    };

    // Botones del footer según la vista
    const renderFooterButtons = () => {
        if (modal.currentView === 'edit') {
            return (
                <>
                    <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="approved"
                        onClick={handleSaveEdit}
                        disabled={isLoading || edit.validateForm().length > 0}
                    >
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </>
            );
        }

        return (
            <>
                {/* Botón de editar - solo si tiene permisos */}
                {permissions.canEdit && modal.currentView === 'details' && (
                    <Button
                        variant="outline"
                        onClick={handleStartEdit}
                        disabled={isLoading}
                        className="flex items-center space-x-2"
                    >
                        <PencilIcon className="h-4 w-4" />
                        <span>Editar</span>
                    </Button>
                )}

                {/* Botón de acciones - solo si puede aplicar o ver aplicantes */}
                {(permissions.canApply || permissions.canViewApplicants) && modal.currentView === 'details' && (
                    <Button
                        variant="dark"
                        onClick={modal.showActions}
                        disabled={isLoading}
                        className="flex items-center space-x-2"
                    >
                        <EyeIcon className="h-4 w-4" />
                        <span>
                            {permissions.canApply ? 'Aplicar' : 'Ver Aplicantes'}
                        </span>
                    </Button>
                )}

                <Button
                    variant="dark"
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cerrar
                </Button>
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
                ref={modal.modalRef}
                className="bg-gray-800 rounded-xl w-full max-w-6xl max-h-[95vh] shadow-xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-600">
                    <div className="flex items-center space-x-4">
                        {/* Botón de volver si aplica */}
                        {currentViewConfig.showBack && (
                            <button
                                onClick={modal.goBack}
                                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                title="Volver"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>
                        )}

                        {/* Icono y título */}
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <BookOpenIcon className="h-5 w-5 text-white" />
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-semibold text-white">
                                {currentViewConfig.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {modal.selectedProposal.pp_name}
                            </p>
                        </div>
                    </div>

                    {/* Botón cerrar */}
                    <button
                        onClick={handleClose}
                        className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        disabled={isLoading}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Notificaciones */}
                {hasError && (
                    <div className="p-4 border-b border-gray-600">
                        <NotificationBanner
                            notification={{
                                message: errorMessage,
                                type: 'error'
                            }}
                            onClose={() => {
                                edit.clearError?.();
                                actions.clearError?.();
                            }}
                        />
                    </div>
                )}

                {/* Contenido principal */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderViewContent()}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-600 p-6">
                    <div className="flex justify-end space-x-3">
                        {renderFooterButtons()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;