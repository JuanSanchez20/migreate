import { Routes, Route } from 'react-router-dom';
import { routeConfig } from '../config/routeConfig';
import { createProtectedRoute, createPublicRoute } from '../helpers/ProtectedRouteHelper';
import SmartRedirect from './SmartRefirect';
import { NotFoundPage } from '@/components';

// Componente que maneja todas las rutas de la aplicación
function AppRoutes() {
    return (
        <Routes>
            {routeConfig.map((route) => {
                const { path, element: Component, isPublic, hasSmartRedirect, allowedRoles } = route;

                // Ruta con redirección al (login)
                if (hasSmartRedirect) {
                    return (
                        <Route
                            key={path}
                            path={path}
                            element={<SmartRedirect />}
                        />
                    );
                }

                // Ruta pública
                if (isPublic) {
                    return (
                        <Route
                            key={path}
                            path={path}
                            element={createPublicRoute(Component)}
                        />
                    );
                }

                // Ruta protegida
                return (
                    <Route
                        key={path}
                        path={path}
                        element={createProtectedRoute(Component, allowedRoles)}
                    />
                );
            })}

            {/* Ruta 404 - Página no encontrada */}
            <Route
                path="*"
                element={<NotFoundPage />}
            />
        </Routes>
    );
}

export default AppRoutes;