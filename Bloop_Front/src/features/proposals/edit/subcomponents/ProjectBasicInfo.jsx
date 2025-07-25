import React from 'react';
import { UserIcon, CalendarIcon, TagIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { getStatusConfig, getDifficultyConfig, getRoleConfig } from '../helpers/projectConfig';
import { formatDate, formatModality } from '../helpers/projectFormatters';

// Componente para mostrar información básica, creador y descripción de la propuesta
const ProjectBasicInfo = ({ proposal, isCompact = false }) => {
    if (!proposal) return null;

    const statusConfig = getStatusConfig(proposal.pp_approval_status);
    const difficultyConfig = getDifficultyConfig(proposal.pp_difficulty_level);
    const authorConfig = getRoleConfig(proposal.pp_user_rol);
    const StatusIcon = statusConfig.icon;

    // Renderizado compacto para vista de lista
    if (isCompact) {
        return (
            <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white truncate">
                        {proposal.pp_name}
                    </h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.styles.container}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-300">
                        <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{proposal.autor_nombre || `Usuario ${proposal.pp_user}`}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <span className={`px-2 py-1 rounded text-xs ${difficultyConfig.styles}`}>
                            {difficultyConfig.label}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizado completo para vista de modal
    return (
        <div className="space-y-6">
            {/* Header con título y estado */}
            <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {proposal.pp_name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            ID: {proposal.pp_id} • Creado el {formatDate(proposal.pp_date_creation)}
                        </p>
                    </div>
                    
                    <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${statusConfig.styles.container}`}>
                        <StatusIcon className="h-4 w-4 mr-2" />
                        {statusConfig.label}
                    </div>
                </div>

                {/* Información del creador */}
                <div className="flex items-center space-x-4 p-4 bg-gray-600/30 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-white">
                            {proposal.autor_nombre || `Usuario ${proposal.pp_user}`}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {authorConfig.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Información básica del proyecto */}
            <div className="bg-gray-700/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-teal-400 mb-4 flex items-center">
                    <TagIcon className="h-5 w-5 mr-2" />
                    Información del Proyecto
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tipo de proyecto */}
                    <div className="space-y-1">
                        <span className="text-sm text-gray-400">Tipo:</span>
                        <div className="flex items-center">
                            <span className="bg-teal-600 px-3 py-1 rounded-full text-sm text-white">
                                {proposal.tipo_proyecto || 'Sin tipo'}
                            </span>
                        </div>
                    </div>

                    {/* Materia */}
                    <div className="space-y-1">
                        <span className="text-sm text-gray-400">Materia:</span>
                        <div className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-2 text-cyan-400" />
                            <span className="text-cyan-400">
                                {proposal.materia_nombre || 'Sin materia'}
                            </span>
                        </div>
                    </div>

                    {/* Dificultad */}
                    <div className="space-y-1">
                        <span className="text-sm text-gray-400">Dificultad:</span>
                        <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyConfig.styles}`}>
                                {difficultyConfig.label}
                            </span>
                        </div>
                    </div>

                    {/* Fecha límite */}
                    <div className="space-y-1">
                        <span className="text-sm text-gray-400">Fecha límite:</span>
                        <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-white">
                                {formatDate(proposal.pp_date_limit)}
                            </span>
                        </div>
                    </div>

                    {/* Modalidad */}
                    <div className="space-y-1 md:col-span-2">
                        <span className="text-sm text-gray-400">Modalidad:</span>
                        <div className="flex items-center">
                            <span className="text-white">
                                {formatModality(proposal.pp_grupal, proposal.pp_max_integrantes)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Descripción del proyecto */}
            <div className="bg-gray-700/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-teal-400 mb-4">
                    Descripción
                </h4>
                
                <div className="text-gray-300 leading-relaxed">
                    {proposal.pp_description ? (
                        <p className="whitespace-pre-wrap">
                            {proposal.pp_description}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">
                            Sin descripción disponible
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectBasicInfo;