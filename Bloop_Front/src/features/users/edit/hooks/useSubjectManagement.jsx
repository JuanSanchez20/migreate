import { useState, useCallback, useEffect } from 'react';
import useSubjectList from './useSubjectList';
import useSubjectAssign from './useSubjectAssignment';
import useSubjectUnassign from './useSubjectDesassignment';
import { SUBJECT_ASSIGNMENT_STATUS } from '../helpers/modalConstants';

const useSubjectManagement = (user, onSuccess, onError) => {
    const [assignedSubjects, setAssignedSubjects] = useState([]);

    const {
        availableSubjects,
        loadAvailableSubjects,
        error: listError,
        clearError: clearListError
    } = useSubjectList(user);

    const {
        selectedSubjectToAdd,
        hasAssignmentChanges,
        loading: assignLoading,
        error: assignError,
        assignSubjectFunction: originalAssignFunction,
        setSelectedSubjectToAdd,
        clearSelection,
        resetAssignmentChanges,
        clearError: clearAssignError
    } = useSubjectAssign(user, availableSubjects, onSuccess, onError);

    const {
        loading: unassignLoading,
        error: unassignError,
        unassignSubjectFunction: originalUnassignFunction,
        clearError: clearUnassignError
    } = useSubjectUnassign(user, onSuccess, onError);

    const loading = assignLoading || unassignLoading;
    const error = listError || assignError || unassignError;

    const clearError = useCallback(() => {
        clearListError();
        clearAssignError();
        clearUnassignError();
    }, [clearListError, clearAssignError, clearUnassignError]);

    const processAssignedSubjects = useCallback(() => {
        if (!user?.materias || !availableSubjects.length) {
            setAssignedSubjects([]);
            return;
        }

        const assignedSubjectNames = user.materias
            .split(', ')
            .filter(Boolean)
            .map(name => name.trim());

        const assignedWithRealIds = assignedSubjectNames
            .map(assignedName => {
                const realSubject = availableSubjects.find(subject =>
                    subject.nombre.toLowerCase().trim() === assignedName.toLowerCase().trim()
                );

                if (realSubject) {
                    return {
                        id: realSubject.id,
                        name: assignedName,
                        realName: realSubject.nombre,
                        semester: realSubject.semestre,
                        status: determineSubjectStatus(realSubject, user)
                    };
                } else {
                    console.warn(`No se encontró ID para la materia: ${assignedName}`);
                    return null;
                }
            })
            .filter(subject => subject !== null);

        setAssignedSubjects(assignedWithRealIds);
    }, [user?.materias, availableSubjects, user]);

    const determineSubjectStatus = useCallback((subject, userData) => {
        if (userData?.rol_name?.toLowerCase() === 'tutor') {
            return SUBJECT_ASSIGNMENT_STATUS.TUTOR;
        }

        if (subject.semestre === parseInt(userData?.u_semester)) {
            return SUBJECT_ASSIGNMENT_STATUS.CURRENT_SEMESTER;
        }

        return SUBJECT_ASSIGNMENT_STATUS.REPEATING;
    }, []);

    const assignSubjectFunction = useCallback(async () => {
        const result = await originalAssignFunction();
        if (result?.success && result.assignedSubject) {
            setAssignedSubjects(prev => [...prev, result.assignedSubject]);
        }
        return result?.success || false;
    }, [originalAssignFunction]);

    const unassignSubjectFunction = useCallback(async (subjectToRemove) => {
        const result = await originalUnassignFunction(subjectToRemove);
        if (result?.success && result.removedSubjectId) {
            setAssignedSubjects(prev => 
                prev.filter(s => s.id !== result.removedSubjectId)
            );
        }
        return result?.success || false;
    }, [originalUnassignFunction]);

    const getAvailableSubjectsToShow = useCallback(() => {
        return availableSubjects.filter(available =>
            !assignedSubjects.some(assigned =>
                assigned.name === available.nombre || assigned.id === available.id
            )
        );
    }, [availableSubjects, assignedSubjects]);

    const getSubjectStats = useCallback(() => {
        return {
            totalAssigned: assignedSubjects.length,
            availableToAssign: getAvailableSubjectsToShow().length,
            hasChanges: hasAssignmentChanges,
            byStatus: {
                tutor: assignedSubjects.filter(s => s.status === SUBJECT_ASSIGNMENT_STATUS.TUTOR).length,
                current: assignedSubjects.filter(s => s.status === SUBJECT_ASSIGNMENT_STATUS.CURRENT_SEMESTER).length,
                repeating: assignedSubjects.filter(s => s.status === SUBJECT_ASSIGNMENT_STATUS.REPEATING).length
            }
        };
    }, [assignedSubjects, getAvailableSubjectsToShow, hasAssignmentChanges]);

    const resetSubjectChanges = useCallback(() => {
        resetAssignmentChanges();
    }, [resetAssignmentChanges]);

    useEffect(() => {
        processAssignedSubjects();
    }, [processAssignedSubjects]);

    return {
        assignedSubjects,
        availableSubjects,
        selectedSubjectToAdd,
        hasSubjectChanges: hasAssignmentChanges,
        loading,
        error,
        assignSubjectFunction,
        unassignSubjectFunction,
        setSelectedSubjectToAdd,
        clearSelection,
        loadAvailableSubjects,
        resetSubjectChanges,
        getSubjectStats,
        subjectsToShow: getAvailableSubjectsToShow(),
        hasError: Boolean(error),
        canAssign: selectedSubjectToAdd && !loading,
        clearError
    };
};

export default useSubjectManagement;