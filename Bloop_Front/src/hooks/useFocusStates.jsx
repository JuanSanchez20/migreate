import { useState, useCallback, useMemo } from 'react';

// Hook generico para manejar múltiples focus
export function useFocusStates(keys) {
    // Objeto con estados falsos
    const initialState = useMemo(() => {
        return keys.reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});
    }, [keys]);


    const [focusStates, setFocusStates] = useState(initialState);

    // Prevencion de re-render innecesario
    const setFocused = useCallback((key, value) => {
        setFocusStates(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const createFocusHandlers = useCallback((key) => ({
        onFocus: () => setFocused(key, true),
        onBlur: () => setFocused(key, false)
    }), [setFocused]);

    // Funcion para resetear todos los estados
    const resetAllFocus = useCallback(() => {
        setFocusStates(initialState);
    }, [initialState]);

    // Verifica si algun estado esta activo
    const hasAnyFocus = Object.values(focusStates).some(state => state);

    return {
        focusStates,
        setFocusState: setFocused,
        createFocusHandlers,
        resetAllFocus,
        hasAnyFocus
    };
};

export default useFocusStates;