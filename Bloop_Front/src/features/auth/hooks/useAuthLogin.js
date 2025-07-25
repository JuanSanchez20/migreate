import useLoginForm from './useLoginForm';
import useLoginAuth from './useLoginAuth';
import useLoginPerformance from './useLoginPerformance';

// Hook que combina toda la funcionalidad del login
export const useAuthLogin = () => {
    // Hook para el manejo del formulario
    const {
        formData,
        validateForm,
        updateFormField,
        resetForm
    } = useLoginForm();

    // Hook para la lógica de autenticación
    const {
        isLoading,
        error,
        executeLogin,
        clearError,
        setError
    } = useLoginAuth();

    // Función que ejecuta el lógin
    const handleLogin = () => {
        executeLogin(formData, validateForm, resetForm);
    };

    // Hook para optimizaciones de rendimiento
    const {
        handleChange,
        handleSubmit,
        features,
        stats
    } = useLoginPerformance({
        updateFormField,
        error,
        setError,
        handleLogin
    });

    return{
        formData,

        isLoading,
        error,

        handleChange,
        handleLogin: handleSubmit,

        features,
        stats,

        clearError,
        resetForm
    }
}