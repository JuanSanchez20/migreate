import React from 'react';
import { CardSectionTitle, Button } from '@/components';
import { CheckIcon, ExclamationCircleIcon, BookOpenIcon } from '@heroicons/react/24/solid';

export const SubjectSection = ({ 
    formData, 
    handleSelectChange, 
    catalogs, 
    catalogsLoading, 
    catalogsError, 
    reloadCatalogs,
    hasPermission 
}) => {
    // Formatea nombre de materia con jornada
    const formatSubjectName = (subject) => {
        const originalData = subject?.originalData || {};
        const subjectName = originalData.s_name || subject.label || 'Materia Desconocida';
        const journey = originalData.s_journey || 'matutina';
        const journeyCode = journey === 'nocturna' ? 'J:N' : 'J:M';
        return `${subjectName} + ${journeyCode}`;
    };

    // Verifica si materia está seleccionada
    const isSubjectSelected = (subjectValue) => {
        return formData.subject && (
            String(formData.subject) === String(subjectValue) ||
            parseInt(formData.subject) === parseInt(subjectValue)
        );
    };

    // Maneja selección de materia
    const handleSubjectSelect = (subjectId) => {
        const numericId = parseInt(subjectId);
        if (isNaN(numericId)) return;
        handleSelectChange('subject', numericId);
    };

    // Sin permisos
    if (!hasPermission) {
        return (
            <div className="p-6 rounded-xl border-2">
                <div className="flex items-center space-x-2 mb-4">
                    <BookOpenIcon className="h-6 w-6"/>
                    <CardSectionTitle>Materia del Proyecto</CardSectionTitle>
                </div>
                
                <div className="rounded-lg p-4 border-2">
                    <div className="flex items-center space-x-2">
                        <ExclamationCircleIcon className="h-5 w-5"/>
                        <span className="font-medium" style={{ color: '#48d1c1' }}>Acceso Restringido</span>
                    </div>
                    <p className="text-sm mt-2" style={{ color: 'white' }}>
                        Solo administradores y tutores pueden crear propuestas.
                    </p>
                </div>
            </div>
        );
    }

    // Cargando
    if (catalogsLoading) {
        return (
            <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#2c3844', borderColor: '#48d1c1' }}>
                <div className="flex items-center space-x-2 mb-4">
                    <BookOpenIcon className="h-6 w-6" style={{ color: '#48d1c1' }} />
                    <CardSectionTitle style={{ color: '#48d1c1' }}>Materia del Proyecto</CardSectionTitle>
                </div>
                
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mr-3" style={{ borderColor: '#48d1c1' }}></div>
                    <span style={{ color: 'white' }}>Cargando materias...</span>
                </div>
            </div>
        );
    }

    // Error
    if (catalogsError) {
        return (
            <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#2c3844', borderColor: '#48d1c1' }}>
                <div className="flex items-center space-x-2 mb-4">
                    <BookOpenIcon className="h-6 w-6" style={{ color: '#48d1c1' }} />
                    <CardSectionTitle style={{ color: '#48d1c1' }}>Materia del Proyecto</CardSectionTitle>
                </div>
                
                <div className="rounded-lg p-4 border-2" style={{ backgroundColor: '#3a4a5c', borderColor: '#ef4444' }}>
                    <div className="flex items-center space-x-2 mb-2">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                        <span className="font-medium text-red-400">Error al cargar materias</span>
                    </div>
                    <p className="text-red-300 text-sm mb-3">{catalogsError}</p>
                    <Button
                        onClick={reloadCatalogs}
                        variant="danger"
                        size="sm"
                    >
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-xl border-2">
            <div className="flex items-center space-x-2 mb-4">
                <BookOpenIcon className="h-6 w-6" style={{ color: '#48d1c1' }} />
                <CardSectionTitle style={{ color: '#48d1c1' }}>Materia del Proyecto</CardSectionTitle>
            </div>

            {catalogs?.subjects?.length === 0 ? (
                <div className="text-center py-8" style={{ color: '#48d1c1' }}>
                    No hay materias disponibles
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catalogs.subjects.map((subject) => {
                        const isSelected = isSubjectSelected(subject.value);
                        
                        return (
                            <button
                                key={subject.value}
                                type="button"
                                onClick={() => handleSubjectSelect(subject.value)}
                                className={`
                                    p-4 rounded-lg text-left transition-all duration-200 
                                    hover:scale-105 shadow-md no-underline
                                    ${isSelected 
                                        ? 'bg-teal-600 border-2 border-blue-500 text-white' 
                                        : 'bg-gray-900 border-2 border-teal-500 text-white hover:bg-gray-800 hover:border-blue-400'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-white no-underline">
                                        {formatSubjectName(subject)}
                                    </span>
                                    {isSelected && <CheckIcon className="h-4 w-4 text-white" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};