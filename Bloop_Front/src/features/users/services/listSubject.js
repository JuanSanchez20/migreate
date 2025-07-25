import { api } from '@/services';

// Obtiene la lista de materias asignadas a un usuario según su rol
export const listSubject = async (userId, userRole) => {
    try {
        // Construir el payload según tu controlador
        const payload = {
            userId,
            userRole
        };

        // Llamada POST según tu ruta: router.post('/list/subjects', listSubject)
        const response = await api.post('/list/subjects', payload);

        // Devuelve directamente la data de la respuesta del backend
        return response.data;
    } catch (error) {
        const errData = error.response?.data;

        // Lanza un error claro basado en la respuesta del backend o un mensaje genérico
        throw (errData?.message
            ? { message: errData.message }
            : { message: 'Error al obtener la lista de materias' });
    }
};