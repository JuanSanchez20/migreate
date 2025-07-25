import React from 'react';

// Componente para mostrar los indicadores de filtros activos
const ActiveFiltersIndicator = ({ activeFiltersInfo }) => {
    if (!activeFiltersInfo || activeFiltersInfo.length === 0) return null;

    return (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
            <div className="flex items-center space-x-2 text-sm text-slate-400 mb-2">
                <span>🔍</span>
                <span>Filtros activos aplicados</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {activeFiltersInfo.map((filter, index) => (
                    <span 
                        key={index}
                        className={`px-2 py-1 rounded text-xs font-medium ${filter.color}`}
                    >
                        {filter.label}: {filter.value}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ActiveFiltersIndicator;