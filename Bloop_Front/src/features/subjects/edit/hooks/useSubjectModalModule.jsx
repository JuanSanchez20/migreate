import { useState, useCallback } from 'react';
import { getAvailableActions } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useNotification } from '@/hooks';
import { useSubjectList } from './useSubjectList';
import { usePEAList } from './usePEAList';
import { usePEACreate } from './usePEACreate';
import { useTutorAssignment } from './useTutorAssignment';
import { useStudentAssignment } from './useStudentAssignment';

// Hook unificador principal para el modal de materias
export const useSubjectModalModule = (subject, onSubjectUpdate) => {
    const { user, userRole } = useAuth();
    const currentUser = {
        ...user,
        rol: parseInt(userRole)
    };

    // Notificaciones globales del modal
    const { notification, showSuccess, showError, showInfo, hideNotification } = useNotification();

    // Estados del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);

    // Obtener permisos y acciones disponibles
    const availableActions = getAvailableActions(currentUser.rol);

    // Hook de información básica de materia
    const subjectInfo = useSubjectList(subject, onSubjectUpdate);

    // Hook de listado de PEA
    const peaList = usePEAList(subject?.id, {
        autoFetch: true,
        onDataLoaded: (data, exists) => {
            if (exists) {
                showInfo('PEA cargado correctamente');
            }
        },
        onError: (error) => {
            showError(`Error cargando PEA: ${error}`);
        }
    });

    // Hook de creación de PEA
    const peaCreate = usePEACreate(subject, (createdData) => {
        // Callback cuando se crea PEA exitosamente
        onSubjectUpdate?.();
        peaList.refreshPEA();
        showSuccess('PEA creado y vinculado correctamente');
    });

    // Hook de gestión de tutores
    const tutorManagement = useTutorAssignment(subject, onSubjectUpdate);

    // Hook de gestión de estudiantes
    const studentManagement = useStudentAssignment(subject, onSubjectUpdate);

    // Abre el modal
    const openModal = useCallback(() => {
        setIsModalOpen(true);

        // Refrescar datos al abrir
        if (availableActions.canManagePEA) {
            peaList.refreshPEA();
        }
        if (availableActions.canManageTutors) {
            tutorManagement.loadTutors();
        }
        if (availableActions.canManageStudents) {
            studentManagement.loadStudents();
        }
    }, [availableActions, peaList, tutorManagement, studentManagement]);

    // Cierra el modal
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setShowStudentModal(false);

        // Resetear estados si es necesario
        if (subjectInfo.isEditing) {
            subjectInfo.cancelEditing();
        }

        if (peaCreate.createState.status !== 'empty' && peaCreate.createState.status !== 'completed') {
            peaCreate.resetState();
        }

        tutorManagement.clearSelection();
        studentManagement.clearAllSelections();
        hideNotification();
    }, [subjectInfo, peaCreate, tutorManagement, studentManagement, hideNotification]);

    // Maneja la actualización exitosa de la materia
    const handleSubjectUpdated = useCallback(() => {
        onSubjectUpdate?.();
        showSuccess('Información de materia actualizada');
    }, [onSubjectUpdate, showSuccess]);

    // Maneja la asignación exitosa de tutor
    const handleTutorAssigned = useCallback((tutorData) => {
        onSubjectUpdate?.();
        tutorManagement.clearSelection();
        showSuccess('Tutor asignado correctamente');
    }, [onSubjectUpdate, tutorManagement, showSuccess]);

    // Maneja la remoción exitosa de tutor
    const handleTutorRemoved = useCallback(() => {
        onSubjectUpdate?.();
        showSuccess('Tutor removido correctamente');
    }, [onSubjectUpdate, showSuccess]);

    // Maneja la asignación exitosa de estudiantes
    const handleStudentsAssigned = useCallback((assignmentResult) => {
        onSubjectUpdate?.();
        studentManagement.clearAllSelections();
        setShowStudentModal(false);

        if (assignmentResult.failed > 0) {
            showError(`${assignmentResult.successful} estudiantes asignados, ${assignmentResult.failed} fallaron`);
        } else {
            showSuccess(`${assignmentResult.successful} estudiante${assignmentResult.successful !== 1 ? 's' : ''} asignado${assignmentResult.successful !== 1 ? 's' : ''} correctamente`);
        }
    }, [onSubjectUpdate, studentManagement, showSuccess, showError]);

    // Abre el modal de asignación de estudiantes
    const openStudentModal = useCallback(() => {
        if (!availableActions.canManageStudents) {
            showError('No tiene permisos para gestionar estudiantes');
            return;
        }

        setShowStudentModal(true);
    }, [availableActions.canManageStudents, showError]);

    // Cierra el modal de asignación de estudiantes
    const closeStudentModal = useCallback(() => {
        setShowStudentModal(false);
        studentManagement.clearAllSelections();
    }, [studentManagement]);

    // Determina qué sección del PEA mostrar según el estado
    const getPEASection = useCallback(() => {
        // Si no puede ver PEA, no mostrar nada
        if (!availableActions.canManagePEA && availableActions.peaViewLevel === 'none') {
            return { type: 'hidden' };
        }

        // Si existe PEA, mostrar datos
        if (peaList.hasPEA && peaList.peaData) {
            return { 
                type: 'display', 
                data: peaList.peaData,
                viewLevel: availableActions.peaViewLevel
            };
        }

        // Si puede crear PEA y no existe, mostrar creación
        if (availableActions.canManagePEA && !peaList.hasPEA) {
            return { 
                type: 'create',
                createState: peaCreate.createState,
                canCreate: peaCreate.canCreate
            };
        }

        // Para estudiantes sin PEA
        if (availableActions.peaViewLevel === 'student' && !peaList.hasPEA) {
            return { type: 'no_pea_student' };
        }

        return { type: 'loading' };
    }, [availableActions, peaList, peaCreate]);

    // Verifica si el modal debe estar bloqueado (durante operaciones)
    const isModalBlocked = () => {
        return (
            subjectInfo.loading ||
            peaList.loading ||
            peaCreate.loading ||
            tutorManagement.loading ||
            studentManagement.loading
        );
    };

    // Obtiene todos los errores activos
    const getAllErrors = () => {
        const errors = [];

        if (subjectInfo.error) errors.push({ section: 'subject', error: subjectInfo.error });
        if (peaList.error) errors.push({ section: 'pea_list', error: peaList.error });
        if (peaCreate.error) errors.push({ section: 'pea_create', error: peaCreate.error });
        if (tutorManagement.error) errors.push({ section: 'tutor', error: tutorManagement.error });
        if (studentManagement.error) errors.push({ section: 'student', error: studentManagement.error });

        return errors;
    };

    // Limpia todos los errores
    const clearAllErrors = () => {
        subjectInfo.clearError();
        peaList.clearError();
        peaCreate.clearError();
        tutorManagement.clearError();
        studentManagement.clearError();
    };

    // Refresca todos los datos
    const refreshAllData = useCallback(async () => {
        const promises = [];

        if (availableActions.canManagePEA) {
            promises.push(peaList.refreshPEA());
        }
        if (availableActions.canManageTutors) {
            promises.push(tutorManagement.loadTutors());
        }
        if (availableActions.canManageStudents) {
            promises.push(studentManagement.loadStudents());
        }

        try {
            await Promise.all(promises);
            showSuccess('Datos actualizados correctamente');
        } catch (error) {
            showError('Error al actualizar algunos datos');
        }
    }, [availableActions, peaList, tutorManagement, studentManagement, showSuccess, showError]);

    return {
        // Estados del modal
        isModalOpen,
        showStudentModal,

        // Funciones del modal
        openModal,
        closeModal,
        openStudentModal,
        closeStudentModal,

        // Hooks individuales (API completa)
        subjectInfo,
        peaList,
        peaCreate,
        tutorManagement,
        studentManagement,

        // Datos calculados
        currentUser,
        availableActions,
        getPEASection,

        // Estados globales
        isLoading: isModalBlocked(),
        notification,
        allErrors: getAllErrors(),

        // Funciones globales
        handleSubjectUpdated,
        handleTutorAssigned,
        handleTutorRemoved,
        handleStudentsAssigned,
        clearAllErrors,
        refreshAllData,
        hideNotification,

        // Funciones de notificación
        showSuccess,
        showError,
        showInfo,

        // Estados de conveniencia
        hasAnyError: getAllErrors().length > 0,
        canEdit: availableActions.canEdit,
        canManagePEA: availableActions.canManagePEA,
        canManageTutors: availableActions.canManageTutors,
        canManageStudents: availableActions.canManageStudents
    };
};