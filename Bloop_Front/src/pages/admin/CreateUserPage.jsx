import React from 'react';
import { UserCreateForm, AssignSubjectsForm, UserPreviewCard, useCreateUserModule } from '@/features';

// Componente principal de la página de creación de usuario
const CreateUserPage = () => {
    const {
        // Estados
        formData,
        fieldErrors,
        isFormValid,
        showPassword,
        currentStep,
        isStep,
        STEPS,
        availableSubjects,
        isLoadingSubjects,
        subjectsError,
        selectedSubjects,
        isCreatingUser,

        // Acciones
        handleInputChange,
        handleSelectChange,
        setShowPassword,
        goToNextStep,
        goToPreviousStep,
        handleSubjectToggle,
        handleRemoveSubject,
        refreshSubjects,
        createUserOnly,
        createUserWithSubjects
    } = useCreateUserModule();

    const handleCreateUserOnlySubmit = async (e) => {
        const result = await createUserOnly(e);
        if (result.success) {
            alert(result.message);
        } else if (result.error) {
            alert(result.error);
        }
    };

    const handleCreateUserWithSubjectsSubmit = async () => {
        const result = await createUserWithSubjects();
        if (result.success) {
            alert(result.message);
        } else if (result.error) {
            alert(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center p-4 pt-10 w-full">
            <div className="w-full max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Área principal del formulario */}
                    <div className="lg:col-span-2">
                        {isStep(STEPS.USER_FORM) ? (
                            // Paso 1: Formulario de datos del usuario
                            <UserCreateForm
                                formData={formData}
                                fieldErrors={fieldErrors}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                                onSubmit={handleCreateUserOnlySubmit}
                                onGoToAssignSubjects={goToNextStep}
                                isLoading={isCreatingUser}
                                showPassword={showPassword}
                                onTogglePassword={setShowPassword}
                                isFormValid={isFormValid}
                            />
                        ) : (
                            // Paso 2: Asignación de materias
                            <AssignSubjectsForm
                                userFormData={formData}
                                availableSubjects={availableSubjects}
                                selectedSubjects={selectedSubjects}
                                isLoadingSubjects={isLoadingSubjects}
                                subjectsError={subjectsError}
                                onSubjectToggle={handleSubjectToggle}
                                onRemoveSubject={handleRemoveSubject}
                                onCancel={goToPreviousStep}
                                onFinish={handleCreateUserWithSubjectsSubmit}
                                onRetryLoadSubjects={refreshSubjects}
                                isLoading={isCreatingUser}
                            />
                        )}
                    </div>

                    {/* Vista previa lateral */}
                    <div className="lg:col-span-1">
                        <UserPreviewCard 
                            formData={formData}
                            selectedSubjects={selectedSubjects}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUserPage;