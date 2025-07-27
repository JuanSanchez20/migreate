import React from 'react';
import { getJornadaConfig } from '../helpers/subjectHelpers';

// Header de la tarjeta con icono de jornada y nombre de materia
const SubjectCardHeader = ({ subject }) => {
    const jornadaConfig = getJornadaConfig(subject.modalidad);
    const JornadaIcon = jornadaConfig.icon;

    return (
        <div className="mb-4">
            <div className="flex items-center space-x-3 mb-3">
                <JornadaIcon className={`h-5 w-5 ${jornadaConfig.color} flex-shrink-0`} />
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                            from-teal-400 to-cyan-400 line-clamp-2 leading-tight">
                    {subject.nombre}
                </h3>
            </div>
        </div>
    );
};

export default SubjectCardHeader;