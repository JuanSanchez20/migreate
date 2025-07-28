import { useState, useEffect, useMemo } from 'react';
import { listUsersAdmin } from '../../services/listUserAdmin';
import { assignSubjectService } from '../../services/assignSubject';
import { unassignSubjectService } from '../../services/unassignSubject';
import { validateTutorAssignment } from '../helpers/subjectValidator';
import { canManageTutors } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';

// Hook para manejar específicamente tutores
export const useTutorAssignment = (subject, onSubjectUpdate) => {
    const { user, userRole } = useAuth();
    const currentUser = {
        ...user,
        rol: parseInt(userRole)
    };

    // Hooks globales
    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError, showWarning } = useNotification();

    // Estados específicos de tutores
    const [tutors, setTutors] = useState([]);
    const [loadingTutors, setLoadingTutors] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);

    // Verificar permisos
    const canManage = canManageTutors(currentUser.rol);

    // Obtener tutor actualmente asignado
    const assignedTutor = useMemo(() => {
        return subject.usuariosAsignados?.find(user => user.rol === 2);
    }, [subject.usuariosAsignados]);

    // Cargar tutores disponibles al inicializar
    useEffect(() => {
        if (canManage) {
            loadTutors();
        }
    }, [subject.id, subject.usuariosAsignados?.length, canManage]);

    // Carga la lista de tutores disponibles
    const loadTutors = async () => {
        if (!canManage) {
            const errorMsg = 'No tiene permisos para gestionar tutores';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        if (!currentUser.id) {
            const errorMsg = 'Usuario no identificado';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        setLoadingTutors(true);
        clearError();

        try {
            // Usar parámetros correctos según tu controlador
            const response = await listUsersAdmin(currentUser.id, 'tutores');

            if (response.ok) {
                setTutors(response.data || []);
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Error al cargar tutores');
            }
        } catch (err) {
            console.error('Error cargando tutores - Error completo:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);

            const errorMsg = err.response?.data?.message || err.message || 'Error al cargar la lista de tutores';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoadingTutors(false);
        }
    };

    // Asigna un tutor a la materia
    const assignTutor = async (tutorId) => {
        if (!canManage) {
            const errorMsg = 'No tiene permisos para asignar tutores';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        // Validar asignación
        const validation = validateTutorAssignment(tutorId, assignedTutor);
        if (!validation.isValid) {
            const errorMsg = validation.errors[0];
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        try {
            const result = await withLoading(async () => {
                return await assignSubjectService({
                    user_id: tutorId,
                    subject_id: subject.id
                });
            });

            if (result.ok) {
                // Actualizar vista padre PRIMERO
                onSubjectUpdate?.();

                // Limpiar selección y errores
                setSelectedTutor(null);
                clearError();

                // Refrescar lista de tutores
                loadTutors();

                // Mostrar mensaje de éxito
                const tutorName = tutors.find(t => t.u_id === tutorId)?.u_name || 'el tutor';
                showSuccess(`${tutorName} asignado correctamente`);

                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'Error al asignar tutor');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error al asignar tutor';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Remueve la asignación de un tutor
    const removeTutor = async (tutorId) => {
        if (!canManage) {
            const errorMsg = 'No tiene permisos para remover tutores';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        if (!tutorId) {
            const errorMsg = 'ID del tutor no válido';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        try {
            const result = await withLoading(async () => {
                return await unassignSubjectService({
                    user_id: tutorId,
                    subject_id: subject.id,
                    executor_id: currentUser.id
                });
            });

            if (result.ok) {
                // Actualizar vista padre PRIMERO
                onSubjectUpdate?.();

                // Limpiar estado local inmediatamente
                clearError();
                setSelectedTutor(null);

                // Refrescar lista de tutores para mostrar el tutor como disponible
                loadTutors();

                // Mostrar mensaje de éxito
                const tutorName = assignedTutor?.nombre || 'el tutor';
                showSuccess(`${tutorName} removido correctamente`);

                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'Error al remover tutor');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error al desasignar tutor';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Cambia la selección de tutor
    const selectTutor = (tutor) => {
        if (!canManage) {
            showWarning('No tiene permisos para seleccionar tutores');
            return { success: false };
        }

        // No permitir seleccionar el tutor actual
        if (assignedTutor && assignedTutor.id === tutor.u_id) {
            showWarning('Este tutor ya está asignado a la materia');
            return { success: false };
        }

        setSelectedTutor(tutor);
        clearError();
        return { success: true };
    };

    // Limpia la selección de tutor
    const clearSelection = () => {
        setSelectedTutor(null);
        clearError();
        return { success: true };
    };

    // Verifica si un tutor está disponible para asignar
    const isTutorAvailable = (tutorId) => {
        return assignedTutor?.id !== tutorId;
    };

    // Obtiene tutores filtrados (excluye el tutor actual)
    const getAvailableTutors = () => {
        if (!assignedTutor) return tutors;

        return tutors.filter(tutor => tutor.u_id !== assignedTutor.id);
    };

    // Obtiene información del tutor seleccionado
    const getSelectedTutorInfo = () => {
        if (!selectedTutor) return null;

        return {
            id: selectedTutor.u_id,
            name: `${selectedTutor.u_name} ${selectedTutor.u_lastname}`,
            email: selectedTutor.u_email,
            semester: selectedTutor.u_semester
        };
    };

    return {
        // Estados principales
        tutors,
        loadingTutors,
        selectedTutor,
        assignedTutor,
        loading,
        error,

        // Funciones principales
        loadTutors,
        assignTutor,
        removeTutor,
        selectTutor,
        clearSelection,

        // Funciones helper
        isTutorAvailable,
        getAvailableTutors,
        getSelectedTutorInfo,

        // Estados de conveniencia
        hasTutors: tutors.length > 0,
        hasAssignedTutor: !!assignedTutor,
        hasSelection: !!selectedTutor,
        canManage,

        // Datos del usuario
        currentUser,

        // Notificaciones
        showSuccess,
        showError,
        showWarning,

        // Funciones de error
        clearError,
        setError,

        // Función de recarga
        loadTutors
    };
};