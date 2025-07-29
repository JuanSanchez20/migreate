import { useState, useEffect, useCallback } from 'react';
import { listUsersAdmin } from '../../services/listUserAdmin';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState } from '@/hooks';

// Hook especializado para manejar el listado de tutores disponibles
const useTutorList = () => {
    // Estados del contexto de autenticación
    const { user, userRole } = useAuth();
    
    // Estados locales
    const [tutors, setTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);
    
    // Hooks de estado
    const { loading, startLoading, stopLoading } = useLoadingState(false);
    const { error, setError, clearError } = useErrorState();

    // Formatear lista de tutores
    const formatTutorsList = useCallback((tutorsData) => {
        if (!Array.isArray(tutorsData)) {
            console.warn('formatTutorsList: tutorsData no es un array:', tutorsData);
            return [];
        }

        return tutorsData.map(tutor => ({
            u_id: tutor.u_id,
            u_name: tutor.u_name,
            u_email: tutor.u_email,
            u_rol: tutor.u_rol,
            isAvailable: true
        }));
    }, []);

    // Cargar lista de tutores disponibles - Función simplificada
    const loadTutors = useCallback(async () => {
        if (!user?.id || userRole !== 1) {
            setError('Permisos insuficientes para cargar tutores');
            return;
        }

        try {
            startLoading();
            clearError();

            const response = await listUsersAdmin(user.id, 'tutores');

            if (response.ok && Array.isArray(response.data)) {
                const formattedTutors = formatTutorsList(response.data);
                setTutors(formattedTutors);
            } else {
                setError(response.message || 'Error al cargar tutores');
                setTutors([]);
            }
        } catch (err) {
            const errorMessage = err?.message || 'Error desconocido al cargar tutores';
            setError(errorMessage);
            setTutors([]);
        } finally {
            stopLoading();
        }
    }, [user?.id, userRole, startLoading, stopLoading, setError, clearError, formatTutorsList]);

    // Seleccionar un tutor específico
    const selectTutor = useCallback((tutor) => {
        if (!tutor || !tutor.u_id) {
            setSelectedTutor(null);
            return;
        }

        // Si el mismo tutor está seleccionado, deseleccionarlo
        if (selectedTutor?.u_id === tutor.u_id) {
            setSelectedTutor(null);
        } else {
            setSelectedTutor(tutor);
        }
    }, [selectedTutor]);

    // Limpiar selección actual
    const clearSelection = useCallback(() => {
        setSelectedTutor(null);
    }, []);

    // Recargar lista de tutores
    const reloadTutors = useCallback(async () => {
        setTutors([]);
        setSelectedTutor(null);
        await loadTutors();
    }, [loadTutors]);

    // Verificar si hay tutores disponibles
    const hasTutors = tutors.length > 0;

    // Verificar si hay un tutor seleccionado
    const hasTutorSelected = selectedTutor !== null;

    // Obtener tutor por ID
    const getTutorById = useCallback((tutorId) => {
        if (!tutorId || !Array.isArray(tutors)) {
            return null;
        }
        return tutors.find(tutor => tutor.u_id === tutorId) || null;
    }, [tutors]);

    // Verificar si un tutor específico está seleccionado
    const isTutorSelected = useCallback((tutorId) => {
        return selectedTutor?.u_id === tutorId;
    }, [selectedTutor]);

    // Cargar tutores automáticamente cuando el hook se monta
    useEffect(() => {
        let mounted = true;
        
        if (user?.id && userRole === 1 && mounted) {
            loadTutors();
        }
        
        return () => {
            mounted = false;
        };
    }, [user?.id, userRole]); // Solo estas dependencias básicas

    // Retornar API del hook
    return {
        // Estados principales
        tutors,
        selectedTutor,
        loading,
        error,
        
        // Estados computados
        hasTutors,
        hasTutorSelected,
        
        // Acciones principales
        loadTutors,
        selectTutor,
        clearSelection,
        reloadTutors,
        
        // Utilidades
        getTutorById,
        isTutorSelected,
        
        // Control de errores
        clearError
    };
};

export default useTutorList;