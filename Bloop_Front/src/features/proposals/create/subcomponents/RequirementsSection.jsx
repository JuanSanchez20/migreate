import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TextField, Button, CardSectionTitle } from '@/components';

export const RequirementsSection = ({
    formData,
    addRequirement,
    removeRequirement
}) => {
    const [newRequirement, setNewRequirement] = useState('');

    // Maneja la adición de un nuevo requerimiento
    const handleAddRequirement = () => {
        const trimmedRequirement = newRequirement.trim();
        if (!trimmedRequirement) {
            alert('Por favor, ingresa un requerimiento válido');
            return;
        }

        // Verificar duplicados
        const isDuplicate = formData.requirements?.some(req =>
            req.name.toLowerCase() === trimmedRequirement.toLowerCase()
        );

        if (isDuplicate) {
            alert('Este requerimiento ya existe en la lista');
            return;
        }

        addRequirement(trimmedRequirement);
        setNewRequirement('');
    };

    // Maneja el envío con Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddRequirement();
        }
    };

    return (
        <div className="p-6 rounded-xl border-2">
            <CardSectionTitle>Requerimientos de la Propuesta</CardSectionTitle>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulario para agregar requerimientos */}
                <div className="space-y-4">
                    <h4 className="text-md font-medium mb-3 text-cyan-400">
                        Agregar Nuevo Requerimiento
                    </h4>
                    <div className="rounded-lg p-4 border-2">
                        <div className="space-y-3">
                            <TextField
                                label="Título del Requerimiento"
                                placeholder="Ej: Implementar autenticación con JWT"
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                onKeyPress={handleKeyPress}
                                maxLength={200}
                                helpText={`${newRequirement.length}/200 caracteres`}
                            />

                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleAddRequirement}
                                disabled={!newRequirement.trim()}
                                className="w-full flex items-center justify-center space-x-2 h-10"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Agregar Requerimiento</span>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg p-3 border-2" style={{ backgroundColor: '#3a4a5c', borderColor: '#278bbd' }}>
                        <p className="text-xs" style={{ color: 'white' }}>
                            <strong style={{ color: '#48d1c1' }}>Tip:</strong> Los requerimientos ayudan a definir las
                            tecnologías, herramientas o funcionalidades específicas que debe
                            incluir el proyecto.
                        </p>
                    </div>
                </div>

                {/* Lista de requerimientos */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-md font-medium text-cyan-400">
                            Requerimientos Agregados
                        </h4>
                        <span className="text-sm px-2 py-1 rounded-full text-cyan-200">
                            {formData.requirements?.length || 0} requerimiento(s)
                        </span>
                    </div>

                    <div className="border-2 rounded-lg min-h-[180px] max-h-[200px] overflow-y-auto">
                        {formData.requirements?.length > 0 ? (
                            <div className="p-4 space-y-2">
                                {formData.requirements.map((requirement, index) => (
                                    <RequirementItem
                                        key={index}
                                        requirement={requirement}
                                        index={index}
                                        onRemove={() => removeRequirement(index)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8" style={{ color: '#48d1c1' }}>
                                <DocumentTextIcon className="w-12 h-12 mb-2 opacity-50" />
                                <p className="text-sm text-center">
                                    No hay requerimientos agregados aún
                                </p>
                                <p className="text-xs text-center mt-1 opacity-70">
                                    Agrega requerimientos desde el panel izquierdo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente individual para cada requerimiento
const RequirementItem = ({ requirement, index, onRemove }) => {
    return (
        <div className="flex items-start justify-between p-3 rounded-lg border-2 hover:shadow-sm transition-all duration-200 hover:scale-102" style={{ backgroundColor: '#2c3844', borderColor: '#48d1c1' }}>
            <div className="flex-1 mr-3">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#48d1c1', color: '#2c3844' }}>
                        #{index + 1}
                    </span>
                </div>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'white' }}>
                    {requirement.name}
                </p>
            </div>

            <button
                type="button"
                onClick={onRemove}
                className="flex-shrink-0 p-1 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded-full transition-colors"
                title="Eliminar requerimiento"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};
