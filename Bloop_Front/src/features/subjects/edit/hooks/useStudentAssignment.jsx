import { useState, useEffect, useRef } from 'react';
import { assignSubjectService } from '../../services/assignSubject';
import { listUsersAdmin } from '../../services/listUserAdmin';
import { validateStudentAssignment } from '../helpers/subjectValidator';
import { canManageStudents } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';

export const useStudentAssignment = (subject, onSubjectUpdate) => {
    const { user, userRole } = useAuth();
    const currentUser = { ...user, rol: parseInt(userRole) };

    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError, showWarning } = useNotification();

    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState({
        cursando: [],
        repitiendo: []
    });
    const [assignedStudents, setAssignedStudents] = useState([]);
    
    // Refs para evitar loops
    const lastSubjectId = useRef(null);
    const isUpdatingLocally = useRef(false);

    const canManage = canManageStudents(currentUser.rol);

    // SOLO sincronizar cuando cambia el ID del subject
    useEffect(() => {
        // Solo actualizar si es un subject diferente
        if (subject?.id !== lastSubjectId.current && !isUpdatingLocally.current) {
            lastSubjectId.current = subject?.id;
            const studentsFromProps = subject?.usuariosAsignados?.filter(user => user.rol === 3) || [];
            setAssignedStudents(studentsFromProps);
        }

        if (canManage && subject?.id) {
            loadStudents();
        }
    }, [subject?.id, canManage]); // SOLO depender de subject.id y canManage

    // Calcular estudiantes disponibles
    const studentsForCursando = students.filter(student => {
        const subjectSemester = parseInt(subject.semestre);
        const studentSemester = parseInt(student.u_semester || 1);
        const assignedIds = assignedStudents.map(s => s.id);
        
        return !assignedIds.includes(student.u_id) &&
            studentSemester === subjectSemester &&
            (student.cursando_count || 0) < 2;
    });

    const studentsForRepitiendo = students.filter(student => {
        const subjectSemester = parseInt(subject.semestre);
        const studentSemester = parseInt(student.u_semester || 1);
        const assignedIds = assignedStudents.map(s => s.id);
        
        return !assignedIds.includes(student.u_id) &&
            studentSemester > subjectSemester;
    });

    const loadStudents = async () => {
        if (!canManage) return { success: false };

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
            showError('Error al cargar la lista de estudiantes');
            return { success: false, error: err.message };
        } finally {
            setLoadingStudents(false);
        }
    };

    const assignStudents = async (studentsToAssign) => {
        if (!canManage || !studentsToAssign || studentsToAssign.length === 0) {
            showError('Debe seleccionar al menos un estudiante');
            return { success: false };
        }

        const validation = validateStudentAssignment(studentsToAssign, subject);
        if (!validation.isValid) {
            showError(validation.errors[0]);
            return { success: false };
        }

        try {
            const result = await withLoading(async () => {
                const assignments = studentsToAssign.map(({ studentId, state }) =>
                    assignSubjectService({
                        user_id: studentId,
                        subject_id: subject.id,
                        state_user_subject: state
                    })
                );
                return await Promise.allSettled(assignments);
            });

            const successful = result.filter(res => res.status === 'fulfilled' && res.value?.ok).length;
            const failed = result.filter(res => res.status === 'rejected' || !res.value?.ok).length;

            if (successful > 0) {
                // Marcar que estamos actualizando localmente
                isUpdatingLocally.current = true;
                
                // ACTUALIZACIÓN INMEDIATA del estado local
                const newStudents = studentsToAssign.map(({ studentId, state }) => {
                    const student = students.find(s => s.u_id === studentId);
                    return {
                        id: studentId,
                        nombre: `${student?.u_name || ''} ${student?.u_lastname || ''}`.trim(),
                        correo: student?.u_email || '',
                        rol: 3,
                        estadoAsignacion: state
                    };
                });
                
                setAssignedStudents(prev => [...prev, ...newStudents]);
                
                clearAllSelections();
                clearError();

                if (failed === 0) {
                    showSuccess(
                        `${successful} estudiante${successful !== 1 ? 's' : ''} asignado${successful !== 1 ? 's' : ''} correctamente`, 
                        3000
                    );
                } else {
                    showWarning(`${successful} estudiantes asignados, ${failed} fallaron`, 3000);
                }
                
                // Actualizar padre en background sin afectar estado local
                setTimeout(() => {
                    onSubjectUpdate?.();
                    // Permitir sincronización después de un tiempo
                    setTimeout(() => {
                        isUpdatingLocally.current = false;
                    }, 500);
                }, 100);

                return { success: true, successful, failed };
            } else {
                isUpdatingLocally.current = false;
                throw new Error('Todas las asignaciones fallaron');
            }
        } catch (err) {
            isUpdatingLocally.current = false;
            showError('Error al asignar estudiantes');
            return { success: false, error: err.message };
        }
    };

    const toggleStudentSelection = (student, category) => {
        if (!canManage || !['cursando', 'repitiendo'].includes(category)) {
            return { success: false };
        }

        setSelectedStudents(prev => {
            const currentList = prev[category];
            const isSelected = currentList.some(s => s.u_id === student.u_id);

            if (isSelected) {
                return {
                    ...prev,
                    [category]: currentList.filter(s => s.u_id !== student.u_id)
                };
            } else {
                return {
                    ...prev,
                    [category]: [...currentList, student]
                };
            }
        });

        clearError();
        return { success: true };
    };

    const isStudentSelected = (student, category) => {
        return selectedStudents[category].some(s => s.u_id === student.u_id);
    };

    const clearAllSelections = () => {
        setSelectedStudents({ cursando: [], repitiendo: [] });
        clearError();
        return { success: true };
    };

    const getTotalSelected = () => {
        return selectedStudents.cursando.length + selectedStudents.repitiendo.length;
    };

    const prepareAssignmentData = () => {
        return [
            ...selectedStudents.cursando.map(student => ({
                studentId: student.u_id,
                state: 'Cursando',
                studentName: `${student.u_name} ${student.u_lastname}`,
                semester: student.u_semester
            })),
            ...selectedStudents.repitiendo.map(student => ({
                studentId: student.u_id,
                state: 'Repitiendo',
                studentName: `${student.u_name} ${student.u_lastname}`,
                semester: student.u_semester
            }))
        ];
    };

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

    const canProceedWithAssignment = () => {
        const totalSelected = getTotalSelected();
        return totalSelected > 0 && canManage;
    };

    return {
        students,
        loadingStudents,
        selectedStudents,
        assignedStudents,
        loading,
        error,
        studentsForCursando,
        studentsForRepitiendo,
        loadStudents,
        assignStudents,
        toggleStudentSelection,
        clearAllSelections,
        isStudentSelected,
        getTotalSelected,
        prepareAssignmentData,
        getStudentStats,
        canProceedWithAssignment,
        hasStudents: students.length > 0,
        hasAssignedStudents: assignedStudents.length > 0,
        hasSelections: getTotalSelected() > 0,
        canManage,
        currentUser,
        showSuccess,
        showError,
        showWarning,
        clearError,
        setError
    };
};