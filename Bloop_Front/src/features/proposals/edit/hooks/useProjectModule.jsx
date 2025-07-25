import { useAuth } from '@/contexts';
import useProjectModal from './useProjectModal';
import useProjectEdit from './useProjectEdit';
import useProjectActions from './useProjectActions';
import useProjectPermissions from './useProjectPermissions';

// Hook principal que unifica toda la funcionalidad de propuestas
const useProjectModule = () => {
    const { user } = useAuth();

    // Información del usuario centralizada
    const userInfo = {
        id: user?.id,
        rol: user?.rol,
        subjects: user?.subjects || []
    };

    // Hook para manejo de modales
    const modal = useProjectModal();

    // Hook para edición de propuestas
    const edit = useProjectEdit(userInfo);

    // Hook para aplicaciones y aplicantes
    const actions = useProjectActions(userInfo);

    // Hook para permisos (se pasa la propuesta seleccionada)
    const permissions = useProjectPermissions(modal.selectedProposal, userInfo);

    // Función para abrir modal y verificar permisos
    const openModalSafely = (proposal, view = 'details') => {
        const proposalPermissions = useProjectPermissions(proposal, userInfo);
        
        if (!proposalPermissions.canView) {
            console.warn('Usuario sin permisos para ver esta propuesta');
            return false;
        }

        modal.openModal(proposal, view);
        return true;
    };

    // Función para iniciar edición con verificación de permisos
    const startEditSafely = (proposal, objectives = [], requirements = []) => {
        const proposalPermissions = useProjectPermissions(proposal, userInfo);
        
        if (!proposalPermissions.canEdit) {
            console.warn('Usuario sin permisos para editar esta propuesta');
            return false;
        }

        edit.startEdit(proposal, objectives, requirements);
        modal.showEdit();
        return true;
    };

    // Función para aplicar a propuesta con verificación de permisos
    const applyToProposalSafely = async (proposal) => {
        const proposalPermissions = useProjectPermissions(proposal, userInfo);
        
        if (!proposalPermissions.canApply) {
            console.warn('Usuario sin permisos para aplicar a esta propuesta');
            return false;
        }

        return await actions.applyToProposal(proposal.pp_id);
    };

    // Función para cargar aplicantes con verificación de permisos
    const loadApplicantsSafely = async (proposal) => {
        const proposalPermissions = useProjectPermissions(proposal, userInfo);
        
        if (!proposalPermissions.canViewApplicants) {
            console.warn('Usuario sin permisos para ver aplicantes');
            return false;
        }

        return await actions.loadApplicants(proposal.pp_id);
    };

    // Estado global del módulo
    const isLoading = edit.loading || actions.loading;
    const hasError = edit.error || actions.error;
    const errorMessage = edit.error || actions.error;

    return {
        // Información del usuario
        userInfo,

        // Estados globales
        isLoading,
        hasError,
        errorMessage,

        // Hooks individuales
        modal,
        edit,
        actions,
        permissions,

        // Funciones con verificación de permisos
        openModalSafely,
        startEditSafely,
        applyToProposalSafely,
        loadApplicantsSafely,

        // Funciones de utilidad
        closeModal: modal.closeModal,
        resetAll: () => {
            modal.resetModal();
            edit.resetEditState();
            actions.clearApplicants();
        }
    };
};

export default useProjectModule;