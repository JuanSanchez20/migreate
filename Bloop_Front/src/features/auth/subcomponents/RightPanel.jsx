import React from 'react';
import { FeatureCard } from './FeatureCard';
import { StatsDisplay } from './StatsDisplay';
import {
    UserGroupIcon,
    BookOpenIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

// Panel derecho del login que muestra un resumen del sistema
export const RightPanel = React.memo(({ features, stats }) => (
    <div className="relative flex-1 flex items-center justify-center p-6 lg:p-8">
        {/* Efectos de fondo */}
        <div className="absolute top-1/4 right-10 w-20 h-20 bg-[#278bbd]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-20 w-32 h-32 bg-[#48d1c1]/10 rounded-full blur-2xl"></div>

        <div className="max-w-md space-y-6 relative z-10">
            {/* Título principal compacto */}
            <div className="text-center space-y-3">
                <div className="flex justify-center space-x-3 mb-4">
                    <div className="bg-gradient-to-br from-[#278bbd] to-[#278bbd]/70 p-3 rounded-full
                                    shadow-lg shadow-[#278bbd]/30">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-[#48d1c1] to-[#48d1c1]/70 p-3 rounded-full
                                    shadow-lg shadow-[#48d1c1]/30">
                        <BookOpenIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-[#278bbd] to-[#278bbd]/70 p-3 rounded-full
                                    shadow-lg shadow-[#278bbd]/30">
                        <LightBulbIcon className="h-6 w-6 text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white leading-tight">
                    Sistema de Gestión 
                    <span className="bg-gradient-to-r from-[#48d1c1] to-[#278bbd] 
                                    bg-clip-text text-transparent block">
                        Académica
                    </span>
                </h2>
                
                <p className="text-slate-300 text-base leading-relaxed">
                    Plataforma integral que conecta estudiantes, tutores y administradores 
                    en un entorno colaborativo y eficiente.
                </p>
            </div>

            {/* Características del sistema */}
            <div className="grid gap-4">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        title={feature.title}
                        description={feature.description}
                        gradient={feature.gradient}
                        iconName={feature.icon}
                    />
                ))}
            </div>

            {/* Estadísticas del sistema */}
            <StatsDisplay stats={stats} />
        </div>
    </div>
));