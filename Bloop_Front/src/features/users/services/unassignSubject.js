import { api } from '@/services';

export const unassignSubject = async ({ user_id, subject_id, executor_id }) => {
    try {
        const payload = { user_id, subject_id, executor_id };

        const response = await api.post('/admin/unassign/subject', payload);
        return response.data;
    } catch (error) {
        const errData = error.response?.data;
        throw (errData?.message
            ? { message: errData.message }
            : { message: 'Error al desasignar materia del usuario' });
    }
};