import { api } from '@/services';

// Servicio para crear una propuesta
export const createProposalService = async (proposal) => {
    try {
        const response = await api.post('/create/proposals', proposal);
        return response.data;
    } catch (error) {
        console.error('Error en createProposalService:', error);
        
        const errData = error.response?.data;
        throw {
            message: errData?.message || 'Error al crear la propuesta',
            status: error.response?.status || 500,
            details: errData
        };
    }
};