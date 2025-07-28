import { useState, useEffect, useMemo } from 'react';
import { assignSubjectService } from '../../services/assignSubject';
import { listUsersAdmin } from '../../services/listUserAdmin';
import { validateStudentAssignment } from '../helpers/subjectValidator';
import { canManageStudents } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';

// Hook para manejar específicamente estudiantes
export const useStudentAssignment = (subject, onSubjectUpdate) => {
    const { user, userRole } = useAuth();
    const currentUser = {
        ...user,
        rol: parseInt(userRole)
    };

    // Hooks globales
    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError, showWarning } = useNotification();

    // Estados específicos de estudiantes
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState({
        cursando: [],
        repitiendo: []
    });

    // Verificar permisos
    const canManage = canManageStudents(currentUser.rol);

    // Obtener estudiantes actualmente asignados
    const assignedStudents = useMemo(() => {
        return subject.usuariosAsignados?.filter(user => user.rol === 3) || [];
    }, [subject.usuariosAsignados]);

    // Cargar estudiantes disponibles al inicializar
    useEffect(() => {
        if (canManage) {
            loadStudents();
        }
    }, [subject.id, subject.usuariosAsignados?.length, canManage]);

    // Clasifica estudiantes según semestre y reglas de asignación
    const { studentsForCursando, studentsForRepitiendo } = useMemo(() => {
        const subjectSemester = parseInt(subject.semestre);

        // Filtrar estudiantes ya asignados
        const assignedStudentIds = assignedStudents.map(student => student.id);
        const availableStudents = students.filter(
            student => !assignedStudentIds.includes(student.u_id)
        );

        const cursando = availableStudents.filter(student => {
            const studentSemester = parseInt(student.u_semester || 1);
            // Mismo semestre Y máximo 2 materias cursando
            return studentSemester === subjectSemester &&
                (student.cursando_count || 0) < 2;
        });

        const repitiendo = availableStudents.filter(student => {
            const studentSemester = parseInt(student.u_semester || 1);
            // Semestres superiores
            return studentSemester > subjectSemester;
        });

        return {
            studentsForCursando: cursando,
            studentsForRepitiendo: repitiendo
        };
    }, [students, subject.semestre, assignedStudents]);

    // Carga la lista de estudiantes disponibles
    const loadStudents = async () => {
        if (!canManage) {
            const errorMsg = 'No tiene permisos para gestionar estudiantes';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        setLoadingStudents(true);
        clearError();

        try {
            const response = await listUsersAdmin(currentUser.id, 'estudiantes');

            if (response.ok) {
                setStudents(response.data || []);
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Error al cargar estudiantes');
            }
        } catch (err) {
            const errorMsg = 'Error al cargar la lista de estudiantes';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoadingStudents(false);
        }
    };

    // Asigna múltiples estudiantes a la materia
    const assignStudents = async (studentsToAssign) => {
        if (!canManage) {
            const errorMsg = 'No tiene permisos para asignar estudiantes';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        // Validar asignaciones
        const validation = validateStudentAssignment(studentsToAssign, subject);
        if (!validation.isValid) {
            const errorMsg = validation.errors[0];
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        try {
            const result = await withLoading(async () => {
                // Procesar asignaciones en paralelo
                const assignments = studentsToAssign.map(({ studentId, state }) =>
                    assignSubjectService({
                        user_id: studentId,
                        subject_id: subject.id,
                        state_user_subject: state
                    })
                );

                return await Promise.allSettled(assignments);
            });

            // Verificar resultados
            const successful = result.filter(res => res.status === 'fulfilled').length;
            const failed = result.filter(res => res.status === 'rejected');

            if (successful > 0) {
                // Actualizar vista padre
                onSubjectUpdate?.();

                // Limpiar selecciones
                clearAllSelections();
                clearError();

                // Mostrar mensaje de éxito
                if (failed.length === 0) {
                    showSuccess(`${successful} estudiante${successful !== 1 ? 's' : ''} asignado${successful !== 1 ? 's' : ''} correctamente`);
                } else {
                    showWarning(`${successful} estudiantes asignados, ${failed.length} fallaron`);
                }

                return { success: true, successful, failed: failed.length };
            } else {
                throw new Error('Todas las asignaciones fallaron');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error al asignar estudiantes';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Maneja la selección/deselección de estudiantes
    const toggleStudentSelection = (student, category) => {
        if (!canManage) {
            showWarning('No tiene permisos para seleccionar estudiantes');
            return { success: false };
        }

        if (!['cursando', 'repitiendo'].includes(category)) {
            showError('Categoría de estudiante inválida');
            return { success: false };
        }

        setSelectedStudents(prev => {
            const currentList = prev[category];
            const isSelected = currentList.some(s => s.u_id === student.u_id);

            if (isSelected) {
                // Remover de selección
                return {
                    ...prev,
                    [category]: currentList.filter(s => s.u_id !== student.u_id)
                };
            } else {
                // Agregar a selección
                return {
                    ...prev,
                    [category]: [...currentList, student]
                };
            }
        });

        clearError();
        return { success: true };
    };

    // Verifica si un estudiante está seleccionado
    const isStudentSelected = (student, category) => {
        return selectedStudents[category].some(s => s.u_id === student.u_id);
    };

    // Limpia todas las selecciones
    const clearAllSelections = () => {
        setSelectedStudents({
            cursando: [],
            repitiendo: []
        });
        clearError();
        return { success: true };
    };

    // Obtiene el total de estudiantes seleccionados
    const getTotalSelected = () => {
        return selectedStudents.cursando.length + selectedStudents.repitiendo.length;
    };

    // Prepara datos para asignación
    const prepareAssignmentData = () => {
        const assignments = [
            // Estudiantes para "Cursando"
            ...selectedStudents.cursando.map(student => ({
                studentId: student.u_id,
                state: 'Cursando',
                studentName: `${student.u_name} ${student.u_lastname}`,
                semester: student.u_semester
            })),
            // Estudiantes para "Repitiendo"
            ...selectedStudents.repitiendo.map(student => ({
                studentId: student.u_id,
                state: 'Repitiendo',
                studentName: `${student.u_name} ${student.u_lastname}`,
                semester: student.u_semester
            }))
        ];

        return assignments;
    };

    // Obtiene estadísticas de estudiantes
    const getStudentStats = () => {
        return {
            totalAvailable: studentsForCursando.length + studentsForRepitiendo.length,
            availableForCursando: studentsForCursando.length,
            availableForRepitiendo: studentsForRepitiendo.length,
            currentlyAssigned: assignedStudents.length,
            selectedForCursando: selectedStudents.cursando.length,
            selectedForRepitiendo: selectedStudents.repitiendo.length,
            totalSelected: getTotalSelected()
        };
    };

    // Verifica si puede proceder con la asignación
    const canProceedWithAssignment = () => {
        const totalSelected = getTotalSelected();
        return totalSelected > 0 && canManage;
    };

    return {
        // Estados principales
        students,
        loadingStudents,
        selectedStudents,
        assignedStudents,
        loading,
        error,

        // Datos clasificados
        studentsForCursando,
        studentsForRepitiendo,

        // Funciones principales
        loadStudents,
        assignStudents,
        toggleStudentSelection,
        clearAllSelections,

        // Funciones helper
        isStudentSelected,
        getTotalSelected,
        prepareAssignmentData,
        getStudentStats,
        canProceedWithAssignment,

        // Estados de conveniencia
        hasStudents: students.length > 0,
        hasAssignedStudents: assignedStudents.length > 0,
        hasSelections: getTotalSelected() > 0,
        canManage,

        // Datos del usuario
        currentUser,

        // Notificaciones
        showSuccess,
        showError,
        showWarning,

        // Funciones de error
        clearError,
        setError
    };
};