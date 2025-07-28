import { api } from '@/services';

// Servicio para crear PEA con conceptos clave
export const createPeaService = async (peaData) => {
    try {
        const response = await api.post('/admin/create/pea', peaData);
        return response.data;
    } catch (error) {
        console.error('Error en createPeaService:', error);
        
        const errData = error.response?.data;
        throw {
            message: errData?.message || 'Error al crear el PEA',
            status: error.response?.status || 500,
            details: errData
        };
    }
};