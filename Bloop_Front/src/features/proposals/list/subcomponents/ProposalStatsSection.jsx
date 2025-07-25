import React from 'react';
import { 
    DocumentIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    XCircleIcon 
} from '@heroicons/react/24/outline';
import { getStatusColors } from '../helpers/styleStates';

// Subcomponente para mostrar estadísticas de propuestas (solo Admin y Tutores)
const ProposalsStatsSection = ({
    // Estadísticas
    stats,

    // Filtro activo
    activeFilter,
    onFilterChange,

    // Estados
    loading = false
}) => {

    // Configuración de las tarjetas de estadísticas
    const statsConfig = [
        {
            key: 'Totales',
            label: 'Totales',
            count: stats?.totales || 0,
            icon: DocumentIcon,
            colors: {
                primary: '#3b82f6', // blue-500
                border: 'rgba(59, 130, 246, 0.6)',
                background: 'rgba(59, 130, 246, 0.1)',
                hover: 'rgba(59, 130, 246, 0.2)'
            }
        },
        {
            key: 'Pendientes',
            label: 'Pendientes', 
            count: stats?.pendientes || 0,
            icon: ClockIcon,
            colors: getStatusColors('Pendiente')
        },
        {
            key: 'Aprobadas',
            label: 'Aprobadas',
            count: stats?.aprobadas || 0,
            icon: CheckCircleIcon,
            colors: getStatusColors('Aprobada')
        },
        {
            key: 'Rechazadas',
            label: 'Rechazadas',
            count: stats?.rechazadas || 0,
            icon: XCircleIcon,
            colors: getStatusColors('Rechazada')
        }
    ];

    // Manejar clic en tarjeta de estadística
    const handleStatClick = (filterKey) => {
        if (onFilterChange && !loading) {
            onFilterChange(filterKey);
        }
    };

    // Componente individual de tarjeta de estadística
    const StatCard = ({ config }) => {
        const { key, label, count, icon: Icon, colors } = config;
        const isActive = activeFilter === key;

        return (
            <div
                className={`
                    relative bg-gray-800 rounded-xl p-6 cursor-pointer 
                    flex items-center justify-between transition-all duration-300
                    hover:bg-gray-750 border border-gray-700
                    ${isActive ? 'ring-2 ring-opacity-60' : ''}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => handleStatClick(key)}
                onMouseEnter={e => {
                    if (!isActive && !loading) {
                        e.currentTarget.style.boxShadow = `0 0 12px 4px ${colors.border}`;
                    }
                }}
                onMouseLeave={e => {
                    if (!isActive && !loading) {
                        e.currentTarget.style.boxShadow = '0 0 0 transparent';
                    }
                }}
                style={{ 
                    boxShadow: isActive ? `0 0 12px 4px ${colors.border}` : '0 0 0 transparent',
                    borderColor: isActive ? colors.border : 'rgb(55, 65, 81)' // gray-700
                }}
            >
                {/* Contenido principal */}
                <div className="flex flex-col items-start">
                    <div className="text-3xl font-bold text-white leading-none mb-1">
                        {count}
                    </div>
                    <div className="text-sm font-medium text-gray-300">
                        {label}
                    </div>
                </div>

                {/* Icono */}
                <div className={`
                    p-3 rounded-full transition-all duration-300
                    ${isActive 
                        ? 'bg-opacity-30' 
                        : 'bg-gray-700/50'
                    }
                `}
                style={{
                    backgroundColor: isActive ? colors.background : undefined
                }}>
                    <Icon 
                        className="h-8 w-8 transition-colors duration-300"
                        style={{ 
                            color: isActive ? colors.primary : '#9ca3af' // gray-400
                        }}
                    />
                </div>

                {/* Indicador de activo */}
                {isActive && (
                    <div 
                        className="absolute top-2 right-2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                    />
                )}
            </div>
        );
    };

    // Componente de esqueleto para estado de carga
    const StatCardSkeleton = () => (
        <div className="bg-gray-800 rounded-xl p-6 animate-pulse border border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="h-8 w-12 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-gray-700 rounded"></div>
                </div>
                <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
            </div>
        </div>
    );

    return (
        <div className="mb-6">
            {/* Título de la sección */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">
                    Estadísticas de Propuestas
                </h2>
            </div>

            {/* Grid de tarjetas de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    // Estado de carga
                    Array.from({ length: 4 }).map((_, index) => (
                        <StatCardSkeleton key={index} />
                    ))
                ) : (
                    // Tarjetas reales
                    statsConfig.map((config) => (
                        <StatCard key={config.key} config={config} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProposalsStatsSection;