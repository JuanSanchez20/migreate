import React, { useState } from 'react';
import {
    UserIcon,
    PlusIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components';
import { InfoSection } from './SubjectModalComponents';
import { LoadingState } from '@/components';
import { NotificationBanner } from '@/services';

// Subcomponente especializado para gestionar tutores asignados a materias
const TutorManagementSection = ({ tutorManagement, canManageTutors }) => {
    const {
        tutors,
        loadingTutors,
        selectedTutor,
        assignedTutor,
        loading,
        error,
        assignTutor,
        removeTutor,
        selectTutor,
        clearSelection,
        hasAssignedTutor,
        canManage
    } = tutorManagement;

    // Estado para controlar el modo de gestión
    const [managementMode, setManagementMode] = useState('view'); // 'view', 'assign', 'change'
    const [showConfirmRemove, setShowConfirmRemove] = useState(false);

    // Maneja la asignación de tutor con reseteo de estado
    const handleAssignTutor = async () => {
        if (!selectedTutor) return;
        
        const success = await assignTutor(selectedTutor.u_id);
        if (success) {
            setManagementMode('view');
            clearSelection();
        }
    };

    // Maneja la confirmación de eliminación de tutor
    const handleConfirmRemove = async () => {
        if (!assignedTutor) return;
        
        const success = await removeTutor(assignedTutor.id);
        if (success) {
            setShowConfirmRemove(false);
            setManagementMode('view');
        }
    };

    // Cancela cualquier acción en progreso
    const handleCancel = () => {
        setManagementMode('view');
        clearSelection();
        setShowConfirmRemove(false);
    };

    // Maneja la selección de tutor
    const handleTutorSelection = (tutor) => {
        selectTutor(tutor);
    };

    return (
        <InfoSection title="Gestión de Tutor" icon={UserIcon}>
            <div className="space-y-4">
                {/* Mostrar error si existe */}
                {error && (
                    <NotificationBanner
                        notification={{ message: error, type: 'error' }}
                        position="top"
                        showCloseButton={false}
                    />
                )}

                {/* Renderizar según si hay tutor asignado */}
                {hasAssignedTutor ? (
                    <AssignedTutorView
                        assignedTutor={assignedTutor}
                        managementMode={managementMode}
                        setManagementMode={setManagementMode}
                        showConfirmRemove={showConfirmRemove}
                        setShowConfirmRemove={setShowConfirmRemove}
                        handleConfirmRemove={handleConfirmRemove}
                        loading={loading}
                        canManage={canManage}
                    />
                ) : (
                    <NoTutorView
                        managementMode={managementMode}
                        setManagementMode={setManagementMode}
                        canManage={canManage}
                        loading={loading}
                    />
                )}

                {/* Selección de tutores cuando está en modo asignar */}
                {(managementMode === 'assign' || managementMode === 'change') && (
                    <TutorSelection
                        tutors={tutors}
                        loadingTutors={loadingTutors}
                        selectedTutor={selectedTutor}
                        assignedTutor={assignedTutor}
                        onTutorSelect={handleTutorSelection}
                        onAssign={handleAssignTutor}
                        onCancel={handleCancel}
                        loading={loading}
                        managementMode={managementMode}
                    />
                )}
            </div>
        </InfoSection>
    );
};

// Vista cuando hay un tutor asignado
const AssignedTutorView = ({
    assignedTutor,
    managementMode,
    setManagementMode,
    showConfirmRemove,
    setShowConfirmRemove,
    handleConfirmRemove,
    loading,
    canManage
}) => {
    return (
        <>
            {/* Información del tutor asignado */}
            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-[#278bbd]/20 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-[#278bbd]" />
                </div>
                <div className="flex-1">
                    <h5 className="text-white font-semibold text-lg">{assignedTutor.nombre}</h5>
                    <p className="text-slate-400">{assignedTutor.correo}</p>
                    <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        {assignedTutor.estadoAsignacion}
                    </span>
                </div>
            </div>

            {/* Botones de acción para tutor asignado */}
            {managementMode === 'view' && canManage && (
                <div className="flex space-x-3">
                    <Button
                        onClick={() => setShowConfirmRemove(true)}
                        variant="danger"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center space-x-2"
                    >
                        <TrashIcon className="h-4 w-4" />
                        <span>Remover</span>
                    </Button>
                </div>
            )}

            {/* Modal de confirmación para remover */}
            {showConfirmRemove && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-red-400 font-medium">¿Remover tutor asignado?</p>
                            <p className="text-red-300 text-sm mt-1">
                                Se eliminará la asignación de <strong>{assignedTutor.nombre}</strong> de esta materia.
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                        <Button
                            onClick={handleConfirmRemove}
                            variant="danger"
                            isLoading={loading}
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <CheckIcon className="h-4 w-4" />
                            <span>Confirmar</span>
                        </Button>
                        
                        <Button
                            onClick={() => setShowConfirmRemove(false)}
                            variant="ghost"
                            disabled={loading}
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <XMarkIcon className="h-4 w-4" />
                            <span>Cancelar</span>
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

// Vista cuando NO hay tutor asignado
const NoTutorView = ({ managementMode, setManagementMode, canManage, loading }) => {
    return (
        <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-slate-600/30 flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-500 mb-4">No hay tutor asignado a esta materia</p>
            
            {managementMode === 'view' && canManage && (
                <Button
                    onClick={() => setManagementMode('assign')}
                    variant="primary"
                    disabled={loading}
                    className="flex items-center space-x-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Asignar Tutor</span>
                </Button>
            )}
        </div>
    );
};

// Componente para selección de tutores
const TutorSelection = ({
    tutors,
    loadingTutors,
    selectedTutor,
    assignedTutor,
    onTutorSelect,
    onAssign,
    onCancel,
    loading,
    managementMode
}) => {
    return (
        <div className="space-y-4">
            {/* Loading de tutores */}
            {loadingTutors && (
                <LoadingState 
                    message="Cargando tutores disponibles..."
                    description="Obteniendo lista de tutores del sistema"
                    size="small"
                />
            )}

            {/* Lista de tutores disponibles */}
            {!loadingTutors && tutors.length > 0 && (
                <div className="space-y-3">
                    <p className="text-slate-300 text-sm font-medium">
                        Tutores disponibles ({tutors.length})
                    </p>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {tutors.map((tutor) => {
                            const isSelected = selectedTutor?.u_id === tutor.u_id;
                            const isCurrentTutor = assignedTutor?.id === tutor.u_id;
                            
                            return (
                                <div
                                    key={tutor.u_id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        isCurrentTutor
                                            ? 'border-gray-500 bg-gray-500/10 opacity-50 cursor-not-allowed'
                                            : isSelected
                                                ? 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                                                : 'border-slate-600 bg-slate-700/30 hover:bg-slate-600/50'
                                    }`}
                                    onClick={() => {
                                        if (!isCurrentTutor) {
                                            onTutorSelect(tutor);
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-[#278bbd]/20 flex items-center justify-center">
                                                <UserIcon className="h-5 w-5 text-[#278bbd]" />
                                            </div>

                                            <div>
                                                <p className={`font-medium ${isCurrentTutor ? 'text-gray-400' : 'text-white'}`}>
                                                    {tutor.u_name} {tutor.u_lastname}
                                                    {isCurrentTutor && <span className="ml-2 text-xs">(Actual)</span>}
                                                </p>
                                                <p className={`text-sm ${isCurrentTutor ? 'text-gray-500' : 'text-slate-400'}`}>
                                                    {tutor.u_email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Indicador de selección */}
                                        {isSelected && !isCurrentTutor && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Mensaje si no hay tutores */}
            {!loadingTutors && tutors.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No hay tutores disponibles para asignar</p>
                </div>
            )}

            {/* Botones de acción para asignación */}
            {selectedTutor && !loadingTutors && (
                <div className="flex space-x-3 pt-4 border-t border-slate-600">
                    <Button
                        onClick={onAssign}
                        isLoading={loading}
                        variant="primary"
                        className="flex-1 flex items-center justify-center space-x-2"
                    >
                        <CheckIcon className="h-4 w-4" />
                        <span>
                            {managementMode === 'change' ? 'Cambiar a' : 'Asignar'} {selectedTutor.u_name}
                        </span>
                    </Button>
                    
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center space-x-2"
                    >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancelar</span>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TutorManagementSection;