import React from 'react';
import { UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { LoadingState, ErrorState, EmptyState } from '@/components';

// Componente individual de tutor
const TutorItem = ({ 
    tutor, 
    isSelected = false, 
    onSelect, 
    disabled = false 
}) => {
    return (
        <div
            className={`
                flex items-center justify-between p-3 rounded-lg border
                transition-all duration-200 cursor-pointer
                ${isSelected 
                    ? 'bg-[#278bbd]/10 border-[#278bbd]/30 ring-1 ring-[#278bbd]/20' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !disabled && onSelect(tutor)}
        >
            {/* Información del tutor */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
                {/* Avatar del tutor */}
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${isSelected 
                        ? 'bg-[#278bbd]/20 text-[#278bbd]' 
                        : 'bg-slate-700 text-slate-400'
                    }
                `}>
                    <UserIcon className="w-5 h-5" />
                </div>

                {/* Datos del tutor */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                        <h4 className={`
                            font-medium truncate
                            ${isSelected ? 'text-[#278bbd]' : 'text-slate-200'}
                        `}>
                            {tutor.u_name}
                        </h4>
                    </div>

                    <div className="flex items-center space-x-1 mt-1">
                        <EnvelopeIcon className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="text-sm text-slate-400 truncate">
                            {tutor.u_email}
                        </span>
                    </div>
                </div>
            </div>

            {/* Indicador de selección */}
            <div className="flex-shrink-0 ml-3">
                <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-colors duration-200
                    ${isSelected 
                        ? 'border-[#278bbd] bg-[#278bbd]' 
                        : 'border-slate-600 bg-transparent'
                    }
                `}>
                    {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Subcomponente que lista todos los tutores disponibles para selección
const SubjectListTutor = ({
    // Datos de tutores
    tutors = [],
    selectedTutorId = null,

    // Estados de carga y error
    loading = false,
    error = null,

    // Funciones de callback
    onTutorSelect,
    onRetry,

    // Personalización
    maxHeight = '300px',
    className = ''
}) => {
    
    // Estado de carga
    if (loading) {
        return (
            <div className={`${className}`}>
                <LoadingState 
                    message="Cargando tutores"
                    description="Obteniendo lista de tutores disponibles"
                    size="medium"
                />
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className={`${className}`}>
                <ErrorState
                    title="Error al cargar tutores"
                    error={error}
                    onRetry={onRetry}
                    retryText="Reintentar carga"
                />
            </div>
        );
    }

    // Estado vacío
    if (!Array.isArray(tutors) || tutors.length === 0) {
        return (
            <div className={`${className}`}>
                <EmptyState
                    type="users"
                    customTitle="No hay tutores disponibles"
                    customDescription="No se encontraron tutores para asignar a la materia"
                />
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            {/* Encabezado de la lista */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-300">
                    Tutores Disponibles
                </h3>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {tutors.length} {tutors.length === 1 ? 'tutor' : 'tutores'}
                </span>
            </div>

            {/* Lista scrolleable de tutores */}
            <div 
                className="space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar"
                style={{ maxHeight }}
            >
                {tutors.map((tutor) => (
                    <TutorItem
                        key={tutor.u_id}
                        tutor={tutor}
                        isSelected={selectedTutorId === tutor.u_id}
                        onSelect={onTutorSelect}
                        disabled={loading}
                    />
                ))}
            </div>

            {/* Información adicional */}
            <div className="mt-3 p-2 bg-slate-800/50 rounded-md">
                <p className="text-xs text-slate-400 text-center">
                    Selecciona un tutor para asignarlo a la materia
                </p>
            </div>

            {/* Estilos para el scrollbar personalizado */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1e293b;
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                }
            `}</style>
        </div>
    );
};

export default SubjectListTutor;