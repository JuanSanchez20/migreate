import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar, Navbar } from '@/pages';
import { useAuth } from '@/contexts';
import AppRoutes from './AppRoutes';

// Layout principal de la aplicación que llama a las rutas
function MainLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuth();

    // Verificar si estamos en la página de login
    const isAuthPage = location.pathname === '/';
    const shouldShowLayout = !isAuthPage && isAuthenticated;

    // Mostrar loading mientras se verifica autenticación
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-xl">Cargando aplicación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Sidebar condicional */}
            {shouldShowLayout && (
                <div className={`fixed h-full z-50 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <Sidebar 
                        collapsed={sidebarCollapsed} 
                        onToggle={setSidebarCollapsed} 
                    />
                </div>
            )}

            {/* Contenido principal */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
                    shouldShowLayout ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''
                }`}
            >
                {/* Navbar condicional */}
                {shouldShowLayout && (
                    <div className="h-12 sticky top-0 z-40 bg-gray-900">
                        <Navbar />
                    </div>
                )}

                {/* Área de contenido */}
                <main
                    className={`flex-1 overflow-y-auto bg-gray-900 ${
                        shouldShowLayout ? 'p-4' : 'p-0'
                    }`}
                >
                    <AppRoutes />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;