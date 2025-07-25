import React from 'react';
import { 
    PlusIcon, 
    TrashIcon, 
    DocumentTextIcon,
    CheckCircleIcon,
    BulletListIcon
} from '@heroicons/react/24/outline';
import { TextField, SelectField, TextArea, Button } from '@/components/common';
import { SELECT_OPTIONS, VALIDATION_RANGES } from '../helpers/projectConfig';

// Componente formulario para editar propuestas completas
const ProjectEditForm = ({ 
    editData, 
    onUpdateBasicField, 
    onAddObjective, 
    onUpdateObjective, 
    onRemoveObjective,
    onAddRequirement, 
    onUpdateRequirement, 
    onRemoveRequirement,
    errors = []
}) => {
    if (!editData) return null;

    // Componente para editar un objetivo
    const ObjectiveEditor = ({ objective, index }) => {
        return (
            <div className="bg-gray-600/30 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h6 className="text-sm font-semibold text-teal-400">
                        Objetivo #{index + 1}
                    </h6>
                    <button
                        type="button"
                        onClick={() => onRemoveObjective(index)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                        title="Eliminar objetivo"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        label="Tipo de objetivo"
                        id={`objective-type-${index}`}
                        value={objective.op_type || 'General'}
                        onValueChange={(value) => onUpdateObjective(index, 'op_type', value)}
                        options={SELECT_OPTIONS.objectiveType}
                        placeholder="Seleccionar tipo"
                    />

                    <TextField
                        label="Título del objetivo"
                        id={`objective-name-${index}`}
                        value={objective.op_name || ''}
                        onChange={(e) => onUpdateObjective(index, 'op_name', e.target.value)}
                        placeholder="Título descriptivo del objetivo"
                        maxLength={VALIDATION_RANGES.objectiveNameLength.max}
                        required
                    />
                </div>

                <TextArea
                    label="Descripción del objetivo"
                    id={`objective-description-${index}`}
                    value={objective.op_description || ''}
                    onChange={(e) => onUpdateObjective(index, 'op_description', e.target.value)}
                    placeholder="Describe detalladamente este objetivo..."
                    rows={3}
                    maxLength={500}
                />
            </div>
        );
    };

    // Componente para editar un requerimiento
    const RequirementEditor = ({ requirement, index }) => {
        return (
            <div className="bg-gray-600/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <h6 className="text-sm font-semibold text-teal-400">
                        Requerimiento #{index + 1}
                    </h6>
                    <button
                        type="button"
                        onClick={() => onRemoveRequirement(index)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                        title="Eliminar requerimiento"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>

                <TextField
                    label="Título del requerimiento"
                    id={`requirement-name-${index}`}
                    value={requirement.rp_name || ''}
                    onChange={(e) => onUpdateRequirement(index, e.target.value)}
                    placeholder="Especifica el requerimiento..."
                    maxLength={VALIDATION_RANGES.requirementNameLength.max}
                    required
                />
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Mostrar errores si existen */}
            {errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h4 className="text-red-400 font-semibold mb-2">Errores de validación:</h4>
                    <ul className="text-red-300 text-sm space-y-1">
                        {errors.map((error, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-red-400 mr-2">•</span>
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Información básica */}
            <div className="bg-gray-700/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-teal-400 mb-6 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Información Básica
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <TextField
                            label="Nombre de la propuesta"
                            id="proposal-name"
                            value={editData.basic.pp_name || ''}
                            onChange={(e) => onUpdateBasicField('pp_name', e.target.value)}
                            placeholder="Nombre descriptivo del proyecto"
                            maxLength={VALIDATION_RANGES.nameLength.max}
                            required
                        />
                    </div>

                    <SelectField
                        label="Estado de aprobación"
                        id="approval-status"
                        value={editData.basic.pp_approval_status || 'Pendiente'}
                        onValueChange={(value) => onUpdateBasicField('pp_approval_status', value)}
                        options={SELECT_OPTIONS.approvalStatus}
                        placeholder="Seleccionar estado"
                    />

                    <SelectField
                        label="Nivel de dificultad"
                        id="difficulty-level"
                        value={editData.basic.pp_difficulty_level || 'Medio'}
                        onValueChange={(value) => onUpdateBasicField('pp_difficulty_level', value)}
                        options={SELECT_OPTIONS.difficulty}
                        placeholder="Seleccionar dificultad"
                    />

                    <SelectField
                        label="Modalidad"
                        id="modality"
                        value={editData.basic.pp_grupal || false}
                        onValueChange={(value) => onUpdateBasicField('pp_grupal', value)}
                        options={SELECT_OPTIONS.modality}
                        placeholder="Seleccionar modalidad"
                    />

                    {editData.basic.pp_grupal && (
                        <TextField
                            label="Máximo de integrantes"
                            id="max-members"
                            type="number"
                            value={editData.basic.pp_max_integrantes || 2}
                            onChange={(e) => onUpdateBasicField('pp_max_integrantes', parseInt(e.target.value))}
                            min={VALIDATION_RANGES.maxIntegrantes.min}
                            max={VALIDATION_RANGES.maxIntegrantes.max}
                            placeholder="Número máximo"
                        />
                    )}

                    <div className="md:col-span-2">
                        <TextField
                            label="Fecha límite"
                            id="due-date"
                            type="date"
                            value={editData.basic.pp_date_limit || ''}
                            onChange={(e) => onUpdateBasicField('pp_date_limit', e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <TextArea
                            label="Descripción"
                            id="description"
                            value={editData.basic.pp_description || ''}
                            onChange={(e) => onUpdateBasicField('pp_description', e.target.value)}
                            placeholder="Describe detalladamente el proyecto..."
                            rows={4}
                            maxLength={VALIDATION_RANGES.descriptionLength.max}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Objetivos */}
            <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-teal-400 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Objetivos ({editData.objectives.length})
                    </h4>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onAddObjective}
                        className="flex items-center space-x-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Agregar Objetivo</span>
                    </Button>
                </div>

                <div className="space-y-4">
                    {editData.objectives.length > 0 ? (
                        editData.objectives.map((objective, index) => (
                            <ObjectiveEditor
                                key={objective.op_id || index}
                                objective={objective}
                                index={index}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <CheckCircleIcon className="h-12 w-12 mx-auto mb-4" />
                            <p>No hay objetivos definidos</p>
                            <p className="text-sm">Agrega al menos un objetivo para continuar</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Requerimientos */}
            <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-teal-400 flex items-center">
                        <BulletListIcon className="h-5 w-5 mr-2" />
                        Requerimientos ({editData.requirements.length})
                    </h4>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onAddRequirement}
                        className="flex items-center space-x-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Agregar Requerimiento</span>
                    </Button>
                </div>

                <div className="space-y-4">
                    {editData.requirements.length > 0 ? (
                        editData.requirements.map((requirement, index) => (
                            <RequirementEditor
                                key={requirement.rp_id || index}
                                requirement={requirement}
                                index={index}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <BulletListIcon className="h-12 w-12 mx-auto mb-4" />
                            <p>No hay requerimientos especificados</p>
                            <p className="text-sm">Los requerimientos son opcionales</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectEditForm;