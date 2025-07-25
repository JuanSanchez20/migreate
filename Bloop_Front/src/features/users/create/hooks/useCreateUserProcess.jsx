import { useCallback, useMemo } from 'react';
import { useLoadingState, useErrorState } from '@/hooks';
import { createUser } from '../../services/createUser';
import { assignSubject } from '../../services/assignSubject';

// Función principal que maneja el proceso de creación de usuario
const useCreateUserProcess = () => {
    // Estados de carga y error
    const { loading: isCreatingUser, withLoading } = useLoadingState();
    const { error: processError, setError, clearError } = useErrorState();

    // Transforma los datos del formulario al formato requerido por el servicio
    const transformUserDataForService = useCallback((formData) => {
        return {
            name_user: formData.name.trim(),
            email_user: formData.email.trim(),
            password_user: formData.password,
            semester_user: formData.role === "estudiante" 
                ? parseInt(formData.semester, 10) 
                : 0,
            rol_user: formData.role === "estudiante" ? 3 : 2
        };
    }, []);

    // Transforma las materias seleccionadas al formato requerido por el servicio
    const transformSubjectsForService = useCallback((userId, selectedSubjects) => {
        return selectedSubjects.map(subject => ({
            user_id: parseInt(userId),
            subject_id: parseInt(subject.subjectId),
            state_user_subject: subject.status
        }));
    }, []);

    // Crea un usuario sin asignar materias
    const createUserOnly = useCallback(async (formData) => {
        return await withLoading(async () => {
            clearError();
            
            try {
                const payload = transformUserDataForService(formData);
                const response = await createUser(payload);

                if (!response.ok) {
                    throw new Error(response.message || "Error al crear el usuario");
                }

                return {
                    success: true,
                    user: response.user,
                    message: "Usuario creado exitosamente"
                };

            } catch (error) {
                const errorMessage = error.message || "Error inesperado al crear usuario";
                setError(errorMessage);
                
                return {
                    success: false,
                    error: errorMessage
                };
            }
        });
    }, [withLoading, clearError, transformUserDataForService, setError]);

    // Crea un usuario y asigna materias en un proceso completo
    const createUserWithSubjects = useCallback(async (formData, selectedSubjects) => {
        return await withLoading(async () => {
            clearError();

            try {
                // PASO 1: Crear usuario
                const userPayload = transformUserDataForService(formData);
                const userResponse = await createUser(userPayload);

                if (!userResponse.ok) {
                    throw new Error(userResponse.message || "Error al crear el usuario");
                }

                const userId = userResponse.user?.id;
                if (!userId) {
                    throw new Error("Usuario creado pero no se pudo obtener el ID");
                }

                // PASO 2: Asignar materias
                const subjectPayloads = transformSubjectsForService(userId, selectedSubjects);

                let successCount = 0;
                let failureCount = 0;
                const errors = [];

                // Procesar asignaciones una por una para manejar errores individuales
                for (const [index, payload] of subjectPayloads.entries()) {
                    try {
                        const assignResponse = await assignSubject(payload);

                        if (assignResponse.ok) {
                            successCount++;
                        } else {
                            failureCount++;
                            const subjectName = selectedSubjects[index]?.subjectName || 'Materia desconocida';
                            errors.push(`${subjectName}: ${assignResponse.message || 'Error desconocido'}`);
                        }
                    } catch (assignError) {
                        failureCount++;
                        const subjectName = selectedSubjects[index]?.subjectName || 'Materia desconocida';
                        errors.push(`${subjectName}: Error de conexión`);
                    }
                }

                // Determinar resultado final
                const result = {
                    success: true,
                    user: userResponse.user,
                    totalSubjects: selectedSubjects.length,
                    successCount,
                    failureCount,
                    errors
                };

                if (failureCount === 0) {
                    result.message = `¡Éxito completo! Usuario creado con ${successCount} materias asignadas.`;
                } else if (successCount > 0) {
                    result.message = `Usuario creado. ${successCount} materias asignadas correctamente, ${failureCount} fallaron.`;
                    result.partialSuccess = true;
                } else {
                    result.message = `Usuario creado pero ninguna materia pudo asignarse.`;
                    result.partialSuccess = true;
                }

                return result;

            } catch (error) {
                const errorMessage = error.message || "Error inesperado en el proceso";
                setError(errorMessage);

                return {
                    success: false,
                    error: errorMessage
                };
            }
        });
    }, [withLoading, clearError, transformUserDataForService, transformSubjectsForService, setError]);

    // Valida que el formulario esté listo para crear usuario
    const validateFormDataForCreation = useCallback((formData) => {
        const errors = [];

        // Validaciones básicas
        if (!formData.name?.trim()) {
            errors.push("El nombre es obligatorio");
        }

        if (!formData.email?.trim()) {
            errors.push("El correo electrónico es obligatorio");
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                errors.push("El formato del correo electrónico no es válido");
            }
        }

        if (!formData.password?.trim()) {
            errors.push("La contraseña es obligatoria");
        } else if (formData.password.length < 6) {
            errors.push("La contraseña debe tener al menos 6 caracteres");
        }

        if (!formData.role) {
            errors.push("El rol es obligatorio");
        } else if (formData.role === "estudiante" && !formData.semester) {
            errors.push("El semestre es obligatorio para estudiantes");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, []);

    // Valida que las materias seleccionadas sean válidas para el proceso
    const validateSubjectsForCreation = useCallback((selectedSubjects, userRole) => {
        const errors = [];

        if (!selectedSubjects || selectedSubjects.length === 0) {
            errors.push("Debes seleccionar al menos una materia");
        }

        // Validaciones específicas para estudiantes
        if (userRole === "estudiante") {
            const cursandoCount = selectedSubjects.filter(s => s.status === "Cursando").length;
            if (cursandoCount > 2) {
                errors.push("Un estudiante puede tener máximo 2 materias 'Cursando'");
            }
        }

        // Verificar que no haya materias duplicadas
        const subjectIds = selectedSubjects.map(s => s.subjectId);
        const uniqueIds = new Set(subjectIds);
        if (subjectIds.length !== uniqueIds.size) {
            errors.push("No se pueden seleccionar materias duplicadas");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, []);

    // Reinicia todos los estados del proceso

    const resetProcess = useCallback(() => {
        clearError();
    }, [clearError]);

    // Verifica si el proceso está actualmente ejecutándose
    const isProcessActive = useMemo(() => {
        return isCreatingUser;
    }, [isCreatingUser]);

    return {
        // Estados del proceso
        isCreatingUser,
        processError,
        isProcessActive,

        // Operaciones principales
        createUserOnly,
        createUserWithSubjects,

        // Validaciones
        validateFormDataForCreation,
        validateSubjectsForCreation,

        // Transformadores (útiles para testing o uso externo)
        transformUserDataForService,
        transformSubjectsForService,

        // Utilidades
        resetProcess,
        clearError
    };
}

export default useCreateUserProcess;