import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';

// Componente que protege las rutas (Autenticación y Roles)
const ProtectedRoute = ({ 
    children, 
    redirectTo = '/', 
    allowedRoles = null,
    unauthorizedRedirect = '/unauthorized' 
}) => {
    // Obtenemos el estado de autenticación del contexto
    const { isAuthenticated, isLoading, userRole, hasAnyRole } = useAuth();

    // Loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Verifica si esta autenticado
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Verifica si tiene el rol necesario
    if (allowedRoles && allowedRoles.length > 0) {
        if (!hasAnyRole(allowedRoles)) {
            // Redirigir según el rol del usuario a su página correspondiente
            const roleRedirects = {
                1: '/adminHome',    // Admin
                2: '/home',         // Tutor  
                3: '/home'          // Estudiante
            };
            
            const userRedirect = roleRedirects[userRole] || '/home';
            return <Navigate to={userRedirect} replace />;
        }
    }

    // Muestra el componente
    return children;
};

// Protege rutas solo para administradores (1)
export const AdminRoute = ({ children, redirectTo = '/' }) => (
    <ProtectedRoute allowedRoles={[1]} redirectTo={redirectTo}>
        {children}
    </ProtectedRoute>
);

// Protege rutas para tutores y administradores (roles 1 y 2)
export const TutorRoute = ({ children, redirectTo = '/' }) => (
    <ProtectedRoute allowedRoles={[1, 2]} redirectTo={redirectTo}>
        {children}
    </ProtectedRoute>
);

// Protege rutas para cualquier usuario autenticado (todos los roles)
export const AuthenticatedRoute = ({ children, redirectTo = '/' }) => (
    <ProtectedRoute redirectTo={redirectTo}>
        {children}
    </ProtectedRoute>
);

export default ProtectedRoute;