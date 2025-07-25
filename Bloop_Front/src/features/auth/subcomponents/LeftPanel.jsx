import React from 'react';
import { AuthForm } from './AuthForm';
import { TextField } from '@/components';
import {
    EnvelopeIcon,
    LockClosedIcon,
    AcademicCapIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Panel izquierdo que contiene el formulario
export const LeftPanel = React.memo(({ 
    formData, 
    isLoading, 
    error, 
    handleChange, 
    handleLogin 
}) => (
    <div className="relative flex-1 flex items-center justify-center p-8 lg:p-12 z-10">
        {/* Efecto de partículas flotantes */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#48d1c1]/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-20 w-1 h-1 bg-[#278bbd]/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-16 w-1.5 h-1.5 bg-[#48d1c1]/20 rounded-full animate-pulse delay-2000"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
            {/* Logo y título principal */}
            <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-8">
                    <div className="relative">
                        <AcademicCapIcon className="h-10 w-10 text-[#48d1c1]" />
                        <div className="absolute inset-0 h-10 w-10 bg-[#48d1c1]/20 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#48d1c1] to-[#278bbd] 
                                    bg-clip-text text-transparent">BLOOP</span>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-white">
                        ¡Bienvenido de vuelta!
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Accede a tu panel de gestión académica
                    </p>
                </div>
            </div>

            {/* Formulario de login */}
            <AuthForm
                buttonText="Iniciar Sesión"
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
            >
                <div className="space-y-5">
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu.email@itq.edu.ec"
                        icon={EnvelopeIcon}
                        required
                    />

                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Tu contraseña"
                        icon={LockClosedIcon}
                        required
                    />
                </div>
            </AuthForm>

            {/* Enlaces adicionales */}
            <div className="text-center space-y-4">
                <a
                    href="#"
                    className="text-slate-400 hover:text-[#48d1c1] text-sm 
                                transition-colors duration-200 inline-block
                                hover:drop-shadow-[0_0_8px_rgba(72,209,193,0.5)]"
                >
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
        </div>
    </div>
));