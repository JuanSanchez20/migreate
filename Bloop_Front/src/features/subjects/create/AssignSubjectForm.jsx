import React from 'react';
import { AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardContent, CardSectionTitle, Button } from '@/components';
import SubjectListTutor from './subcomponents/SubjectListTutor';
import SubjectTutorSelected from './subcomponents/SubjectTutorSelected';

// Componente principal para el formulario de asignación de tutores
const AssignSubjectsForm = ({
    // Datos del módulo desde useCreateSubjectModule
    moduleState,
    actions,

    // Estados específicos de tutores
    tutors: {
        tutorsList,
        selectedTutor,
        selectTutor,
        clearSelection,
        loading: tutorsLoading,
        error: tutorsError,
        reloadTutors
    },

    // Personalización
    className = ''
}) => {

    console.log('AssignSubjectsForm Debug:', {
        moduleState,
        hasModuleState: !!moduleState,
        formData: moduleState?.formData,
        capabilities: moduleState?.capabilities
    });

    // VALIDACIONES DEFENSIVAS MEJORADAS
    
    // Validar que moduleState existe
    if (!moduleState) {
        console.error('AssignSubjectsForm: moduleState es undefined');
        return (
            <Card className={className}>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-red-400">Error de configuración del módulo</p>
                        <p className="text-sm text-slate-400 mt-2">moduleState no está disponible</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Validar que actions existe
    if (!actions) {
        console.error('AssignSubjectsForm: actions es undefined');
        return (
            <Card className={className}>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-red-400">Error de configuración de acciones</p>
                        <p className="text-sm text-slate-400 mt-2">Las acciones no están disponibles</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Validar que tutors existe
    if (!tutorsList || !selectTutor || !clearSelection) {
        console.error('AssignSubjectsForm: tutors configuration es inválida');
        return (
            <Card className={className}>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-red-400">Error de configuración de tutores</p>
                        <p className="text-sm text-slate-400 mt-2">La configuración de tutores no está disponible</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // EXTRACCIÓN SEGURA DE DATOS

    // Obtener capacidades de acción con valores por defecto
    const capabilities = moduleState.capabilities || {
        canCreateWithTutor: false,
        canCancelAssignment: false
    };
    
    // Obtener datos del formulario con validación completa
    const formData = moduleState.formData || {
        name: '',
        semester: '',
        journey: '',
        tutor: null
    };

    // Validar que formData tiene las propiedades mínimas requeridas
    const safeFormData = {
        name: formData.name || 'Nueva Materia',
        semester: formData.semester || 'Semestre no definido',
        journey: formData.journey || 'Jornada no definida',
        tutor: formData.tutor || null
    };

    // Estados del proceso con valores por defecto
    const processState = {
        isProcessing: moduleState.isProcessing || false,
        isCompleted: moduleState.isCompleted || false,
        hasError: moduleState.hasError || false
    };

    // Funciones de acción con validación
    const safeActions = {
        cancelAssignment: actions.cancelAssignment || (() => console.warn('cancelAssignment no disponible')),
        createWithTutor: actions.createWithTutor || (() => console.warn('createWithTutor no disponible'))
    };

    return (
        <Card className={className}>
            <CardHeader
                icon={AcademicCapIcon}
                title="Asignar Tutor"
                description={`Selecciona un tutor para la materia "${formData.name || 'Nueva Materia'}"`}
            />

            <CardContent>
                {/* Navegación: Botón para volver al paso anterior */}
                <div className="flex items-center space-x-3 mb-6">
                    <Button
                        onClick={actions.cancelAssignment}
                        disabled={moduleState.isProcessing}
                        variant="secondary"
                        icon={ArrowLeftIcon}
                        className="text-sm"
                    >
                        Volver a información básica
                    </Button>
                </div>

                {/* Información de la materia */}
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#278bbd]/10 flex items-center justify-center">
                            <AcademicCapIcon className="h-5 w-5 text-[#278bbd]" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-200">{formData.name || 'Nueva Materia'}</h3>
                            <p className="text-sm text-slate-400">
                                {formData.semester ? `${formData.semester}° Semestre` : 'Semestre no definido'} • {formData.journey || 'Jornada no definida'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Información del progreso */}
                <div className="mb-6 p-3 bg-[#278bbd]/10 border border-[#278bbd]/30 rounded-lg">
                    <p className="text-sm text-[#278bbd]">
                        <strong>Paso 2 de 2:</strong> Selecciona un tutor para asignar a la nueva materia
                    </p>
                </div>

                {/* Error global de tutores */}
                {tutorsError && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">
                            {tutorsError}
                        </p>
                        {reloadTutors && (
                            <button
                                onClick={reloadTutors}
                                className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
                            >
                                Intentar de nuevo
                            </button>
                        )}
                    </div>
                )}

                {/* Layout en dos columnas para desktop, una columna para móvil */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    
                    {/* Columna izquierda: Lista de tutores */}
                    <div className="space-y-4">
                        <CardSectionTitle>Seleccionar Tutor</CardSectionTitle>
                        
                        <SubjectListTutor
                            tutors={tutorsList || []}
                            selectedTutorId={selectedTutor?.u_id}
                            loading={tutorsLoading}
                            error={tutorsError}
                            onTutorSelect={selectTutor}
                            onRetry={reloadTutors}
                            maxHeight="400px"
                        />
                    </div>

                    {/* Columna derecha: Tutor seleccionado */}
                    <div className="space-y-4">
                        <CardSectionTitle>Confirmación</CardSectionTitle>
                        
                        {/* Tutor seleccionado */}
                        {selectedTutor ? (
                            <SubjectTutorSelected
                                selectedTutor={selectedTutor}
                                canCreateWithTutor={capabilities.canCreateWithTutor}
                                isProcessing={moduleState.isProcessing}
                                onCreateWithTutor={actions.createWithTutor}
                                onClearSelection={clearSelection}
                                showActions={false}
                                showClearButton={true}
                            />
                        ) : (
                            /* Estado cuando no hay tutor seleccionado */
                            <div className="p-6 border-2 border-dashed border-slate-600 rounded-lg text-center">
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-slate-700/50 rounded-full 
                                                  flex items-center justify-center mx-auto">
                                        <span className="text-slate-500 text-lg">👤</span>
                                    </div>
                                    <h4 className="text-slate-400 font-medium">
                                        No hay tutor seleccionado
                                    </h4>
                                    <p className="text-sm text-slate-500">
                                        Selecciona un tutor de la lista para continuar
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-3 pt-4 border-t border-slate-700">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={actions.cancelAssignment}
                        disabled={moduleState.isProcessing}
                        className="flex-1 h-12"
                        icon={ArrowLeftIcon}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={actions.createWithTutor}
                        disabled={moduleState.isProcessing || !selectedTutor}
                        isLoading={moduleState.isProcessing}
                        loadingText="Creando y asignando..."
                        className="flex-1 h-12"
                    >
                        {!selectedTutor 
                            ? "Selecciona un tutor" 
                            : "Crear Materia y Asignar Tutor"
                        }
                    </Button>
                </div>

                {/* Información adicional del proceso */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                        <div className="text-sm text-slate-300">
                            <p className="font-medium mb-2">¿Qué sucede al continuar?</p>
                            <ul className="text-slate-400 space-y-1">
                                <li>• Se creará la materia con la información proporcionada</li>
                                <li>• Se asignará automáticamente el tutor seleccionado</li>
                                <li>• El tutor recibirá acceso a la materia en el sistema</li>
                                <li>• El proceso se completará y podrás crear otra materia</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AssignSubjectsForm;