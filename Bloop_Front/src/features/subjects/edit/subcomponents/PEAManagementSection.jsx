// src/features/subjects/subcomponents/PEAManagementSection.jsx

import React from 'react';
import {
    DocumentArrowUpIcon,
    DocumentTextIcon,
    EyeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    CloudArrowUpIcon,
    BookOpenIcon,
    CalendarIcon,
    HashtagIcon,
    LightBulbIcon,
    PlusIcon,
    ArrowUpTrayIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { InfoSection, InfoField } from './SubjectModalComponents';
import { LoadingState, EmptyState, Button } from '@/components';
import { NotificationBanner } from '@/services';

// Subcomponente para gestionar toda la funcionalidad del PEA
const PEAManagementSection = ({ peaList, peaCreate, getPEASection, availableActions }) => {
    const peaSection = getPEASection();

    // Renderiza según el tipo de sección determinado
    switch (peaSection.type) {
        case 'hidden':
            return null;

        case 'display':
            return <PEADisplaySection 
                peaData={peaSection.data} 
                viewLevel={peaSection.viewLevel}
                refreshPEA={peaList.refreshPEA}
            />;

        case 'create':
            return <PEACreateSection 
                peaCreate={peaCreate}
                canCreate={peaSection.canCreate}
            />;

        case 'no_pea_student':
            return <NoPEAStudentSection />;

        case 'loading':
        default:
            return <PEALoadingSection loading={peaList.loading} error={peaList.error} />;
    }
};

// Sección para mostrar PEA existente
const PEADisplaySection = ({ peaData, viewLevel, refreshPEA }) => {
    return (
        <InfoSection title="Plan de Enseñanza-Aprendizaje" icon={DocumentTextIcon}>
            <div className="space-y-4">
                {/* Información básica del PEA */}
                <div className="grid grid-cols-2 gap-4">
                    <InfoField label="ID del PEA" value={`#${peaData.id}`} />
                    <InfoField label="Fecha de Creación" icon={CalendarIcon} value={
                        peaData.dateCreated ? 
                        new Date(peaData.dateCreated).toLocaleDateString() : 
                        'No disponible'
                    } />
                </div>

                {/* Estadísticas */}
                {peaData.totalConcepts && (
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Total Conceptos" icon={HashtagIcon} value={peaData.totalConcepts} />
                        <InfoField label="Unidades" icon={BookOpenIcon} value={peaData.totalUnits || 0} />
                    </div>
                )}

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Descripción:</label>
                    <div className="p-3 bg-slate-600/30 rounded-lg border border-slate-600/50">
                        <p className="text-white text-sm leading-relaxed">
                            {peaData.description || 'No disponible'}
                        </p>
                    </div>
                </div>

                {/* Objetivo */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Objetivo General:</label>
                    <div className="p-3 bg-slate-600/30 rounded-lg border border-slate-600/50">
                        <p className="text-white text-sm leading-relaxed">
                            {peaData.objective || 'No disponible'}
                        </p>
                    </div>
                </div>

                {/* Conceptos por unidad */}
                {peaData.conceptsByUnit && peaData.conceptsByUnit.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Conceptos Clave por Unidad:</label>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {peaData.conceptsByUnit.map((unit, index) => (
                                <div key={index} className="bg-slate-600/30 p-3 rounded-lg border border-slate-600/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-medium text-white flex items-center space-x-2">
                                            <BookOpenIcon className="h-4 w-4 text-[#278bbd]" />
                                            <span>Unidad {unit.unit}</span>
                                        </h5>
                                        <span className="text-xs px-2 py-1 bg-[#278bbd]/20 text-[#278bbd] rounded">
                                            {unit.concepts?.length || 0} conceptos
                                        </span>
                                    </div>
                                    {unit.concepts && unit.concepts.length > 0 && (
                                        <div className="space-y-1">
                                            {unit.concepts.map((concept, conceptIndex) => (
                                                <div key={conceptIndex} className="flex items-start space-x-2">
                                                    <LightBulbIcon className="h-3 w-3 text-yellow-400 mt-1 flex-shrink-0" />
                                                    <p className="text-slate-300 text-xs leading-relaxed">
                                                        {concept.name || concept}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botón de actualizar para admin/tutor */}
                {viewLevel === 'full' && (
                    <div className="pt-4 border-t border-slate-600">
                        <Button
                            onClick={refreshPEA}
                            variant="secondary"
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <EyeIcon className="h-4 w-4" />
                            <span>Actualizar PEA</span>
                        </Button>
                    </div>
                )}
            </div>
        </InfoSection>
    );
};

// Sección para crear nuevo PEA
const PEACreateSection = ({ peaCreate, canCreate }) => {
    const {
        createState,
        flaskStatus,
        loading,
        error,
        fileInputRef,
        startUpload,
        handleFileSelected,
        createPEA,
        rejectPEA,
        resetState,
        isUploading,
        isReviewing,
        isCreating,
        isCompleted,
        isEmpty
    } = peaCreate;

    return (
        <InfoSection title="Plan de Enseñanza-Aprendizaje" icon={DocumentArrowUpIcon}>
            <div className="space-y-4">
                {/* Mostrar error si existe */}
                {error && (
                    <NotificationBanner
                        notification={{ message: error, type: 'error' }}
                        position="top"
                        showCloseButton={false}
                    />
                )}

                {/* Estado vacío - Permite subir archivo */}
                {isEmpty && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                            <CloudArrowUpIcon className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            No hay PEA registrado
                        </h3>
                        <p className="text-slate-400 mb-6">
                            {canCreate ? 
                                'Sube un archivo PDF para crear el PEA de esta materia' :
                                'No tienes permisos para crear PEA'
                            }
                        </p>
                        
                        {/* Estado de Flask */}
                        <div className="mb-4">
                            {flaskStatus.isChecking ? (
                                <p className="text-sm text-yellow-400">Verificando conexión con Flask...</p>
                            ) : flaskStatus.isHealthy ? (
                                <p className="text-sm text-green-400 flex items-center justify-center space-x-1">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    <span>API Flask disponible</span>
                                </p>
                            ) : (
                                <p className="text-sm text-red-400 flex items-center justify-center space-x-1">
                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                    <span>API Flask no disponible</span>
                                </p>
                            )}
                        </div>

                        {canCreate && (
                            <Button
                                onClick={startUpload}
                                variant="primary"
                                disabled={!flaskStatus.isHealthy || loading}
                                className="flex items-center space-x-2"
                            >
                                <ArrowUpTrayIcon className="h-4 w-4" />
                                <span>Subir PDF del PEA</span>
                            </Button>
                        )}
                        
                        {/* Input oculto para archivos */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                    </div>
                )}

                {/* Estado subiendo */}
                {isUploading && (
                    <div className="text-center py-8">
                        <LoadingState 
                            message="Procesando archivo PDF..."
                            description="Extrayendo información del PEA"
                            size="medium"
                        />
                    </div>
                )}

                {/* Estado revisando */}
                {isReviewing && createState.extractedData && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-white">Revisar Datos Extraídos</h4>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={createPEA}
                                    variant="primary"
                                    size="sm"
                                    disabled={isCreating}
                                    className="flex items-center space-x-2"
                                >
                                    <CheckCircleIcon className="h-4 w-4" />
                                    <span>Crear PEA</span>
                                </Button>
                                <Button
                                    onClick={rejectPEA}
                                    variant="secondary"
                                    size="sm"
                                    disabled={isCreating}
                                    className="flex items-center space-x-2"
                                >
                                    <XCircleIcon className="h-4 w-4" />
                                    <span>Rechazar</span>
                                </Button>
                            </div>
                        </div>

                        {/* Advertencias si existen */}
                        {createState.validations?.warnings?.length > 0 && (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                    <ExclamationTriangleIcon className="h-4 w-4 text-orange-400" />
                                    <span className="text-orange-400 font-medium text-sm">
                                        Advertencias encontradas:
                                    </span>
                                </div>
                                <ul className="text-orange-300 text-xs space-y-1">
                                    {createState.validations.warnings.map((warning, index) => (
                                        <li key={index}>• {warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Preview de datos extraídos */}
                        <div className="bg-slate-600/30 rounded-lg p-4 space-y-3">
                            <h5 className="font-medium text-white">Información Extraída:</h5>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">Asignatura:</span>
                                    <p className="text-white">{createState.extractedData.informacionGeneral?.asignatura || 'No disponible'}</p>
                                </div>
                                <div>
                                    <span className="text-slate-400">Total Unidades:</span>
                                    <p className="text-white">{createState.extractedData.estadisticas?.totalUnidades || 0}</p>
                                </div>
                            </div>
                            
                            <div>
                                <span className="text-slate-400 text-sm">Descripción:</span>
                                <p className="text-white text-sm mt-1 line-clamp-3">
                                    {createState.extractedData.contenidoAcademico?.descripcion || 'No disponible'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estado creando */}
                {isCreating && (
                    <div className="text-center py-8">
                        <LoadingState 
                            message="Creando PEA..."
                            description="Guardando información en la base de datos"
                            size="medium"
                        />
                    </div>
                )}

                {/* Estado completado */}
                {isCompleted && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-400 mb-2">
                            PEA Creado Exitosamente
                        </h3>
                        <p className="text-slate-400 mb-6">
                            El PEA ha sido procesado y guardado correctamente
                        </p>
                        <Button
                            onClick={resetState}
                            variant="secondary"
                            size="sm"
                        >
                            Continuar
                        </Button>
                    </div>
                )}
            </div>
        </InfoSection>
    );
};

// Sección para estudiantes sin PEA
const NoPEAStudentSection = () => {
    return (
        <InfoSection title="Plan de Enseñanza-Aprendizaje" icon={DocumentTextIcon}>
            <EmptyState
                type="default"
                customTitle="No hay PEA disponible"
                customDescription="El tutor aún no ha registrado el Plan de Enseñanza-Aprendizaje para esta materia"
                customIcon={DocumentTextIcon}
            />
        </InfoSection>
    );
};

// Sección de carga
const PEALoadingSection = ({ loading, error }) => {
    if (error) {
        return (
            <InfoSection title="Plan de Enseñanza-Aprendizaje" icon={DocumentTextIcon}>
                <div className="text-center py-8">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 mb-4">{error}</p>
                </div>
            </InfoSection>
        );
    }

    if (loading) {
        return (
            <InfoSection title="Plan de Enseñanza-Aprendizaje" icon={DocumentTextIcon}>
                <LoadingState 
                    message="Cargando PEA..."
                    description="Obteniendo información del Plan de Enseñanza-Aprendizaje"
                    size="medium"
                />
            </InfoSection>
        );
    }

    return null;
};

export default PEAManagementSection;