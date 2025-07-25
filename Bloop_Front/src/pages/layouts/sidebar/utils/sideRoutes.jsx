import { routesConfig } from '../../routesConfig';

// Genera una lista de elementos del sidebar según el rol del usuario
export const sideRoutes = (roleId) => {
    return (
        // Convierte el objeto en un arreglo de pares
        Object.entries(routesConfig)
        // Filtra las rutas a base del rol, la subruta no sea para crear y que no tenga el valor default como lo tiene el home
        .filter(([path, config])=>{
            const hasRole = config.allowedRoles?.includes(roleId);
            const isMainRoute = !path.includes('/create');
            const isNorDefault = path !== 'default';

            return hasRole && isMainRoute && isNorDefault;
        })
        // Genera un array de objetos que representa los ítems del menú lateral.
        .map(([path, config]) => ({
            path,
            label: config.label,
            icon:config.sideIcon
        }))
    );
};