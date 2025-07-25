import { useState, useCallback } from 'react';

// Hook para gestionar filtros principales y selección de propuestas
const useProposalsActions = () => {

    // Estado del filtro activo en StatsPanel
    const [activeFilter, setActiveFilter] = useState('Totales');

    // Estado de la propuesta seleccionada para modal
    const [selectedProposal, setSelectedProposal] = useState(null);

    // Cambia el filtro principal del StatsPanel
    const changeFilter = useCallback((newFilter) => {
        const validFilters = ['Totales', 'Pendientes', 'Aprobadas', 'Rechazadas'];
        
        if (!validFilters.includes(newFilter)) {
            console.warn(`Filtro inválido: ${newFilter}. Usando 'Totales'.`);
            setActiveFilter('Totales');
            return 'Totales';
        }

        setActiveFilter(newFilter);
        return newFilter;
    }, []);

    // Selecciona una propuesta para mostrar en modal
    const selectProposal = useCallback((proposal) => {
        if (!proposal || (!proposal.pp_id && !proposal.id)) {
            console.warn('Propuesta inválida seleccionada');
            return;
        }
        setSelectedProposal(proposal);
    }, []);

    // Limpia la propuesta seleccionada
    const clearSelectedProposal = useCallback(() => {
        setSelectedProposal(null);
    }, []);

    // Verifica si un filtro específico está activo
    const isFilterActive = useCallback((filter) => {
        return activeFilter === filter;
    }, [activeFilter]);

    // Resetea todo al estado inicial
    const resetAll = useCallback(() => {
        setActiveFilter('Totales');
        setSelectedProposal(null);
    }, []);

    return {
        // Estados principales
        activeFilter,
        selectedProposal,

        // Acciones principales
        changeFilter,
        selectProposal,
        clearSelectedProposal,
        isFilterActive,
        resetAll,

        // Estados derivados para UI
        hasSelection: !!selectedProposal,
        isShowingAll: activeFilter === 'Totales'
    };
};

export default useProposalsActions;