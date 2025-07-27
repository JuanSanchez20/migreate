import { useEffect, useMemo, useRef } from 'react';
import useSubjectData from './useSubjectData';
import useSubjectFilters from './useSubjectFilters';
import { groupSubjectsByJornada } from '../helpers/subjectHelpers';

// Hook unificador que combina datos y filtros de materias
const useSubjectModule = (currentUser) => {
    // Ref para rastrear si ya se ejecutó la carga inicial
    const hasInitialized = useRef(false);

    // Hook de datos
    const {
        subjects,
        loading,
        error,
        fetchSubjects,
        refreshSubjects,
        clearSubjects,
        stats: dataStats,
        hasData,
        isEmpty
    } = useSubjectData(currentUser);

    // Hook de filtros
    const {
        filters,
        hasActiveFilters,
        showStatusFilter,
        updateFilter,
        updateFilters,
        clearFilters,
        resetFilters,
        applyFilters,
        getActiveFilters,
        getFilterStats
    } = useSubjectFilters(currentUser);

    // Aplicar filtros a las materias - OPTIMIZADO
    const filteredSubjects = useMemo(() => {
        if (!subjects.length) return [];
        return applyFilters(subjects);
    }, [subjects, filters]); // Solo dependencias primitivas

    // Agrupar materias filtradas por jornada - OPTIMIZADO
    const groupedSubjects = useMemo(() => {
        return groupSubjectsByJornada(filteredSubjects);
    }, [filteredSubjects]);

    // Estadísticas de filtrado - OPTIMIZADO
    const filterStats = useMemo(() => {
        return getFilterStats(subjects, filteredSubjects);
    }, [subjects.length, filteredSubjects.length]); // Solo longitudes

    // Filtros activos - OPTIMIZADO
    const activeFilters = useMemo(() => {
        return getActiveFilters();
    }, [filters]); // Solo filters

    // Estadísticas combinadas - OPTIMIZADO
    const combinedStats = useMemo(() => {
        return {
            ...dataStats,
            filtered: {
                total: filteredSubjects.length,
                byJornada: {
                    matutina: groupedSubjects.matutina.length,
                    nocturna: groupedSubjects.nocturna.length
                }
            },
            filtering: filterStats
        };
    }, [dataStats, filteredSubjects.length, groupedSubjects.matutina.length, groupedSubjects.nocturna.length, filterStats]);

    // Cargar datos SOLO una vez al cambiar usuario - SOLUCIONADO
    useEffect(() => {
        const currentId = currentUser?.id;
        const currentRole = currentUser?.rol;
        
        if (currentId && currentRole) {
            // Solo ejecutar si cambió el usuario o es la primera vez
            if (!hasInitialized.current) {
                hasInitialized.current = true;
                fetchSubjects();
            }
        } else {
            hasInitialized.current = false;
            clearSubjects();
        }
    }, [currentUser?.id, currentUser?.rol]); // SOLO primitivos

    // Reset cuando cambia el usuario
    useEffect(() => {
        hasInitialized.current = false;
    }, [currentUser?.id, currentUser?.rol]);

    // Estados derivados para componentes
    const isEmptyState = !loading && !error && filteredSubjects.length === 0;
    const isErrorState = !loading && error;
    const isLoadingState = loading;
    const hasFilteredData = filteredSubjects.length > 0;

    return {
        // Estados principales
        subjects: filteredSubjects,
        groupedSubjects,
        loading,
        error,

        // Estados de filtros
        filters,
        hasActiveFilters,
        showStatusFilter,
        activeFilters,

        // Funciones de datos
        refresh: refreshSubjects,

        // Funciones de filtros
        updateFilter,
        updateFilters,
        clearFilters,
        resetFilters,

        // Estados derivados
        isEmptyState,
        isErrorState,
        isLoadingState,
        hasFilteredData,
        hasData,
        isEmpty,

        // Estadísticas
        stats: combinedStats,

        // Datos crudos (por si se necesitan)
        originalSubjects: subjects,
        user: currentUser
    };
};

export default useSubjectModule;