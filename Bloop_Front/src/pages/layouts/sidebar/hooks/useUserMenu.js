import { useRef } from "react";
import { useAuth } from '@/contexts';
import { useClickOutside } from "@/hooks";
import { useUserData } from "./useUserData";

// Hook que maneja la lógica del menú del sidebar
export const useUserMenu = (isMenuOpen, setIsMenuOpen) => {
    // Obtiene la función logout desde el contexto
    const { logout } = useAuth();

    // Desestructura el hook para la obtenición de datos del usuario logeado
    const { name, userRole, roleLabel, initials } = useUserData();

    // Crea una referencia para detectar clics fuera del menu
    const userMenuRef = useRef(null);

    // Cierra el menu si se hace clic fuera, excepto en botones permitidos
    useClickOutside(
        userMenuRef,
        () => setIsMenuOpen(false),
        isMenuOpen,
        ['logout-button', 'profile-button']
    );

    // Cierra el menú y luego ejecuta logout con un pequeño retardo
    const handleLogout = () => {
        setIsMenuOpen(false);
        setTimeout(() => logout(), 50);
    };

    // Función en proceso para ir al perfil del usuario
    const handleProfileClick = () => {
        setIsMenuOpen(false);
        // Puedes agregar navegación aquí
    };

    // Alterna el estado de apertura del menú
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return {
        userMenuRef,
        name,
        userRole,
        roleLabel,
        initials,
        handleLogout,
        handleProfileClick,
        handleMenuToggle
    };
};