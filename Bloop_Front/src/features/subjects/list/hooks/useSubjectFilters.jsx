import { useState, useCallback, useMemo } from 'react';
import { canSeeStatusFilter } from '../helpers/subjectHelpers';

// Hook para manejar la lógica de filtros de materias
const useSubjectFilters = (currentUser) => {
    // Estados iniciales de filtros
    const initialFilters = {
        nombre: '',
        jornada: 'todas',
        semestre: 'todos',
        estado: 'todos'
    };

    // Estado de filtros actual
    const [filters, setFilters] = useState(initialFilters);

    // Verificar si el usuario puede ver el filtro de estado
    const showStatusFilter = useMemo(() => {
        return canSeeStatusFilter(currentUser?.rol);
    }, [currentUser?.rol]);

    // Actualizar un filtro específico
    const updateFilter = useCallback((filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    }, []);

    // Actualizar múltiples filtros
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    // Limpiar todos los filtros
    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    // Verificar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return filters.nombre.trim() !== '' ||
               filters.jornada !== 'todas' ||
               filters.semestre !== 'todos' ||
               (showStatusFilter && filters.estado !== 'todos');
    }, [filters, showStatusFilter]);

    // Aplicar filtros a una lista de materias - OPTIMIZADO SIN useCallback
    const applyFilters = (subjects) => {
        if (!subjects || !Array.isArray(subjects)) {
            return [];
        }

        let filtered = [...subjects];

        // Filtro por nombre (búsqueda parcial)
        if (filters.nombre.trim()) {
            const searchTerm = filters.nombre.toLowerCase().trim();
            filtered = filtered.filter(subject => 
                subject.nombre?.toLowerCase().includes(searchTerm)
            );
        }

        // Filtro por jornada
        if (filters.jornada !== 'todas') {
            filtered = filtered.filter(subject => 
                subject.modalidad?.toLowerCase() === filters.jornada
            );
        }

        // Filtro por semestre
        if (filters.semestre !== 'todos') {
            filtered = filtered.filter(subject => 
                subject.semestre?.toString() === filters.semestre
            );
        }

        // Filtro por estado (solo si el usuario puede verlo)
        if (showStatusFilter && filters.estado !== 'todos') {
            if (filters.estado === 'activo') {
                filtered = filtered.filter(subject => subject.estado === true);
            } else if (filters.estado === 'inactivo') {
                filtered = filtered.filter(subject => subject.estado === false);
            }
        }

        return filtered;
    };

    // Obtener filtros activos para mostrar badges - OPTIMIZADO SIN useCallback
    const getActiveFilters = () => {
        const active = [];
        
        if (filters.nombre.trim()) {
            active.push({
                key: 'nombre',
                label: 'Nombre',
                value: filters.nombre,
                color: 'bg-[#278bbd]/20 text-[#278bbd]'
            });
        }
        
        if (filters.jornada !== 'todas') {
            active.push({
                key: 'jornada',
                label: 'Jornada',
                value: filters.jornada,
                color: 'bg-[#48d1c1]/20 text-[#48d1c1]'
            });
        }
        
        if (filters.semestre !== 'todos') {
            active.push({
                key: 'semestre',
                label: 'Semestre',
                value: filters.semestre,
                color: 'bg-purple-500/20 text-purple-400'
            });
        }
        
        if (showStatusFilter && filters.estado !== 'todos') {
            active.push({
                key: 'estado',
                label: 'Estado',
                value: filters.estado,
                color: 'bg-orange-500/20 text-orange-400'
            });
        }
        
        return active;
    };

    // Obtener estadísticas de filtrado - OPTIMIZADO SIN useCallback
    const getFilterStats = (originalSubjects, filteredSubjects) => {
        const original = originalSubjects?.length || 0;
        const filtered = filteredSubjects?.length || 0;
        
        return {
            original,
            filtered,
            percentage: original > 0 ? Math.round((filtered / original) * 100) : 0,
            hasFiltered: original !== filtered
        };
    };

    // Resetear filtros a estado inicial
    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    return {
        // Estados
        filters,
        hasActiveFilters,
        showStatusFilter,
        
        // Funciones de actualización
        updateFilter,
        updateFilters,
        clearFilters,
        resetFilters,
        
        // Funciones de aplicación
        applyFilters,
        
        // Funciones de información
        getActiveFilters,
        getFilterStats
    };
};

export default useSubjectFilters;