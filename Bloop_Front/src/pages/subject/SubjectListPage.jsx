import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjectModule, SubjectList, SubjectModal } from '@/features';

// Página principal de gestión de materias
const SubjectListPage = () => {
    // Obtener usuario actual del context
    const { user: currentUser } = useAuth();

    // Estados para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

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

    // Handler para click en tarjeta - Abre el modal
    const handleCardClick = (subject) => {
        console.log('Opening modal for subject:', subject);
        setSelectedSubject(subject);
        setIsModalOpen(true);
    };

    // Handler para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubject(null);
    };

    // Handler para cuando se actualiza una materia desde el modal
    const handleSubjectUpdate = async () => {
        console.log('Subject updated, refreshing list...');

        // Refrescar la lista y esperar
        await refresh();

        // Actualizar selectedSubject con datos frescos
        setTimeout(() => {
            if (selectedSubject && groupedSubjects) {
                const allSubjects = [
                    ...(groupedSubjects.matutina || []),
                    ...(groupedSubjects.nocturna || [])
                ];

                const updatedSubject = allSubjects.find(s => s.id === selectedSubject.id);
                if (updatedSubject) {
                    setSelectedSubject(updatedSubject);
                }
            }
        }, 100);
    };

    return (
        <>
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
                            onCardClick={handleCardClick} // ← Función actualizada para abrir modal

                            // Estadísticas
                            stats={stats}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de gestión de materia */}
            {selectedSubject && (
                <SubjectModal
                    subject={selectedSubject}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubjectUpdate={handleSubjectUpdate}
                />
            )}
        </>
    );
};

export default SubjectListPage;