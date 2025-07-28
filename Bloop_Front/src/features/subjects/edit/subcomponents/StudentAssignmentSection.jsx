import React from 'react';
import {
    AcademicCapIcon,
    UserGroupIcon,
    PlusIcon,
    HashtagIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { InfoSection, InfoField } from './SubjectModalComponents';
import { EmptyState, LoadingState, Button } from '@/components';

// Subcomponente para gestionar estudiantes asignados
const StudentAssignmentSection = ({ 
    studentManagement, 
    subject, 
    canManageStudents, 
    onOpenStudentModal 
}) => {
    const {
        assignedStudents,
        loadingStudents,
        hasAssignedStudents,
        getStudentStats,
        canManage
    } = studentManagement;

    const stats = getStudentStats();

    return (
        <InfoSection 
            title={`Estudiantes Asignados (${assignedStudents.length})`} 
            icon={AcademicCapIcon}
        >
            {/* Header con información estadística */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <HashtagIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400">Total:</span>
                        <span className="text-white font-medium">{stats.currentlyAssigned}</span>
                    </div>
                    {stats.currentlyAssigned > 0 && (
                        <div className="text-slate-500">
                            Semestre {subject.semestre}°
                        </div>
                    )}
                </div>

                {/* Botón para asignar más estudiantes */}
                {canManageStudents && (
                    <Button
                        onClick={onOpenStudentModal}
                        variant="primary"
                        size="sm"
                        disabled={loadingStudents}
                        className="flex items-center space-x-1"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Asignar</span>
                    </Button>
                )}
            </div>

            {/* Información sobre criterios de asignación */}
            {canManageStudents && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                        <InformationCircleIcon className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="text-blue-400 font-medium mb-1">Criterios de Asignación:</p>
                            <ul className="text-blue-300 space-y-1 text-xs">
                                <li>• <strong>Cursando:</strong> Estudiantes del {subject.semestre}° semestre (máximo 2 materias)</li>
                                <li>• <strong>Repitiendo:</strong> Estudiantes de semestres superiores al {subject.semestre}°</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading de estudiantes */}
            {loadingStudents && (
                <LoadingState 
                    message="Cargando estudiantes..."
                    description="Obteniendo lista de estudiantes asignados"
                    size="small"
                />
            )}

            {/* Lista de estudiantes asignados */}
            {!loadingStudents && hasAssignedStudents && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {assignedStudents.map((student) => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
            )}

            {/* Estado vacío */}
            {!loadingStudents && !hasAssignedStudents && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-slate-400/10 flex items-center justify-center mx-auto mb-4">
                        <UserGroupIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                        No hay estudiantes inscritos
                    </h3>
                    <p className="text-slate-400 mb-4">
                        Esta materia aún no tiene estudiantes asignados
                    </p>
                    
                    {canManageStudents && (
                        <Button
                            onClick={onOpenStudentModal}
                            variant="secondary"
                            size="sm"
                            disabled={loadingStudents}
                            className="flex items-center space-x-2"
                        >
                            <PlusIcon className="h-4 w-4" />
                            <span>Asignar Estudiantes</span>
                        </Button>
                    )}
                </div>
            )}

            {/* Mensaje si no puede gestionar estudiantes */}
            {!canManage && !hasAssignedStudents && (
                <EmptyState
                    type="default"
                    customTitle="Sin estudiantes asignados"
                    customDescription="No hay estudiantes registrados en esta materia"
                    customIcon={UserGroupIcon}
                />
            )}
        </InfoSection>
    );
};

// Componente para mostrar tarjeta individual de estudiante
const StudentCard = ({ student }) => {
    // Determina el color del badge según el estado
    const getStateBadgeClass = (estado) => {
        const stateClasses = {
            'Cursando': 'bg-green-500/10 text-green-400 border-green-500/20',
            'Repitiendo': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            'Aprobado': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        };
        return stateClasses[estado] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <div className="flex items-center space-x-3 p-3 bg-slate-600/30 rounded-lg border border-slate-600/50 hover:bg-slate-600/40 transition-colors">
            {/* Avatar del estudiante */}
            <div className="w-10 h-10 rounded-full bg-[#48d1c1]/20 flex items-center justify-center flex-shrink-0">
                <AcademicCapIcon className="h-5 w-5 text-[#48d1c1]" />
            </div>

            {/* Información del estudiante */}
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                    {student.nombre}
                </p>
                <p className="text-slate-400 text-xs truncate">
                    {student.correo}
                </p>
            </div>

            {/* Badge de estado */}
            <span className={`px-2 py-1 rounded text-xs border font-medium flex-shrink-0 ${
                getStateBadgeClass(student.estadoAsignacion)
            }`}>
                {student.estadoAsignacion}
            </span>
        </div>
    );
};

export default StudentAssignmentSection;