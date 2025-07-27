import React from 'react';
import { CardSectionTitle, TextArea } from '@/components';
import { SpecificObjectivesManager } from './ObjectivesManager';

export const ObjectivesSection = ({
    formData,
    handleChange,
    activeObjectiveIndex,
    setActiveObjectiveIndex,
    addSpecificObjective,
    removeSpecificObjective,
    updateSpecificObjective
}) => {
    const objectives = formData.objectives || [];

    // Obtiene el objetivo general
    const getGeneralObjective = () => {
        return objectives.find(obj => obj.type === 'General') || { name: '', description: '' };
    };

    // Actualiza el objetivo general
    const updateGeneralObjective = (field, value) => {
        const existingIndex = objectives.findIndex(obj => obj.type === 'General');
        let updatedObjectives;
        
        if (existingIndex >= 0) {
            updatedObjectives = [...objectives];
            updatedObjectives[existingIndex] = {
                ...updatedObjectives[existingIndex],
                [field]: value
            };
        } else {
            const newGeneral = {
                name: field === 'name' ? value : '',
                type: 'General',
                description: field === 'description' ? value : ''
            };
            updatedObjectives = [newGeneral, ...objectives];
        }
        
        handleChange({
            target: { name: 'objectives', value: updatedObjectives }
        });
    };

    // Obtiene objetivos específicos para el gestor
    const getSpecificObjectives = () => {
        return objectives
            .filter(obj => obj.type === 'Específico')
            .map(obj => ({ title: obj.name, description: obj.description }));
    };

    const generalObjective = getGeneralObjective();
    const specificObjectives = getSpecificObjectives();

    return (
        <div className="bg-opacity-20 p-6 rounded-xl border-2">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎯</span>
                        <CardSectionTitle>Objetivo General</CardSectionTitle>
                    </div>
                    
                    <div className="space-y-2">
                        <TextArea
                            label="Nombre del Objetivo General"
                            id="generalObjectiveName"
                            name="generalObjectiveName"
                            value={generalObjective.name || ''}
                            onChange={(e) => updateGeneralObjective('name', e.target.value)}
                            rows={2}
                            placeholder="Nombre conciso del objetivo principal"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <TextArea
                            label="Descripción Detallada"
                            id="generalObjectiveDesc"
                            name="generalObjectiveDesc"
                            value={generalObjective.description || ''}
                            onChange={(e) => updateGeneralObjective('description', e.target.value)}
                            rows={4}
                            placeholder="Describe el propósito principal y el resultado esperado del proyecto"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <SpecificObjectivesManager
                        specificObjectives={specificObjectives}
                        activeObjectiveIndex={activeObjectiveIndex}
                        setActiveObjectiveIndex={setActiveObjectiveIndex}
                        addSpecificObjective={addSpecificObjective}
                        removeSpecificObjective={removeSpecificObjective}
                        updateSpecificObjective={updateSpecificObjective}
                    />
                </div>
            </div>
        </div>
    );
};