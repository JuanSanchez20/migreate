import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { listUser, loginUser } from '../services/index';

// Hook para manejar la lógica de autenticación del usuario
const useLoginAuth = () => {
    const navigate = useNavigate();
    const { login: loginContext } = useAuth();

    // Estados de autenticación
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Determina la ruta según el rol
    const getRedirectRoute = useCallback((userRole) => {
        const roleRoutes = {
            1: '/adminHome',
            2: '/home',
            3: '/home'
        };
        return roleRoutes[userRole] || '//home';
    }, []);

    // Función principal para manejar el login
    const executeLogin = useCallback(async (formData, validateForm, resetForm) => {
        // Validación del formulario
        const { isValid, errors } = validateForm();
        if (!isValid){
            setError(Object.values(errors)[0]);
            return;
        }

        // Inicializa el estado de carga
        setIsLoading(true)
        setError(null);

        // Consume el servicio y captura su resultado
        try{
            // Trata de iniciar sesión
            const loginResult = await loginUser(formData.email, formData.password);
            const { token, user } = loginResult;

            // Obtener información del usuario
            let userInfo = user;
            if (!user.email || !user.name) { // Solo si necesitas más datos
                userInfo = await listUser(user.id);
            }

            // Actualiza el contenixto de las autenticación global
            const userRole = user.rol || userInfo.rol;
            loginContext(token, userRole, userInfo);

            // Navega según el rol obtenido del usuario
            const redirectRoute = getRedirectRoute(parseInt(rol));
            navigate(redirectRoute);

            // Limpia el formulario
            resetForm();
        } catch(e){
            // Manejo de errores
            setError(e.message || 'Error inesperado al iniciar sesión');
        } finally {
            // Finaliza el estado de carga
            setIsLoading(false);
        }
    }, [loginContext, navigate, getRedirectRoute]);

    // Limpia el error actual
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return{
        isLoading,
        error,

        executeLogin,
        clearError,
        setError
    }
}

export default useLoginAuth;