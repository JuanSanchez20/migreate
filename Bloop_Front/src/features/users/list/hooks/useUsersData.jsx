import { useState, useCallback } from 'react';
import useUserService from './useUserService';

// Maneja el estado de datos del usuario (Mantiene y Actualiza la lista de usuarios)
const useUserData = (initialMode = 'todos') => {
    const { fetchUsers } = useUserService();

    // Estado para almacenar la lista de usuarios
    const [users, setUsers] = useState([]);

    // Estado para recordar el último modo usado
    const [currentMode, setCurrentMode] = useState(initialMode);

    // Función para cargar los usuarios
    const loadUsers = useCallback(async (modo = currentMode) => {
        try {
            // Llama al servicio
            const response = await fetchUsers(modo);

            // Valida que la respuesta contenga datos
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('El servidor no devolvió una lista válida de usuarios');
            }

            // Actualiza el estado con los usuarios obtenidos
            setUsers(response.data);

            // Recordar el modo usado
            setCurrentMode(modo);

            // Retornar los datos para que el componente los use si es necesario
            return response.data;
        } catch (error) {
            console.error('Error en loadUsers:', error);
            // Envío de error del servidor
            throw error;
        }
    }, [fetchUsers, currentMode]);

    // Función para recargar los usuarios con el último modo usado
    const refetchUsers = async () => await loadUsers(currentMode);

    // Función para actualizar un usuario específico en la lista
    const updateUser = (updatedUser) => {
        if (!updatedUser || !updatedUser.u_id) {
            console.warn('No se puede actualizar usuario: datos inválidos');
            return;
        }

        setUsers(prevUsers =>
            prevUsers.map(user=>
                user.u_id === updatedUser.u_id ? updatedUser : user
            )
        )
    };

    // Función para obtener las estadísticas de la lista actual
    const getUserStats = () => {
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.u_state === true).length;
        const inactiveUsers = totalUsers - activeUsers;

        // Conteo por roles
        const tutors = users.filter(user => user.rol_name?.toLowerCase() === 'tutor').length;
        const students = users.filter(user => user.rol_name?.toLowerCase() === 'estudiante').length;

        return {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            tutors,
            students,
            mode: currentMode
        };
    };

    // Función para buscar un usuario específico por ID
    const findUserById = (userId) => {
        return users.find(user => user.u_id === userId) || null;
    };

    return {
        // Estados
        users,
        currentMode,

        // Funciones de listar
        loadUsers,
        refetchUsers,

        // Funciones de actualizar
        updateUser,

        // Funciones de búsqueda
        getUserStats,
        findUserById
    }
};

export default useUserData;