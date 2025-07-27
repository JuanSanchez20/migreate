import { useState, useCallback } from 'react';
import { getObjectiveStats, canAddSpecificObjective } from '../helpers/objectiveHelpers';

// Maneja el estado y lógica del formulario de propuestas
export const useProposalForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);
    const [activeObjectiveIndex, setActiveObjectiveIndex] = useState(null);

    // Maneja cambios en campos de texto
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    // Maneja cambios en selects
    const handleSelectChange = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Agrega un objetivo específico
    const addSpecificObjective = useCallback(() => {
        if (!canAddSpecificObjective(formData.objectives || [])) return;

        const newObjective = {
            name: '',
            type: 'Específico',
            description: ''
        };

        setFormData(prev => ({
            ...prev,
            objectives: [...(prev.objectives || []), newObjective]
        }));
    }, [formData.objectives]);

    // Elimina un objetivo específico
    const removeSpecificObjective = useCallback((index) => {
        const specificObjectives = formData.objectives?.filter(obj => obj.type === 'Específico') || [];
        const otherObjectives = formData.objectives?.filter(obj => obj.type !== 'Específico') || [];
        
        specificObjectives.splice(index, 1);
        
        setFormData(prev => ({
            ...prev,
            objectives: [...otherObjectives, ...specificObjectives]
        }));
        
        setActiveObjectiveIndex(null);
    }, [formData.objectives]);

    // Actualiza un objetivo específico
    const updateSpecificObjective = useCallback((index, updatedObjective) => {
        const specificObjectives = formData.objectives?.filter(obj => obj.type === 'Específico') || [];
        const otherObjectives = formData.objectives?.filter(obj => obj.type !== 'Específico') || [];
        
        specificObjectives[index] = {
            name: updatedObjective.title,
            type: 'Específico',
            description: updatedObjective.description
        };
        
        setFormData(prev => ({
            ...prev,
            objectives: [...otherObjectives, ...specificObjectives]
        }));
    }, [formData.objectives]);

    // Agrega un requerimiento
    const addRequirement = useCallback((requirementName) => {
        const newRequirement = { name: requirementName.trim() };
        
        setFormData(prev => ({
            ...prev,
            requirements: [...(prev.requirements || []), newRequirement]
        }));
    }, []);

    // Elimina un requerimiento
    const removeRequirement = useCallback((index) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements?.filter((_, i) => i !== index) || []
        }));
    }, []);

    // Obtiene estadísticas de objetivos
    const getObjectivesStats = useCallback(() => {
        return getObjectiveStats(formData.objectives || []);
    }, [formData.objectives]);

    // Obtiene estadísticas de requerimientos
    const getRequirementsStats = useCallback(() => {
        return {
            total: formData.requirements?.length || 0
        };
    }, [formData.requirements]);

    return {
        formData,
        setFormData,
        handleChange,
        handleSelectChange,
        activeObjectiveIndex,
        setActiveObjectiveIndex,
        addSpecificObjective,
        removeSpecificObjective,
        updateSpecificObjective,
        addRequirement,
        removeRequirement,
        getObjectivesStats,
        getRequirementsStats
    };
};