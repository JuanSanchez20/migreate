import React from 'react';
import { 
    CogIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

// Subcomponente para mostrar los requerimientos de una propuesta
const ProposalRequirements = ({ 
    requirements, 
    isLoading = false,
    error = null 
}) => {
    // Estado de carga
    if (isLoading) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-700 rounded w-40 animate-pulse"></div>
                </div>
                
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start space-x-3">
                            <div className="w-4 h-4 bg-gray-700 rounded mt-1 animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
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
                <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                    <CogIcon className="h-5 w-5 mr-2" />
                    Requerimientos
                </h3>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                        <span className="text-sm font-medium text-red-400">
                            Error al cargar requerimientos
                        </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                        {error.message || 'No se pudieron cargar los requerimientos de la propuesta'}
                    </p>
                </div>
            </div>
        );
    }

    // Función para categorizar requerimientos (si llegaran con algún tipo)
    const categorizeRequirements = (requirements) => {
        if (!Array.isArray(requirements)) return { general: requirements || [] };

        // Por ahora solo hay una categoría general, pero se puede expandir
        return {
            general: requirements
        };
    };

    // Componente para renderizar un requerimiento individual
    const RequirementItem = ({ requirement, index }) => (
        <div className="flex items-start space-x-3 group hover:bg-gray-700/20 rounded-lg p-2 -m-2 transition-colors">
            {/* Icono de requerimiento */}
            <div className="flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
            </div>
            
            {/* Contenido del requerimiento */}
            <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {requirement.nombre}
                </p>
                
                {/* Número de requerimiento para referencia */}
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-700 text-gray-400 rounded group-hover:bg-gray-600 transition-colors">
                    Req. #{index + 1}
                </span>
            </div>
        </div>
    );

    // Categorizar requerimientos
    const categorizedRequirements = categorizeRequirements(requirements);
    const totalRequirements = requirements?.length || 0;

    return (
        <div className="bg-gray-800/50 rounded-lg p-4">
            {/* Header con contador */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-orange-400 flex items-center">
                    <CogIcon className="h-5 w-5 mr-2" />
                    Requerimientos
                </h3>
                
                {totalRequirements > 0 && (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
                        {totalRequirements} {totalRequirements === 1 ? 'requerimiento' : 'requerimientos'}
                    </span>
                )}
            </div>

            {/* Contenido principal */}
            {totalRequirements === 0 ? (
                // Estado vacío
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <WrenchScrewdriverIcon className="h-8 w-8 text-gray-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-400 mb-2">
                        Sin requerimientos definidos
                    </h4>
                    <p className="text-sm text-gray-500">
                        Esta propuesta no tiene requerimientos técnicos especificados.
                    </p>
                </div>
            ) : (
                // Lista de requerimientos
                <div className="space-y-1">
                    {categorizedRequirements.general.map((requirement, index) => (
                        <RequirementItem
                            key={requirement.id || index}
                            requirement={requirement}
                            index={index}
                        />
                    ))}
                    
                    {/* Información adicional */}
                    <div className="mt-6 p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <WrenchScrewdriverIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-400">
                                Sobre los requerimientos
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Estos son los recursos, herramientas, conocimientos o condiciones necesarias 
                            para desarrollar exitosamente este proyecto.
                        </p>
                    </div>
                </div>
            )}

            {/* Indicador de completitud (si hay requerimientos) */}
            {totalRequirements > 0 && (
                <div className="mt-4 flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-orange-400" />
                        <div>
                            <p className="text-sm font-medium text-orange-400">
                                Requerimientos definidos
                            </p>
                            <p className="text-xs text-gray-400">
                                Revisa que cumples con todos los requerimientos antes de aplicar
                            </p>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="text-lg font-bold text-orange-400">
                            {totalRequirements}
                        </div>
                        <div className="text-xs text-gray-400">
                            {totalRequirements === 1 ? 'requerimiento' : 'requerimientos'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalRequirements;