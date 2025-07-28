import { api } from '@/services';

export const listPEAService = async (subjectId) => {
    try {
        // Valida que se proporcione el subjectId
        if (!subjectId) {
            throw new Error('El ID de la materia es obligatorio');
        }

        // Valida que subjectId sea un número entero positivo
        if (!Number.isInteger(subjectId) || subjectId <= 0) {
            throw new Error('El ID de la materia debe ser un número entero positivo');
        }

        const payload = {
            subjectId
        };

        // Llamada POST al endpoint del PEA con el subjectId
        const response = await api.post('/list-with-concepts', payload);

        // Devuelve directamente la data de la respuesta del backend
        return response.data;
    } catch (error){
        const errData = error.response?.data;

        // Lanza un error claro basado en la respuesta del backend o un mensaje genérico
        throw (errData?.message
            ? { message: errData.message }
            : { message: 'Error al obtener la lista de materias' });
    }
}