import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Muestra el encabezado del filtro de usuarios incluyendo un botón para limpiar los filtros activos
const FilterHeader = ({ hasActiveFilters, onClearFilters, disabled = false }) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-[#278bbd]" />
            <h2 className="text-lg font-semibold text-white">
                Filtros de Búsqueda
            </h2>
        </div>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
            <button
                onClick={onClearFilters}
                disabled={disabled}
                className="flex items-center space-x-2 text-sm text-slate-400 hover:text-red-400 
                        transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-400/10
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <XMarkIcon className="h-4 w-4" />
                <span>Limpiar filtros</span>
            </button>
        )}
    </div>
);

export default FilterHeader;