import { useCallback } from "react";
import { LOGIN_FEATURES, LOGIN_STATS } from '../helpers/index'

// Hook que optimiza el rendimiento del componente
const useLoginPerformance = ({
    updateFormField,
    error,
    setError,
    handleLogin
}) => {
    // Manejador de cambios en los inputs
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        updateFormField(name, value);

        // Limpia el error cuando el usuario empieza a escribir
        if (error) setError(null);
    }, [updateFormField, error, setError]);

    //Menejador de subidas del formulario para evitar una re-creación de la función
    const handleSubmit = useCallback((e) => {
        e?.preventDefault();
        handleLogin();
    }, [handleLogin]);

    return {
        handleChange,
        handleSubmit,

        features: LOGIN_FEATURES,
        stats: LOGIN_STATS
    }
}

export default useLoginPerformance;