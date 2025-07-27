import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const SubjectListHeader = ({ count, onRefresh, loading }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">
                Listado de Materias
            </h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#278bbd]/20 text-[#278bbd]">
                {count} {count === 1 ? 'materia' : 'materias'}
            </span>
        </div>

        <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-slate-300 
                    rounded-lg border border-slate-600 hover:bg-slate-700 hover:text-white 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refrescar lista de materias"
        >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refrescar</span>
        </button>
    </div>
);

export default SubjectListHeader;