import React from 'react';
import {
    XMarkIcon,
    AcademicCapIcon,
    UserGroupIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components';
import { LoadingState } from '@/components';
import { NotificationBanner } from '@/services';

// Modal especializado para asignar estudiantes a materias
const StudentAssignmentModal = ({ 
    subject, 
    studentManagement,
    onClose, 
    onAssign // Esta función viene del hook unificador
}) => {
    const {
        studentsForCursando,
        studentsForRepitiendo,
        selectedStudents,
        loading,
        error,
        toggleStudentSelection,
        isStudentSelected,
        getTotalSelected,
        prepareAssignmentData,
        canProceedWithAssignment,
        clearAllSelections
    } = studentManagement;

    // Maneja la asignación de estudiantes seleccionados
    const handleAssignStudents = async () => {
        const assignmentData = prepareAssignmentData();
        
        // Usar la función del hook unificador que maneja todo el flujo
        const result = await onAssign(assignmentData);
        
        // El modal se cierra automáticamente desde el hook unificador si es exitoso
        // Solo manejar errores aquí si es necesario
        if (!result?.success) {
            console.error('Error en asignación:', result?.error);
        }
    };

    // Maneja el cierre del modal
    const handleClose = () => {
        clearAllSelections();
        onClose();
    };

    const totalSelected = getTotalSelected();

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
            {/* Backdrop con blur más oscuro para modal secundario */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 
                            w-full max-w-4xl max-h-[85vh] overflow-hidden mx-4">

                {/* Header del modal */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-[#48d1c1]/20 flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-[#48d1c1]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Asignar Estudiantes</h2>
                            <p className="text-slate-400">
                                {subject.nombre} • {subject.semestre}° Semestre
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        disabled={loading}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Contenido principal */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                    
                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="mb-6">
                            <NotificationBanner
                                notification={{ message: error, type: 'error' }}
                                position="top"
                                showCloseButton={false}
                            />
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <LoadingState 
                            message="Procesando asignaciones..."
                            description="Asignando estudiantes a la materia"
                            size="medium"
                        />
                    )}

                    {/* Grid de dos columnas para las listas */}
                    {!loading && (
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* Lista de estudiantes para "Cursando" */}
                            <StudentList
                                studentList={studentsForCursando}
                                category="cursando"
                                title="Para Cursar"
                                description={`Estudiantes del mismo semestre (${subject.semestre}°)`}
                                badgeColor="text-green-400"
                                selectedStudents={selectedStudents.cursando}
                                onToggleStudent={toggleStudentSelection}
                                isStudentSelected={isStudentSelected}
                            />

                            {/* Lista de estudiantes para "Repitiendo" */}
                            <StudentList
                                studentList={studentsForRepitiendo}
                                category="repitiendo"
                                title="Repitiendo"
                                description={`Estudiantes de semestres superiores al ${subject.semestre}°`}
                                badgeColor="text-orange-400"
                                selectedStudents={selectedStudents.repitiendo}
                                onToggleStudent={toggleStudentSelection}
                                isStudentSelected={isStudentSelected}
                            />
                        </div>
                    )}
                </div>

                {/* Footer con botones de acción */}
                <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/50">
                    <div className="text-sm text-slate-400">
                        {totalSelected > 0 ? (
                            <span>
                                {totalSelected} estudiante{totalSelected !== 1 ? 's' : ''} seleccionado{totalSelected !== 1 ? 's' : ''}
                            </span>
                        ) : (
                            <span>Selecciona estudiantes para asignar</span>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            onClick={handleClose}
                            variant="ghost"
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        
                        <Button
                            onClick={handleAssignStudents}
                            variant="primary"
                            isLoading={loading}
                            disabled={!canProceedWithAssignment()}
                            className="flex items-center space-x-2"
                        >
                            <PlusIcon className="h-4 w-4" />
                            <span>Asignar {totalSelected > 0 ? `(${totalSelected})` : ''}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente para renderizar una lista de estudiantes
const StudentList = ({ 
    studentList, 
    category, 
    title, 
    description, 
    badgeColor, 
    selectedStudents,
    onToggleStudent,
    isStudentSelected
}) => {
    return (
        <div className="space-y-4">
            {/* Header de la sección */}
            <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg ${badgeColor.replace('text-', 'bg-').replace('-400', '-500/20')} flex items-center justify-center`}>
                    <AcademicCapIcon className={`h-5 w-5 ${badgeColor}`} />
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-white">{title}</h4>
                    <p className="text-sm text-slate-400">{description}</p>
                </div>
                <div className="ml-auto">
                    <span className="px-2 py-1 rounded-full bg-slate-600 text-slate-300 text-xs">
                        {selectedStudents.length}/{studentList.length}
                    </span>
                </div>
            </div>

            {/* Lista de estudiantes */}
            {studentList.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {studentList.map((student) => {
                        const isSelected = isStudentSelected(student, category);
                        
                        return (
                            <div
                                key={student.u_id}
                                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                                        : 'border-slate-600 bg-slate-700/30 hover:bg-slate-600/50'
                                }`}
                                onClick={() => onToggleStudent(student, category)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {/* Avatar del estudiante */}
                                        <div className="w-8 h-8 rounded-full bg-[#48d1c1]/20 flex items-center justify-center">
                                            <AcademicCapIcon className="h-4 w-4 text-[#48d1c1]" />
                                        </div>

                                        <div>
                                            <p className="font-medium text-white">
                                                {student.u_name} {student.u_lastname}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {student.u_email}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Semestre: {student.u_semester || 'N/A'}
                                                {category === 'cursando' && (
                                                    <span className="ml-2">
                                                        • Cursando: {student.cursando_count || 0}/2
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Indicador de selección */}
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        isSelected 
                                            ? 'bg-blue-500 border-blue-500' 
                                            : 'border-slate-400'
                                    }`}>
                                        {isSelected && (
                                            <CheckIcon className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <UserGroupIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No hay estudiantes disponibles en esta categoría</p>
                </div>
            )}
        </div>
    );
};

export default StudentAssignmentModal;