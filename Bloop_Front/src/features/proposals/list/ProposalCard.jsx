import React from 'react';
import { 
    UserCircleIcon, 
    SparklesIcon,
    CalendarDaysIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts';
import { getStatusClass, getPriorityClass } from './helpers/styleStates';
import { isStudentRole, getRoleDisplayName  } from './helpers/roleMapper';

// Componente principal de tarjeta de propuesta con diseño moderno
const ProposalCard = ({
    // Datos de la propuesta
    id,
    title,
    author,
    role,
    projectType,
    description,
    priority,
    dueDate,
    status,
    subject,

    // Acciones
    onCardClick,

    // Estados
    isSelected = false,
    disabled = false
}) => {
    const { user } = useAuth();

    // Manejar clic en la tarjeta
    const handleClick = () => {
        if (onCardClick && !disabled) {
            onCardClick({
                id,
                title,
                author,
                role,
                projectType,
                description,
                priority,
                dueDate,
                status,
                subject
            });
        }
    };

    // Verificar si es estudiante para mostrar estado diferente
    const isStudent = isStudentRole(role);

    // Componente de cinta de prioridad
    const PriorityRibbon = () => (
        <div className={`
            absolute top-0 right-0 px-3 py-1 text-xs font-semibold uppercase tracking-wide 
            rounded-bl-lg shadow-sm ${getPriorityClass(priority)}
        `}>
            {priority}
        </div>
    );

    // Componente de encabezado de la tarjeta
    const CardHeader = () => (
        <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                            from-teal-400 to-cyan-400 line-clamp-2 leading-tight pr-2">
                    {title}
                </h3>
                <div className="flex-shrink-0 p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 
                                rounded-full shadow-inner border border-teal-500/30
                                group-hover:from-teal-500/30 group-hover:to-cyan-500/30 
                                transition-all duration-300">
                    <SparklesIcon className="h-5 w-5 text-teal-400 group-hover:text-teal-300 
                                            transition-colors duration-300" />
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-700/50 rounded-full px-3 py-1.5
                                border border-gray-600/50 backdrop-blur-sm">
                    <UserCircleIcon className="h-4 w-4 text-teal-400" />
                    <span className="text-sm">
                        <span className="font-semibold text-white">{author || 'Autor desconocido'}</span>
                        <span className="mx-1.5 text-gray-500">•</span>
                        <span className="text-teal-300 text-xs font-medium uppercase tracking-wide">
                            {getRoleDisplayName(role) || 'Sin rol'}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );

    // Componente de contenido de la tarjeta
    const CardContent = () => (
        <div className="space-y-4 mb-4 flex-grow">
            <div className="flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span className="text-sm bg-gradient-to-r from-teal-500 to-cyan-500 text-white 
                                font-medium px-3 py-1.5 rounded-full shadow-sm
                                group-hover:shadow-teal-500/25 transition-shadow duration-300">
                    {projectType}
                </span>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b 
                            from-teal-500/50 to-transparent rounded-full" />
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 pl-4
                            group-hover:text-gray-200 transition-colors duration-300">
                    {description}
                </p>
            </div>

            {/* Información de materia */}
            {subject && (
                <div className="flex items-center space-x-2 mt-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs text-cyan-300 font-medium">
                        {subject}
                    </span>
                </div>
            )}
        </div>
    );

    // Componente de footer de la tarjeta
    const CardFooter = () => (
        <div className="flex justify-between items-center text-sm border-t border-gray-700/50 pt-4">
            <div className="flex items-center space-x-2 text-gray-300">
                <CalendarDaysIcon className="h-4 w-4 text-teal-400" />
                <span className="font-medium text-white">{dueDate || 'Sin fecha' }</span>
            </div>

            <div className={`
                flex items-center space-x-2 text-white font-semibold 
                px-3 py-1.5 rounded-full text-xs shadow-sm
                transition-all duration-300 group-hover:shadow-lg
                ${getStatusClass(status)}
            `}>
                {/* Para estudiantes mostrar "Aplicado/No aplicado" en lugar del estado */}
                <span>
                    {isStudent ? 'No aplicado' : status}
                </span>
            </div>
        </div>
    );

    return (
        <div 
            className={`
                group relative bg-gradient-to-br from-gray-800 to-gray-900 
                rounded-2xl p-6 cursor-pointer transition-all duration-500 ease-out
                border border-gray-700/50 backdrop-blur-sm
                min-h-[320px] flex flex-col justify-between
                hover:scale-[1.02] hover:shadow-2xl hover:shadow-teal-500/10
                hover:border-teal-500/30 hover:bg-gradient-to-br hover:from-gray-750 hover:to-gray-850
                ${isSelected ? 'ring-2 ring-teal-500 shadow-lg shadow-teal-500/20' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={handleClick}
        >
            {/* Cinta de prioridad */}
            <PriorityRibbon />

            {/* Contenido principal */}
            <div className="flex-grow flex flex-col">
                <CardHeader />
                <CardContent />
            </div>

            {/* Footer */}
            <CardFooter />

            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        </div>
    );
};

export default ProposalCard;