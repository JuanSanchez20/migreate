import React from 'react';
import { LoginForm } from '@/features';

// Páginda del login
const LoginPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden">
            {/* Efectos de fondo decorativos */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradientes de fondo */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                
                {/* Efectos de luz ambiental */}
                <div className="absolute top-1/6 left-1/6 w-96 h-96 bg-[#48d1c1]/3 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/6 right-1/6 w-96 h-96 bg-[#278bbd]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                {/* Partículas decorativas */}
                <div className="absolute top-1/5 left-1/5 w-2 h-2 bg-[#48d1c1]/20 rounded-full animate-ping"></div>
                <div className="absolute top-2/5 right-1/4 w-1 h-1 bg-[#278bbd]/30 rounded-full animate-ping delay-500"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#48d1c1]/15 rounded-full animate-ping delay-1500"></div>
                
                {/* Grid pattern sutil */}
                <div className="absolute inset-0 opacity-5">
                    <div className="h-full w-full bg-grid-pattern"></div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage;