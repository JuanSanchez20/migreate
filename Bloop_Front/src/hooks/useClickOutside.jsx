import { useRef, useEffect } from 'react';

// Hook genérico para detectar clics fuera de un elemento
export const useClickOutside = (ref, callback, isActive = true, ignoreClasses = []) => {
    useEffect(() => {
        // Si no está activo, no se ejecuta nada
        if (!isActive) return;

        // Si no hay callback o ref válido, no se ejecuta
        if (!callback || !ref) return;

        // Manejador de evento para detectar clic fuera del ref
        const handleClickOutside = (event) => {
            // Si el ref no existe o el clic fue dentro del elemento, no se hace nada
            if (!ref.current || ref.current.contains(event.target)) return;

            // Si se definieron clases a ignorar, verifica si el clic fue en alguna de ellas
            if (ignoreClasses.length > 0) {
                const clickedElement = event.target;
                const isIgnoreClass = ignoreClasses.some(className =>
                    clickedElement.closest(`.${className}`)
                );

                // Si fue dentro de un elemento ignorado, no ejecuta el callback
                if (isIgnoreClass) return;
            }

            // Si el clic fue fuera del ref y no fue ignorado, ejecuta el callback
            callback(event);
        };

        // Agrega los listeners al documento
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside); // Para dispositivos móviles

        // Limpia los listeners al desmontar el componente o cambiar dependencias
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, callback, isActive, ignoreClasses]);
};

// Hook especializado para las modales que manejará el clic fuera de la modal
export function useModalClickOutside(onClose, isOpen, closeOnBackdrop = true) {
    // Ref que se debe asignar al contenedor principal de la modal
    const modalRef = useRef(null);

    // Usa el hook genérico y lo activa solo si la modal está abierta y debe cerrarse con fondo
    useClickOutside(modalRef, onClose, isOpen && closeOnBackdrop);

    return modalRef;
};

// Exportación principal del hook genérico
export default useClickOutside;
