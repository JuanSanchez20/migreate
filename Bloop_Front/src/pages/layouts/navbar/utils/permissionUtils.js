import { routesConfig } from "../../routesConfig";
// Validan permisos de acceso a rutas

// Verifica si un usuario puede acceder a la ruta
export const canUserAccessRoute = (allowedRoles, userRole) => {
    // Si no hay restricciones, permitir acceso
    if (!allowedRoles || allowedRoles.length === 0) {
        return true;
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    return allowedRoles.includes(parseInt(userRole));
};

// Verifica si un usuario puede acceder a la ruta de creación de una ruta específica
export const canAccessCreateRoute = (routeConfig, userRole) => {
    // Si no hay ruta de creación, no mostrar botón
    if (!routeConfig || !routeConfig.createPath) {
        return false;
    }

    // Buscar la configuración de la ruta de DESTINO
    const targetRouteConfig = routesConfig[routeConfig.createPath];
    
    if (!targetRouteConfig) {
        return false;
    }

    // Verificar permisos de la ruta de DESTINO
    const canAccess = canUserAccessRoute(targetRouteConfig.allowedRoles, userRole);

    return canAccess;
};