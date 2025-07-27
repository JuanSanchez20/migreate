import React, { useState } from 'react';
import { useAuth } from '@/contexts';
import { ProposalList, useProposalModule, ProposalModal  } from '@/features';

// Página principal de gestión de propuestas
const ProposalListPage = () => {
    const { user, isLoading: authLoading } = useAuth();

    // Para manejar qué propuesta está seleccionada
    const [selectedProposal, setSelectedProposal] = useState(null);

    // Hook unificador que maneja toda la lógica de propuestas
    const {
        // Datos principales
        proposals,

        // Estados principales
        loading,
        error,

        // Estadísticas
        stats,

        // Filtros y acciones
        filters,
        actions,

        // Estados de UI
        ui
    } = useProposalModule();

    // Solo seleccionar propuesta
    const handleProposalClick = (proposal) => {
        setSelectedProposal(proposal);
    };

    // Solo limpiar selección
    const handleCloseModal = () => {
        setSelectedProposal(null);
    };

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
                actions={{
                    ...actions,
                    select: handleProposalClick  // ← Usar nuestra función
                }}

                // Estados de UI
                ui={ui}
            />

            {/* Modal de propuesta seleccionada */}
            <ProposalModal
                selectedProposal={selectedProposal}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default ProposalListPage;