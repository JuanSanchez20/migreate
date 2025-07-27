import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

// Componente decorativo superior de la tarjeta de materia
const SubjectCardDecorative = () => (
    <div className="relative h-24 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 
                    rounded-t-3xl flex items-center justify-center overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
            </svg>
        </div>
        
        {/* Icono principal */}
        <div className="relative z-10 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center 
                        backdrop-blur-sm border border-white/20">
            <BookOpenIcon className="h-6 w-6 text-white" />
        </div>
    </div>
);

export default SubjectCardDecorative;