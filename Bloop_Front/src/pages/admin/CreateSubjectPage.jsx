import React from 'react';
import { CreateSubjectForm, AssignSubjectForm, SubjectPreviewCard, useCreateSubjectModule } from '@/features';

const CreateSubjectPage = () => {
    const {
        // Estados principales
        formData,
        currentStep,
        isStep,
        STEPS,
        
        // Estados de tutores
        tutorsList,
        selectedTutor,
        isLoadingTutors,
        tutorsError,
        
        // Estados del proceso
        isCreatingSubject,
        isCompleted,
        hasError,
        
        // Datos para componentes
        moduleState,
        subjectPreview,
        
        // Funciones de manejo del formulario
        handleInputChange,
        handleSelectChange,
        handleJourneyChange,
        
        // Funciones de navegación
        goToNextStep,
        goToPreviousStep,
        
        // Funciones de tutores
        handleTutorSelect,
        handleClearTutorSelection,
        refreshTutors,
        
        // Acciones principales
        createSubjectOnly,
        createSubjectWithTutor,
        resetModule,
        
        // Hooks especializados
        form,
        tutors
    } = useCreateSubjectModule();

    // Manejadores específicos para los componentes
    const handleCreateSubjectOnly = async () => {
        const result = await createSubjectOnly();
        if (result.success) {
            alert('Materia creada exitosamente');
        } else if (result.error) {
            alert(result.error);
        }
    };

    const handleCreateWithTutor = async () => {
        const result = await createSubjectWithTutor();
        if (result.success) {
            alert('Materia creada y tutor asignado exitosamente');
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
                        {isStep(STEPS.CREATE) ? (
                            // Paso 1: Formulario de datos de la materia
                            <CreateSubjectForm
                                formData={formData}
                                form={form}
                                moduleState={moduleState}
                                onCreateOnly={handleCreateSubjectOnly}
                                onGoToAssignStep={goToNextStep}
                                onReset={resetModule}
                                isLoading={isCreatingSubject}
                                isCompleted={isCompleted}
                            />
                        ) : (
                            // Paso 2: Asignación de tutor
                            <AssignSubjectForm
                                moduleState={moduleState}
                                actions={{
                                    cancelAssignment: goToPreviousStep,
                                    createWithTutor: handleCreateWithTutor
                                }}
                                tutors={{
                                    tutorsList: tutorsList,
                                    selectedTutor: selectedTutor,
                                    selectTutor: handleTutorSelect,
                                    clearSelection: handleClearTutorSelection,
                                    loading: isLoadingTutors,
                                    error: tutorsError,
                                    reloadTutors: refreshTutors
                                }}
                            />
                        )}
                    </div>

                    {/* Vista previa lateral */}
                    <div className="lg:col-span-1">
                        <SubjectPreviewCard
                            subjectPreview={subjectPreview}
                            moduleState={moduleState}
                            isSticky={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSubjectPage;