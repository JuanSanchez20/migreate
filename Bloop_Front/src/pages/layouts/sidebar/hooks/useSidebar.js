import { useState, useEffect } from 'react';

export const useSidebar = (propCollapsed, onToggle) => {
    // Estados del colapsado
    const [collapsed, setCollapsed] = useState(propCollapsed || false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Notifica al padre cuando cambia 'collapsed'
    useEffect(() => {
        if (onToggle) onToggle(collapsed);
    }, [collapsed, onToggle]);

    return {
        collapsed,  // Valor actual de colapso
        setCollapsed, // Actualiza colapso
        isMenuOpen, // Estado menú móvil
        setIsMenuOpen, // Controla menú móvil
    };
};