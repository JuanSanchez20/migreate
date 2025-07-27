import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

// Indicador de estudiantes para la tarjeta de materia
const SubjectCardIndicator = ({ estudiantesCount }) => (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-slate-600/50">
        <div className="flex items-center space-x-1">
            <AcademicCapIcon className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-300">
                {estudiantesCount} estudiantes
            </span>
        </div>
    </div>
);

export default SubjectCardIndicator;