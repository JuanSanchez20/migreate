import { api } from '@/services';

// Asigna una materia a un usuario según su rol (tutor o estudiante).
export const assignSubjectService = async ({ user_id, subject_id, state_user_subject }) => {
    try {
        const payload = { user_id, subject_id };

        // Agrega el estado si está presente (para estudiantes)
        if (state_user_subject) {
            payload.state_user_subject = state_user_subject;
        }

        const response = await api.post('/admin/assign/subject', payload);

        return response.data;
    } catch (error) {
        const errData = error.response?.data;

        throw (errData?.message
            ? { message: errData.message }
            : { message: 'Error al asignar materia al usuario' });
    }
};
