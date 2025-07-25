import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts';
import { listProposals } from '../../services/listProposal';
import { useLoadingState, useErrorState } from '@/hooks';

// Hook para obtener y gestionar la lista de propuestas según el rol del usuario
const useProposalsList = () => {
    const { user } = useAuth();

    // Estados usando hooks globales
    const { loading, startLoading, stopLoading } = useLoadingState(true);
    const { error, setError, clearError } = useErrorState();

    // Estado principal de las propuestas
    const [proposals, setProposals] = useState([]);

    // Obtiene propuestas del backend
    const fetchProposals = useCallback(async (approvalStatus = null) => {
        try {
            // Validación inline del usuario
            if (!user?.id || !user?.rol) {
                throw new Error('Usuario no autenticado o datos incompletos');
            }

            // Mapeo de rol string a número
            const roleMap = { 'Admin': 1, 'Administrador': 1, 'Tutor': 2, 'Estudiante': 3 };
            const userRole = roleMap[user.rol];
            
            if (!userRole) {
                throw new Error('Rol de usuario inválido');
            }

            // Llamada al servicio
            const response = await listProposals({
                userId: user.id,
                userRole,
                approvalStatus,
                section: 'general'
            });

            const proposalsData = response.data || [];
            setProposals(proposalsData);
            return proposalsData;

        } catch (err) {
            console.error('Error en fetchProposals:', err);
            setError(err.message || 'Error al cargar la lista de propuestas');
            setProposals([]);
            throw err;
        }
    }, [user?.id, user?.rol]); // ✅ QUITAR setError

    // Obtiene propuestas con filtro específico
    const fetchProposalsWithFilter = useCallback(async (filterType) => {
        // Mapeo de filtros UI a estados de API
        const statusMap = {
            'Pendientes': 'Pendiente',
            'Aprobadas': 'Aprobada',
            'Rechazadas': 'Rechazada',
            'Totales': null
        };

        const approvalStatus = statusMap[filterType] || null;
        return await fetchProposals(approvalStatus);
    }, [fetchProposals]);

    // Limpia el estado
    const clearProposals = useCallback(() => {
        setProposals([]);
        clearError();
    }, []); // ✅ QUITAR clearError

    // Carga propuestas iniciales cuando cambia el usuario
    useEffect(() => {
        if (user?.id && user?.rol) {
            const loadInitialProposals = async () => {
                try {
                    startLoading();
                    clearError();
                    await fetchProposals();
                } catch (error) {
                    // Error ya manejado en fetchProposals
                } finally {
                    stopLoading();
                }
            };

            loadInitialProposals();
        } else {
            setProposals([]);
            clearError();
        }
    }, [user?.id, user?.rol]); // ✅ QUITAR todas las funciones

    return {
        // Datos principales
        proposals,

        // Estados
        loading,
        error,

        // Acciones principales
        fetchProposals,
        fetchProposalsWithFilter,
        clearProposals,

        // Estados derivados para UI
        hasError: !!error,
        hasData: proposals.length > 0,
        isEmpty: proposals.length === 0,
        count: proposals.length
    };
};

export default useProposalsList;