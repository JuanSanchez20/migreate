import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Subcomponente para filtros de búsqueda y materia
const ProposalsFiltersSection = ({
    // Props para búsqueda
    searchTerm,
    onSearchChange,
    onSearchClear,

    // Props para filtro de materias
    selectedSubject,
    availableSubjects,
    onSubjectChange,
    onSubjectClear,

    // Estados
    loading = false
}) => {

    return (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">

                {/* Input de búsqueda */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Buscar propuestas
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por título..."
                            value={searchTerm || ''}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            disabled={loading}
                            className="block w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 
                                    rounded-lg text-white placeholder-gray-400 
                                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all duration-200"
                        />
                        {searchTerm && !loading && (
                            <button
                                onClick={onSearchClear}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center
                                        text-gray-400 hover:text-gray-200 transition-colors duration-200"
                                title="Limpiar búsqueda"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ✅ CORREGIDO: Select de materias */}
                <div className="flex-1 sm:max-w-xs">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Filtrar por materia
                    </label>
                    <div className="relative">
                        <select
                            value={selectedSubject || 'todas'} // ✅ Simplificado
                            onChange={(e) => {
                                const value = e.target.value;

                                if (value === 'todas') {
                                    onSubjectChange?.(null);
                                } else {
                                    // ✅ Simplificado: convertir directamente a número
                                    const numericId = parseInt(value);
                                    onSubjectChange?.(numericId);
                                }
                            }}
                            disabled={loading || !availableSubjects || availableSubjects.length === 0}
                            className="block w-full py-3 px-4 bg-gray-700 border border-gray-600 
                                rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                                appearance-none cursor-pointer"
                        >
                            <option key="option-todas" value="todas">
                                Todas las materias
                            </option>
                            {availableSubjects?.length > 0 ? (
                                availableSubjects.map((subject) => (
                                    <option
                                        key={`option-${subject.id}`}
                                        value={subject.id} // ✅ Usar ID directamente
                                    >
                                        {subject.name}
                                    </option>
                                ))
                            ) : (
                                <option key="option-no-subjects" disabled>
                                    No hay materias disponibles
                                </option>
                            )}
                        </select>

                        {/* Icono de dropdown */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Botón para limpiar filtro de materia */}
                        {selectedSubject && !loading && (
                            <button
                                onClick={onSubjectClear}
                                className="absolute inset-y-0 right-8 flex items-center
                                        text-gray-400 hover:text-gray-200 transition-colors duration-200"
                                title="Mostrar todas las materias"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* Indicadores de filtros activos */}
            {(searchTerm || selectedSubject) && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {searchTerm && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                    bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Búsqueda: "{searchTerm}"
                            <button
                                onClick={onSearchClear}
                                className="ml-2 text-teal-400 hover:text-teal-200"
                            >
                                <XMarkIcon className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {selectedSubject && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                        bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {/* ✅ MEJORADO: Mostrar nombre de la materia seleccionada */}
                            Materia: {availableSubjects?.find(s => s.id === selectedSubject)?.name || 'Desconocida'}
                            <button
                                onClick={onSubjectClear}
                                className="ml-2 text-blue-400 hover:text-blue-200"
                            >
                                <XMarkIcon className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Estado de carga */}
            {loading && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-teal-500"></div>
                    <span>Aplicando filtros...</span>
                </div>
            )}

        </div>
    );
};

export default ProposalsFiltersSection;