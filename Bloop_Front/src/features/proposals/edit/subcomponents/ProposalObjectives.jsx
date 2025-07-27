import React from 'react';
import { FlagIcon, ListBulletIcon } from '@heroicons/react/24/outline';

// Subcomponente para mostrar los objetivos de una propuesta
const ProposalObjectives = ({ 
    objectives, 
    isLoading = false,
    error = null 
}) => {
    // Estado de carga
    if (isLoading) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
                </div>
                
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gray-700 rounded-full mt-2 animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-teal-400 mb-3 flex items-center">
                    <FlagIcon className="h-5 w-5 mr-2" />
                    Objetivos
                </h3>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 text-red-400">⚠</div>
                        <span className="text-sm font-medium text-red-400">
                            Error al cargar objetivos
                        </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                        {error.message || 'No se pudieron cargar los objetivos de la propuesta'}
                    </p>
                </div>
            </div>
        );
    }

    // Función para categorizar objetivos por tipo
    const categorizeObjectives = (objectives) => {
        if (!Array.isArray(objectives)) return { general: [], especificos: [] };

        const categorized = {
            general: [],
            especificos: []
        };

        objectives.forEach(objective => {
            const tipo = objective.tipo?.toLowerCase() || 'general';
            
            if (tipo.includes('general') || tipo === 'general') {
                categorized.general.push(objective);
            } else {
                categorized.especificos.push(objective);
            }
        });

        return categorized;
    };

    // Componente para renderizar una lista de objetivos
    const ObjectivesList = ({ objectives, title, emptyMessage, color = 'teal' }) => {
        const colorClasses = {
            teal: 'text-teal-400',
            cyan: 'text-cyan-400',
            blue: 'text-blue-400'
        };

        if (!objectives || objectives.length === 0) {
            return (
                <div className="space-y-2">
                    <h4 className={`font-semibold ${colorClasses[color]} text-sm`}>
                        {title}
                    </h4>
                    <p className="text-gray-500 italic text-sm pl-5">
                        {emptyMessage}
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <h4 className={`font-semibold ${colorClasses[color]} text-sm flex items-center`}>
                    <ListBulletIcon className="h-4 w-4 mr-1" />
                    {title} ({objectives.length})
                </h4>
                <div className="space-y-2">
                    {objectives.map((objective, index) => (
                        <div key={objective.id || index} className="flex items-start space-x-3 group">
                            {/* Bullet point */}
                            <div className={`w-2 h-2 ${colorClasses[color].replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0 group-hover:scale-110 transition-transform`}></div>
                            
                            {/* Contenido del objetivo */}
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {objective.nombre}
                                </p>
                                
                                {/* Información adicional si existe */}
                                {objective.tipo && objective.tipo !== 'General' && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">
                                        {objective.tipo}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Categorizar objetivos
    const categorizedObjectives = categorizeObjectives(objectives);
    const totalObjectives = objectives?.length || 0;

    return (
        <div className="bg-gray-800/50 rounded-lg p-4">
            {/* Header con contador */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-teal-400 flex items-center">
                    <FlagIcon className="h-5 w-5 mr-2" />
                    Objetivos
                </h3>
            </div>

            {/* Contenido principal */}
            {totalObjectives === 0 ? (
                // Estado vacío
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FlagIcon className="h-8 w-8 text-gray-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-400 mb-2">
                        Sin objetivos definidos
                    </h4>
                    <p className="text-sm text-gray-500">
                        Esta propuesta no tiene objetivos registrados aún.
                    </p>
                </div>
            ) : (
                // Lista de objetivos categorizados
                <div className="space-y-6">
                    {/* Objetivos generales */}
                    <ObjectivesList
                        objectives={categorizedObjectives.general}
                        title="Objetivos Generales"
                        emptyMessage="No hay objetivos generales definidos"
                        color="teal"
                    />

                    {/* Objetivos específicos */}
                    <ObjectivesList
                        objectives={categorizedObjectives.especificos}
                        title="Objetivos Específicos"
                        emptyMessage="No hay objetivos específicos definidos"
                        color="cyan"
                    />

                    {/* Información adicional */}
                    {totalObjectives > 0 && (
                        <div className="mt-6 p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <FlagIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-400">
                                    Información
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Los objetivos definen qué se espera lograr con este proyecto. 
                                Cada objetivo representa una meta específica que debe alcanzarse.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProposalObjectives;