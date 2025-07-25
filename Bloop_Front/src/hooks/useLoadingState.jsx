import { useState } from "react";

// Hook genérico para manejar los estados de carga en cualquier operación asíncrona
const useLoadingState = (initialLoading = false) => {
    // Estado principal de carga
    const [loading, setLoading] = useState(initialLoading);

    // Inicia el estado de carga
    const startLoading = () => setLoading(true);
    // Detiene el estado de carga
    const stopLoading = () => setLoading(false);


    // Alterna el estado de carga 
    const toggleLoading = () => setLoading(prev => !prev);

    // Ejecuta una operación automática del loading
    const withLoading = async (asyncOperation) => {
        try {
            startLoading();
            const result = await asyncOperation();
            return result;
        } finally {
            stopLoading();
        }
    }

    // Resetea el estado de carga al valor inicial
    const resetLoading = () => {
        setLoading(initialLoading);
    };

    return {
        // Estado
        loading,
        
        // Funciones básicas
        startLoading,
        stopLoading,
        toggleLoading,
        resetLoading,
        
        // Función avanzada
        withLoading
    };
};

export default useLoadingState;