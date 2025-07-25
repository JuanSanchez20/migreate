import React from "react";
import { ArrowPathIcon, } from '@heroicons/react/24/outline';

const ListHeader = ({ stats, onRefresh, loading }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">
                Lista de Usuarios
            </h2>
            
            {/* Badge con contador */}
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#278bbd]/20 text-[#278bbd]">
                {stats.filtered} {stats.filtered === 1 ? 'usuario' : 'usuarios'}
            </span>
            
            {/* Indicador de filtros si están activos */}
            {stats.hasFilters && (
                <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Filtrado
                </span>
            )}
        </div>

        {/* Botón de refrescar */}
        {onRefresh && (
            <button
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-slate-300 
                        rounded-lg border border-slate-600 hover:bg-slate-700 hover:text-white 
                        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refrescar lista de usuarios"
            >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refrescar</span>
            </button>
        )}
    </div>
);

export default ListHeader;