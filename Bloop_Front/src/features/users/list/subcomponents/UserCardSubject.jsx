import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { parseSubjectsString } from '../helpers/userHelpers';

// Sección de materias asignadas del usuario
const SubjectsSection = ({ user }) => {
    const materias = parseSubjectsString(user.materias);

    return (
        <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30">
            <div className="flex items-center space-x-2 mb-2">
                <BookOpenIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-300">Materias Asignadas</span>
                <span className="text-xs text-slate-500 bg-slate-600/50 px-2 py-0.5 rounded-full">
                    {materias.length}
                </span>
            </div>

            {materias.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                    {materias.slice(0, 3).map((materia, index) => (
                        <span 
                            key={index} 
                            className="text-xs px-2 py-1 bg-gradient-to-r from-slate-600/50 to-slate-700/50 
                                    text-slate-300 rounded border border-slate-500/30"
                        >
                            {materia}
                        </span>
                    ))}
                    {materias.length > 3 && (
                        <span className="text-xs px-2 py-1 text-slate-400 italic">
                            +{materias.length - 3} más
                        </span>
                    )}
                </div>
            ) : (
                <div className="text-xs text-slate-500 italic py-1">
                    Sin materias asignadas
                </div>
            )}
        </div>
    );
};

export default SubjectsSection;