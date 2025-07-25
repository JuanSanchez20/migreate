import { useAuth } from '@/contexts';

// Hook para la obtención de datos del usuario ingresado
const useUserData = () => {
    const { user, userRole } = useAuth();

    // Mapeo de roles a etiquetas legibles
    const roleMapping = {
        1: 'Admin',
        2: 'Tutor',
        3: 'Estudiante'
    };

    return {
        // Datos básicos del usuario
        user: user,
        userRole: userRole,

        // Datos formateados para mostrar
        name: user?.name || 'Usuario',
        roleLabel: roleMapping[userRole] || 'Desconocido',

        // Iniciales para el ávatar
        initials: user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'
    };
};

export { useUserData };