import React from 'react';
import SubjectCardDecorative from './subcomponents/SubjectCardDecorative';
import SubjectCardIndicator from './subcomponents/SubjectCardIndicator';
import SubjectCardHeader from './subcomponents/SubjectCardHeader';
import SubjectCardBody from './subcomponents/SubjectCardBody';
import SubjectCardFooter from './subcomponents/SubjectCardFooter';
import { getUserCounts } from './helpers/subjectHelpers';

// Componente principal de tarjeta de materia
const SubjectCard = ({ subject, onCardClick, disabled = false }) => {
    const { estudiantes } = getUserCounts(subject.usuariosAsignados);

    // Manejar click en la tarjeta
    const handleClick = () => {
        if (!disabled && onCardClick) {
            onCardClick(subject);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                group relative min-h-[280px]
                bg-gradient-to-br from-gray-800/90 via-gray-800/95 to-gray-900/90 
                backdrop-blur-sm p-6 rounded-3xl 
                shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 
                hover:scale-[1.02] transition-all duration-500 
                border border-gray-700/50 hover:border-teal-500/30
                flex flex-col justify-start
                before:absolute before:inset-0 before:rounded-3xl before:p-[1px]
                before:bg-gradient-to-br before:from-teal-500/20 before:to-transparent
                before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                overflow-hidden
                ${onCardClick && !disabled ? 'cursor-pointer' : 'cursor-default'}
                ${disabled ? 'opacity-50 pointer-events-none' : ''}
                pt-24
            `}
        >
            {/* Efecto de brillo superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Elemento decorativo superior */}
            <div className="absolute top-0 left-0 right-0">
                <SubjectCardDecorative />
            </div>

            {/* Indicador de estudiantes (aparece en hover) */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <SubjectCardIndicator estudiantesCount={estudiantes} />
            </div>

            {/* Contenido principal */}
            <div className="relative z-0 flex flex-col h-full w-full">
                {/* Header con jornada y nombre */}
                <SubjectCardHeader subject={subject} />

                {/* Body con estado PEA */}
                <SubjectCardBody subject={subject} />

                {/* Espaciador flexible */}
                <div className="flex-1"></div>

                {/* Footer con tutor y semestre */}
                <SubjectCardFooter subject={subject} />
            </div>
        </div>
    );
};

export default SubjectCard;