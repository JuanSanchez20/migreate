import { api } from '@/services'

export const updateUserService = async (payload) => {
    try {
        const {
            admin_id,
            user_id,
            ...rest
        } = payload;

        // Verificar que user_id existe
        if (!user_id) {
            throw { message: 'ID de usuario requerido' };
        }

        const finalPayload = {
            executor_id: admin_id,
            ...rest
        };

        // Usar el user_id en la URL
        const response = await api.put(`/update/users/${user_id}`, finalPayload);
        return response.data;
    } catch (error) {
        const errData = error.response?.data;
        throw (errData?.message
            ? { message: errData.message }
            : { message: 'Error al actualizar el usuario' });
    }
};