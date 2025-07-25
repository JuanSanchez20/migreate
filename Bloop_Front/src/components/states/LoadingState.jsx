import React from "react";

// Componente de estado de carga para mostrar un mensaje mientras se cargan los datos
const LoadingState = (
    message = "Cargando...", 
    description = "Obteniendo información del sistema",
    size = "large"
) => {
    // Asegurar que message y description sean strings
    const safeMessage = typeof message === 'string' ? message : 
                        typeof message === 'object' && message?.message ? message.message :
                        'Cargando...';
    
    const safeDescription = typeof description === 'string' ? description : 
                            typeof description === 'object' && description?.description ? description.description :
                            'Obteniendo información del sistema';

    const sizeClasses = {
        small: { spinner: "h-8 w-8", inner: "w-4 h-4", spacing: "py-8" },
        medium: { spinner: "h-12 w-12", inner: "w-6 h-6", spacing: "py-12" },
        large: { spinner: "h-16 w-16", inner: "w-8 h-8", spacing: "py-16" }
    };

    const classes = sizeClasses[size];

    return (
        <div className={`flex flex-col items-center justify-center ${classes.spacing}`}>
            <div className="space-y-4">
                <div className="relative flex items-center justify-center">
                    <div className={`animate-spin rounded-full ${classes.spinner} border-4 border-slate-600 border-t-[#278bbd]`}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className={`${classes.inner} bg-[#278bbd]/20 rounded-full animate-pulse`}></div>
                    </div>
                </div>
                
                <div className="text-center">
                    <h3 className={`${classes.titleSize} font-semibold text-slate-200 mb-2`}>
                        {safeMessage}
                    </h3>
                    <p className={`${classes.descSize} text-slate-400`}>
                        {safeDescription}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingState;