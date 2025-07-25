import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { LoginPage } from '@/pages';
import { getRedirectPathForRole } from '../config/routeConfig';

// Componente que maneja la redirección en la página de login
function SmartRedirect() {
    const { isAuthenticated, userRole } = useAuth();

    // Si no está autenticado, mostrar login
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    // Si está autenticado, redirigir según su rol
    const redirectPath = getRedirectPathForRole(userRole);

    return <Navigate to={redirectPath} replace />;
}

export default SmartRedirect;