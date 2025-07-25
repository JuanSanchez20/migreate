import { useAuth } from '@/contexts';
import { listUsersAdmin } from '../../services/listUserAdmin';

// Consume el servicio para devolver los usuarios obtenidos
const useUserService = () => {
    const { user } = useAuth();

    // Obtiene los datos del usuarios
    const fetchUsers = async (modo = 'todos') => {
        // Usuario autenticado
        if (!user?.id){
            throw new Error('Usuario no autenticado. Se requiere autenticación para obtener usuarios.');
        }

        // Modo válido
        const validModes = ['todos', 'tutores', 'estudiantes'];
        if (!validModes.includes(modo)) {
            throw new Error(`Modo inválido: ${modo}. Los modos válidos son: ${validModes.join(', ')}`);
        }

        try {
            // Lama al servicio
            const response = await listUsersAdmin(user.id, modo);

            // Retorna la respuesta completa  del servidor
            return response;
        }catch (error) {
            // Errores enviados desde el servidor
            if (error.message) {
                throw error;
            }

            // Para errores inesperados
            throw new Error('Error al comunicarse con el servicio de usuarios');
        };
    };

    // Función para validar que el usuario esta autenticad
    const canAccessUsers = () => {
        // Verifica si encontró el usuario
        if (!user?.id) {
            return false;
        }

        // Verifica si es administrador
        if (!user.rol || user.rol !== 1){
            return false;
        }

        return true;
    };

    // Función para obtener información del usuario que solicita la petición
    const getCurrentUserInfo = () => {
        // Verifica si hay un usuario autenticado
        if (!user) {
            return null;
        }

        // Devuelve los valores obtenidos
        return {
            id: user.id,
            email: user.email,
            rol: user.rol,
            canAccess: canAccessUsers()
        };
    };

    return {
        fetchUsers,
        canAccessUsers,
        getCurrentUserInfo
    };
};

export default useUserService;