import { useState, useEffect } from 'react';
// import { updateSubject } from '../../services/subjectService';
import { validateSubjectData } from '../helpers/subjectValidator';
import { canEditSubject } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';

// Hook para manejar información básica de la materia
export const useSubjectList = (subject, onSubjectUpdate) => {
    const { user, userRole } = useAuth();
    const currentUser = {
        ...user,
        rol: parseInt(userRole)
    };

    // Hooks globales
    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError } = useNotification();
    
    // Estados de edición
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        semester: 1,
        journey: 'matutina',
        state: true
    });
    const [validationErrors, setValidationErrors] = useState({});

    // Inicializar formulario cuando cambia la materia
    useEffect(() => {
        if (subject) {
            setEditForm({
                name: subject.nombre || '',
                semester: subject.semestre || 1,
                journey: subject.modalidad || 'matutina',
                state: subject.estado !== undefined ? subject.estado : true
            });
        }
    }, [subject]);

    // Verifica si el usuario puede editar
    const canEdit = canEditSubject(currentUser.rol);

    // Inicia el modo edición
    const startEditing = () => {
        if (!canEdit) {
            setError('No tiene permisos para editar materias');
            showError('No tiene permisos para editar materias');
            return false;
        }

        setIsEditing(true);
        clearError();
        setValidationErrors({});
        return true;
    };

    // Cancela la edición y restaura valores originales
    const cancelEditing = () => {
        setEditForm({
            name: subject.nombre || '',
            semester: subject.semestre || 1,
            journey: subject.modalidad || 'matutina',
            state: subject.estado !== undefined ? subject.estado : true
        });
        setIsEditing(false);
        clearError();
        setValidationErrors({});
    };

    // Maneja cambios en el formulario
    const handleFormChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error específico del campo
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Limpiar error general
        clearError();
    };

    // Actualiza la materia
    // const updateSubjectInfo = async () => {
    //     if (!canEdit) {
    //         const errorMsg = 'No tiene permisos para editar materias';
    //         setError(errorMsg);
    //         showError(errorMsg);
    //         return false;
    //     }

    //     // Validar datos
    //     const validation = validateSubjectData(editForm);
    //     if (!validation.isValid) {
    //         setValidationErrors(validation.errors);
    //         showError('Por favor corrige los errores en el formulario');
    //         return false;
    //     }

    //     try {
    //         const result = await withLoading(async () => {
    //             const updateData = {
    //                 subjectId: subject.id,
    //                 name: editForm.name.trim(),
    //                 semester: parseInt(editForm.semester),
    //                 journey: editForm.journey.trim(),
    //                 state: editForm.state
    //             };

    //             return await updateSubject(updateData);
    //         });

    //         if (result.success) {
    //             // Actualizar vista padre
    //             onSubjectUpdate?.();

    //             // Salir del modo edición
    //             setIsEditing(false);
    //             clearError();
    //             setValidationErrors({});

    //             // Mostrar mensaje de éxito
    //             showSuccess('Materia actualizada correctamente');

    //             return true;
    //         } else {
    //             const errorMsg = result.message || 'Error al actualizar la materia';
    //             setError(errorMsg);
    //             showError(errorMsg);
    //             return false;
    //         }
    //     } catch (err) {
    //         const errorMsg = 'Error inesperado al actualizar la materia';
    //         setError(errorMsg);
    //         showError(errorMsg);
    //         return false;
    //     }
    // };

    // Obtiene el icono y colores según la jornada
    const getJourneyInfo = (journey) => {
        const journeyData = {
            'matutina': { 
                color: 'text-yellow-400', 
                bg: 'bg-yellow-400/10',
                icon: 'SunIcon'
            },
            'nocturna': { 
                color: 'text-purple-400', 
                bg: 'bg-purple-400/10',
                icon: 'MoonIcon'
            }
        };

        return journeyData[journey?.toLowerCase()] || { 
            color: 'text-gray-400', 
            bg: 'bg-gray-400/10',
            icon: 'ClockIcon'
        };
    };

    // Obtiene los datos actuales (del formulario si está editando, sino de la materia)
    const getCurrentData = () => {
        if (isEditing) {
            return {
                ...editForm,
                journeyInfo: getJourneyInfo(editForm.journey)
            };
        }

        return {
            name: subject.nombre,
            semester: subject.semestre,
            journey: subject.modalidad,
            state: subject.estado,
            journeyInfo: getJourneyInfo(subject.modalidad)
        };
    };

    // Verifica si hay cambios pendientes
    const hasChanges = () => {
        if (!isEditing) return false;

        return (
            editForm.name.trim() !== (subject.nombre || '') ||
            editForm.semester !== (subject.semestre || 1) ||
            editForm.journey !== (subject.modalidad || 'matutina') ||
            editForm.state !== (subject.estado !== undefined ? subject.estado : true)
        );
    };

    return {
        // Estados de edición
        isEditing,
        editForm,

        // Estados de proceso
        loading,
        error,
        validationErrors,

        // Funciones de control
        startEditing,
        cancelEditing,
        handleFormChange,
        // updateSubjectInfo,

        // Datos calculados
        getCurrentData,
        getJourneyInfo,
        hasChanges,
        canEdit,

        // Información del usuario
        currentUser,
        
        // Notificaciones (para que el componente pueda mostrarlas)
        showSuccess,
        showError,

        // Funciones de error
        clearError,
        setError
    };
};