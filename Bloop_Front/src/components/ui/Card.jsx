import React from "react";

// Componente para los formularios de crear
export default function Card({ 
    children, 
    variant = "default", // "default" | "elevated" | "bordered" | "flat"
    size = "default", // "sm" | "default" | "lg" | "xl"
    isLoading = false,
    className = ""
}) {
    // Clases base del componente
    const baseClasses = "rounded-lg w-full transition-all duration-200";
    
    // Variantes de estilo
    const variants = {
        default: "bg-slate-900 shadow-xl border border-slate-700",
        elevated: "bg-slate-900 shadow-2xl border border-slate-600 hover:shadow-slate-900/20",
        bordered: "bg-slate-900 border-2 border-slate-600 hover:border-slate-500",
        flat: "bg-slate-800 border border-slate-700"
    };
    
    // Tamaños disponibles
    const sizes = {
        sm: "max-w-md",
        default: "max-w-full",
        lg: "max-w-4xl",
        xl: "max-w-6xl"
    };
    
    const cardClasses = `
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isLoading ? 'opacity-70 pointer-events-none' : ''}
        ${className}
    `.trim();

    return (
        <div className={cardClasses}>
            {isLoading && (
                <div className="absolute inset-0 bg-slate-900/50 rounded-lg flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#278bbd]"></div>
                </div>
            )}
            {children}
        </div>
    );
}