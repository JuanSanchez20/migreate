import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLoadingState, useErrorState } from '@/hooks';
import { listSubject } from '../../services/listSubject';
import { useAuth } from '@/contexts';

// Maneja la carga y filtrado de materias
const useSubjectsList = (targetUserRole, targetUserSemester) => {
    // Estado para materias y filtros
    const { user, userRole } = useAuth();
    const [rawSubjects, setRawSubjects] = useState([]);
    const { loading: isLoadingSubjects, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();

    // Carga la materia desde el servicio
    const loadSubjects = useCallback(async () => {
        if (!user?.id || !userRole) {
            setError("Información de usuario no disponible");
            return;
        }

        return await withLoading(async () => {
            clearError();

            try {
                // Usar el servicio existente con los datos del usuario autenticado
                const response = await listSubject(user.id, userRole);

                if (response.ok && response.data) {
                    // Filtrar solo materias activas
                    const activeSubjects = response.data.filter(subject => subject.estado === true);
                    setRawSubjects(activeSubjects);
                } else {
                    throw new Error(response.message || "No se pudieron cargar las materias");
                }
            } catch (error) {
                const errorMessage = error.message || "Error al conectar con el servidor";
                setError(errorMessage);
                setRawSubjects([]);
            }
        });
    }, [user?.id, userRole, withLoading, clearError, setError]);

    // Carga las materias al montar el hook
    useEffect(() => {
        if (user?.id && userRole) {
            loadSubjects();
        }
    }, [user?.id, userRole]);

    // Filtra materias segun el rol y smeestre del usuario objetivo
    const filteredSubjects = useMemo(() => {
        if (!rawSubjects.length || !targetUserRole) {
            return [];
        }

        // Para tutores: todas las materias activas
        if (targetUserRole === "tutor") {
            return rawSubjects;
        }

        // Para estudiantes: solo materias del semestre actual o anteriores
        if (targetUserRole === "estudiante" && targetUserSemester) {
            const userSemester = parseInt(targetUserSemester);
            return rawSubjects.filter(subject => subject.semestre <= userSemester);
        }

        // Si no se puede determinar, devolver todas
        return rawSubjects;
    }, [rawSubjects, targetUserRole, targetUserSemester]);

    // Obtiene información de una materia por ID
    const getSubjectById = useCallback((subjectId) => {
        return filteredSubjects.find(subject => subject.id === parseInt(subjectId)) || null;
    }, [filteredSubjects]);

    // Busca materias por nombre
    const searchSubjects = useCallback((searchTerm) => {
        if (!searchTerm.trim()) {
            return filteredSubjects;
        }

        const term = searchTerm.toLowerCase().trim();
        return filteredSubjects.filter(subject =>
            subject.nombre.toLowerCase().includes(term) ||
            subject.semestre.toString().includes(term) ||
            subject.modalidad.toLowerCase().includes(term)
        );
    }, [filteredSubjects]);

    // Filtro de materias por semestre
    const getSubjectsBySemester = useCallback((semester) => {
        return filteredSubjects.filter(subject => subject.semestre === parseInt(semester));
    }, [filteredSubjects]);

    // Filtro de materias por modalidad
    const getSubjectsByModalidad = useCallback((modalidad) => {
        return filteredSubjects.filter(subject => 
            subject.modalidad.toLowerCase() === modalidad.toLowerCase()
        );
    }, [filteredSubjects]);

    // Estadistica de las materias disponibles
    const subjectsStats = useMemo(() => {
        const stats = {
            total: filteredSubjects.length,
            bySemester: {},
            byModalidad: {},
            averageSemester: 0
        };

        if (filteredSubjects.length === 0) {
            return stats;
        }

        // Agrupar por semestre
        filteredSubjects.forEach(subject => {
            const sem = subject.semestre;
            const mod = subject.modalidad;

            stats.bySemester[sem] = (stats.bySemester[sem] || 0) + 1;
            stats.byModalidad[mod] = (stats.byModalidad[mod] || 0) + 1;
        });

        // Calcular semestre promedio
        const totalSemesters = filteredSubjects.reduce((sum, subject) => sum + subject.semestre, 0);
        stats.averageSemester = Math.round(totalSemesters / filteredSubjects.length * 10) / 10;

        return stats;
    }, [filteredSubjects]);

    // Verifica si hay materias disponibles
    const hasSubjects = useMemo(() => {
        return filteredSubjects.length > 0;
    }, [filteredSubjects.length]);

    // Obtiene los semestres únicos de las materias
    const availableSemesters = useMemo(() => {
        const semesters = [...new Set(filteredSubjects.map(subject => subject.semestre))];
        return semesters.sort((a, b) => a - b);
    }, [filteredSubjects]);

    // Obtiene las modalidades únicas de las materias
    const availableModalidades = useMemo(() => {
        return [...new Set(filteredSubjects.map(subject => subject.modalidad))];
    }, [filteredSubjects]);

    // Refresca la lista de materias
    const refreshSubjects = useCallback(() => {
        return loadSubjects();
    }, [loadSubjects]);

    // Limpia la lista actual de materias
    const clearSubjects = useCallback(() => {
        setRawSubjects([]);
        clearError();
    }, [clearError]);

    return {
        // Listas de materias
        subjects: filteredSubjects,
        rawSubjects,

        // Estados de carga y error
        isLoadingSubjects,
        error,

        // Funciones de consulta
        getSubjectById,
        searchSubjects,
        getSubjectsBySemester,
        getSubjectsByModalidad,

        // Estadísticas e información
        subjectsStats,
        hasSubjects,
        availableSemesters,
        availableModalidades,

        // Funciones de control
        loadSubjects,
        refreshSubjects,
        clearSubjects,
        clearError
    };
}

export default useSubjectsList;