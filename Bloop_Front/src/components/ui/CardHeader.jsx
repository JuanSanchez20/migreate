import React from "react";

// Componente de encabezado para las Card
export default function CardHeader({ 
    icon: Icon, 
    title, 
    description,
    badge, // { text: string, variant: "info" | "success" | "warning" | "error" }
    actions, // Array de botones/acciones para el header
    variant = "default", // "default" | "gradient" | "minimal"
    className = ""
}) {
    // Variantes del header
    const variants = {
        default: "border-b border-slate-700 bg-slate-950",
        gradient: "border-b border-slate-700 bg-gradient-to-r from-slate-950 to-slate-900",
        minimal: "border-b border-slate-800 bg-slate-900"
    };
    
    // Colores para badges
    const badgeColors = {
        info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        success: "bg-green-500/10 text-green-400 border-green-500/20",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        error: "bg-red-500/10 text-red-400 border-red-500/20"
    };

    const headerClasses = `
        p-6 rounded-t-lg
        ${variants[variant]}
        ${className}
    `.trim();

    return (
        <div className={headerClasses}>
            <div className="flex items-center justify-between">
                {/* Lado izquierdo: Icon, Title, Badge */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {Icon && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#278bbd]/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-[#278bbd]" />
                        </div>
                    )}
                    
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-semibold text-slate-50 truncate">
                                {title}
                            </h2>
                            
                            {badge && (
                                <span className={`
                                    px-2 py-1 text-xs font-medium rounded-full border
                                    ${badgeColors[badge.variant] || badgeColors.info}
                                `}>
                                    {badge.text}
                                </span>
                            )}
                        </div>
                        
                        {description && (
                            <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Lado derecho: Acciones */}
                {actions && actions.length > 0 && (
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className={`
                                    px-3 py-1.5 text-sm font-medium rounded-md
                                    transition-colors duration-200
                                    ${action.variant === 'primary' 
                                        ? 'bg-[#278bbd] text-white hover:bg-[#48d1c1] disabled:bg-slate-700 disabled:text-slate-400'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500'
                                    }
                                    disabled:cursor-not-allowed
                                `}
                            >
                                {action.icon && <action.icon className="w-4 h-4 mr-1 inline" />}
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}