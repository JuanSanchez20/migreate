import { api } from '@/services';

export const createSubjectService = async (subjectData) => {
    try {
        const response = await api.post('/admin/create/subjects', subjectData);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Error con respuesta del servidor
            return {
                ok: false,
                status: error.response.status,
                message: error.response.data?.message || 'Error en la solicitud de creación de materia',
            };
        } else {
            // Error de red u otro tipo
            return {
                ok: false,
                message: 'No se pudo conectar con el servidor',
            };
        }
    }
};