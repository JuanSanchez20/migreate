import { useMemo } from 'react';

// Hook para calcular estadísticas básicas de propuestas
const useProposalsStats = (proposals = []) => {

    // Cálculo de estadísticas básicas
    const stats = useMemo(() => {
        if (!Array.isArray(proposals)) {
            return {
                pendientes: 0,
                aprobadas: 0,
                rechazadas: 0,
                totales: 0
            };
        }

        const pendientes = proposals.filter(proposal => 
            proposal.pp_approval_status === 'Pendiente'
        ).length;

        const aprobadas = proposals.filter(proposal => 
            proposal.pp_approval_status === 'Aprobada'
        ).length;

        const rechazadas = proposals.filter(proposal => 
            proposal.pp_approval_status === 'Rechazada'
        ).length;

        const totales = proposals.length;

        return {
            pendientes,
            aprobadas,
            rechazadas,
            totales
        };
    }, [proposals]);

    // Cálculo de porcentajes
    const percentages = useMemo(() => {
        const { pendientes, aprobadas, rechazadas, totales } = stats;

        if (totales === 0) {
            return {
                pendientesPercent: 0,
                aprobadasPercent: 0,
                rechazadasPercent: 0
            };
        }

        return {
            pendientesPercent: Math.round((pendientes / totales) * 100),
            aprobadasPercent: Math.round((aprobadas / totales) * 100),
            rechazadasPercent: Math.round((rechazadas / totales) * 100)
        };
    }, [stats]);

    // Obtiene estadísticas por filtro específico
    const getStatsByFilter = (filterType) => {
        const filterMap = {
            'Totales': stats.totales,
            'Pendientes': stats.pendientes,
            'Aprobadas': stats.aprobadas,
            'Rechazadas': stats.rechazadas
        };

        return filterMap[filterType] || 0;
    };

    return {
        // Estadísticas principales
        stats,
        percentages,

        // Función útil
        getStatsByFilter,

        // Estados derivados para UI
        isEmpty: stats.totales === 0,
        hasData: stats.totales > 0
    };
};

export default useProposalsStats;