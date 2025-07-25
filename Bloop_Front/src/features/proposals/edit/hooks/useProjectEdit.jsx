import { useState, useCallback } from 'react';
import { useLoadingState, useErrorState, useNotifications } from '@/hooks';

// Hook para manejar la edición de propuestas (datos básicos, objetivos y requerimientos)
const useProjectEdit = (userInfo) => {
    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError } = useNotifications();

    // Estado del formulario completo
    const [editData, setEditData] = useState({
        basic: {},      // Datos de prop_project
        objectives: [], // Datos de obj_project
        requirements: [] // Datos de requeriment_project
    });
    const [originalData, setOriginalData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // Inicia el modo de edición con todos los datos de la propuesta
    const startEdit = useCallback((proposalData, objectives = [], requirements = []) => {
        const basicData = {
            pp_id: proposalData.pp_id,
            pp_name: proposalData.pp_name || '',
            pp_description: proposalData.pp_description || '',
            pp_approval_status: proposalData.pp_approval_status || 'Pendiente',
            pp_difficulty_level: proposalData.pp_difficulty_level || 'Medio',
            pp_max_integrantes: proposalData.pp_max_integrantes || 2,
            pp_date_limit: proposalData.pp_date_limit || '',
            pp_grupal: proposalData.pp_grupal || false
        };

        const editableData = {
            basic: basicData,
            objectives: objectives.map(obj => ({
                op_id: obj.op_id || null,
                op_name: obj.op_name || '',
                op_type: obj.op_type || 'General',
                op_description: obj.op_description || ''
            })),
            requirements: requirements.map(req => ({
                rp_id: req.rp_id || null,
                rp_name: req.rp_name || ''
            }))
        };

        setOriginalData(JSON.parse(JSON.stringify(editableData)));
        setEditData(editableData);
        setIsEditing(true);
        clearError();
    }, [clearError]);

    // Actualiza un campo de los datos básicos
    const updateBasicField = useCallback((fieldName, value) => {
        setEditData(prev => ({
            ...prev,
            basic: {
                ...prev.basic,
                [fieldName]: value
            }
        }));
    }, []);

    // Agrega un nuevo objetivo
    const addObjective = useCallback(() => {
        setEditData(prev => ({
            ...prev,
            objectives: [
                ...prev.objectives,
                {
                    op_id: null,
                    op_name: '',
                    op_type: 'Específico',
                    op_description: ''
                }
            ]
        }));
    }, []);

    // Actualiza un objetivo específico
    const updateObjective = useCallback((index, fieldName, value) => {
        setEditData(prev => ({
            ...prev,
            objectives: prev.objectives.map((obj, i) => 
                i === index ? { ...obj, [fieldName]: value } : obj
            )
        }));
    }, []);

    // Elimina un objetivo
    const removeObjective = useCallback((index) => {
        setEditData(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    }, []);

    // Agrega un nuevo requerimiento
    const addRequirement = useCallback(() => {
        setEditData(prev => ({
            ...prev,
            requirements: [
                ...prev.requirements,
                {
                    rp_id: null,
                    rp_name: ''
                }
            ]
        }));
    }, []);

    // Actualiza un requerimiento específico
    const updateRequirement = useCallback((index, value) => {
        setEditData(prev => ({
            ...prev,
            requirements: prev.requirements.map((req, i) => 
                i === index ? { ...req, rp_name: value } : req
            )
        }));
    }, []);

    // Elimina un requerimiento
    const removeRequirement = useCallback((index) => {
        setEditData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    }, []);

    // Valida todo el formulario
    const validateForm = useCallback(() => {
        const errors = [];

        // Validar datos básicos
        if (!editData.basic.pp_name?.trim()) {
            errors.push('El nombre de la propuesta es requerido');
        }
        if (!editData.basic.pp_description?.trim()) {
            errors.push('La descripción es requerida');
        }

        // Validar objetivos
        if (editData.objectives.length === 0) {
            errors.push('Debe tener al menos un objetivo');
        }
        editData.objectives.forEach((obj, index) => {
            if (!obj.op_name?.trim()) {
                errors.push(`El objetivo ${index + 1} debe tener un título`);
            }
        });

        // Validar requerimientos
        editData.requirements.forEach((req, index) => {
            if (!req.rp_name?.trim()) {
                errors.push(`El requerimiento ${index + 1} debe tener un título`);
            }
        });

        return errors;
    }, [editData]);

    // Guarda todos los cambios
    const saveChanges = useCallback(async () => {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return false;
        }

        return await withLoading(async () => {
            try {
                const payload = {
                    proposalId: editData.basic.pp_id,
                    editorId: userInfo.id,
                    basicData: editData.basic,
                    objectives: editData.objectives,
                    requirements: editData.requirements
                };

                // Aquí iría la llamada al servicio cuando esté implementado
                console.log('Guardando propuesta completa:', payload);
                await new Promise(resolve => setTimeout(resolve, 1000));

                setOriginalData(JSON.parse(JSON.stringify(editData)));
                setIsEditing(false);
                showSuccess('Propuesta actualizada correctamente');
                clearError();
                return true;

            } catch (err) {
                const errorMessage = err?.message || 'Error al guardar los cambios';
                setError(errorMessage);
                showError(errorMessage);
                return false;
            }
        });
    }, [editData, validateForm, withLoading, userInfo.id, showSuccess, showError, setError, clearError]);

    // Cancela la edición
    const cancelEdit = useCallback(() => {
        setEditData(JSON.parse(JSON.stringify(originalData)));
        setIsEditing(false);
        clearError();
    }, [originalData, clearError]);

    return {
        // Estados
        editData,
        isEditing,
        loading,
        error,

        // Funciones principales
        startEdit,
        saveChanges,
        cancelEdit,

        // Funciones para datos básicos
        updateBasicField,

        // Funciones para objetivos
        addObjective,
        updateObjective,
        removeObjective,

        // Funciones para requerimientos
        addRequirement,
        updateRequirement,
        removeRequirement,

        // Validación
        validateForm
    };
};

export default useProjectEdit;