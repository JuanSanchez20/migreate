import React from 'react';
import { TextField, TextArea, SelectField, CardSectionTitle, Button } from '@/components';

export const BasicInformationSection = ({
    formData,
    handleChange,
    handleSelectChange,
    catalogs,
    catalogsLoading,
    catalogsError,
    reloadCatalogs
}) => {
    // Genera opciones para tipos de proyecto
    const getProjectTypeOptions = () => {
        if (catalogsLoading) {
            return [{ value: '', label: 'Cargando...', disabled: true }];
        }
        
        if (catalogsError) {
            return [{ value: '', label: 'Error al cargar', disabled: true }];
        }
        
        if (catalogs.projectTypes.length === 0) {
            return [{ value: '', label: 'No hay tipos disponibles', disabled: true }];
        }
        
        return catalogs.projectTypes;
    };

    // Genera opciones para niveles de dificultad
    const getDifficultyOptions = () => [
        { value: "Básico", label: "Básico" },
        { value: "Intermedio", label: "Intermedio" },
        { value: "Avanzado", label: "Avanzado" }
    ];

    return (
        <div className="bg-opacity-30 p-6 rounded-xl border-2">
            <CardSectionTitle>Información de la Propuesta</CardSectionTitle>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <SelectField
                        label="Tipo del Proyecto"
                        id="projectType"
                        value={formData.projectType || ''}
                        onValueChange={(value) => handleSelectChange("projectType", value)}
                        options={getProjectTypeOptions()}
                        placeholder="Seleccionar tipo"
                        className="focus:ring-2"
                        style={{
                            '--tw-ring-color': '#48d1c1',
                            backgroundColor: 'white'
                        }}
                        required
                        disabled={catalogsLoading}
                    />
                    
                    {catalogsError && (
                        <div className="text-xs text-red-500 flex items-center justify-between">
                            <span>{catalogsError}</span>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={reloadCatalogs}
                            >
                                Reintentar
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <TextField
                        label="Título de la Propuesta"
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        placeholder="Título descriptivo de la propuesta"
                        required
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                    <TextArea
                        id="description"
                        label="Descripción"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Descripción detallada de la propuesta"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <SelectField
                        label="Nivel de Dificultad"
                        id="difficultyLevel"
                        value={formData.difficultyLevel || ''}
                        onValueChange={(value) => handleSelectChange("difficultyLevel", value)}
                        options={getDifficultyOptions()}
                        placeholder="Seleccionar nivel"
                        className="focus:ring-2"
                        style={{
                            '--tw-ring-color': '#48d1c1',
                            backgroundColor: 'white'
                        }}
                        required
                    />
                </div>
            </div>
        </div>
    );
};