import { useLoadingState } from '@/hooks';
import useUserData from './useUsersData';

// Combina el manejo de datos con el estado de carga
const useLoadingUsers = (initialMode = 'todos') => {
    // Hook del loading
    const { 
        loading, 
        startLoading, 
        stopLoading, 
        withLoading 
    } = useLoadingState();

    // Hook de los datos del usuario
    const {
        users,
        currentMode,
        loadUsers,
        refetchUsers,
        updateUser,
        getUserStats,
        findUserById
    } = useUserData(initialMode);

    // Carga de usuarios
    const loadUser = async (modo) => {
        return await withLoading(() => loadUsers(modo));
    };

    // Recarga los usuarios
    const refetchUser =  async () => {
        return await withLoading(() => refetchUsers());
    };

    // Función de inicialización
    const initializeUsers = async (modo = initialMode) => {
        try {
            await loadUser(modo);
        } catch (error) {
            // Error será manejado por el hook de errores
            throw error;
        }
    };

    return {
        // Estados
        users,
        currentMode,
        loading,

        // Funciones principales
        loadUser,
        refetchUser,
        initializeUsers,

        updateUser,
        getUserStats,
        findUserById,

        // Control del loading manual
        startLoading,
        stopLoading
    };
}

export default useLoadingUsers;