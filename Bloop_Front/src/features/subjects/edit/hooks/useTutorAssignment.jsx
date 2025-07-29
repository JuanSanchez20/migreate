import { useState, useEffect, useRef } from 'react';
import { listUsersAdmin } from '../../services/listUserAdmin';
import { assignSubjectService } from '../../services/assignSubject';
import { unassignSubjectService } from '../../services/unassignSubject';
import { validateTutorAssignment } from '../helpers/subjectValidator';
import { canManageTutors } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';

export const useTutorAssignment = (subject, onSubjectUpdate) => {
    const { user, userRole } = useAuth();
    const currentUser = { ...user, rol: parseInt(userRole) };

    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError, showWarning } = useNotification();

    const [tutors, setTutors] = useState([]);
    const [loadingTutors, setLoadingTutors] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [assignedTutor, setAssignedTutor] = useState(null);
    
    // Refs para evitar loops
    const lastSubjectId = useRef(null);
    const isUpdatingLocally = useRef(false);

    const canManage = canManageTutors(currentUser.rol);

    // SOLO sincronizar cuando cambia el ID del subject, NO cuando cambian usuariosAsignados
    useEffect(() => {
        // Solo actualizar si es un subject diferente
        if (subject?.id !== lastSubjectId.current && !isUpdatingLocally.current) {
            lastSubjectId.current = subject?.id;
            const tutorFromProps = subject?.usuariosAsignados?.find(user => user.rol === 2);
            setAssignedTutor(tutorFromProps || null);
        }
        
        if (canManage && subject?.id) {
            loadTutors();
        }
    }, [subject?.id, canManage]); // SOLO depender de subject.id y canManage

    const loadTutors = async () => {
        if (!canManage) return { success: false };

        setLoadingTutors(true);
        clearError();

        try {
            const response = await listUsersAdmin(currentUser.id, 'tutores');
            if (response.ok) {
                setTutors(response.data || []);
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Error al cargar tutores');
            }
        } catch (err) {
            const errorMsg = 'Error al cargar la lista de tutores';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoadingTutors(false);
        }
    };

    const assignTutor = async (tutorId) => {
        if (!canManage) {
            showError('No tiene permisos para asignar tutores');
            return { success: false };
        }

        const validation = validateTutorAssignment(tutorId, assignedTutor);
        if (!validation.isValid) {
            showError(validation.errors[0]);
            return { success: false };
        }

        try {
            const result = await withLoading(async () => {
                return await assignSubjectService({
                    user_id: tutorId,
                    subject_id: subject.id
                });
            });

            if (result.ok) {
                const newTutor = tutors.find(t => t.u_id === tutorId);
                
                // Marcar que estamos actualizando localmente
                isUpdatingLocally.current = true;
                
                // ACTUALIZACIÓN INMEDIATA del estado local
                setAssignedTutor({
                    id: tutorId,
                    nombre: `${newTutor?.u_name || ''} ${newTutor?.u_lastname || ''}`.trim(),
                    correo: newTutor?.u_email || '',
                    rol: 2,
                    estadoAsignacion: 'Asignado'
                });
                
                setSelectedTutor(null);
                clearError();
                showSuccess(`${newTutor?.u_name || 'Tutor'} asignado correctamente`, 3000);
                
                // Actualizar padre en background sin afectar estado local
                setTimeout(() => {
                    onSubjectUpdate?.();
                    // Permitir sincronización después de un tiempo
                    setTimeout(() => {
                        isUpdatingLocally.current = false;
                    }, 500);
                }, 100);

                return { success: true, data: result.data };
            } else {
                isUpdatingLocally.current = false;
                throw new Error(result.message || 'Error al asignar tutor');
            }
        } catch (err) {
            isUpdatingLocally.current = false;
            showError('Error al asignar tutor');
            return { success: false, error: err.message };
        }
    };

    const removeTutor = async (tutorId) => {
        if (!canManage) {
            showError('No tiene permisos para remover tutores');
            return { success: false };
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
                const tutorName = assignedTutor?.nombre || 'el tutor';
                
                // Marcar que estamos actualizando localmente
                isUpdatingLocally.current = true;
                
                // ACTUALIZACIÓN INMEDIATA del estado local
                setAssignedTutor(null);
                
                clearError();
                setSelectedTutor(null);
                showSuccess(`${tutorName} removido correctamente`, 3000);
                
                // Actualizar padre en background sin afectar estado local
                setTimeout(() => {
                    onSubjectUpdate?.();
                    // Permitir sincronización después de un tiempo
                    setTimeout(() => {
                        isUpdatingLocally.current = false;
                    }, 500);
                }, 100);

                return { success: true, data: result.data };
            } else {
                isUpdatingLocally.current = false;
                throw new Error(result.message || 'Error al remover tutor');
            }
        } catch (err) {
            isUpdatingLocally.current = false;
            showError('Error al desasignar tutor');
            return { success: false, error: err.message };
        }
    };

    const selectTutor = (tutor) => {
        if (!canManage) {
            showWarning('No tiene permisos para seleccionar tutores');
            return { success: false };
        }

        if (assignedTutor && assignedTutor.id === tutor.u_id) {
            showWarning('Este tutor ya está asignado a la materia');
            return { success: false };
        }

        setSelectedTutor(tutor);
        clearError();
        return { success: true };
    };

    const clearSelection = () => {
        setSelectedTutor(null);
        clearError();
        return { success: true };
    };

    const isTutorAvailable = (tutorId) => {
        return assignedTutor?.id !== tutorId;
    };

    const getAvailableTutors = () => {
        if (!assignedTutor) return tutors;
        return tutors.filter(tutor => tutor.u_id !== assignedTutor.id);
    };

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
        tutors,
        loadingTutors,
        selectedTutor,
        assignedTutor,
        loading,
        error,
        loadTutors,
        assignTutor,
        removeTutor,
        selectTutor,
        clearSelection,
        isTutorAvailable,
        getAvailableTutors,
        getSelectedTutorInfo,
        hasTutors: tutors.length > 0,
        hasAssignedTutor: !!assignedTutor,
        hasSelection: !!selectedTutor,
        canManage,
        currentUser,
        showSuccess,
        showError,
        showWarning,
        clearError,
        setError
    };
};