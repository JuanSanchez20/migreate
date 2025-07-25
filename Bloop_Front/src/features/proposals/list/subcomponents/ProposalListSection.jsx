import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { LoadingState, ErrorState, EmptyState } from '@/components';

// Subcomponente para mostrar la lista de propuestas con diferentes estados
const ProposalsListSection = ({
    // Datos
    proposals,
    totalCount = 0,

    // Estados
    loading = false,
    error = null,

    // Filtros y contexto
    activeFilter = 'Totales',
    hasLocalFilters = false,

    // Acciones
    onRefresh,
    onProposalClick,

    // Componente de tarjeta personalizado
    renderProposalCard,

    // Configuración
    emptyTitle,
    emptyDescription
}) => {
    // Manejar clic en propuesta
    const handleProposalClick = (proposal) => {
        if (onProposalClick && !loading) {
            onProposalClick(proposal);
        }
    };

    // Manejar refresh
    const handleRefresh = () => {
        if (onRefresh && !loading) {
            onRefresh();
        }
    };

    // Obtener título dinámico según el filtro activo
    const getSectionTitle = () => {
        const baseTitle = activeFilter === 'Totales' 
            ? 'Propuestas' 
            : `Propuestas ${activeFilter}`;
            
        return `${baseTitle} (${proposals?.length || 0})`;
    };

    // Obtener mensaje para estado vacío
    const getEmptyStateConfig = () => {
        if (hasLocalFilters) {
            return {
                type: 'proposals',
                title: 'No se encontraron propuestas',
                description: 'No hay propuestas que coincidan con los filtros aplicados',
                hasActiveFilters: true
            };
        }

        if (activeFilter !== 'Totales') {
            return {
                type: 'proposals',
                title: `No hay propuestas ${activeFilter.toLowerCase()}`,
                description: `No se encontraron propuestas con estado ${activeFilter.toLowerCase()}`,
                hasActiveFilters: false
            };
        }

        return {
            type: 'proposals',
            title: emptyTitle || 'No hay propuestas',
            description: emptyDescription || 'No hay propuestas registradas en el sistema',
            hasActiveFilters: false
        };
    };

    // Componente de header de la sección
    const SectionHeader = () => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    {getSectionTitle()}
                </h2>
                {totalCount > 0 && proposals && proposals.length !== totalCount && (
                    <p className="text-sm text-gray-400 mt-1">
                        Mostrando {proposals.length} de {totalCount} propuestas
                    </p>
                )}
            </div>

            {/* Botón de refresh */}
            {onRefresh && (
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg
                            hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-200 space-x-2"
                    title="Refrescar propuestas"
                >
                    <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refrescar</span>
                </button>
            )}
        </div>
    );

    // Grid responsivo de propuestas
    const ProposalsGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {proposals.map((proposal) => {
                // Si se proporciona un render personalizado, usarlo
                if (renderProposalCard) {
                    return renderProposalCard(proposal, handleProposalClick);
                }

                // Fallback básico si no hay render personalizado
                return (
                    <div 
                        key={proposal.id || proposal.proposalId}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer
                                    hover:bg-gray-750 transition-colors duration-200"
                        onClick={() => handleProposalClick(proposal)}
                    >
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {proposal.title || proposal.nombre || 'Sin título'}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3">
                            {proposal.description || proposal.descripcion || 'Sin descripción'}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                                {proposal.author?.name || proposal.autorNombre || 'Autor desconocido'}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                                {proposal.status || proposal.estadoAprobacion || 'Sin estado'}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Estado de carga
    if (loading) {
        return (
            <div className="space-y-6">
                <SectionHeader />
                <LoadingState 
                    message="Cargando propuestas..."
                    description="Obteniendo información de las propuestas"
                    size="large"
                />
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="space-y-6">
                <SectionHeader />
                <ErrorState
                    title="Error al cargar propuestas"
                    error={error}
                    onRetry={handleRefresh}
                    retryText="Reintentar"
                />
            </div>
        );
    }

    // Estado vacío
    if (!proposals || proposals.length === 0) {
        const emptyConfig = getEmptyStateConfig();

        return (
            <div className="space-y-6">
                <SectionHeader />
                <EmptyState
                    type={emptyConfig.type}
                    customTitle={emptyConfig.title}
                    customDescription={emptyConfig.description}
                    hasActiveFilters={emptyConfig.hasActiveFilters}
                />
            </div>
        );
    }

    // Lista con datos
    return (
        <div className="space-y-6">
            <SectionHeader />
            <ProposalsGrid />
        </div>
    );
};

export default ProposalsListSection;