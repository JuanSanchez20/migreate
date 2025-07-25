import { api } from '@/services';

export const loginUser = async (email, password) => {
    try {
        // Llama al servicio
        const response = await api.post('/login', { email, password });
        // Guarda la respuesta para utilizarlos
        return response.data;
    } catch (error) {
        // Toma el error que se manda en el servidor
        const errData = error.response?.data;
        // En caso de que no se pudo obtener el error del servidor
        throw (errData?.message ? { message: errData.message } : { message: 'Error inesperado en el login' });
    }
};
