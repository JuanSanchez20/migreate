import React from 'react';
import { FolderIcon  } from '@heroicons/react/24/outline';
import { Button, Card, CardHeader, CardContent } from '@/components';
import { BasicInformationSection } from './subcomponents/BasicInformationSection';
import { SubjectSection } from './subcomponents/SubjectSection';
import { ObjectivesSection } from './subcomponents/ObjectivesSection';
import { RequirementsSection } from './subcomponents/RequirementsSection';

// Organiza los subcomponentes del formulario de crear propuesta
export const CreateProposalForm = ({
    // Estados de permisos
    hasPermission,
    
    // Datos del formulario
    formData,
    handleChange,
    handleSelectChange,
    
    // Catálogos
    catalogs,
    catalogsLoading,
    catalogsError,
    reloadCatalogs,
    
    // Objetivos
    activeObjectiveIndex,
    setActiveObjectiveIndex,
    addSpecificObjective,
    removeSpecificObjective,
    updateSpecificObjective,
    
    // Requerimientos
    addRequirement,
    removeRequirement,
    
    // Envío
    handleSubmit,
    isSubmitting
}) => {
    // Renderiza mensaje de sin permisos
    if (!hasPermission) {
        return (
            <div className="min-h-screen p-6">
                <Card>
                    <CardHeader
                        icon={FolderIcon}
                        title="Crear Nueva Propuesta"
                        description="No tienes permisos para acceder a esta funcionalidad"
                        className="border-b border-opacity-20"
                    />
                    <CardContent className="p-8">
                        <div className="text-center py-8">
                            <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#3a4a5c', borderColor: '#ef4444' }}>
                                <h3 className="text-lg font-semibold text-red-400 mb-2">
                                    Acceso Restringido
                                </h3>
                                <p className="text-red-300">
                                    Solo administradores y tutores pueden crear propuestas.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <Card>
                <CardHeader
                    icon={FolderIcon}
                    title="Crear Nueva Propuesta"
                    description="Completa el formulario para agregar una nueva propuesta al sistema"
                    className="border-b border-opacity-20"
                />

                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Información básica */}
                        <BasicInformationSection
                            formData={formData}
                            handleChange={handleChange}
                            handleSelectChange={handleSelectChange}
                            catalogs={catalogs}
                            catalogsLoading={catalogsLoading}
                            catalogsError={catalogsError}
                            reloadCatalogs={reloadCatalogs}
                        />

                        {/* Selección de materia */}
                        <SubjectSection
                            formData={formData}
                            handleSelectChange={handleSelectChange}
                            catalogs={catalogs}
                            catalogsLoading={catalogsLoading}
                            catalogsError={catalogsError}
                            reloadCatalogs={reloadCatalogs}
                            hasPermission={hasPermission}
                        />

                        {/* Objetivos del proyecto */}
                        <ObjectivesSection
                            formData={formData}
                            handleChange={handleChange}
                            activeObjectiveIndex={activeObjectiveIndex}
                            setActiveObjectiveIndex={setActiveObjectiveIndex}
                            addSpecificObjective={addSpecificObjective}
                            removeSpecificObjective={removeSpecificObjective}
                            updateSpecificObjective={updateSpecificObjective}
                        />

                        {/* Requerimientos */}
                        <RequirementsSection
                            formData={formData}
                            addRequirement={addRequirement}
                            removeRequirement={removeRequirement}
                        />

                        {/* Configuración grupal */}
                        <GroupConfigurationSection
                            formData={formData}
                            handleChange={handleChange}
                            handleSelectChange={handleSelectChange}
                        />
                        
                        {/* Botones de acción */}
                        <ActionButtonsSection 
                            isSubmitting={isSubmitting}
                        />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

// Sección para configuración de propuestas grupales
const GroupConfigurationSection = ({ 
    formData, 
    handleChange, 
    handleSelectChange 
}) => {
    return (
        <div className="p-6 rounded-xl border-2">
            <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">👥</span>
                <h3 className="text-lg font-semibold text-[#278bbd] border-b border-slate-600 pb-2">
                    Configuración del Proyecto
                </h3>
            </div>

            <div className="space-y-4">
                {/* Checkbox para proyecto grupal */}
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="grupal"
                        name="grupal"
                        checked={formData.grupal || false}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#48d1c1] bg-slate-700 border-slate-600 rounded focus:ring-[#48d1c1] focus:ring-2"
                    />
                    <label htmlFor="grupal" className="text-sm font-medium text-slate-300">
                        Este es un proyecto grupal
                    </label>
                </div>

                {/* Campo de número de integrantes */}
                {formData.grupal && (
                    <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            Número de Integrantes
                        </label>
                        <input
                            type="number"
                            id="integrants"
                            name="integrants"
                            value={formData.integrants || ''}
                            onChange={handleChange}
                            min="2"
                            max="10"
                            placeholder="Ej: 3"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-[#48d1c1] focus:ring-2 focus:ring-[#48d1c1]/50 focus:outline-none transition-all duration-200"
                            required={formData.grupal}
                        />
                        <p className="text-xs text-slate-500">
                            Especifica cuántos estudiantes pueden participar en este proyecto (mínimo 2, máximo 10)
                        </p>
                    </div>
                )}

                {/* Fecha límite opcional */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                        Fecha Límite (Opcional)
                    </label>
                    <input
                        type="date"
                        id="dateLimit"
                        name="dateLimit"
                        value={formData.dateLimit || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-[#48d1c1] focus:ring-2 focus:ring-[#48d1c1]/50 focus:outline-none transition-all duration-200"
                    />
                    <p className="text-xs text-slate-500">
                        Fecha límite para la entrega del proyecto
                    </p>
                </div>
            </div>
        </div>
    );
};

// Sección de botones de acción del formulario
const ActionButtonsSection = ({ isSubmitting }) => {
    return (
        <div className="pt-6 border-t border-slate-600">
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 h-12 font-semibold hover:scale-105 transition-transform shadow-lg"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                >
                    {isSubmitting ? 'Creando propuesta...' : 'Crear Propuesta'}
                </Button>
                
                <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 h-12 font-semibold hover:scale-105 transition-transform"
                    disabled={isSubmitting}
                    onClick={() => {
                        if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados.')) {
                            window.history.back();
                        }
                    }}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
};

export default CreateProposalForm;