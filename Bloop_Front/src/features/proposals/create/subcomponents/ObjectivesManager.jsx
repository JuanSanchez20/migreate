import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Button, TextArea, CardSectionTitle } from '@/components';

export const SpecificObjectivesManager = ({
    specificObjectives,
    activeObjectiveIndex,
    setActiveObjectiveIndex,
    addSpecificObjective,
    removeSpecificObjective,
    updateSpecificObjective
}) => {
    const MAX_OBJECTIVES = 3;
    const canAddMore = specificObjectives.length < MAX_OBJECTIVES;
    
    // Alterna la expansión del objetivo
    const handleToggleObjective = (index) => {
        setActiveObjectiveIndex(activeObjectiveIndex === index ? null : index);
    };
    
    // Elimina un objetivo específico
    const handleRemoveObjective = (index) => {
        setActiveObjectiveIndex(null);
        removeSpecificObjective(index);
    };

    // Maneja cambios en campos del objetivo
    const handleFieldChange = (index, field, value) => {
        const objective = specificObjectives[index];
        updateSpecificObjective(index, { ...objective, [field]: value });
    };
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">📌</span>
                    <CardSectionTitle className="text-white">
                        Objetivos Específicos
                    </CardSectionTitle>
                </div>
                
                <div className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#48d1c1', color: 'white' }}>
                    {specificObjectives.length}/{MAX_OBJECTIVES}
                </div>
            </div>
            
            <div className="space-y-3">
                {specificObjectives.map((objective, index) => {
                    const isActive = index === activeObjectiveIndex;
                    const displayTitle = objective.title || `Objetivo Específico ${index + 1}`;
                    
                    return (
                        <div
                            key={index}
                            className={`rounded-xl overflow-hidden transition-all duration-300 transform ${
                                isActive ? 'scale-105 shadow-lg' : 'hover:scale-102 shadow-md'
                            }`}
                            style={{
                                backgroundColor: isActive ? '#278bbd' : 'white',
                                borderColor: '#48d1c1',
                                border: '2px solid'
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => handleToggleObjective(index)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:opacity-80 transition-opacity"
                                style={{ color: isActive ? 'white' : '#2c3844' }}
                                aria-expanded={isActive}
                            >
                                <span className="font-semibold text-left">
                                    {displayTitle}
                                </span>
                                <div className="flex items-center space-x-2">
                                    {isActive ? (
                                        <ChevronUpIcon className="h-5 w-5" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5" />
                                    )}
                                </div>
                            </button>

                            {isActive && (
                                <div className="px-4 pb-4 space-y-3" style={{ backgroundColor: '#3a4a5c' }}>
                                    <div>
                                        <TextArea
                                            label="Título del Objetivo"
                                            id={`specificTitle${index}`}
                                            name={`specificObjectives[${index}].title`}
                                            value={objective.title}
                                            onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                            placeholder="Título del objetivo específico"
                                            rows={1}
                                            required
                                            className="w-full"
                                            style={{
                                                backgroundColor: '#2c3844',
                                                borderColor: '#48d1c1',
                                                color: 'white',
                                                border: '2px solid'
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <TextArea
                                            label="Descripción Detallada"
                                            id={`specificDesc${index}`}
                                            name={`specificObjectives[${index}].description`}
                                            value={objective.description}
                                            onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                            rows={2}
                                            placeholder="Descripción detallada del objetivo específico"
                                            required
                                            className="w-full"
                                            style={{
                                                backgroundColor: '#2c3844',
                                                borderColor: '#48d1c1',
                                                color: 'white',
                                                border: '2px solid'
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemoveObjective(index)}
                                            className="hover:scale-105 transition-transform"
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {canAddMore && (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full py-3 border-2 border-dashed hover:scale-105 transition-transform"
                        onClick={addSpecificObjective}
                        style={{ 
                            borderColor: '#48d1c1',
                            color: '#278bbd',
                            backgroundColor: 'white'
                        }}
                        title={`Puedes agregar ${MAX_OBJECTIVES - specificObjectives.length} objetivo(s) más`}
                    >
                        Agregar Objetivo Específico ({MAX_OBJECTIVES - specificObjectives.length} restante{MAX_OBJECTIVES - specificObjectives.length !== 1 ? 's' : ''})
                    </Button>
                )}
                
                {!canAddMore && (
                    <div className="text-center py-3">
                        <p className="text-sm" style={{ color: '#48d1c1' }}>
                            Has alcanzado el límite máximo de {MAX_OBJECTIVES} objetivos específicos
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};