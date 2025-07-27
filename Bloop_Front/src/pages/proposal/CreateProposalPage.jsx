import React from 'react';
import { useAuth } from '@/contexts';
import { useCreateProposalModule, CreateProposalForm } from '@/features';

// Página principal para crear propuestas
export const CreateProposalPage = () => {
    // Obtener información del usuario autenticado
    const { user, userRole, isAuthenticated } = useAuth();

    // Valores iniciales del formulario
    const initialValues = {
        name: '',
        description: '',
        projectType: '',
        subject: '',
        difficultyLevel: '',
        dateLimit: '',
        grupal: false,
        integrants: '',
        objectives: [
            {
                name: '',
                type: 'General',
                description: ''
            }
        ],
        requirements: []
    };

    // Datos del usuario para el hook
    const userData = {
        id: user?.id,
        rol: userRole
    };

    // Hook unificador que maneja toda la lógica
    const {
        // Estados de permisos
        hasPermission,
        
        // Catálogos
        catalogs,
        catalogsLoading,
        catalogsError,
        reloadCatalogs,
        
        // Formulario
        formData,
        handleChange,
        handleSelectChange,
        activeObjectiveIndex,
        setActiveObjectiveIndex,
        
        // Objetivos
        addSpecificObjective,
        removeSpecificObjective,
        updateSpecificObjective,
        getObjectivesStats,
        
        // Requerimientos
        addRequirement,
        removeRequirement,
        getRequirementsStats,
        
        // Envío
        isSubmitting,
        submitError,
        handleSubmit,
        clearSubmitError
    } = useCreateProposalModule(initialValues, userData);

    // Mostrar pantalla de carga si no está autenticado
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#48d1c1] mx-auto mb-4"></div>
                    <p className="text-slate-300">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Mostrar error de envío si existe */}
            {submitError && (
                <div className="fixed top-4 right-4 z-50 max-w-md">
                    <div className="bg-red-900/90 border border-red-500 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-red-300 font-medium">Error al crear propuesta</h4>
                                <p className="text-red-200 text-sm mt-1">{submitError}</p>
                            </div>
                            <button
                                onClick={clearSubmitError}
                                className="text-red-300 hover:text-red-100 ml-4"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario principal */}
            <CreateProposalForm
                // Estados de permisos
                hasPermission={hasPermission}
                
                // Datos del formulario
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                
                // Catálogos
                catalogs={catalogs}
                catalogsLoading={catalogsLoading}
                catalogsError={catalogsError}
                reloadCatalogs={reloadCatalogs}
                
                // Objetivos
                activeObjectiveIndex={activeObjectiveIndex}
                setActiveObjectiveIndex={setActiveObjectiveIndex}
                addSpecificObjective={addSpecificObjective}
                removeSpecificObjective={removeSpecificObjective}
                updateSpecificObjective={updateSpecificObjective}
                
                // Requerimientos
                addRequirement={addRequirement}
                removeRequirement={removeRequirement}
                
                // Envío
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default CreateProposalPage;