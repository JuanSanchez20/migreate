import { useState, useCallback, useMemo } from 'react';
import { useLoadingState, useErrorState } from '@/hooks';

// Gestión de estados de materias seleccionadas y validación de reglas
const useAssingSubjects = ( userRole, userSemester ) => {
    // Estado para materias seleccionadas
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const { loading: isProcessing, startLoading, stopLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();

    // Reglas
    const BUSINESS_RULES = {
        MAX_CURSANDO_ESTUDIANTE: 2,
        ESTUDIANTE_ROLE: "estudiante",
        TUTOR_ROLE: "tutor"
    };

    // Determina el estado de una materia según el rol y el semestre
    const determineSubjectStatus = useCallback((subjectSemester) => {
        if (userRole === BUSINESS_RULES.TUTOR_ROLE) {
            return "Encargado";
        }

        const userSem = parseInt(userSemester);
        const subjectSem = parseInt(subjectSemester);

        return subjectSem === userSem ? "Cursando" : "Repitiendo";
    }, [userRole, userSemester]);

    // Valida si se puede seleccionar una materia segun las reglas
    const validateSubjectSelection = useCallback((subjectId, subjectSemester) => {
        // Verificar si ya está seleccionada
        const isAlreadySelected = selectedSubjects.some(s => s.subjectId === subjectId);

        if (isAlreadySelected) {
            return { canSelect: true, reason: "Ya seleccionada - se puede deseleccionar" };
        }

        // Para tutores: sin restricciones especiales
        if (userRole === BUSINESS_RULES.TUTOR_ROLE) {
            return { canSelect: true, reason: "Sin restricciones para tutores" };
        }

        // Para estudiantes: verificar límite de materias "Cursando"
        if (userRole === BUSINESS_RULES.ESTUDIANTE_ROLE) {
            const status = determineSubjectStatus(subjectSemester);

            if (status === "Cursando") {
                const currentCursandoCount = selectedSubjects.filter(s => s.status === "Cursando").length;

                if (currentCursandoCount >= BUSINESS_RULES.MAX_CURSANDO_ESTUDIANTE) {
                    return { 
                        canSelect: false, 
                        reason: `Máximo ${BUSINESS_RULES.MAX_CURSANDO_ESTUDIANTE} materias "Cursando" permitidas` 
                    };
                }
            }

            return { canSelect: true, reason: "Dentro de los límites permitidos" };
        }

        return { canSelect: false, reason: "Rol no válido" };
    }, [selectedSubjects, userRole, determineSubjectStatus]);

    // Selecciona o deselecciona una materia
    const toggleSubjectSelection = useCallback((subjectId, subjectSemester, subjectInfo = {}) => {
        clearError(); // Limpiar errores previos

        const validation = validateSubjectSelection(subjectId, subjectSemester);

        if (!validation.canSelect) {
            setError(validation.reason);
            return false;
        }

        setSelectedSubjects(prevSelected => {
            // Verificar si ya está seleccionada para removerla
            const existingIndex = prevSelected.findIndex(s => s.subjectId === subjectId);

            if (existingIndex >= 0) {
                // Remover materia (deseleccionar)
                return prevSelected.filter(s => s.subjectId !== subjectId);
            }

            // Agregar nueva materia
            const status = determineSubjectStatus(subjectSemester);
            const newSubject = {
                subjectId,
                status,
                subjectName: subjectInfo.nombre || `Materia ${subjectId}`,
                subjectSemester: subjectSemester,
                subjectModalidad: subjectInfo.modalidad || null
            };

            return [...prevSelected, newSubject];
        });

        return true;
    }, [clearError, validateSubjectSelection, determineSubjectStatus, setError]);

    // Calcula las materias seleccionadas
    const selectionStats = useMemo(() => {
        const stats = {
            total: selectedSubjects.length,
            cursando: 0,
            repitiendo: 0,
            encargado: 0
        };

        selectedSubjects.forEach(subject => {
            switch (subject.status) {
                case 'Cursando':
                    stats.cursando++;
                    break;
                case 'Repitiendo':
                    stats.repitiendo++;
                    break;
                case 'Encargado':
                    stats.encargado++;
                    break;
            }
        });

        return stats;
    }, [selectedSubjects]);

    // Verificacion de limites de materias para estudiantes
    const isAtCursandoLimit = useMemo(() => {
        if (userRole !== BUSINESS_RULES.ESTUDIANTE_ROLE) return false;
        return selectionStats.cursando >= BUSINESS_RULES.MAX_CURSANDO_ESTUDIANTE;
    }, [userRole, selectionStats.cursando]);

    // Verifica si hay materias seleccionadas
    const hasSelectedSubjects = useMemo(() => {
        return selectedSubjects.length > 0;
    }, [selectedSubjects.length]);

    // Verifica si una materia está seleccionada
    const isSubjectSelected = useCallback((subjectId) => {
        return selectedSubjects.some(subject => subject.subjectId === subjectId);
    }, [selectedSubjects]);

    // Obtiene información de una materia seleccionada
    const getSelectedSubjectInfo = useCallback((subjectId) => {
        return selectedSubjects.find(subject => subject.subjectId === subjectId) || null;
    }, [selectedSubjects]);

    // Limpia las materias seleccionadas
    const clearAllSelections = useCallback(() => {
        setSelectedSubjects([]);
        clearError();
    }, [clearError]);

    // Verifica si la sección es valida para procesar
    const validateCurrentSelection = useCallback(() => {
        if (selectedSubjects.length === 0) {
            setError("Debes seleccionar al menos una materia");
            return false;
        }

        clearError();
        return true;
    }, [selectedSubjects.length, setError, clearError]);

return {
        // Estados principales
        selectedSubjects,
        isProcessing,
        error,
        
        // Estadísticas calculadas
        selectionStats,
        isAtCursandoLimit,
        hasSelectedSubjects,
        
        // Funciones de selección
        toggleSubjectSelection,
        validateSubjectSelection,
        determineSubjectStatus,
        
        // Funciones de consulta
        isSubjectSelected,
        getSelectedSubjectInfo,
        
        // Funciones de validación y utilidad
        validateCurrentSelection,
        clearAllSelections,
        clearError,
        
        // Funciones de loading (para operaciones futuras)
        startLoading,
        stopLoading
    };
}

export default useAssingSubjects;