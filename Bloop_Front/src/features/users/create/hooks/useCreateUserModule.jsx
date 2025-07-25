import { useMemo } from 'react';
import useCreateUserForm from './useCreateUserForm';
import useAssignSubjects from './useAssignSubjects';
import useCreateUserStep from './useCreateUserStep';
import useCreateUserProcess from './useCreateUserProcess';
import useSubjectsList from './useSubjectsList';

const useCreateUserModule = () => {
    // Hook del formulario de usuario
    const formHook = useCreateUserForm();

    // Hook de navegación entre pasos
    const stepHook = useCreateUserStep();

    // Hook de carga de materias (depende del formulario)
    const subjectsHook = useSubjectsList(
        formHook.formData.role, 
        formHook.formData.semester
    );

    // Hook de asignación de materias (depende del formulario)
    const assignmentHook = useAssignSubjects(
        formHook.formData.role, 
        formHook.formData.semester
    );

    // Hook del proceso completo
    const processHook = useCreateUserProcess();

    // Maneja la navegación al paso de asignación de materias
    const handleGoToAssignSubjects = async () => {
        const isValid = await stepHook.goToNextStep(() => {
            return formHook.validateForm();
        });

        if (!isValid) {
            alert("Por favor completa todos los campos correctamente.");
        }

        return isValid;
    };

    // Maneja la selccion y deselección de materias
    const handleSubjectToggle = (subjectId, subjectSemester, subjectInfo) => {
        return assignmentHook.toggleSubjectSelection(subjectId, subjectSemester, subjectInfo);
    };

    // Maneja la eliminación de una materia seleccionada
    const handleRemoveSubject = (subjectId) => {
        const subject = subjectsHook.subjects.find(s => s.id === subjectId);
        if (subject) {
            return assignmentHook.toggleSubjectSelection(subjectId, subject.semestre, subject);
        }
        return false;
    };

    // Crea un usuario sin asignar materias
    const handleCreateUserOnly = async (e) => {
        e.preventDefault();

        // Validar formulario
        if (!formHook.validateForm()) {
            return { success: false, error: "Formulario inválido" };
        }

        // Validar con reglas de negocio
        const validation = processHook.validateFormDataForCreation(formHook.formData);
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return { success: false, error: "Validación fallida" };
        }

        // Crear usuario
        const result = await processHook.createUserOnly(formHook.formData);

        if (result.success) {
            handleResetAll();
        }

        return result;
    };

    // Crea usuario con materias asignadas
    const handleCreateUserWithSubjects = async () => {
        // Validar selección de materias
        if (!assignmentHook.validateCurrentSelection()) {
            return { success: false, error: "Selección de materias inválida" };
        }

        // Crear usuario con materias
        const result = await processHook.createUserWithSubjects(
            formHook.formData, 
            assignmentHook.selectedSubjects
        );

        if (result.success) {
            handleResetAll();
        }

        return result;
    };

    // Resetea todo el estado del módulo
    const handleResetAll = () => {
        formHook.resetForm();
        assignmentHook.clearAllSelections();
        stepHook.resetToFirstStep();
        processHook.resetProcess();
    };

    // Estados principales del módulo
    const moduleState = useMemo(() => ({
        // Estado del formulario
        formData: formHook.formData,
        fieldErrors: formHook.fieldErrors,
        isFormValid: formHook.isFormValid,
        showPassword: formHook.showPassword,

        // Estado de navegación
        currentStep: stepHook.currentStep,
        isStep: stepHook.isStep,
        STEPS: stepHook.STEPS,

        // Estado de materias
        availableSubjects: subjectsHook.subjects,
        isLoadingSubjects: subjectsHook.isLoadingSubjects,
        subjectsError: subjectsHook.error,

        // Estado de asignación
        selectedSubjects: assignmentHook.selectedSubjects,
        hasSelectedSubjects: assignmentHook.hasSelectedSubjects,

        // Estado del proceso
        isCreatingUser: processHook.isCreatingUser,
        processError: processHook.processError
    }), [
        formHook.formData,
        formHook.fieldErrors,
        formHook.isFormValid,
        formHook.showPassword,
        stepHook.currentStep,
        stepHook.isStep,
        stepHook.STEPS,
        subjectsHook.subjects,
        subjectsHook.isLoadingSubjects,
        subjectsHook.error,
        assignmentHook.selectedSubjects,
        assignmentHook.hasSelectedSubjects,
        processHook.isCreatingUser,
        processHook.processError
    ]);

    // Acciones principales del módulo
    const moduleActions = useMemo(() => ({
        // Acciones del formulario
        handleInputChange: formHook.handleInputChange,
        handleSelectChange: formHook.handleSelectChange,
        setShowPassword: formHook.setShowPassword,

        // Acciones de navegación
        goToNextStep: handleGoToAssignSubjects,
        goToPreviousStep: stepHook.goToPreviousStep,

        // Acciones de materias
        handleSubjectToggle,
        handleRemoveSubject,
        refreshSubjects: subjectsHook.refreshSubjects,

        // Acciones del proceso
        createUserOnly: handleCreateUserOnly,
        createUserWithSubjects: handleCreateUserWithSubjects,

        // Acciones de utilidad
        resetAll: handleResetAll
    }), [
        formHook.handleInputChange,
        formHook.handleSelectChange,
        formHook.setShowPassword,
        stepHook.goToPreviousStep,
        subjectsHook.refreshSubjects
    ]);

    return {
        ...moduleState,
        ...moduleActions
    };
}

export default useCreateUserModule;