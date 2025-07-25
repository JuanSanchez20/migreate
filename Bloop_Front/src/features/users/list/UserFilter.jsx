import React from 'react';
import {
    MagnifyingGlassIcon,
    UserGroupIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    XMarkIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

import FilterHeader from './subcomponents/UserFilterHeader';
import EmailSearchField from './subcomponents/UserFilterEmail';
import RoleSelectField from './subcomponents/UserFilterRol';
import SemesterSelectField from './subcomponents/UserFilterSemester';
import StatusSelectField from './subcomponents/UserFilterStatus';
import ActiveFiltersIndicator from './subcomponents/UserFilterIndicator';


// Componente de filtro para la lista de usuarios
const UserFilter = ({
    // Props del hook useUserFilters
    filters = {},
    updateEmail,
    updateRol,
    updateSemestre,
    updateEstado,
    clearFilters,
    hasActiveFilters,
    getActiveFiltersInfo,
    
    // Props adicionales
    disabled = false,
    className = "",
    ...props
}) => {
    // Verifica que las funciones necesarias estén definidas
    if (!updateEmail || !updateRol || !updateSemestre || !updateEstado) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <XMarkIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 text-sm">
                    Error: Faltan funciones del hook useUserFilters
                </p>
            </div>
        )
    }

    // Info de filtros activos
    const activeFiltersInfo = getActiveFiltersInfo ? getActiveFiltersInfo() : [];
    const hasFilters = hasActiveFilters ? hasActiveFilters() : false;

    return (
        <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-6 ${className}`} {...props}>
            {/* Header del filtro */}
            <FilterHeader 
                hasActiveFilters={hasFilters}
                onClearFilters={clearFilters}
                disabled={disabled}
            />

            {/* Contenido del filtro */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Campo de búsqueda por email */}
                <EmailSearchField
                    value={filters.email || ''}
                    onChange={updateEmail}
                    disabled={disabled}
                />

                {/* Filtro por rol */}
                <RoleSelectField
                    value={filters.rol || 'todos'}
                    onChange={updateRol}
                    disabled={disabled}
                />

                {/* Filtro por semestre */}
                <SemesterSelectField
                    value={filters.semestre || 'todos'}
                    onChange={updateSemestre}
                    disabled={disabled}
                />

                {/* Filtro por estado */}
                <StatusSelectField
                    value={filters.estado || 'todos'}
                    onChange={updateEstado}
                    disabled={disabled}
                />
            </div>

            {/* Indicador de filtros activos */}
            <ActiveFiltersIndicator activeFiltersInfo={activeFiltersInfo} />
        </div>
    );
}

export default UserFilter;