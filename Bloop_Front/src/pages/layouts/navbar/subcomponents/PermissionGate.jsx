import React from 'react';

// Componente que envuelve elementos y los muestra solo si se cumplen los permisos
const PermissionGate = ({ 
    canAccess, 
    children, 
    fallback = null,
    showFallbackOnDenied = false 
}) => {
    // Si puede acceder, mostrar el contenido
    if (canAccess) {
        return children;
    }

    // Si no puede acceder y queremos mostrar fallback, mostrarlo
    if (showFallbackOnDenied && fallback) {
        return fallback;
    }

    // Por defecto, no mostrar nada
    return null;
};

export default PermissionGate;