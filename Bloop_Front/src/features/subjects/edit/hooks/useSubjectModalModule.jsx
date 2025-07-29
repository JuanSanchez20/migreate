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
        onSubjectUpdate?.();
        peaList.refreshPEA();
        showSuccess('PEA creado y vinculado correctamente', 3000);
    });

    // Hook de gestión de tutores - SIMPLIFICADO
    const tutorManagement = useTutorAssignment(subject, onSubjectUpdate);

    // Hook de gestión de estudiantes - SIMPLIFICADO
    const studentManagement = useStudentAssignment(subject, onSubjectUpdate);

    // Abre el modal
    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

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

    // Maneja la asignación de estudiantes desde el modal secundario
    const handleStudentsAssignedFromModal = useCallback(async (assignmentData) => {
        if (!assignmentData || assignmentData.length === 0) {
            showError('Debe seleccionar al menos un estudiante');
            return { success: false };
        }

        const result = await studentManagement.assignStudents(assignmentData);
        
        if (result.success) {
            setShowStudentModal(false); // Cerrar modal
        }
        
        return result;
    }, [studentManagement, showError]);

    // Determina qué sección del PEA mostrar según el estado
    const getPEASection = useCallback(() => {
        if (!availableActions.canManagePEA && availableActions.peaViewLevel === 'none') {
            return { type: 'hidden' };
        }

        if (peaList.hasPEA && peaList.peaData) {
            return { 
                type: 'display', 
                data: peaList.peaData,
                viewLevel: availableActions.peaViewLevel
            };
        }

        if (availableActions.canManagePEA && !peaList.hasPEA) {
            return { 
                type: 'create',
                createState: peaCreate.createState,
                canCreate: peaCreate.canCreate
            };
        }

        if (availableActions.peaViewLevel === 'student' && !peaList.hasPEA) {
            return { type: 'no_pea_student' };
        }

        return { type: 'loading' };
    }, [availableActions, peaList, peaCreate]);

    // Verifica si el modal debe estar bloqueado
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

    return {
        // Estados del modal
        isModalOpen,
        showStudentModal,

        // Funciones del modal
        openModal,
        closeModal,
        openStudentModal,
        closeStudentModal,

        // Hooks individuales
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

        // Funciones principales
        handleStudentsAssignedFromModal,
        clearAllErrors,
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