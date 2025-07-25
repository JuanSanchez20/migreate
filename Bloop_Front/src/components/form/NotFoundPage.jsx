import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';

// Componente para páginas no encontradas (404)
function NotFoundPage() {
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();

    const handleGoHome = () => {
    if (isAuthenticated) {
        // Importación dinámica para evitar ciclo
        const { getRedirectPathForRole } = require('@/routes');
        const homePath = getRedirectPathForRole(userRole);
        navigate(homePath);
    } else {
        navigate('/');
    }
};

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center text-white">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-6">Página no encontrada</p>
                <div className="space-x-4">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors"
                    >
                        Volver atrás
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
                    >
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;