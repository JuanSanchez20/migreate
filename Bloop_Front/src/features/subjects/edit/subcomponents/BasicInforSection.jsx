import React from 'react';
import {
    BookOpenIcon,
    PencilIcon,
    CheckIcon,
    XCircleIcon,
    SunIcon,
    MoonIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components';
import { InfoSection, InfoField, StatusBadge } from './SubjectModalComponents';
import { NotificationBanner } from '@/services';

// Subcomponente para mostrar y editar información básica de la materia
const BasicInfoSection = ({ subjectInfo, subject }) => {
    const {
        isEditing,
        editForm,
        loading,
        error,
        validationErrors,
        startEditing,
        cancelEditing,
        handleFormChange,
        updateSubjectInfo,
        getCurrentData,
        hasChanges,
        canEdit
    } = subjectInfo;

    // Obtiene el icono según la jornada
    const getJourneyIcon = (journey) => {
        const icons = {
            'matutina': SunIcon,
            'nocturna': MoonIcon
        };
        return icons[journey?.toLowerCase()] || ClockIcon;
    };

    const currentData = getCurrentData();
    const JourneyIcon = getJourneyIcon(currentData.journey);

    return (
        <InfoSection title="Detalles de la Materia" icon={BookOpenIcon}>
            {/* Mostrar error si existe */}
            {error && (
                <div className="mb-4">
                    <NotificationBanner
                        notification={{ message: error, type: 'error' }}
                        position="top"
                        showCloseButton={false}
                    />
                </div>
            )}

            {isEditing ? (
                // Modo edición
                <div className="space-y-4">
                    {/* Campo: Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nombre de la Materia
                        </label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                validationErrors.name ? 'border-red-500' : 'border-slate-600'
                            }`}
                            placeholder="Ingrese el nombre de la materia"
                            maxLength={50}
                            disabled={loading}
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
                        )}
                    </div>

                    {/* Campo: Semestre */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Semestre
                        </label>
                        <select
                            value={editForm.semester}
                            onChange={(e) => handleFormChange('semester', parseInt(e.target.value))}
                            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                validationErrors.semester ? 'border-red-500' : 'border-slate-600'
                            }`}
                            disabled={loading}
                        >
                            {[1, 2, 3, 4, 5].map(sem => (
                                <option key={sem} value={sem}>{sem}° Semestre</option>
                            ))}
                        </select>
                        {validationErrors.semester && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.semester}</p>
                        )}
                    </div>

                    {/* Campo: Jornada */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Jornada
                        </label>
                        <select
                            value={editForm.journey}
                            onChange={(e) => handleFormChange('journey', e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                validationErrors.journey ? 'border-red-500' : 'border-slate-600'
                            }`}
                            disabled={loading}
                        >
                            <option value="matutina">Matutina</option>
                            <option value="nocturna">Nocturna</option>
                        </select>
                        {validationErrors.journey && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.journey}</p>
                        )}
                    </div>

                    {/* Campo: Estado */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Estado
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="state"
                                    checked={editForm.state === true}
                                    onChange={() => handleFormChange('state', true)}
                                    className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 focus:ring-green-500"
                                    disabled={loading}
                                />
                                <span className="text-green-400">Activo</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="state"
                                    checked={editForm.state === false}
                                    onChange={() => handleFormChange('state', false)}
                                    className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 focus:ring-red-500"
                                    disabled={loading}
                                />
                                <span className="text-red-400">Inactivo</span>
                            </label>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            onClick={updateSubjectInfo}
                            variant="primary"
                            isLoading={loading}
                            disabled={!hasChanges()}
                            className="flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Actualizando...</span>
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4" />
                                    <span>Guardar Cambios</span>
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={cancelEditing}
                            variant="secondary"
                            disabled={loading}
                            className="flex items-center space-x-2"
                        >
                            <XCircleIcon className="h-4 w-4" />
                            <span>Cancelar</span>
                        </Button>
                    </div>

                    {/* Mostrar si hay cambios pendientes */}
                    {hasChanges() && !loading && (
                        <div className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                            <p className="text-yellow-400 text-sm">Tienes cambios sin guardar</p>
                        </div>
                    )}
                </div>
            ) : (
                // Modo vista
                <div className="space-y-3">
                    <InfoField label="Nombre" value={subject.nombre} />
                    <InfoField label="Jornada" icon={JourneyIcon}>
                        <span className={`${currentData.journeyInfo.color} font-medium`}>
                            {subject.modalidad}
                        </span>
                    </InfoField>
                    <InfoField label="Semestre" value={`${subject.semestre}°`} />
                    <InfoField label="Estado">
                        <StatusBadge active={subject.estado} />
                    </InfoField>
                    <InfoField label="Fecha de Creación" value={
                        subject.fechaCreacion ? 
                        new Date(subject.fechaCreacion).toLocaleDateString() : 
                        'No disponible'
                    } />

                    {/* Botón de edición */}
                    {canEdit && (
                        <div className="pt-4">
                            <Button
                                onClick={startEditing}
                                variant="secondary"
                                size="sm"
                                className="flex items-center space-x-2"
                            >
                                <PencilIcon className="h-4 w-4" />
                                <span>Editar Información</span>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </InfoSection>
    );
};

export default BasicInfoSection;