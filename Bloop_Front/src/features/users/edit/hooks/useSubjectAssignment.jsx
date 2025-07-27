import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts';
import { useErrorState, useLoadingState } from '@/hooks';
import { assignSubject } from '../../services/assignSubject';
import { SUBJECT_ASSIGNMENT_STATUS, NOTIFICATION_MESSAGES } from '../helpers/modalConstants';

const useSubjectAssign = (user, availableSubjects, onSuccess, onError) => {
    const { user: currentUser } = useAuth();
    const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState('');
    const [hasAssignmentChanges, setHasAssignmentChanges] = useState(false);

    const { loading, startLoading, stopLoading } = useLoadingState(false);
    const { error, setError, clearError } = useErrorState();

    const determineSubjectStatus = useCallback((subject, userData) => {
        if (userData?.rol_name?.toLowerCase() === 'tutor') {
            return SUBJECT_ASSIGNMENT_STATUS.TUTOR;
        }

        if (subject.semestre === parseInt(userData?.u_semester)) {
            return SUBJECT_ASSIGNMENT_STATUS.CURRENT_SEMESTER;
        }

        return SUBJECT_ASSIGNMENT_STATUS.REPEATING;
    }, []);

    const assignSubjectFunction = useCallback(async () => {
        if (!selectedSubjectToAdd) {
            const errorMsg = 'Debe seleccionar una materia para asignar';
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }

        if (!currentUser?.id) {
            const errorMsg = NOTIFICATION_MESSAGES.ERROR.AUTH_USER_MISSING;
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }

        try {
            startLoading();
            clearError();

            const subjectToAdd = availableSubjects.find(s => 
                s.id.toString() === selectedSubjectToAdd
            );

            if (!subjectToAdd) {
                throw new Error(NOTIFICATION_MESSAGES.ERROR.SUBJECT_NOT_FOUND);
            }

            const status = determineSubjectStatus(subjectToAdd, user);

            const response = await assignSubject({
                user_id: parseInt(user.u_id),
                subject_id: parseInt(subjectToAdd.id),
                state_user_subject: status
            });

            if (!response?.ok) {
                throw new Error(response?.message || NOTIFICATION_MESSAGES.ERROR.SUBJECT_ASSIGN_FAILED);
            }

            setSelectedSubjectToAdd('');
            setHasAssignmentChanges(true);
            onSuccess?.(response.message || NOTIFICATION_MESSAGES.SUCCESS.SUBJECT_ASSIGNED);

            return {
                success: true,
                assignedSubject: {
                    id: subjectToAdd.id,
                    name: subjectToAdd.nombre,
                    realName: subjectToAdd.nombre,
                    semester: subjectToAdd.semestre,
                    status: status
                }
            };

        } catch (err) {
            console.error('Error al asignar materia:', err);
            setError(err.message);
            onError?.(err.message);
            return { success: false };
        } finally {
            stopLoading();
        }
    }, [
        selectedSubjectToAdd,
        currentUser?.id,
        availableSubjects,
        user,
        startLoading,
        stopLoading,
        setError,
        clearError,
        determineSubjectStatus,
        onSuccess,
        onError
    ]);

    const clearSelection = useCallback(() => {
        setSelectedSubjectToAdd('');
    }, []);

    const resetAssignmentChanges = useCallback(() => {
        setHasAssignmentChanges(false);
    }, []);

    return {
        selectedSubjectToAdd,
        hasAssignmentChanges,
        loading,
        error,
        assignSubjectFunction,
        setSelectedSubjectToAdd,
        clearSelection,
        resetAssignmentChanges,
        setError,
        clearError
    };
};

export default useSubjectAssign;