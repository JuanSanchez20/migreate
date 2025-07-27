import React from 'react';

export default function TextArea({
    id, // Identificador principal
    label, // Mostrar texto descriptivo encima del textArea (No obligatorio)
    icon: Icon, // Icono que se mostrará dentro del textArea
    className = '', // Clases únicas del hijo
    ...props // Información que ingresa el usuario
}) {
    return (
        <div className="relative">
            <div className="space-y-2">
                {/* Solo renderiza el label si existe */}
                <label htmlFor={id} className="text-sm font-medium text-slate-300">
                    {label}
                </label>
                {Icon && (
                    <Icon className="h-5 w-5 text-accent absolute left-3 top-1/2 transform -translate-y-1/2" />
                )}
                { /* Input Principal */ }
                <textarea
                    id={id}
                    {...props}
                    className={`w-full pl-10 pr-4 py-3
                                bg-slate-700 border border-cyan-300 rounded-lg
                                text-white placeholder:text-slate-400
                                focus:border-accent focus:ring-2 focus:ring-accent/50
                                focus:outline-none transition-all duration-200
                                ${className}`} />
            </div>
        </div>
    );
};
