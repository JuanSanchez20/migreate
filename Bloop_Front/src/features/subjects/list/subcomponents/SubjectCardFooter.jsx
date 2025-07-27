import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { getAssignedTutor, getSemestreConfig } from '../helpers/subjectHelpers';

// Footer de la tarjeta con tutor y semestre
const SubjectCardFooter = ({ subject }) => {
    const tutorAsignado = getAssignedTutor(subject.usuariosAsignados);
    const semestreConfig = getSemestreConfig(subject.semestre);

    return (
        <div className="border-t border-gray-700/50 pt-4">
            <div className="flex items-center justify-between space-x-4">
                {/* Información del tutor */}
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <UserIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400">Tutor:</p>
                        <p className="text-sm font-medium text-slate-200 truncate">
                            {tutorAsignado ? tutorAsignado.nombre : 'Sin asignar'}
                        </p>
                    </div>
                </div>

                {/* Badge de semestre */}
                <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium 
                                    ${semestreConfig.bg} ${semestreConfig.text} ${semestreConfig.border}`}>
                        {subject.semestre}° Sem
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SubjectCardFooter;