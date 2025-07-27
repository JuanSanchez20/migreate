import { useCallback } from 'react';
import { useAuth } from '@/contexts';
import { useErrorState, useLoadingState } from '@/hooks';
import { unassignSubject } from '../../services/unassignSubject';
import { NOTIFICATION_MESSAGES } from '../helpers/modalConstants';

const useSubjectUnassign = (user, onSuccess, onError) => {
    const { user: currentUser } = useAuth();
    const { loading, startLoading, stopLoading } = useLoadingState(false);
    const { error, setError, clearError } = useErrorState();

    const unassignSubjectFunction = useCallback(async (subjectToRemove) => {
        if (!subjectToRemove?.id) {
            const errorMsg = NOTIFICATION_MESSAGES.ERROR.SUBJECT_ID_MISSING;
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

            const response = await unassignSubject({
                user_id: parseInt(user.u_id),
                subject_id: parseInt(subjectToRemove.id),
                executor_id: parseInt(currentUser.id)
            });

            if (!response?.ok) {
                throw new Error(response.message || NOTIFICATION_MESSAGES.ERROR.SUBJECT_UNASSIGN_FAILED);
            }

            onSuccess?.(response.message || NOTIFICATION_MESSAGES.SUCCESS.SUBJECT_UNASSIGNED);

            return {
                success: true,
                removedSubjectId: subjectToRemove.id
            };

        } catch (err) {
            console.error('Error al desasignar materia:', err);
            setError(err.message);
            onError?.(err.message);
            return { success: false };
        } finally {
            stopLoading();
        }
    }, [currentUser?.id, user?.u_id, startLoading, stopLoading, setError, clearError, onSuccess, onError]);

    return {
        loading,
        error,
        unassignSubjectFunction,
        setError,
        clearError
    };
};

export default useSubjectUnassign;