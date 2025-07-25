import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Componente de estado de error para mostrar un mensaje de error
const ErrorState = ({
    title = "Error al cargar datos",
    error, 
    onRetry,
    retryText = "Reintentar"
}) => {
    <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
            </div>

            <h3 className="text-xl font-semibold text-red-400 mb-2">
                {title}
            </h3>
            <p className="text-red-300 mb-4">
                {error || 'Ocurrió un error inesperado'}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 
                            hover:bg-red-500/30 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>{retryText}</span>
                </button>
            )}
        </div>
    </div>
};

export default ErrorState;