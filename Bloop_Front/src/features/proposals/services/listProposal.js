import { api } from '@/services';

// Servicio genérico para listar propuestas según la sección solicitada
export const listProposals = async ({
    userId,
    userRole,
    approvalStatus = null,
    subjectFilter = null,
    section = 'general'
}) => {
    try {
        // Estructura que espera el backend
        const payload = {
            id: userId,      // ← Cambiar userId por id
            role: userRole   // ← Cambiar userRole por role
        };

        // Construir query params
        const queryParams = new URLSearchParams();
        if (approvalStatus && approvalStatus !== 'Totales') {
            queryParams.append('status', approvalStatus);
        }
        if (subjectFilter) {
            queryParams.append('subject', subjectFilter.toString());
        }

        // Determinar endpoint
        let endpoint = '/list/proposals';
        if (section === 'objetive') {
            endpoint = '/list/proposals/objetive';
        } else if (section === 'requeriments') {
            endpoint = '/list/proposals/requeriments';
        }

        // Agregar query params si existen
        const fullEndpoint = queryParams.toString() 
            ? `${endpoint}?${queryParams.toString()}`
            : endpoint;

        const response = await api.post(fullEndpoint, payload);
        return response.data;
    } catch (error) {
        const errData = error.response?.data;
        throw (errData?.message
            ? { message: errData.message }
            : { message: 'Error al obtener la lista de propuestas' });
    }
};