import { useState, useCallback } from 'react';
import { assignSubjectService } from '../../services/assignSubject';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState } from '@/hooks';

import {
    validateTutorAssignment,
    validateAssignSubjectPayload
} from '../helpers/validation';
import {
    transformTutorAssignmentPayload,
    formatApiError
} from '../helpers/mapperOptions';

// Hook especializado para manejar la asignación de tutores a materias
const useAssignSubject = () => {
    // Estados del contexto de autenticación
    const { user, userRole } = useAuth();

    // Estados principales
    const [assignedTutor, setAssignedTutor] = useState(null);
    const [assignmentResult, setAssignmentResult] = useState(null);

    // Hooks de estado
    const { loading, withLoading } = useLoadingState(false);
    const { error, setError, clearError } = useErrorState();

    // Asignar tutor a una materia específica
    const assignTutor = useCallback(async (tutorData, subjectId) => {
        if (!user?.id || userRole !== 1) {
            setError('Permisos insuficientes para asignar tutor');
            return { success: false };
        }

        if (!subjectId) {
            setError('ID de materia requerido para asignación');
            return { success: false };
        }

        // Validar datos del tutor
        const tutorValidation = validateTutorAssignment(tutorData, userRole);
        if (!tutorValidation.isValid) {
            const errorMessages = Object.values(tutorValidation.errors).join(', ');
            setError(errorMessages);
            return { success: false };
        }

        // Preparar payload
        const payload = transformTutorAssignmentPayload(tutorData, subjectId);
        const payloadValidation = validateAssignSubjectPayload(payload);

        if (!payloadValidation.isValid) {
            setError('Datos de asignación inválidos');
            return { success: false };
        }

        try {
            const response = await withLoading(async () => {
                return await assignSubjectService(payload);
            });

            if (response.ok) {
                setAssignedTutor(tutorData);
                setAssignmentResult({
                    subjectId,
                    tutorId: tutorData.u_id,
                    tutorName: tutorData.u_name,
                    assignedAt: new Date().toISOString()
                });
                clearError();
                return { 
                    success: true, 
                    data: response,
                    assignment: {
                        subjectId,
                        tutor: tutorData
                    }
                };
            } else {
                setError(response.message || 'Error al asignar tutor');
                return { success: false };
            }
        } catch (err) {
            const errorMessage = formatApiError(err);
            setError(errorMessage);
            return { success: false };
        }
    }, [user?.id, userRole, withLoading, setError, clearError]);

    // Verificar si se puede asignar tutor
    const canAssignTutor = useCallback((tutorData, subjectId) => {
        if (!user?.id || userRole !== 1) {
            return false;
        }

        if (!subjectId || !tutorData?.u_id) {
            return false;
        }

        const validation = validateTutorAssignment(tutorData, userRole);
        return validation.isValid;
    }, [user?.id, userRole]);

    // Limpiar asignación actual
    const clearAssignment = useCallback(() => {
        setAssignedTutor(null);
        setAssignmentResult(null);
        clearError();
    }, [clearError]);

    // Verificar si hay un tutor asignado
    const hasTutorAssigned = assignedTutor !== null;

    // Verificar si la asignación fue exitosa
    const isAssignmentComplete = assignmentResult !== null;

    // Obtener información de la asignación actual
    const getAssignmentInfo = useCallback(() => {
        if (!assignmentResult) {
            return null;
        }

        return {
            subjectId: assignmentResult.subjectId,
            tutorId: assignmentResult.tutorId,
            tutorName: assignmentResult.tutorName,
            assignedAt: assignmentResult.assignedAt
        };
    }, [assignmentResult]);

    // Validar si los datos del tutor son correctos para asignación
    const validateTutorData = useCallback((tutorData) => {
        return validateTutorAssignment(tutorData, userRole);
    }, [userRole]);

    // Preparar datos para vista previa de asignación
    const getAssignmentPreview = useCallback((tutorData, subjectId) => {
        if (!tutorData || !subjectId) {
            return null;
        }

        return {
            tutorName: tutorData.u_name,
            tutorEmail: tutorData.u_email,
            subjectId: subjectId,
            canProceed: canAssignTutor(tutorData, subjectId)
        };
    }, [canAssignTutor]);

    // Retornar API del hook
    return {
        // Estados principales
        loading,
        error,
        assignedTutor,
        assignmentResult,

        // Estados computados
        hasTutorAssigned,
        isAssignmentComplete,

        // Acciones principales
        assignTutor,
        clearAssignment,

        // Utilidades de validación
        canAssignTutor,
        validateTutorData,
        getAssignmentInfo,
        getAssignmentPreview,

        // Control de errores
        clearError
    };
};

export default useAssignSubject;