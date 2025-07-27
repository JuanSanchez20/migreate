import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Componente de estado de error
export const ErrorState = ({ error, onClose, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <XMarkIcon className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
            Error al cargar la propuesta
        </h3>
        <p className="text-gray-400 text-center mb-6 max-w-md">
            {error?.message || 'No se pudieron cargar los detalles de la propuesta. Por favor, intenta nuevamente.'}
        </p>
        <div className="flex space-x-3">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
                Cerrar
            </button>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
                >
                    Reintentar
                </button>
            )}
        </div>
    </div>
);

// Componente de estado de carga
export const LoadingState = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-600 pb-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                    <div className="h-6 bg-gray-700 rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                </div>
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Header de la modal
export const ModalHeader = ({ modalData, mode, onClose }) => (
    <div className="flex items-center justify-between border-b border-gray-600 p-6 bg-gray-800">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
            {modalData ? (
                <>
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                            {modalData.proposal?.nombre?.charAt(0)?.toUpperCase() || 'P'}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 
                            id="modal-title" 
                            className="text-xl font-bold text-white truncate"
                        >
                            Detalles completos de la propuesta
                        </h2>
                        <p className="text-sm text-gray-400">
                            {mode === 'edit' ? 'Modo edición' : 'Visualización general'}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-6 bg-gray-700 rounded w-48 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                    </div>
                </>
            )}
        </div>

        <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-4"
            aria-label="Cerrar modal"
        >
            <XMarkIcon className="h-6 w-6" />
        </button>
    </div>
);
