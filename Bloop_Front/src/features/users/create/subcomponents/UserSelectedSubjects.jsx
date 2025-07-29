import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Muestra las materias seleccionadas por el usuario
export default function SelectedSubjects({
    selectedSubjects = [],
    onRemoveSubject,
    showRemoveButton = true,
    compact = false
}) {
    // Función para obtener estilos del estado
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Cursando':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Repitiendo':
                return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'Encargado':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    if (selectedSubjects.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No hay materias seleccionadas</p>
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${compact ? 'max-h-48' : 'max-h-64'} overflow-y-auto`}>
            {selectedSubjects.map((subject, index) => (
                <div 
                    key={`${subject.subjectId}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/70 transition-colors"
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-slate-200 truncate">
                                {subject.subjectName || `Materia ${subject.subjectId}`}
                            </p>

                            <span className={`
                                px-2 py-1 text-xs font-medium rounded-full border
                                ${getStatusStyles(subject.status)}
                            `}>
                                {subject.status}
                            </span>
                        </div>

                        {!compact && (
                            <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                                {subject.subjectSemester && (
                                    <span>Sem. {subject.subjectSemester}</span>
                                )}
                                {subject.subjectModalidad && (
                                    <span>{subject.subjectModalidad}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {showRemoveButton && onRemoveSubject && (
                        <button
                            type="button"
                            onClick={() => onRemoveSubject(subject.subjectId)}
                            className="ml-3 p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Remover materia"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}