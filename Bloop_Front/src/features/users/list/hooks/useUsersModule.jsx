import { useEffect, useMemo, useRef } from 'react';
import useUsersState from './useUsersState';
import useUserFilters from './useUserFilters';
import { useAuth } from '@/contexts';

// Hook principal del módulo de usuarios
const useUsersModule = ({ 
    initialMode = 'todos', 
    autoLoad = true 
} = {}) => {
    const { user: currentUser, userRole } = useAuth();

    // Evita la recarga de usuarios si ya se ha inicializado
    const hasInitialized = useRef(false);

    // Instancia del hook con manejo de cargas y errores
    const {
        users,
        loading,
        error,
        currentMode,
        loadUsers,
        refetchUsers,
        initializeUsers,
        updateUser,
        getUserStats,
        findUserById,
        clearError,
        hasError,
        getFormattedError,
        getModuleState,
        resetUsersState
    } = useUsersState(initialMode);

    // Instancia del hook de filtros
    const {
        filters,
        updateFilter,
        updateFilters,
        clearFilters,
        updateEmail,
        updateRol,
        updateSemestre,
        updateEstado,
        getFilteredUsers,
        hasActiveFilters,
        getFilterStats,
        getActiveFiltersInfo
    } = useUserFilters();

    // Usuarios filtrados
    const filteredUsers = useMemo(() => {
        return getFilteredUsers(users);
    }, [users, getFilteredUsers]);

    // Estadísticas del módulo
    const moduleStats = useMemo(() => {
        const baseStats = getUserStats();
        const filterStats = getFilterStats(users, filteredUsers);

        return {
            ...baseStats,
            ...filterStats,
            hasData: users.length > 0,
            showingFiltered: hasActiveFilters(),
            activeFilters: getActiveFiltersInfo()
        };
    }, [users, filteredUsers, getUserStats, getFilterStats, hasActiveFilters, getActiveFiltersInfo]);

    // Maneja los cambios de filtros
    const handleFiltersChange = (newFilters) => updateFilters(newFilters);

    // Limpia los filtros
    const handleClearFilters = () => clearFilters();

    // Refresca los datos
    const handleRefresh = async () => {
        clearError();
        await refetchUsers();
    };

    // Maneja las actualizaciones del usuario
    const handleUserUpdate = async (updatedUserData = null) => {
        if (updatedUserData) {
            // Si se proporciona el usuario actualizado, actualizar directamente
            updateUser(updatedUserData);
        } else {
            // Si no, recargar toda la lista
            await refetchUsers();
        }
    };

    // Carga los usuarios con el modo específico
    const loadUsersByMode = async (modo) => { await loadUsers(modo)};

    // Obtiene el estado completo del módulo (debuggin)
    const getCompleteModuleState = () => {
        return {
            ...getModuleState(),
            filters,
            filteredCount: filteredUsers.length,
            hasActiveFilters: hasActiveFilters(),
            stats: moduleStats
        };
    };

    // Resetea completamente el módulo
    // Limpia datos errores y filtros
    const resetModule = () => {
        resetUsersState();
        clearFilters();
        hasInitialized.current = false;
    };

    // Efecto para cargar usuarios automáticamente al montar el componente
    useEffect(() => {
        if (autoLoad && !hasInitialized.current && currentUser?.id && userRole === 1) {
            hasInitialized.current = true;
            initializeUsers(initialMode);
        }
    }, [autoLoad, currentUser?.id, userRole, initialMode, initializeUsers]);

    return {
        // Estados principales
        users: filteredUsers,
        allUsers: users,
        loading,
        error,
        currentMode,
        filters,

        // Estadísticas y estado
        stats: moduleStats,
        hasError,
        hasActiveFilters,

        // Funciones de carga y actualización
        loadUsers: loadUsersByMode,
        refreshUsers: handleRefresh,
        initializeUsers,
        updateUser,

        // Funciones de filtros
        onFiltersChange: handleFiltersChange,
        onClearFilters: handleClearFilters,

        // Funciones específicas de filtros
        updateEmail,
        updateRol,
        updateSemestre,
        updateEstado,

        // Funciones de utilidad
        findUserById,
        getUserStats,
        clearError,
        getFormattedError,

        // Callbacks para componentes
        onRefresh: handleRefresh,
        onUserUpdate: handleUserUpdate,

        // Funciones avanzadas
        getCompleteModuleState,
        resetModule
    };
};

export default useUsersModule;