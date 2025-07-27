import React from 'react';
import { useAuth } from '@/contexts';
import { isStudentRole } from './helpers/roleMapper';
import { formatDate } from './helpers/formatData';
import ProposalsFiltersSection from './subcomponents/ProposalsStatsFilter';
import ProposalsStatsSection from './subcomponents/ProposalStatsSection';
import ProposalsListSection from './subcomponents/ProposalListSection';
import ProposalCard from './ProposalCard';

// Componente contenedor principal para propuestas
const ProposalsList = ({
    // Datos principales
    proposals,
    stats,
    availableSubjects,

    // Estados
    loading,
    error,

    // Filtros
    filters,

    // Acciones
    actions,

    // Estados de UI
    ui
}) => {
    const { user } = useAuth();

    // Verificar si el usuario es estudiante
    const isStudent = isStudentRole(user?.rol);

    // Renderizar tarjeta de propuesta
    const renderProposalCard = (proposal, onCardClick) => {
        return (
            <ProposalCard
                key={proposal.pp_id}
                id={proposal.pp_id}
                title={proposal.pp_name}
                author={proposal.autor_nombre}
                role={proposal.pp_user_rol}
                projectType={proposal.tipo_proyecto}
                description={proposal.pp_description}
                priority={proposal.pp_difficulty_level}
                dueDate={formatDate(proposal.pp_date_limit)}
                status={proposal.pp_approval_status}
                subject={proposal.materia_nombre}
                onCardClick={onCardClick}
                isSelected={actions.selectedProposal?.pp_id === proposal.pp_id}
                disabled={loading}
            />
        );
    };

    // Mensajes contextuales según el rol
    const getEmptyStateConfig = () => {
        if (isStudent) {
            return {
                title: 'No hay propuestas aprobadas disponibles',
                description: 'No se encontraron propuestas aprobadas en las materias en las que estás inscrito'
            };
        }

        return {
            title: `No hay propuestas ${filters.active.toLowerCase()}`,
            description: `No se encontraron propuestas con el filtro actual`
        };
    };

    const emptyConfig = getEmptyStateConfig();

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Filtros superiores */}
                <ProposalsFiltersSection
                    searchTerm={filters.search.term}
                    onSearchChange={filters.search.update}
                    onSearchClear={() => filters.clearAll()}
                    selectedSubject={filters.subject.selected}
                    availableSubjects={availableSubjects}
                    onSubjectChange={filters.subject.update}
                    onSubjectClear={() => filters.clearAll()}
                    loading={loading}
                />

                {/* Estadísticas - Solo Admin y Tutores */}
                {!isStudent && (
                    <ProposalsStatsSection
                        stats={stats}
                        activeFilter={filters.active}
                        onFilterChange={filters.change}
                        loading={loading}
                    />
                )}

                {/* Lista de propuestas */}
                <ProposalsListSection
                    proposals={proposals}
                    totalCount={stats?.totales || 0}
                    loading={loading}
                    error={error}
                    activeFilter={filters.active}
                    hasLocalFilters={filters.hasLocalFilters}
                    onRefresh={actions.refresh}
                    onProposalClick={actions.select}
                    renderProposalCard={renderProposalCard}
                    emptyTitle={emptyConfig.title}
                    emptyDescription={emptyConfig.description}
                />

            </div>
        </div>
    );
};

export default ProposalsList;