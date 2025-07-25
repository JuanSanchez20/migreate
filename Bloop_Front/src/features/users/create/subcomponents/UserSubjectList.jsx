import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

// Lista de materias del usuario [Cursando, Repitiendo, Encargado]
export default function SubjectsList({
    subjects = [],
    selectedSubjects = [],
    onSubjectToggle,
    userRole,
    userSemester,
    isLoading = false
}) {
    // Función simple para verificar si una materia está seleccionada
    const isSelected = (subjectId) => {
        return selectedSubjects.some(s => s.subjectId === subjectId);
    };

    // Función para obtener el estado sugerido de una materia
    const getSubjectStatus = (subject) => {
        if (userRole === 'tutor') return 'Encargado';
        
        const subjectSemester = parseInt(subject.semestre);
        const studentSemester = parseInt(userSemester);
        
        return subjectSemester === studentSemester ? 'Cursando' : 'Repitiendo';
    };

    // Función para obtener estilos del botón según estado
    const getButtonStyles = (subject) => {
        const isSubjectSelected = isSelected(subject.id);
        
        if (isSubjectSelected) {
            return 'bg-teal-600 border-teal-500 text-white hover:bg-teal-700';
        }
        
        return 'bg-gray-900 border-teal-500 text-white hover:bg-gray-800 hover:border-blue-400';
    };

    // Función para obtener estilos del estado/badge
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Cursando':
                return 'bg-green-500/20 text-green-300';
            case 'Repitiendo':
                return 'bg-orange-500/20 text-orange-300';
            case 'Encargado':
                return 'bg-blue-500/20 text-blue-300';
            default:
                return 'bg-gray-500/20 text-gray-300';
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#278bbd]"></div>
                <p className="mt-2 text-slate-600">Cargando materias...</p>
            </div>
        );
    }

    if (subjects.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <p>No hay materias disponibles</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {subjects.map((subject) => {
                const isSubjectSelected = isSelected(subject.id);
                const status = getSubjectStatus(subject);

                return (
                    <button
                        key={subject.id}
                        type="button"
                        onClick={() => onSubjectToggle(subject.id, subject.semestre, subject)}
                        className={`
                            p-4 rounded-lg text-left transition-all duration-200 
                            hover:scale-105 shadow-md w-full border-2
                            ${getButtonStyles(subject)}
                        `}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">
                                    {subject.nombre}
                                </h3>
                                
                                <div className="flex items-center space-x-4 text-sm opacity-90">
                                    <span>📚 Semestre {subject.semestre}</span>
                                    <span>🕒 {subject.modalidad}</span>
                                    
                                    <span className={`
                                        px-2 py-1 rounded text-xs font-medium
                                        ${getStatusStyles(status)}
                                    `}>
                                        {status}
                                    </span>
                                </div>
                            </div>

                            {isSubjectSelected && (
                                <div className="flex items-center space-x-1 ml-4">
                                    <CheckIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">Seleccionada</span>
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}