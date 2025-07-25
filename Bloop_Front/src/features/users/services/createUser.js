import { api } from '@/services';

// Crea un nuevo usuario en el sistema
export const createUser = async (userData) => {
    try {
        const response = await api.post('/admin/create/users', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Error con respuesta del servidor
            return {
                ok: false,
                status: error.response.status,
                message: error.response.data?.message || 'Error en la solicitud',
            };
        } else {
            // Error sin respuesta (problemas de red, etc.)
            return {
                ok: false,
                message: 'No se pudo conectar con el servidor',
            };
        }
    }
};