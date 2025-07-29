import React from 'react';
import { 
    UserIcon, 
    EnvelopeIcon, 
    XMarkIcon,
    CheckCircleIcon 
} from '@heroicons/react/24/outline';

// Subcomponente que muestra el tutor seleccionado con opciones de acción
const SubjectTutorSelected = ({
    // Datos del tutor seleccionado
    selectedTutor = null,

    // Estados del proceso
    canCreateWithTutor = false,
    isProcessing = false,

    // Funciones de callback
    onCreateWithTutor,
    onClearSelection,

    // Personalización
    showActions = true,
    showClearButton = true,
    className = ''
}) => {
    // Si no hay tutor seleccionado, no renderizar nada
    if (!selectedTutor) {
        return null;
    }

    return (
        <div className={`${className}`}>
            {/* Tarjeta del tutor seleccionado */}
            <div className="bg-[#278bbd]/10 border border-[#278bbd]/30 rounded-lg p-4">
                {/* Encabezado con título y botón de limpiar */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-[#278bbd]" />
                        <h3 className="text-sm font-medium text-[#278bbd]">
                            Tutor Seleccionado
                        </h3>
                    </div>

                    {showClearButton && (
                        <button
                            onClick={onClearSelection}
                            disabled={isProcessing}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-300 
                                    hover:bg-slate-700/50 transition-colors duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Deseleccionar tutor"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Información del tutor */}
                <div className="flex items-center space-x-3">
                    {/* Avatar del tutor */}
                    <div className="w-12 h-12 bg-[#278bbd]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-6 h-6 text-[#278bbd]" />
                    </div>

                    {/* Datos del tutor */}
                    <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-slate-200 truncate">
                            {selectedTutor.u_name}
                        </h4>

                        <div className="flex items-center space-x-1 mt-1">
                            <EnvelopeIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-400 truncate">
                                {selectedTutor.u_email}
                            </span>
                        </div>

                        {/* Información adicional si está disponible */}
                        {selectedTutor.u_rol && (
                            <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs 
                                            bg-[#278bbd]/20 text-[#278bbd] border border-[#278bbd]/30">
                                    Tutor
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Acciones del tutor seleccionado */}
                {showActions && (
                    <div className="mt-4 pt-3 border-t border-[#278bbd]/20">
                        <button
                            onClick={onCreateWithTutor}
                            disabled={!canCreateWithTutor || isProcessing}
                            className={`
                                w-full px-4 py-2 rounded-md font-medium text-sm
                                transition-all duration-200 flex items-center justify-center space-x-2
                                ${canCreateWithTutor && !isProcessing
                                    ? 'bg-[#278bbd] text-white hover:bg-[#48d1c1] focus:ring-2 focus:ring-[#278bbd]/50'
                                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                }
                                focus:outline-none disabled:opacity-50
                            `}
                        >
                            {isProcessing && (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            )}
                            <span>
                                {isProcessing ? 'Creando y asignando...' : 'Crear Materia y Asignar Tutor'}
                            </span>
                        </button>

                        {/* Texto explicativo */}
                        <p className="text-xs text-slate-400 text-center mt-2">
                            Se creará la materia y se asignará el tutor seleccionado
                        </p>
                    </div>
                )}
            </div>

            {/* Información adicional del proceso */}
            {!showActions && (
                <div className="mt-3 p-3 bg-slate-800/50 rounded-md">
                    <p className="text-xs text-slate-400 text-center">
                        Tutor listo para ser asignado a la nueva materia
                    </p>
                </div>
            )}
        </div>
    );
};

export default SubjectTutorSelected;