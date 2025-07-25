import React from 'react';
import { useAuth } from '@/contexts';
import { ProposalList, useProposalModule } from '@/features';
// ✅ REMOVIDO: import { useSubjectList } from '@/features';

// Página principal de gestión de propuestas
const ProposalListPage = () => {
    const { user, isLoading: authLoading } = useAuth();

    // Hook unificador que maneja toda la lógica de propuestas
    const {
        // Datos principales
        proposals,
        selectedProposal,

        // Estados principales
        loading,
        error,
        hasData,
        isEmpty,

        // Estadísticas
        stats,

        // Filtros y acciones
        filters,
        actions,

        // Estados de UI
        ui
    } = useProposalModule();

    // ✅ REMOVIDO: Hook para materias (ya se obtienen desde useProposalModule)
    // const subjectsData = useSubjectList();

    // Estado de carga de autenticación
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-teal-500 mx-auto"></div>
                    <p className="text-gray-300">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Estado de usuario no autenticado
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <h1 className="text-2xl font-bold text-white">Acceso Requerido</h1>
                    <p className="text-gray-400">
                        Debes iniciar sesión para acceder a la gestión de propuestas.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Contenedor principal de propuestas */}
            <ProposalList
                // Datos principales
                proposals={proposals}
                stats={stats}
                // ✅ CORREGIDO: Usar las materias del useProposalModule
                availableSubjects={filters.subject.available}

                // Estados
                loading={loading}
                error={error}

                // Filtros
                filters={filters}

                // Acciones
                actions={actions}

                // Estados de UI
                ui={ui}
            />

            {/* Modal de propuesta seleccionada */}
            {selectedProposal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-white">
                                {selectedProposal.pp_name || 'Detalles de la Propuesta'}
                            </h2>
                            <button
                                onClick={actions.clearSelection}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4 text-gray-300">
                            <div>
                                <strong className="text-white">Descripción:</strong>
                                <p className="mt-1">{selectedProposal.pp_description || 'Sin descripción'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong className="text-white">Autor:</strong>
                                    <p>{selectedProposal.autor_nombre || 'Desconocido'}</p>
                                </div>
                                <div>
                                    <strong className="text-white">Tipo:</strong>
                                    <p>{selectedProposal.tipo_proyecto || 'Sin tipo'}</p>
                                </div>
                                <div>
                                    <strong className="text-white">Dificultad:</strong>
                                    <p>{selectedProposal.pp_difficulty_level || 'Sin especificar'}</p>
                                </div>
                                <div>
                                    <strong className="text-white">Fecha límite:</strong>
                                    <p>{selectedProposal.pp_date_limit || 'Sin fecha'}</p>
                                </div>
                            </div>

                            <div>
                                <strong className="text-white">Materia:</strong>
                                <p>{selectedProposal.materia_nombre || 'Sin materia'}</p>
                            </div>

                            <div>
                                <strong className="text-white">Modalidad:</strong>
                                <p>{selectedProposal.pp_grupal ? 'Grupal' : 'Individual'}</p>
                                {selectedProposal.pp_grupal && selectedProposal.pp_max_integrantes && (
                                    <p className="text-sm text-gray-400">
                                        Máximo {selectedProposal.pp_max_integrantes} integrantes
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={actions.clearSelection}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalListPage;