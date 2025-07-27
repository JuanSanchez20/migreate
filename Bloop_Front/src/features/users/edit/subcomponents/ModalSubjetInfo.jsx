import React from 'react';
import { PlusIcon, BookOpenIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components';

// Sección reutilizable para mostrar información agrupada
const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            {Icon && <Icon className="h-5 w-5 text-[#278bbd]" />}
            <span>{title}</span>
        </h4>
        {children}
    </div>
);

// Formulario para asignar nueva materia al usuario
const SubjectAssignmentForm = ({ 
    subjectsToShow, 
    selectedSubjectToAdd, 
    onSubjectSelect, 
    onAddSubject, 
    loading 
}) => (
    <InfoSection title="Asignar Nueva Materia" icon={PlusIcon}>
        <div className="space-y-3">
            <select
                value={selectedSubjectToAdd}
                onChange={(e) => onSubjectSelect(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-[#278bbd] focus:ring-2 focus:ring-[#278bbd]/50 focus:outline-none transition-all duration-200"
                disabled={loading}
            >
                <option value="">Seleccionar materia...</option>
                {subjectsToShow.map(subject => (
                    <option key={subject.id} value={subject.id}>
                        {subject.nombre} - Sem. {subject.semestre} - Jor. {subject.modalidad}
                    </option>
                ))}
            </select>
            
            <Button
                onClick={onAddSubject}
                disabled={!selectedSubjectToAdd || loading}
                variant="approved"
                size="default"
                isLoading={loading}
                className="w-full"
            >
                {loading ? 'Asignando...' : 'Asignar Materia'}
            </Button>
        </div>
    </InfoSection>
);

// Lista de materias asignadas con opción de desasignar
const AssignedSubjectsList = ({ assignedSubjects, onRemoveSubject, loading }) => {
    if (assignedSubjects.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <BookOpenIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay materias asignadas</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {assignedSubjects.map((subject) => (
                <div 
                    key={subject.id} 
                    className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg border border-slate-600/20 hover:bg-slate-600/40 transition-colors"
                >
                    <div className="flex flex-col">
                        <span className="text-slate-200 font-medium">
                            {subject.name}
                        </span>

                        {/* Información adicional de la materia */}
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-slate-500">
                                ID: {subject.id}
                            </span>
                            {subject.semester && (
                                <span className="text-xs text-slate-400 bg-slate-600/40 px-2 py-0.5 rounded">
                                    Sem. {subject.semester}
                                </span>
                            )}
                            {subject.status && (
                                <span className="text-xs text-[#278bbd] bg-[#278bbd]/10 px-2 py-0.5 rounded border border-[#278bbd]/20">
                                    {subject.status}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Botón para desasignar materia */}
                    <button
                        onClick={() => onRemoveSubject(subject)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={`Desasignar ${subject.name}`}
                        disabled={!subject.id || loading}
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};

// Componente principal para gestionar materias del usuario
const SubjectManagement = ({ 
    assignedSubjects = [], 
    subjectsToShow = [], 
    selectedSubjectToAdd = '', 
    onSubjectSelect, 
    onAddSubject, 
    onRemoveSubject, 
    loading = false 
}) => {
    // Validación de props requeridas
    if (!onSubjectSelect || !onAddSubject || !onRemoveSubject) {
        return (
            <div className="p-4 text-center text-red-400">
                <p>Error: Faltan funciones requeridas para gestionar materias</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Formulario para asignar nueva materia */}
            <SubjectAssignmentForm 
                subjectsToShow={subjectsToShow}
                selectedSubjectToAdd={selectedSubjectToAdd}
                onSubjectSelect={onSubjectSelect}
                onAddSubject={onAddSubject}
                loading={loading}
            />

            {/* Lista de materias asignadas */}
            <InfoSection 
                title={`Materias Asignadas (${assignedSubjects.length})`} 
                icon={BookOpenIcon}
            >
                <AssignedSubjectsList 
                    assignedSubjects={assignedSubjects}
                    onRemoveSubject={onRemoveSubject}
                    loading={loading}
                />
            </InfoSection>
        </div>
    );
};

export default SubjectManagement;