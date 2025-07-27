import { useState, useEffect, useCallback } from 'react';
import { useErrorState } from '@/hooks';
import { listSubject } from '../../services/listSubject';
import { NOTIFICATION_MESSAGES } from '../helpers/modalConstants';

const useSubjectList = (user) => {
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const { error, setError, clearError } = useErrorState();

    // Solo cargar y filtrar materias disponibles
    const loadAvailableSubjects = useCallback(async () => {
        try {
            const response = await listSubject(1, 1);

            if (!response?.ok || !response.data) {
                throw new Error(NOTIFICATION_MESSAGES.ERROR.LOAD_SUBJECTS_FAILED);
            }

            // Filtrar solo materias activas
            let subjects = response.data.filter(subject => subject.estado === true);

            // Filtro adicional para estudiantes según su semestre
            if (user?.rol_name?.toLowerCase() === 'estudiante' && user.u_semester) {
                subjects = subjects.filter(subject =>
                    subject.semestre <= parseInt(user.u_semester)
                );
            }

            setAvailableSubjects(subjects);
            clearError();

        } catch (err) {
            console.error('Error al cargar materias disponibles:', err);
            setError(err.message || NOTIFICATION_MESSAGES.ERROR.LOAD_SUBJECTS_FAILED);
        }
    }, [user?.rol_name, user?.u_semester, setError, clearError]);

    // Carga inicial de materias
    useEffect(() => {
        if (user?.u_id) {
            loadAvailableSubjects();
        }
    }, [user?.u_id, loadAvailableSubjects]);

    return {
        availableSubjects,
        loadAvailableSubjects,
        loading: false, // Este hook no maneja loading
        error,
        setError,
        clearError
    };
};

export default useSubjectList;