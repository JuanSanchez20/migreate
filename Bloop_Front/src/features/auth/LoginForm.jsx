import React from 'react';
import { useAuthLogin } from './hooks/useAuthLogin';
import { LeftPanel } from './subcomponents/LeftPanel';
import { RightPanel } from './subcomponents/RightPanel';

// Componente principal del formulario Login
const LoginForm = () => {
    // Hook principal
    const {
        formData,
        isLoading,
        error,
        handleChange,
        handleLogin,
        features,
        stats,
        clearError,
        resetForm
    } = useAuthLogin();

    return(
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
            {/* Contenedor principal con borde neon */}
            <div className="relative w-full max-w-5xl h-[580px] overflow-hidden">
                {/* Borde neon brillante */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#48d1c1] via-[#278bbd] to-[#48d1c1] 
                                rounded-3xl p-[3px] animate-pulse">
                    <div className="h-full w-full bg-slate-900 rounded-3xl"></div>
                </div>

                {/* Contenedor interior con división 50/50 */}
                <div className="absolute inset-[3px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                                rounded-3xl overflow-hidden flex">

                    {/* Panel izquierdo - Formulario de Login */}
                    <div className="w-1/2 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
                        <LeftPanel
                            formData={formData}
                            isLoading={isLoading}
                            error={error}
                            handleChange={handleChange}
                            handleLogin={handleLogin}
                        />
                    </div>

                    {/* Panel derecho - Información del sistema */}
                    <div className="w-1/2 bg-gradient-to-bl from-slate-800/95 to-slate-700/95">
                        <RightPanel
                            features={features}
                            stats={stats}
                        />
                    </div>
                </div>

                {/* Efectos de luz ambiental */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48d1c1]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#278bbd]/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;