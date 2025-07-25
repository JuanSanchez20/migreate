import { useMemo } from 'react';
import { useAuth } from '@/contexts';
import { getRouteMetadata } from '../utils/navRoutes';
import { canAccessCreateRoute } from '../utils/permissionUtils';

// Maneja permisos del navbar
export const useNavbarPermissions = (currentPath) => {
    const { userRole } = useAuth();

    // Obtener metadatos de la ruta actual
    const routeMetadata = useMemo(() => {
        return getRouteMetadata(currentPath) || getRouteMetadata.default;
    }, [currentPath]);

    // Verificar si puede acceder a la ruta de creación
    const canShowCreateButton = useMemo(() => {
        // No mostrar en rutas principales
        const isMainRoute = ['/home', '/adminHome'].includes(currentPath);
        if (isMainRoute) return false;
        
        // Verificar permisos para la ruta de creación
        return canAccessCreateRoute(routeMetadata, userRole);
    }, [routeMetadata, userRole, currentPath]);

    return {
        routeMetadata,
        canShowCreateButton,
        userRole
    };
};