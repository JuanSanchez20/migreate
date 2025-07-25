import { BrowserRouter } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { AuthProvider } from '@/contexts';

// Este componente envuelve toda la aplicación con el BrowserRouter y AuthProvider.
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <MainLayout />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
