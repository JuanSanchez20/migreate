import { useState, useMemo } from 'react';

// Maneja los filtros de los usuarios
const useUserFilters = () => {
    // Estado inicial de filtros
    const [filters, setFilters] = useState({
        email: '',
        rol: 'todos',
        semestre: 'todos',
        estado: 'todos'
    });

    // Actualiza el filtro específico
    const updateFilter = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    // Actualiza varios filtros a la vez
    const updateFilters = (newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    };

    // Limpia todos los filtros a su estado inicial
    const clearFilters = () => {
        setFilters({
            email: '',
            rol: 'todos',
            semestre: 'todos',
            estado: 'todos'
        });
    };

    // Verifica si hay filtros activos
    const hasActiveFilters = () => {
        return filters.email.trim() !== '' ||
            filters.rol !== 'todos' ||
            filters.semestre !== 'todos' ||
            filters.estado !== 'todos';
    };

    // Aplica filtros a una lisa de usuarios
    const applyFiltersToUsers = (users) => {
        if (!Array.isArray(users)) {
            return [];
        }

        return users.filter(user => {
            // Filtro por email
            if (filters.email.trim() !== '') {
                const emailMatch = user.u_email?.toLowerCase().includes(filters.email.toLowerCase().trim());
                if (!emailMatch) return false;
            }

            // Filtro por rol
            if (filters.rol !== 'todos') {
                // Comparar con rol numérico
                if (filters.rol === '2' && user.rol_name?.toLowerCase() !== 'tutor') return false;
                if (filters.rol === '3' && user.rol_name?.toLowerCase() !== 'estudiante') return false;
            }

            // Filtro por semestre (solo para estudiantes)
            if (filters.semestre !== 'todos') {
                // Solo aplicar filtro de semestre a estudiantes
                if (user.rol_name?.toLowerCase() === 'estudiante') {
                    if (user.u_semester?.toString() !== filters.semestre) return false;
                }
                // Para tutores, incluir siempre
            }

            // Filtro por estado
            if (filters.estado !== 'todos') {
                const isActive = user.u_state === true;
                if (filters.estado === 'activo' && !isActive) return false;
                if (filters.estado === 'suspendido' && isActive) return false;
            }

            return true;
        });
    };

    // Obtener usuarios filtrados
    const getFilteredUsers = useMemo(() => {
        return (users) => applyFiltersToUsers(users);
    }, [filters]);

    // Obtiene estadísticas de los filtros aplicados
    const getFilterStats = (originalUsers = [], filteredUsers = []) => {
        return {
            total: originalUsers.length,
            filtered: filteredUsers.length,
            hasFilters: hasActiveFilters(),
            percentage: originalUsers.length > 0 ? 
                Math.round((filteredUsers.length / originalUsers.length) * 100) : 0,
            hidden: originalUsers.length - filteredUsers.length
        };
    };

    // Funciones específicos para cada tipo de filtro
    const filterActions = {
        updateEmail: (email) => updateFilter('email', email),
        updateRol: (rol) => updateFilter('rol', rol),
        updateSemestre: (semestre) => updateFilter('semestre', semestre),
        updateEstado: (estado) => updateFilter('estado', estado)
    };

    // Obtiene información de filtros activos para mostrar
    const getActiveFiltersInfo = () => {
        const activeFilters = [];

        if (filters.email.trim() !== '') {
            activeFilters.push({
                type: 'email',
                label: 'Email',
                value: filters.email,
                color: 'text-[#278bbd] bg-[#278bbd]/20'
            });
        }

        if (filters.rol !== 'todos') {
            const rolText = filters.rol === '2' ? 'Tutor' : 'Estudiante';
            activeFilters.push({
                type: 'rol',
                label: 'Rol',
                value: rolText,
                color: 'text-[#48d1c1] bg-[#48d1c1]/20'
            });
        }

        if (filters.semestre !== 'todos') {
            activeFilters.push({
                type: 'semestre',
                label: 'Semestre',
                value: `${filters.semestre}°`,
                color: 'text-purple-400 bg-purple-500/20'
            });
        }

        if (filters.estado !== 'todos') {
            const estadoColor = filters.estado === 'activo' 
                ? 'text-green-400 bg-green-500/20' 
                : 'text-red-400 bg-red-500/20';
            activeFilters.push({
                type: 'estado',
                label: 'Estado',
                value: filters.estado.charAt(0).toUpperCase() + filters.estado.slice(1),
                color: estadoColor
            });
        }

        return activeFilters;
    };

    return {
        // Estado de filtros
        filters,

        // Funciones principales
        updateFilter,
        updateFilters,
        clearFilters,

        // Funciones específicas para cada filtro
        ...filterActions,

        // Funciones de aplicación de filtros
        getFilteredUsers,
        applyFiltersToUsers,

        // Funciones auxiliares
        hasActiveFilters,
        getFilterStats,
        getActiveFiltersInfo
    };
}

export default useUserFilters;