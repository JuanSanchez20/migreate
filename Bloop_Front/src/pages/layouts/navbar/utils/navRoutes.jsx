import { routesConfig } from '../../routesConfig';

// Función que extrae solo metadatos de header
export const getRouteMetadata = (path) => {
    const route = routesConfig[path];
    if (!route) return routesConfig.default;
    
    return {
        title: route.title,
        description: route.description,
        headerIcon: route.headerIcon,
        createPath: route.createPath,
        createLabel: route.createLabel,
        label: route.label,
        icon: route.icon || routesConfig.default.icon
    };
};