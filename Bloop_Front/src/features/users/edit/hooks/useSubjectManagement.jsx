import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts';
import{ useErrorState, useLoadingState } from '@/hooks';
import { listSubject } from '../../services/listSubject';
import { assignSubject } from '../../services/assignSubject';
import { unassignSubject } from '../../services/unassignSubject';
import { SUBJECT_ASSIGNMENT_STATUS, NOTIFICATION_MESSAGES } from '../helpers/modalConstants';

// Hook para manejar la gestión de materias del usuario
const useSubjectManagement = (user) => {
    // Contexto de autenticación
    const { user: currentUser } = useAuth();

    // Estados de las materias
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState('');

    // Estado para rastrear cambios en materias
    const [hasSubjectChanges, setHasSubjectChanges] = useState(false);

    // Hooks de estado
    const { loading, startLoading, stopLoading } = useLoadingState(false);
    const { error, setError, clearError, hasError } = useErrorState();

    // Carga las materias disponibles del sistema
    const loadAvailableSubjects = useCallback(async () => {
        try {
            const response = await listSubject(1, 1);

            if (!response?.ok || !response.data) {
                throw new Error(NOTIFICATION_MESSAGES.ERROR.LOAD_SUBJECTS_FAILED);
            }

            // Filtrar solo materias activas
            let subjects = response.data.filter(subject => subject.estado === true);

            // Filtro adicional para estudiantes según su semestre
            if (user?.rol_name?.toLowerCase() === 'estudiante' && user.u_semester) {
                subjects = subjects.filter(subject =>
                    subject.semestre <= parseInt(user.u_semester)
                );
            }

            setAvailableSubjects(subjects);
            clearError();

        } catch (err) {
            console.error('Error al cargar materias disponibles:', err);
            setError(err.message || NOTIFICATION_MESSAGES.ERROR.LOAD_SUBJECTS_FAILED);
        }
    }, [user?.rol_name, user?.u_semester, setError, clearError]);

    // Procesa las materias asignadas al usuario
    const processAssignedSubjects = useCallback(() => {
        if (!user?.materias || !availableSubjects.length) {
            setAssignedSubjects([]);
            return;
        }

        // Dividir las materias asignadas por comas
        const assignedSubjectNames = user.materias
            .split(', ')
            .filter(Boolean)
            .map(name => name.trim());

        // Mapear nombres a objetos completos con IDs reales
        const assignedWithRealIds = assignedSubjectNames
            .map(assignedName => {
                const realSubject = availableSubjects.find(subject =>
                    subject.nombre.toLowerCase().trim() === assignedName.toLowerCase().trim()
                );

                if (realSubject) {
                    return {
                        id: realSubject.id,
                        name: assignedName,
                        realName: realSubject.nombre,
                        semester: realSubject.semestre,
                        status: determineSubjectStatus(realSubject, user)
                    };
                } else {
                    console.warn(`No se encontró ID para la materia: ${assignedName}`);
                    return null;
                }
            })
            .filter(subject => subject !== null);

        setAssignedSubjects(assignedWithRealIds);
    }, [user?.materias, availableSubjects, user]);

    // Determina el estado de una materia asignada
    const determineSubjectStatus = useCallback((subject, userData) => {
        if (userData?.rol_name?.toLowerCase() === 'tutor') {
            return SUBJECT_ASSIGNMENT_STATUS.TUTOR;
        }

        if (subject.semestre === parseInt(userData?.u_semester)) {
            return SUBJECT_ASSIGNMENT_STATUS.CURRENT_SEMESTER;
        }

        return SUBJECT_ASSIGNMENT_STATUS.REPEATING;
    }, []);

    // Obtiene las materias disponibles para asignar (excluye las ya asignadas)
    const getAvailableSubjectsToShow = useCallback(() => {
        return availableSubjects.filter(available =>
            !assignedSubjects.some(assigned =>
                assigned.name === available.nombre || assigned.id === available.id
            )
        );
    }, [availableSubjects, assignedSubjects]);

    // Asigna una nueva materia al usuario
    const assignSubjectFunction = useCallback(async () => {
        if (!selectedSubjectToAdd) {
            setError('Debe seleccionar una materia para asignar');
            return false;
        }

        if (!currentUser?.id) {
            setError(NOTIFICATION_MESSAGES.ERROR.AUTH_USER_MISSING);
            return false;
        }

        try {
            startLoading();
            clearError();

            // Buscar la materia seleccionada
            const subjectToAdd = availableSubjects.find(s => 
                s.id.toString() === selectedSubjectToAdd
            );

            if (!subjectToAdd) {
                throw new Error(NOTIFICATION_MESSAGES.ERROR.SUBJECT_NOT_FOUND);
            }

            // Verificar que no esté ya asignada
            const isAlreadyAssigned = assignedSubjects.some(a => 
                a.name === subjectToAdd.nombre || a.id === subjectToAdd.id
            );

            if (isAlreadyAssigned) {
                throw new Error(NOTIFICATION_MESSAGES.ERROR.SUBJECT_ALREADY_ASSIGNED);
            }

            // Determinar estado de la asignación
            const status = determineSubjectStatus(subjectToAdd, user);

            // Llamar al servicio de asignación
            const response = await assignSubject({
                user_id: parseInt(user.u_id),
                subject_id: parseInt(subjectToAdd.id),
                state_user_subject: status
            });

            if (!response?.ok) {
                throw new Error(response?.message || NOTIFICATION_MESSAGES.ERROR.SUBJECT_ASSIGN_FAILED);
            }

            // Actualizar el estado local
            const newAssignment = {
                id: subjectToAdd.id,
                name: subjectToAdd.nombre,
                realName: subjectToAdd.nombre,
                semester: subjectToAdd.semestre,
                status: status
            };

            setAssignedSubjects(prev => [...prev, newAssignment]);
            setSelectedSubjectToAdd('');
            setHasSubjectChanges(true);

            return true;

        } catch (err) {
            console.error('Error al asignar materia:', err);
            setError(err.message);
            return false;
        } finally {
            stopLoading();
        }
    }, [
        selectedSubjectToAdd,
        currentUser?.id,
        availableSubjects,
        assignedSubjects,
        user,
        startLoading,
        stopLoading,
        setError,
        clearError,
        determineSubjectStatus
    ]);

    // Desasigna una materia del usuario
    const unassignSubjectFunction = useCallback(async (subjectToRemove) => {
        if (!subjectToRemove?.id) {
            setError(NOTIFICATION_MESSAGES.ERROR.SUBJECT_ID_MISSING);
            return false;
        }

        if (!currentUser?.id) {
            setError(NOTIFICATION_MESSAGES.ERROR.AUTH_USER_MISSING);
            return false;
        }

        try {
            startLoading();
            clearError();

            // Llamar al servicio de desasignación
            const response = await unassignSubject({
                user_id: parseInt(user.u_id),
                subject_id: parseInt(subjectToRemove.id),
                executor_id: parseInt(currentUser.id)
            });

            if (!response?.ok) {
                throw new Error(response.message || NOTIFICATION_MESSAGES.ERROR.SUBJECT_UNASSIGN_FAILED);
            }

            // Actualizar el estado local
            setAssignedSubjects(prev => 
                prev.filter(s => s.id !== subjectToRemove.id)
            );
            setHasSubjectChanges(true);

            return true;

        } catch (err) {
            console.error('Error al desasignar materia:', err);
            setError(err.message);
            return false;
        } finally {
            stopLoading();
        }
    }, [currentUser?.id, user?.u_id, startLoading, stopLoading, setError, clearError]);

    // Resetea el estado de cambios en materias
    const resetSubjectChanges = useCallback(() => {
        setHasSubjectChanges(false);
    }, []);

    // Limpia la selección actual
    const clearSelection = useCallback(() => {
        setSelectedSubjectToAdd('');
    }, []);

    // Obtiene estadísticas de las materias
    const getSubjectStats = useCallback(() => {
        return {
            totalAssigned: assignedSubjects.length,
            availableToAssign: getAvailableSubjectsToShow().length,
            hasChanges: hasSubjectChanges,
            byStatus: {
                tutor: assignedSubjects.filter(s => s.status === SUBJECT_ASSIGNMENT_STATUS.TUTOR).length,
                current: assignedSubjects.filter(s => s.status === SUBJECT_ASSIGNMENT_STATUS.CURRENT_SEMESTER).length,
                repeating: assignedSubjects.filter(s => s.status === SUBJECT_ASSIGNMENT_STATUS.REPEATING).length
            }
        };
    }, [assignedSubjects, getAvailableSubjectsToShow, hasSubjectChanges]);

    // Carga inicial de materias
    useEffect(() => {
        if (user?.u_id) {
            loadAvailableSubjects();
        }
    }, [user?.u_id, loadAvailableSubjects]);

    // Procesa materias asignadas cuando cambien las disponibles
    useEffect(() => {
        processAssignedSubjects();
    }, [processAssignedSubjects]);

    return {
        // Estados principales
        assignedSubjects,
        availableSubjects,
        selectedSubjectToAdd,
        hasSubjectChanges,
        loading,
        error,

        // Funciones de asignación
        assignSubjectFunction,
        unassignSubjectFunction,

        // Funciones de selección
        setSelectedSubjectToAdd,
        clearSelection,

        // Funciones de carga
        loadAvailableSubjects,

        // Funciones de utilidad
        resetSubjectChanges,
        getSubjectStats,

        // Datos derivados
        subjectsToShow: getAvailableSubjectsToShow(),
        hasError: hasError(),
        canAssign: selectedSubjectToAdd && !loading,

        // Funciones de error
        setError,
        clearError
    };
};

export default useSubjectManagement;