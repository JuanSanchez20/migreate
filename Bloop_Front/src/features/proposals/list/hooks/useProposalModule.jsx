import { useMemo, useCallback } from 'react';
import useProposalsList from './useProposalList';
import useProposalsStats from './useProposalStats';
import useProposalsFilters from './useProposalFilter';
import useProposalsActions from './useProposalActions';
import useSubjectList from './useSubjectList'; // ✅ AGREGADO: Hook para materias

// Hook unificador que orquesta todos los hooks especializados de propuestas
const useProposalModule = () => {
    // Inicializar todos los hooks especializados
    const proposalsList = useProposalsList();
    const proposalsFilters = useProposalsFilters();
    const proposalsActions = useProposalsActions();
    const subjectsData = useSubjectList(); // ✅ AGREGADO: Hook para materias

    // Aplicar filtros locales a las propuestas obtenidas de la API
    const filteredProposals = useMemo(() => {
        return proposalsFilters.applyFilters(proposalsList.proposals);
    }, [proposalsList.proposals, proposalsFilters.applyFilters]);

    // Calcular estadísticas basadas en las propuestas originales
    const proposalsStats = useProposalsStats(proposalsList.proposals);

    // Función unificada para recargar propuestas cuando cambia el filtro principal
    const handleFilterChange = useCallback(async (newFilter) => {
        try {
            // Cambiar el filtro en las acciones
            const actualFilter = proposalsActions.changeFilter(newFilter);

            // Recargar propuestas con el nuevo filtro desde la API
            await proposalsList.fetchProposalsWithFilter(actualFilter);

            return actualFilter;
        } catch (error) {
            console.error('Error al cambiar filtro:', error);
            throw error;
        }
    }, [proposalsActions.changeFilter, proposalsList.fetchProposalsWithFilter]);

    // Función unificada para refrescar datos
    const refreshData = useCallback(async () => {
        try {
            await proposalsList.fetchProposalsWithFilter(proposalsActions.activeFilter);
        } catch (error) {
            console.error('Error al refrescar datos:', error);
            throw error;
        }
    }, [proposalsList.fetchProposalsWithFilter, proposalsActions.activeFilter]);

    // ✅ CORREGIDO: Usar materias de la base de datos, no de propuestas
    const availableSubjects = useMemo(() => {
        return subjectsData.subjects || [];
    }, [subjectsData.subjects]);

    // Función para limpiar todos los estados
    const clearAll = useCallback(() => {
        proposalsList.clearProposals();
        proposalsFilters.clearAllFilters();
        proposalsActions.resetAll();
    }, [
        proposalsList.clearProposals, 
        proposalsFilters.clearAllFilters, 
        proposalsActions.resetAll
    ]);

    // API unificada y limpia para usar en componentes
    return {
        // Datos principales
        proposals: filteredProposals,
        allProposals: proposalsList.proposals,
        selectedProposal: proposalsActions.selectedProposal,

        // Estados principales
        loading: proposalsList.loading,
        error: proposalsList.error,
        hasData: proposalsList.hasData,
        isEmpty: proposalsList.isEmpty,

        // Estadísticas
        stats: proposalsStats.stats,

        // Filtros y acciones
        filters: {
            // Filtro principal
            active: proposalsActions.activeFilter,
            change: handleFilterChange,
            isActive: proposalsActions.isFilterActive,

            // Filtros locales
            search: {
                term: proposalsFilters.searchTerm,
                update: proposalsFilters.updateSearchTerm
            },
            subject: {
                selected: proposalsFilters.selectedSubject,
                update: proposalsFilters.updateSelectedSubject,
                available: availableSubjects
            },

            // Estado de filtros
            hasLocalFilters: proposalsFilters.hasActiveFilters,
            clearAll: proposalsFilters.clearAllFilters
        },

        // Acciones de propuestas
        actions: {
            select: proposalsActions.selectProposal,
            clearSelection: proposalsActions.clearSelectedProposal,
            refresh: refreshData
        },

        // Funciones auxiliares
        utils: {
            clearAll
        },

        // Estados útiles para UI
        ui: {
            showEmptyState: !proposalsList.loading && proposalsList.isEmpty,
            showLoadingState: proposalsList.loading,
            showErrorState: proposalsList.hasError,
            showNoResults: !proposalsList.loading && proposalsList.hasData && filteredProposals.length === 0,
            canRefresh: !proposalsList.loading,
            hasSelection: proposalsActions.hasSelection
        }
    };
};

export default useProposalModule;