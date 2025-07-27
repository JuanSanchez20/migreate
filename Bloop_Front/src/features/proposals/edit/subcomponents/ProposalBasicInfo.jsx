import React from 'react';
import { 
    UserIcon, 
    CalendarDaysIcon, 
    BookOpenIcon,
    TagIcon,
    UsersIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

// Subcomponente para mostrar la información básica de una propuesta
const ProposalBasicInfo = ({ 
    proposal, 
    currentUser, 
    isLoading = false 
}) => {
    // Si no hay propuesta, mostrar esqueleto de carga
    if (!proposal || isLoading) {
        return (
            <div className="space-y-6">
                {/* Header skeleton */}
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-4">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
                </div>
            </div>
        );
    }

    // Función para obtener el color del badge de estado
    const getStatusBadgeStyles = (status) => {
        const statusStyles = {
            'Aprobada': 'bg-green-500/20 text-green-400 border border-green-500/30',
            'Pendiente': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            'Rechazada': 'bg-red-500/20 text-red-400 border border-red-500/30'
        };
        return statusStyles[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    };

    // Función para obtener el color del badge de dificultad
    const getDifficultyBadgeStyles = (difficulty) => {
        const difficultyStyles = {
            'Avanzado': 'bg-red-600 text-white',
            'Intermedio': 'bg-yellow-600 text-white',
            'Básico': 'bg-green-600 text-white'
        };
        return difficultyStyles[difficulty] || 'bg-gray-600 text-white';
    };

    // Verificar si es el autor de la propuesta
    const isAuthor = currentUser && proposal.autorId === currentUser.id;

    // Componente para mostrar información con icono
    const InfoItem = ({ icon: Icon, label, value, badge = false, badgeStyles = '' }) => (
        <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-teal-400 flex-shrink-0" />
            <div className="flex-1">
                <span className="text-sm text-gray-400">{label}:</span>
                {badge ? (
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${badgeStyles}`}>
                        {value}
                    </span>
                ) : (
                    <span className="ml-2 text-white">{value}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header con información principal */}
            <div className="flex items-start space-x-4">
                {/* Icono de la propuesta */}
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                </div>

                {/* Información principal */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold text-white truncate">
                                {proposal.nombre}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                ID: {proposal.id} • Creada el {proposal.fechaCreacion}
                            </p>
                            {isAuthor && (
                                <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                                    <UserIcon className="h-3 w-3 mr-1" />
                                    Tu propuesta
                                </span>
                            )}
                        </div>

                        {/* Badge de estado */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadgeStyles(proposal.estadoAprobacion)}`}>
                            {proposal.estadoAprobacion}
                        </span>
                    </div>
                </div>
            </div>

            {/* Descripción de la propuesta */}
            <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-teal-400 mb-3 flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Descripción
                </h3>
                <div className="text-gray-300 leading-relaxed">
                    {proposal.descripcion && proposal.descripcion.trim() ? (
                        <p>{proposal.descripcion}</p>
                    ) : (
                        <p className="text-gray-500 italic">Sin descripción disponible</p>
                    )}
                </div>
            </div>

            {/* Información detallada en grid */}
            <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">
                    Información del Proyecto
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Autor */}
                    <InfoItem
                        icon={UserIcon}
                        label="Autor"
                        value={`${proposal.autorNombre} (${proposal.autorRolNombre})`}
                    />

                    {/* Tipo de proyecto */}
                    <InfoItem
                        icon={TagIcon}
                        label="Tipo"
                        value={proposal.tipoProyecto}
                    />

                    {/* Materia */}
                    <InfoItem
                        icon={BookOpenIcon}
                        label="Materia"
                        value={proposal.materiaNombre}
                    />

                    {/* Nivel de dificultad */}
                    <InfoItem
                        icon={ClockIcon}
                        label="Dificultad"
                        value={proposal.nivelDificultad}
                        badge={true}
                        badgeStyles={getDifficultyBadgeStyles(proposal.nivelDificultad)}
                    />

                    {/* Fecha límite */}
                    <InfoItem
                        icon={CalendarDaysIcon}
                        label="Fecha límite"
                        value={proposal.fechaLimite}
                    />

                    {/* Información de grupo (si aplica) */}
                    {proposal.esGrupal && (
                        <InfoItem
                            icon={UsersIcon}
                            label="Integrantes máx."
                            value={`${proposal.maxIntegrantes} personas`}
                        />
                    )}
                </div>

                {/* Información adicional para proyectos grupales */}
                {proposal.esGrupal && (
                    <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <UsersIcon className="h-5 w-5 text-teal-400" />
                            <span className="text-sm font-medium text-teal-400">
                                Proyecto Grupal
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                            Este proyecto está diseñado para trabajar en equipo con un máximo de {proposal.maxIntegrantes} integrantes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProposalBasicInfo;