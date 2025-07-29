import React from 'react';
import {
    XMarkIcon,
    SunIcon,
    MoonIcon,
    ClockIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { NotificationBanner } from '@/services';
import { useSubjectModalModule } from './hooks/useSubjectModalModule';

// Subcomponentes
import BasicInfoSection from './subcomponents/BasicInforSection';
import PEAManagementSection from './subcomponents/PEAManagementSection';
import TutorManagementSection from './subcomponents/TutorManagementSection';
import StudentAssignmentSection from './subcomponents/StudentAssignmentSection';
import StudentAssignmentModal from './subcomponents/StudentAssignmentModal';

// Componente principal del modal de materias
const SubjectModal = ({ subject, isOpen, onClose, onSubjectUpdate }) => {
    // Hook unificador que maneja toda la lógica
    const {
        // Estados del modal
        showStudentModal,

        // Funciones del modal
        closeModal,
        openStudentModal,
        closeStudentModal,

        // Hooks individuales
        subjectInfo,
        peaList,
        peaCreate,
        tutorManagement,
        studentManagement,

        // Datos calculados
        currentUser,
        availableActions,
        getPEASection,

        // Estados globales
        isLoading,
        notification,

        // Funciones globales mejoradas
        handleSubjectUpdated,
        handleStudentsAssignedFromModal,
        hideNotification
    } = useSubjectModalModule(subject, onSubjectUpdate);

    // No renderizar si el modal no está abierto
    if (!isOpen) return null;

    // Obtiene el icono según la jornada
    const getJourneyIcon = (modalidad) => {
        const icons = {
            'matutina': { icon: SunIcon, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            'nocturna': { icon: MoonIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' }
        };
        return icons[modalidad?.toLowerCase()] || { 
            icon: ClockIcon, 
            color: 'text-gray-400', 
            bg: 'bg-gray-400/10' 
        };
    };

    const jornadaInfo = getJourneyIcon(subject.modalidad);
    const JornadaIcon = jornadaInfo.icon;

    // Maneja el cierre del modal
    const handleClose = () => {
        closeModal();
        onClose();
    };

    return (
        <>
            {/* Modal principal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop con blur */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

                <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 
                                w-full max-w-6xl max-h-[90vh] overflow-hidden mx-4">

                    {/* Notificación global del modal */}
                    {notification && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-96">
                            <NotificationBanner
                                notification={notification}
                                onClose={hideNotification}
                                position="top"
                            />
                        </div>
                    )}

                    {/* Header del modal con información básica */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700">
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg ${jornadaInfo.bg} flex items-center justify-center border-2 border-opacity-30`}>
                                <JornadaIcon className={`h-6 w-6 ${jornadaInfo.color}`} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {subject.nombre}
                                </h2>
                                <p className="text-slate-400">
                                    {subject.modalidad} • {subject.semestre}° Semestre
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Botón de edición si no está editando ya */}
                            {availableActions.canEdit && !subjectInfo.isEditing && (
                                <button
                                    onClick={subjectInfo.startEditing}
                                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                    title="Editar materia"
                                    disabled={isLoading}
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                            )}

                            {/* Botón de cerrar */}
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                disabled={isLoading}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Contenido principal en grid de dos columnas */}
                    <div className="grid lg:grid-cols-2 h-[calc(90vh-80px)]">

                        {/* Columna izquierda: Información de materia y usuarios */}
                        <div className="p-6 border-r border-slate-700 overflow-y-auto space-y-6">

                            {/* Información básica de la materia */}
                            <BasicInfoSection 
                                subjectInfo={subjectInfo}
                                subject={subject}
                            />

                            {/* Gestión de tutores - Solo visible cuando NO está editando */}
                            {!subjectInfo.isEditing && availableActions.canManageTutors && (
                                <TutorManagementSection
                                    tutorManagement={tutorManagement}
                                    canManageTutors={availableActions.canManageTutors}
                                />
                            )}

                            {/* Gestión de estudiantes - Solo visible cuando NO está editando */}
                            {!subjectInfo.isEditing && availableActions.canManageStudents && (
                                <StudentAssignmentSection
                                    studentManagement={studentManagement}
                                    subject={subject}
                                    canManageStudents={availableActions.canManageStudents}
                                    onOpenStudentModal={openStudentModal}
                                />
                            )}
                        </div>

                        {/* Columna derecha: Gestión del PEA */}
                        <div className="p-6 overflow-y-auto">
                            {!subjectInfo.isEditing ? (
                                <PEAManagementSection
                                    peaList={peaList}
                                    peaCreate={peaCreate}
                                    getPEASection={getPEASection}
                                    availableActions={availableActions}
                                />
                            ) : (
                                // Mensaje informativo cuando está editando
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center text-slate-400">
                                        <PencilIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">Modo Edición Activo</p>
                                        <p className="text-sm">
                                            Complete los cambios en la información básica de la materia
                                            para acceder a las demás funcionalidades.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Overlay de carga global */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                    <span className="text-white">Procesando...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal secundario para asignación de estudiantes */}
            {showStudentModal && availableActions.canManageStudents && (
                <StudentAssignmentModal
                    subject={subject}
                    studentManagement={studentManagement}
                    onClose={closeStudentModal}
                    onAssign={handleStudentsAssignedFromModal}
                />
            )}
        </>
    );
};

export default SubjectModal;