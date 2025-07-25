import { api } from '@/services';

export const listUser = async (usuario_id) => {
    try {
        // Llama al servicio
        const response = await api.post('/list/users', { usuario_id });
        // Guarda la respuesta para utilizarlos
        return response.data.user;
    } catch (error) {
        // Toma el error que se manda en el servidor
        const errData = error.response?.data;
        // En caso de que no se pudo obtener el error del servidor
        throw (errData?.message ? { message: errData.message } : { message: 'Error al obtener datos del usuario' });
    }
};
