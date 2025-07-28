import { api } from '@/services';

// Consulta la lista de usuarios según el rol (modo) especificado.
export const listUsersAdmin = async (usuario_id, modo) => {
    try {
        // Realiza una petición GET al endpoint del backend pasando los parámetros por query string
        const response = await api.get('/admin/list/users', {
            params: {
                usuario_id,
                modo
            }
        });

        // Devuelve directamente la data de la respuesta del backend
        return response.data;
    } catch (error) {
        const errData = error.response?.data;

        // Lanza un error claro basado en la respuesta del backend o un mensaje genérico
        throw (errData?.message
            ? { message: errData.message }
            : { message: 'Error al obtener la lista de usuarios' });
    }
};