import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjectModule, SubjectList } from '@/features';

// Página principal de gestión de materias
const SubjectListPage = () => {
    // Obtener usuario actual del context
    const { user: currentUser } = useAuth();

    // Hook unificador que maneja toda la lógica
    const {
        // Estados principales
        groupedSubjects,
        loading,
        error,

        // Estados de filtros
        filters,
        hasActiveFilters,
        showStatusFilter,
        activeFilters,

        // Funciones de datos
        refresh,

        // Funciones de filtros
        updateFilters,
        clearFilters,

        // Estadísticas
        stats
    } = useSubjectModule(currentUser);

    // Handler para click en tarjeta (placeholder para futuras funcionalidades)
    const handleCardClick = (subject) => {
        console.log('Clicked subject:', subject);
        // Aquí se podría abrir modal, navegar a detalle, etc.
    };

    return (
        <div className="min-h-screen flex items-start justify-center p-4 pt-10 w-full">
            <div className="w-full max-w-7xl">
                <div className="space-y-6">
                    {/* Componente principal que organiza todo */}
                    <SubjectList
                        // Estados de datos
                        groupedSubjects={groupedSubjects}
                        loading={loading}
                        error={error}

                        // Estados de filtros
                        filters={filters}
                        showStatusFilter={showStatusFilter}
                        activeFilters={activeFilters}
                        hasActiveFilters={hasActiveFilters}

                        // Funciones de filtros
                        onFiltersChange={updateFilters}
                        onClearFilters={clearFilters}

                        // Funciones de datos
                        onRefresh={refresh}
                        onCardClick={handleCardClick}

                        // Estadísticas
                        stats={stats}
                    />
                </div>

                {/* Footer informativo */}
                <div className="mt-12 pt-8 border-t border-slate-700/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
                        <div className="mb-4 sm:mb-0">
                            <p>Sistema de Gestión de Materias - Administración</p>
                            <p>Filtra, busca y gestiona materias del sistema académico</p>
                        </div>

                        {/* Indicadores de filtros activos en footer */}
                        <div className="flex items-center space-x-4">
                            {activeFilters.map((filter) => (
                                <span
                                    key={filter.key}
                                    className={`px-2 py-1 rounded text-xs ${filter.color}`}
                                >
                                    {filter.label} activo
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectListPage;