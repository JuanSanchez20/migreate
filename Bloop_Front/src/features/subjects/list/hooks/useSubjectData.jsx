import { useState, useCallback, useRef } from 'react';
import { listSubject } from '../../services/listSubject';
import { mapRolStringToNumber } from '../helpers/subjectHelpers';
import { useLoadingState, useErrorState } from '@/hooks';
// Hook para manejar datos de materias con estados de carga
const useSubjectData = (currentUser) => {
    // Estados principales
    const [subjects, setSubjects] = useState([]);
    
    // Estados de operaciones usando hooks globales
    const { loading, withLoading } = useLoadingState(false);
    const { error, setError, clearError } = useErrorState();

    // Ref para evitar recreaciones innecesarias
    const currentUserRef = useRef(currentUser);
    currentUserRef.current = currentUser;

    // Validar usuario antes de hacer petición - ESTABLE
    const validateUser = useCallback(() => {
        const user = currentUserRef.current;
        if (!user?.id || !user?.rol) {
            throw new Error('Usuario no autenticado correctamente');
        }

        const rolNumerico = mapRolStringToNumber(user.rol);
        
        if (!rolNumerico || ![1, 2, 3].includes(rolNumerico)) {
            throw new Error(`Rol inválido: "${user.rol}" no se puede mapear a número válido`);
        }

        return { userId: user.id, userRole: rolNumerico };
    }, []); // Sin dependencias - usa ref

    // Obtener materias del backend - ESTABLE
    const fetchSubjects = useCallback(async () => {
        try {
            clearError(); // Limpiar errores antes
            
            // Validar usuario
            const { userId, userRole } = validateUser();
            
            // Llamada al servicio
            const response = await listSubject(userId, userRole);

            // Verificar respuesta del backend
            if (response.ok && response.data) {
                setSubjects(response.data);
            } else {
                throw new Error(response.message || 'Error al cargar materias');
            }
        } catch (err) {
            console.error('Error al cargar materias:', err);
            setError(err.message || 'Error al cargar la lista de materias');
            setSubjects([]);
        }
    }, [validateUser, setError, clearError]);

    // Refrescar datos con loading - ESTABLE
    const refreshSubjects = useCallback(async () => {
        await withLoading(fetchSubjects);
    }, [withLoading, fetchSubjects]);

    // Limpiar datos - ESTABLE
    const clearSubjects = useCallback(() => {
        setSubjects([]);
        clearError();
    }, [clearError]);

    // Obtener estadísticas - ESTABLE
    const getStats = useCallback(() => {
        return {
            total: subjects.length,
            byJornada: {
                matutina: subjects.filter(s => s.modalidad?.toLowerCase() === 'matutina').length,
                nocturna: subjects.filter(s => s.modalidad?.toLowerCase() === 'nocturna').length
            },
            bySemestre: subjects.reduce((acc, subject) => {
                const sem = subject.semestre;
                acc[sem] = (acc[sem] || 0) + 1;
                return acc;
            }, {}),
            withPea: subjects.filter(s => s.pea?.id).length,
            activePea: subjects.filter(s => s.pea?.estado === true).length
        };
    }, [subjects]);

    return {
        // Estados principales
        subjects,
        loading,
        error,
        
        // Funciones de datos
        fetchSubjects,
        refreshSubjects,
        clearSubjects,
        
        // Información adicional
        stats: getStats(),
        hasData: subjects.length > 0,
        isEmpty: !loading && subjects.length === 0
    };
};

export default useSubjectData;