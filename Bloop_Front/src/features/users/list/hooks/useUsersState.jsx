import { useErrorState } from '@/hooks';
import useLoadingUsers from './useLoadingUsers';

// Hook que combina todas las funcionalidades
const useUsersState = (initialMode = 'todos') => {
    // Hook para loading y datos de usuarios
    const {
        users,
        currentMode,
        loading,
        loadUser,
        refetchUser,
        updateUser,
        getUserStats,
        findUserById,
        startLoading,
        stopLoading
    } = useLoadingUsers(initialMode);

    // Hook genérico para manejo de errores
    const {
        error,
        setError,
        clearError,
        hasError,
        getFormattedError,
        withErrorHandling
    } = useErrorState();

    // Carga los usuarios
    const loadUsersWithFullHandling = async (modo) => {
        try {
            return await withErrorHandling(() => loadUser(modo));
        } catch (err) {
            // Error capturado del hook genérico de errores
            return null;
        }
    };

    // Recarga los usuarios con manejo completo de carga y errores
    const refetchUsersWithFullHandling = async () => {
        try {
            return await withErrorHandling(() => refetchUser());
        } catch (err) {
            // Error capturado del hook genérico de errores
            return null;
        }
    };

    // Inicialización completa
    const initializeUsersState = async (modo = initialMode) => await loadUsersWithFullHandling(modo);

    // Actualiza los usuarios
    const updateUserSafely = (updatedUser) => {
        try {
            clearError(); // Limpiar errores previos
            updateUser(updatedUser);
            return true;
        } catch (err) {
            setError('Error al actualizar usuario en la lista');
            return false;
        }
    };

    // Función para obtener el estado general del módulo
    const getModuleState = () => {
        return {
            hasUsers: users.length > 0,
            isLoading: loading,
            hasError: hasError(),
            errorMessage: getFormattedError(),
            userCount: users.length,
            currentMode,
            stats: getUserStats()
        };
    };

    // Función para resetear todo el estado del módulo
    const resetUsersState = () => clearError();

    return {
        // Estados principales
        users,
        loading,
        error,
        currentMode,

        // Funciones principales con manejo completo
        loadUsers: loadUsersWithFullHandling,
        refetchUsers: refetchUsersWithFullHandling,
        initializeUsers: initializeUsersState,

        // Funciones de manipulación seguras
        updateUser: updateUserSafely,

        // Funciones de búsqueda y estadísticas
        getUserStats,
        findUserById,

        // Control manual de estados
        clearError,
        startLoading,
        stopLoading,

        // Funciones auxiliares
        hasError,
        getFormattedError,
        getModuleState,
        resetUsersState
    };
}

export default useUsersState;