import React from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardContent, Button } from '@/components';
import UserBasicInfo from './subcomponents/UserBasicInfo';
import UserAcademicInfo from './subcomponents/UserAcademicInfo';

// Formulario para crear un nuevo usuario
export default function CreateUserForm({
    // Datos del formulario
    formData,
    fieldErrors,

    // Funciones de manejo
    onInputChange,
    onSelectChange,
    onSubmit,
    onGoToAssignSubjects,

    // Estados de UI
    isLoading = false,
    showPassword = false,
    onTogglePassword,

    // Validación
    isFormValid = false
}) {
    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    // Función para ir a asignar materias con validación
    const handleGoToAssignSubjects = () => {
        if (!isFormValid) {
            alert("Por favor completa todos los campos requeridos antes de asignar materias.");
            return;
        }

        if (onGoToAssignSubjects) {
            onGoToAssignSubjects();
        }
    };

    return (
        <Card>
            <CardHeader
                icon={UserPlusIcon}
                title="Crear Nuevo Usuario"
                description="Completa el formulario para agregar un nuevo usuario al sistema"
            />

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sección: Información Personal */}
                    <UserBasicInfo
                        formData={formData}
                        fieldErrors={fieldErrors}
                        onInputChange={onInputChange}
                        showPassword={showPassword}
                        onTogglePassword={onTogglePassword}
                        isLoading={isLoading}
                    />

                    {/* Sección: Información Académica */}
                    <UserAcademicInfo
                        formData={formData}
                        fieldErrors={fieldErrors}
                        onSelectChange={onSelectChange}
                        isLoading={isLoading}
                    />

                    {/* Botones de Acción */}
                    <div className="pt-4 flex space-x-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-12"
                            disabled={isLoading}
                            isLoading={isLoading}
                            loadingText="Creando usuario..."
                        >
                            Crear Usuario
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full h-12"
                            disabled={isLoading || !isFormValid}
                            onClick={handleGoToAssignSubjects}
                        >
                            Asignar Materias
                        </Button>
                    </div>

                    {/* Mensaje de ayuda */}
                    {!isFormValid && (
                        <div className="text-center text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            💡 Completa todos los campos para habilitar la asignación de materias
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}