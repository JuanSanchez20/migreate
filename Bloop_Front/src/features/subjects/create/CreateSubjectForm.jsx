// components/CreateSubjectForm.jsx
// Componente principal para el formulario de creación de materia

import React from 'react';
import { AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardContent, Button } from '@/components';
import SubjectBasicInfo from './subcomponents/SubjectBasicInfo';
import SubjectActions from './subcomponents/SubjectActions';

const CreateSubjectForm = ({
    // Datos del formulario
    formData,
    form,
    moduleState,
    
    // Funciones de manejo
    onCreateOnly,
    onGoToAssignStep,
    onReset, // Nueva prop para manejar reset
    
    // Estados de UI
    isLoading = false,
    isCompleted = false
}) => {
    
    // Obtener errores de validación actuales
    const validationErrors = form.getValidationErrors();
    
    // Obtener capacidades de acción actuales
    const capabilities = moduleState.capabilities;
    
    // Crear handlers de focus para los campos
    const focusHandlers = {
        name: form.createFocusHandlers('name'),
        semester: form.createFocusHandlers('semester'), 
        journey: form.createFocusHandlers('journey')
    };

    // Función para manejar creación de materia solamente
    const handleCreateOnly = (e) => {
        e.preventDefault();
        if (onCreateOnly) {
            onCreateOnly();
        }
    };

    return (
        <Card>
            <CardHeader
                icon={AcademicCapIcon}
                title="Crear Materia"
                description="Define los datos básicos de la materia y opcionalmente asigna un tutor"
            />

            <CardContent>
                {/* Estado completado - Simple y directo */}
                {isCompleted ? (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-green-400 mb-2">
                            Proceso completado exitosamente
                        </h2>
                        <p className="text-slate-300 mb-6 max-w-md mx-auto">
                            {moduleState.processResult?.type === 'complete_process' 
                                ? 'La materia fue creada y el tutor asignado correctamente'
                                : 'La materia fue creada exitosamente'
                            }
                        </p>
                        <Button
                            onClick={onReset}
                            variant="primary"
                            className="px-6 py-3"
                        >
                            Crear Nueva Materia
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleCreateOnly} className="space-y-6">
                        {/* Mensaje de error global del formulario */}
                        {form.error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-400">
                                    {form.error}
                                </p>
                            </div>
                        )}
                        
                        {/* Subcomponente: Información básica de la materia */}
                        <SubjectBasicInfo
                            formData={formData}
                            onChange={form.handleChange}
                            onSelectChange={form.handleSelectChange}
                            onJourneyChange={form.handleJourneyChange}
                            focusHandlers={focusHandlers}
                            errors={validationErrors}
                            disabled={moduleState.isProcessing || isCompleted}
                        />
                        
                        {/* Subcomponente: Acciones del formulario */}
                        <SubjectActions
                            // Estados de habilitación
                            canCreateOnly={capabilities.canCreateOnly}
                            canGoToAssign={capabilities.canGoToAssign}
                            
                            // Estados de carga
                            isCreatingOnly={isLoading && !moduleState.isAssignStepActive}
                            isProcessing={moduleState.isProcessing}
                            
                            // Estados del proceso
                            isAssignStepActive={false} // Siempre false en este componente
                            isCompleted={isCompleted}
                            
                            // Funciones de callback
                            onCreateOnly={handleCreateOnly}
                            onGoToAssign={onGoToAssignStep}
                            onCancelAssign={() => {}} // No aplica en este step
                            
                            className="pt-2"
                        />

                        {/* Mensaje de ayuda */}
                        {!form.canSubmit && (
                            <div className="text-center text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                💡 Completa todos los campos para habilitar las acciones
                            </div>
                        )}
                        
                        {/* Información adicional basada en el estado */}
                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 rounded-full bg-[#278bbd] mt-2 flex-shrink-0"></div>
                                <div className="text-sm text-slate-300">
                                    <p className="font-medium mb-1">Opciones disponibles:</p>
                                    <ul className="text-slate-400 space-y-1">
                                        <li>• <strong>Crear Materia:</strong> Crea la materia sin asignar tutor</li>
                                        <li>• <strong>Asignar Tutor:</strong> Continúa para seleccionar un tutor</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default CreateSubjectForm;