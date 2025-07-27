import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listSubject } from '../../services/listSubject';
import { useLoadingState, useErrorState } from '@/hooks';

// Hook para gestionar la lista de materias según el rol del usuario
const useSubjectList = () => {
    const { user } = useAuth();

    // Estados principales
    const [subjects, setSubjects] = useState([]);

    // Estados de UI reutilizables
    const { loading, startLoading, stopLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();

    // Obtiene materias del backend
    const fetchSubjects = useCallback(async () => {
        try {
            // Validación inline del usuario
            if (!user || !user.id || !user.rol) {
                throw new Error('Datos de usuario no válidos. Por favor, inicia sesión nuevamente.');
            }

            // Conversión simple de rol string a número
            const roleMap = { 'Admin': 1, 'Administrador': 1, 'Tutor': 2, 'Estudiante': 3 };
            const roleNumber = roleMap[user.rol];

            if (!roleNumber) {
                throw new Error('Rol de usuario inválido');
            }

            // Llamada al servicio
            const response = await listSubject(user.id, roleNumber);
            const subjectsData = response.data || [];

            // Validación de formato
            if (!Array.isArray(subjectsData)) {
                throw new Error('Formato de datos inválido recibido del servidor');
            }

            // ✅ CORREGIDO: Transformación usando los campos que realmente devuelve el backend
            const transformedSubjects = subjectsData.map(subject => ({
                // Campos originales
                ...subject,

                // ✅ CORREGIDO: Usar los campos correctos del controlador backend
                id: subject.id,           // El controlador ya devuelve 'id'
                name: subject.nombre,     // El controlador devuelve 'nombre'
                value: subject.id,        // Para compatibilidad con selects
                label: subject.nombre     // Para compatibilidad con selects
            }));

            setSubjects(transformedSubjects);
            return transformedSubjects;

        } catch (err) {
            setError(err.message || 'Error al cargar la lista de materias');
            setSubjects([]);
            throw err;
        }
    }, [user?.id, user?.rol]);

    // Limpia el estado
    const clearSubjects = useCallback(() => {
        setSubjects([]);
        clearError();
    }, []);

    // Carga materias iniciales cuando cambia el usuario
    useEffect(() => {
        if (user?.id && user?.rol) {
            const loadInitialSubjects = async () => {
                try {
                    startLoading();
                    clearError();
                    await fetchSubjects();
                } catch (error) {
                    // Error ya manejado en fetchSubjects
                } finally {
                    stopLoading();
                }
            };

            loadInitialSubjects();
        } else {
            setSubjects([]);
            clearError();
        }
    }, [user?.id, user?.rol]);

    return {
        // Datos principales
        subjects,

        // Estados
        loading,
        error,

        // Acciones principales
        fetchSubjects,
        clearSubjects,

        // Estados derivados para UI
        hasSubjects: subjects.length > 0,
        isEmpty: subjects.length === 0,
        count: subjects.length
    };
};

export default useSubjectList;