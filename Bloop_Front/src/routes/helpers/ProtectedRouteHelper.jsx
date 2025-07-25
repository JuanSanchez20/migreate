import { AdminRoute, TutorRoute, AuthenticatedRoute } from '../config/ProtectedRoute';

// Helper que determina qué tipo de protección usar según los roles permitidos
export const createProtectedRoute = (Component, allowedRoles) => {
    // Si no hay roles específicos, es para cualquier usuario autenticado
    if (!allowedRoles || allowedRoles.length === 0) {
        return (
            <AuthenticatedRoute>
                <Component />
            </AuthenticatedRoute>
        );
    }

    // Si incluye todos los roles
    if (allowedRoles.includes(1) && allowedRoles.includes(2) && allowedRoles.includes(3)) {
        return (
            <AuthenticatedRoute>
                <Component />
            </AuthenticatedRoute>
        );
    }

    // Si solo incluye rol 1 (Admin)
    if (allowedRoles.length === 1 && allowedRoles.includes(1)) {
        return (
            <AdminRoute>
                <Component />
            </AdminRoute>
        );
    }

    // Si incluye roles 1 y 2 (Admin y Tutor)
    if (allowedRoles.includes(1) && allowedRoles.includes(2) && !allowedRoles.includes(3)) {
        return (
            <TutorRoute>
                <Component />
            </TutorRoute>
        );
    }

    // Para casos específicos, usar ProtectedRoute con roles customizados
    return (
        <ProtectedRoute allowedRoles={allowedRoles}>
            <Component />
        </ProtectedRoute>
    );
};

// Helper para crear rutas públicas
export const createPublicRoute = (Component) => {
    return <Component />;
};