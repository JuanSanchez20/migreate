import React from 'react';
import { 
    AcademicCapIcon, 
    UserGroupIcon 
} from '@heroicons/react/24/outline';

// Mapeo de nombres de iconos a componentes
const ICON_MAP = {
    AcademicCapIcon,
    UserGroupIcon
};

// Muestra las características de las funcionalidades del sistema
export const FeatureCard = React.memo(({ title, description, gradient, iconName }) => {
    const IconComponent = ICON_MAP[iconName] || AcademicCapIcon;

    return (
        <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-white/10 to-white/5 
                        backdrop-blur-sm border border-white/20 p-4 hover:border-[#48d1c1]/50 
                        transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#48d1c1]/20">
            {/* Efecto de brillo al hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#48d1c1]/0 via-[#48d1c1]/5 to-[#48d1c1]/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gradient} flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 text-base">{title}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
});