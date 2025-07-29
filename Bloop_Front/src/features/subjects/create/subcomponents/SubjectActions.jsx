import React from 'react';
import { Button } from '@/components';

// Subcomponente que maneja los botones de acción para crear materia o asignar tutor
const SubjectActions = ({
    // Estados de habilitación
    canCreateOnly = false,
    canGoToAssign = false,

    // Estados de carga
    isCreatingOnly = false,
    isProcessing = false,

    // Estados del proceso
    isAssignStepActive = false,
    isCompleted = false,

    // Funciones de callback
    onCreateOnly,
    onGoToAssign,
    onCancelAssign,

    // Personalización
    className = ''
}) => {
    // Si el proceso está completado, no mostrar botones
    if (isCompleted) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Botones del paso de creación */}
            {!isAssignStepActive && (
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Botón: Crear materia solamente */}
                    <Button
                        variant="secondary"
                        onClick={onCreateOnly}
                        disabled={!canCreateOnly || isProcessing}
                        loading={isCreatingOnly}
                        loadingText="Creando materia..."
                        className="flex-1"
                    >
                        Crear Materia
                    </Button>

                    {/* Botón: Asignar tutor */}
                    <Button
                        variant="primary"
                        onClick={onGoToAssign}
                        disabled={!canGoToAssign || isProcessing}
                        className="flex-1"
                    >
                        Asignar Tutor
                    </Button>
                </div>
            )}

            {/* Botones del paso de asignación */}
            {isAssignStepActive && (
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Botón: Cancelar asignación */}
                    <Button
                        variant="secondary"
                        onClick={onCancelAssign}
                        disabled={isProcessing}
                        className="flex-1 sm:flex-initial"
                    >
                        Cancelar
                    </Button>
                </div>
            )}

            {/* Texto informativo basado en el estado */}
            <div className="text-center">
                {!isAssignStepActive && (
                    <p className="text-xs text-slate-400">
                        Puedes crear la materia ahora o asignar un tutor después
                    </p>
                )}

                {isAssignStepActive && (
                    <p className="text-xs text-slate-400">
                        Selecciona un tutor para completar el proceso
                    </p>
                )}
            </div>
        </div>
    );
};

export default SubjectActions;