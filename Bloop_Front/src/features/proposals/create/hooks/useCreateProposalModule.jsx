import { useMemo } from 'react';
import { useCatalogList } from './useCatalogList';
import { useProposalForm } from './useProposalForm';
import { useProposalSubmit } from './useProposalSubmit';
import { canCreateProposal } from '../helpers/roleVerificate';

const useCreateProposalModule = (initialValues, userData) => {
    // Verificar permisos
    const hasPermission = canCreateProposal(userData?.rol);
    
    // Estabilizar catalogsToLoad para evitar recreación
    const catalogsToLoad = useMemo(() => {
        return hasPermission ? ['projectTypes', 'subjects'] : [];
    }, [hasPermission]);
    
    // Estabilizar userData con useMemo
    const stableUserData = useMemo(() => {
        if (!hasPermission || !userData?.id || !userData?.rol) return null;
        
        return {
            user_id: userData.id,
            user_rol: userData.rol
        };
    }, [hasPermission, userData?.id, userData?.rol]);

    // Hooks especializados
    const catalogHook = useCatalogList(catalogsToLoad, stableUserData);
    const formHook = useProposalForm(initialValues);
    const submitHook = useProposalSubmit();

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!hasPermission) {
            alert('No tiene permisos para crear propuestas');
            return;
        }

        const result = await submitHook.submitProposal(formHook.formData, userData);
        
        if (result.success) {
            alert(result.message);
        } else {
            alert('Error al crear propuesta: ' + result.message);
        }
    };

    return {
        // Estados de permisos
        hasPermission,
        
        // Catálogos
        catalogs: catalogHook.catalogs,
        catalogsLoading: catalogHook.loading,
        catalogsError: catalogHook.error,
        reloadCatalogs: catalogHook.reloadCatalogs,
        
        // Formulario
        formData: formHook.formData,
        handleChange: formHook.handleChange,
        handleSelectChange: formHook.handleSelectChange,
        activeObjectiveIndex: formHook.activeObjectiveIndex,
        setActiveObjectiveIndex: formHook.setActiveObjectiveIndex,
        
        // Objetivos
        addSpecificObjective: formHook.addSpecificObjective,
        removeSpecificObjective: formHook.removeSpecificObjective,
        updateSpecificObjective: formHook.updateSpecificObjective,
        getObjectivesStats: formHook.getObjectivesStats,
        
        // Requerimientos
        addRequirement: formHook.addRequirement,
        removeRequirement: formHook.removeRequirement,
        getRequirementsStats: formHook.getRequirementsStats,
        
        // Envío
        isSubmitting: submitHook.isSubmitting,
        submitError: submitHook.submitError,
        handleSubmit,
        clearSubmitError: submitHook.clearSubmitError
    };
};

export default useCreateProposalModule;