import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SubjectFilterSearch from './subcomponents/SubjectFilterSearch';
import SubjectFilterSemester from './subcomponents/SubjectFilterSemester';
import SubjectFilterJornada from './subcomponents/SubjectFilterJornada';
import SubjectFilterStatus from './subcomponents/SubjectFilterStatus';

// Componente principal de filtros de materias
const SubjectFilter = ({ 
    filters, 
    onFiltersChange, 
    onClearFilters, 
    showStatusFilter,
    activeFilters 
}) => {
    // Manejar cambio de un filtro específico
    const handleFilterChange = (filterName, value) => {
        onFiltersChange({
            ...filters,
            [filterName]: value
        });
    };

    // Verificar si hay filtros activos
    const hasActiveFilters = activeFilters && activeFilters.length > 0;

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-6">
            {/* Header del filtro */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <MagnifyingGlassIcon className="h-5 w-5 text-[#278bbd]" />
                    <h2 className="text-lg font-semibold text-white">
                        Filtros de Materias
                    </h2>
                </div>

                {/* Botón para limpiar filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center space-x-2 text-sm text-slate-400 hover:text-red-400 
                                transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-400/10"
                    >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Limpiar filtros</span>
                    </button>
                )}
            </div>

            {/* Grid de filtros */}
            <div className={`grid gap-4 ${
                showStatusFilter 
                    ? 'grid-cols-1 lg:grid-cols-4' 
                    : 'grid-cols-1 lg:grid-cols-3'
            }`}>
                {/* Filtro por nombre */}
                <SubjectFilterSearch
                    value={filters.nombre}
                    onChange={(value) => handleFilterChange('nombre', value)}
                />

                {/* Filtro por jornada */}
                <SubjectFilterJornada
                    value={filters.jornada}
                    onChange={(value) => handleFilterChange('jornada', value)}
                />

                {/* Filtro por semestre */}
                <SubjectFilterSemester
                    value={filters.semestre}
                    onChange={(value) => handleFilterChange('semestre', value)}
                />

                {/* Filtro por estado (solo Admin/Tutor) */}
                {showStatusFilter && (
                    <SubjectFilterStatus
                        value={filters.estado}
                        onChange={(value) => handleFilterChange('estado', value)}
                    />
                )}
            </div>

            {/* Indicadores de filtros activos */}
            {hasActiveFilters && (
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center space-x-2 text-sm text-slate-400 flex-wrap gap-2">
                        <span>🔍</span>
                        <span>Filtros activos aplicados</span>
                        {activeFilters.map((filter) => (
                            <span
                                key={filter.key}
                                className={`px-2 py-1 rounded text-xs ${filter.color}`}
                            >
                                {filter.label}: {filter.value}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectFilter;