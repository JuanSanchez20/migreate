import React from 'react';
import SubjectFilter from './SubjectFilter';
import SubjectListHeader from './subcomponents/SubjectListHeader';
import SubjectGrid from './subcomponents/SubjectListGrid';
import { LoadingState, ErrorState, EmptyState } from '@/components';
// Componente principal que organiza la lista de materias
const SubjectList = ({
    // Estados de datos
    groupedSubjects,
    loading,
    error,

    // Estados de filtros
    filters,
    showStatusFilter,
    activeFilters,
    hasActiveFilters,

    // Funciones de filtros
    onFiltersChange,
    onClearFilters,

    // Funciones de datos
    onRefresh,
    onCardClick,

    // Estadísticas
    stats
}) => {
    // Estado de carga
    if (loading) {
        return (
            <div className="space-y-6">
                <SubjectFilter
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    onClearFilters={onClearFilters}
                    showStatusFilter={showStatusFilter}
                    activeFilters={activeFilters}
                />
                <LoadingState 
                    message="Cargando materias..."
                    description="Obteniendo la lista de materias del sistema"
                    size="large"
                />
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="space-y-6">
                <SubjectFilter
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    onClearFilters={onClearFilters}
                    showStatusFilter={showStatusFilter}
                    activeFilters={activeFilters}
                />
                <ErrorState
                    title="Error al cargar materias"
                    error={error}
                    onRetry={onRefresh}
                    retryText="Reintentar"
                />
            </div>
        );
    }

    // Verificar si hay datos para mostrar
    const totalSubjects = (groupedSubjects?.matutina?.length || 0) + (groupedSubjects?.nocturna?.length || 0);
    const isEmpty = totalSubjects === 0;

    // Estado vacío
    if (isEmpty) {
        return (
            <div className="space-y-6">
                <SubjectFilter
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    onClearFilters={onClearFilters}
                    showStatusFilter={showStatusFilter}
                    activeFilters={activeFilters}
                />
                <EmptyState
                    type="subjects"
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={onClearFilters}
                />
            </div>
        );
    }

    // Lista con datos
    return (
        <div className="space-y-6">
            {/* Filtros */}
            <SubjectFilter
                filters={filters}
                onFiltersChange={onFiltersChange}
                onClearFilters={onClearFilters}
                showStatusFilter={showStatusFilter}
                activeFilters={activeFilters}
            />

            {/* Header con conteo y botón refrescar */}
            <SubjectListHeader
                count={totalSubjects}
                onRefresh={onRefresh}
                loading={loading}
            />

            {/* Grid de materias agrupadas por jornada */}
            <SubjectGrid
                groupedSubjects={groupedSubjects}
                onCardClick={onCardClick}
                loading={loading}
            />
        </div>
    );
};

export default SubjectList;