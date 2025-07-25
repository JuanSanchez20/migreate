import { useState, useCallback } from 'react';

// Hook genérico para manejar los estados de error en cualquier operación
const useErrorState = (initialError = null) => {
    // Estado principal de error
    const [error, setError] = useState(initialError);

    // Establece un nuevo error
    const setErrorMessage = useCallback((newError) => {
        if (!newError) {
            setError(null);
            return;
        }

        // Si es un objeto Error, extraer el mensaje
        if (newError instanceof Error) {
            setError(newError.message);
            return;
        }

        // Si es un objeto con propiedad message
        if (typeof newError === 'object' && newError.message) {
            setError(newError.message);
            return;
        }

        // Si es string, usarlo directamente
        if (typeof newError === 'string') {
            setError(newError);
            return;
        }

        // Para cualquier otro caso, convertir a string
        setError(String(newError));
    }, []);

    // Limpia el error actual
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Verifica si hay un error activo
    const hasError = useCallback(() => {
        return error !== null && error !== '';
    }, [error]);

    // Ejecuta una operación con manejo automático de errores (Limpia y muestra nuevos)
    const withErrorHandling = useCallback(async (operation) => {
        try {
            // Limpiar errores previos
            setError(null);

            // Ejecuta la operación
            const result = await operation();
            return result;
        } catch (err) {
            console.error('Error capturado por useErrorState:', err);
            // Captura y establece el error
            setErrorMessage(err);
            throw err;
        }
    }, [setErrorMessage]);

    // Función para obtener un mensaje de error formateado
    const getFormattedError = useCallback(() => {
        if (!error || error === '') {
            return null;
        }

        // Devuelve el error si está bien formateado
        if (typeof error === 'string' && error.length > 0) {
            return error;
        }

        // Mensaje por defecto en caso de error de formateo
        return 'Ha ocurrido un error inesperado';
    }, [error]);

    // Función para resetear el estado inicial
    const resetError = useCallback(() => {
        setError(initialError);
    }, [initialError]);

    return {
        // Estado
        error,
        
        // Funciones básicas
        setError: setErrorMessage,
        clearError,
        resetError,
        
        // Funciones auxiliares
        hasError,
        getFormattedError,
        
        // Función avanzada
        withErrorHandling
    };
}

export default useErrorState;