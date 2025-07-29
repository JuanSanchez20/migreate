import React from 'react';
import { 
    AcademicCapIcon,
    UserIcon,
    ClockIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Vista previa de la materia en el formulario de creación
export default function SubjectPreviewCard({
    subjectPreview,
    moduleState
}) {
    // Obtener datos formateados
    const preview = subjectPreview || {
        name: 'Nombre de la materia',
        semester: 'Semestre no seleccionado',
        journey: 'Jornada no seleccionada',
        tutorName: 'Sin tutor asignado',
        tutorEmail: null
    };

    // Función para verificar si el perfil está completo
    const isSubjectComplete = () => {
        return preview.name !== 'Nombre de la materia' && 
            preview.semester !== 'Semestre no seleccionado' && 
            preview.journey !== 'Jornada no seleccionada';
    };

    // Función para obtener las iniciales de la materia
    const getSubjectInitials = (name) => {
        if (!name || name === 'Nombre de la materia') return 'M';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="bg-slate-800 shadow-xl rounded-lg border border-slate-700 sticky top-4">
            {/* Header */}
            <div className="p-6 border-b border-slate-700 bg-slate-900 rounded-t-lg">
                <h2 className="text-lg text-slate-50 font-semibold">Vista Previa</h2>
                <p className="text-sm text-slate-300">
                    {moduleState.isCompleted 
                        ? "Materia creada exitosamente" 
                        : "Así se verá la materia en el sistema"
                    }
                </p>
            </div>

            {/* Contenido */}
            <div className="p-6">
                {/* Avatar y datos básicos */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#278bbd]/10 flex items-center justify-center mb-3 border-2 border-[#278bbd]/20">
                        {preview.name !== 'Nombre de la materia' ? (
                            <span className="text-2xl font-bold text-[#278bbd]">
                                {getSubjectInitials(preview.name)}
                            </span>
                        ) : (
                            <AcademicCapIcon className="h-10 w-10 text-[#278bbd]" />
                        )}
                    </div>

                    <h3 className="font-medium text-lg text-slate-300 text-center">
                        {preview.name}
                    </h3>

                    <p className="text-sm text-slate-500 mb-3 text-center">
                        {preview.semester} • {preview.journey}
                    </p>

                    {/* Badge de estado */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {moduleState.isCompleted ? (
                            <span className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                Completado
                            </span>
                        ) : (
                            <span className="text-sm px-3 py-1 rounded-full bg-[#278bbd]/10 text-[#278bbd] border border-[#278bbd]/20">
                                {moduleState.currentStep === 'assign' ? 'Asignando tutor' : 'En progreso'}
                            </span>
                        )}
                    </div>

                    {/* Indicador de completitud */}
                    <div className="mt-3 text-xs">
                        {isSubjectComplete() ? (
                            <span className="text-green-400">✓ Información completa</span>
                        ) : (
                            <span className="text-yellow-400">⚠ Información incompleta</span>
                        )}
                    </div>
                </div>

                {/* Detalles de la materia */}
                <div className="space-y-3 mb-6">
                    {/* Semestre */}
                    <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <CalendarDaysIcon className="w-5 h-5 text-[#278bbd] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-400 uppercase">Semestre</p>
                            <p className="text-sm font-medium text-slate-300">{preview.semester}</p>
                        </div>
                    </div>

                    {/* Jornada */}
                    <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-[#278bbd] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-400 uppercase">Jornada</p>
                            <p className="text-sm font-medium text-slate-300">{preview.journey}</p>
                        </div>
                    </div>
                </div>

                {/* Sección de tutor */}
                <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center">
                            <UserIcon className="w-4 h-4 mr-2" />
                            Tutor Asignado
                        </h4>
                        {preview.tutorName !== 'Sin tutor asignado' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                Asignado
                            </span>
                        )}
                    </div>

                    {preview.tutorName !== 'Sin tutor asignado' ? (
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <p className="text-sm font-medium text-green-400">
                                {preview.tutorName}
                            </p>
                            {preview.tutorEmail && (
                                <p className="text-xs text-green-300 mt-1">
                                    {preview.tutorEmail}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-slate-400">
                            <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Sin tutor asignado</p>
                        </div>
                    )}
                </div>

                {/* Progreso general */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                    <div className="text-xs text-slate-400 mb-2">
                        Progreso de creación
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-[#278bbd] h-2 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${moduleState.isCompleted ? 100 : (moduleState.currentStep === 'assign' ? 75 : (isSubjectComplete() ? 50 : 25))}%` 
                            }}
                        />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        {moduleState.isCompleted 
                            ? "Proceso completado" 
                            : (moduleState.currentStep === 'assign' 
                                ? "Seleccionando tutor" 
                                : (isSubjectComplete() ? "Datos completos" : "Completa la información básica")
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}