import React from 'react';
import { AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardContent, CardSectionTitle, Button } from '@/components';
import SubjectsList from './subcomponents/UserSubjectList';
import SelectedSubjects from './subcomponents/UserSelectedSubjects';
import AssignmentStats from './subcomponents/UserAssignementStats';

// Formulario para asignar materias a un usuario
export default function AssignSubjectsForm({
    // Datos del usuario
    userFormData,

    // Materias
    availableSubjects = [],
    selectedSubjects = [],
    isLoadingSubjects = false,
    subjectsError = null,

    // Funciones de manejo
    onSubjectToggle,
    onRemoveSubject,
    onCancel,
    onFinish,
    onRetryLoadSubjects,

    // Estados de UI
    isLoading = false
}) {
    // Función para manejar cancelación
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const handleFinish = () => {
        if (selectedSubjects.length === 0) {
            alert("Debes seleccionar al menos una materia para continuar.");
            return;
        }

        if (onFinish) {
            onFinish();
        }
    };

    // Función para remover materia seleccionada
    const handleRemoveSubject = (subjectId) => {
        if (onRemoveSubject) {
            onRemoveSubject(subjectId);
        }
    };

    return (
        <Card>
            <CardHeader
                icon={AcademicCapIcon}
                title="Asignar Materias"
                description={`Selecciona las materias para ${userFormData.name} (${userFormData.role === 'estudiante' ? 'Estudiante' : 'Tutor'})`}
            />

            <CardContent>
                {/* Información del usuario */}
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#278bbd]/10 flex items-center justify-center">
                            <AcademicCapIcon className="h-5 w-5 text-[#278bbd]" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-200">{userFormData.name}</h3>
                            <p className="text-sm text-slate-400">
                                {userFormData.role === "estudiante" 
                                    ? `Estudiante - Semestre ${userFormData.semester}`
                                    : "Tutor"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Estadísticas de asignación */}
                <AssignmentStats
                    selectedSubjects={selectedSubjects}
                    userRole={userFormData.role}
                />

                {/* Materias seleccionadas */}
                {selectedSubjects.length > 0 && (
                    <div className="mb-6">
                        <CardSectionTitle>Materias Seleccionadas</CardSectionTitle>
                        <SelectedSubjects
                            selectedSubjects={selectedSubjects}
                            onRemoveSubject={handleRemoveSubject}
                            showRemoveButton={true}
                        />
                    </div>
                )}

                {/* Lista de materias disponibles */}
                <div className="mb-6">
                    <CardSectionTitle>Materias Disponibles</CardSectionTitle>

                    {subjectsError ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-2 text-red-400">
                                <span className="font-medium">Error: {subjectsError}</span>
                            </div>
                            {onRetryLoadSubjects && (
                                <button
                                    onClick={onRetryLoadSubjects}
                                    className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
                                >
                                    Intentar de nuevo
                                </button>
                            )}
                        </div>
                    ) : (
                        <SubjectsList
                            subjects={availableSubjects}
                            selectedSubjects={selectedSubjects}
                            onSubjectToggle={onSubjectToggle}
                            userRole={userFormData.role}
                            userSemester={userFormData.semester}
                            isLoading={isLoadingSubjects}
                        />
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-3 pt-4 border-t border-slate-700">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 h-12"
                        icon={ArrowLeftIcon}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleFinish}
                        disabled={isLoading || selectedSubjects.length === 0}
                        isLoading={isLoading}
                        loadingText="Creando usuario..."
                        className="flex-1 h-12"
                    >
                        {selectedSubjects.length === 0 
                            ? "Selecciona materias" 
                            : `Crear Usuario (${selectedSubjects.length} materias)`
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}