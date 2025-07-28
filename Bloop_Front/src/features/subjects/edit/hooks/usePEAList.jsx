import { useState, useEffect, useCallback } from 'react';
import { listPEAService } from '../../services/listPEA';
import { validateSubjectId } from '../helpers/subjectValidator';
import { getPEAViewLevel } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';

// Hook para manejar listado y visualización del PEA
export const usePEAList = (subjectId, options = {}) => {
    const { user, userRole } = useAuth();
    const currentUser = {
        ...user,
        rol: parseInt(userRole) // Convertir rol a entero
    };
    
    const {
        autoFetch = true,
        onDataLoaded = null,
        onError = null
    } = options;

    // Hooks globales
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError, showInfo } = useNotification();

    // Estados principales
    const [loading, setLoading] = useState(false);
    const [hasPEA, setHasPEA] = useState(false);
    const [peaData, setPeaData] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    // Estados derivados para estadísticas
    const [statistics, setStatistics] = useState({
        totalConcepts: 0,
        totalUnits: 0,
        conceptsByUnit: []
    });

    // Obtiene el nivel de vista según permisos del usuario
    const viewLevel = getPEAViewLevel(currentUser.rol);

    // Función principal para obtener datos del PEA
    const fetchPEAData = useCallback(async () => {
        // Validar subjectId
        const validation = validateSubjectId(subjectId);
        if (!validation.isValid) {
            setError(validation.error);
            showError(validation.error);
            setHasPEA(false);
            setPeaData(null);
            return { success: false, error: validation.error };
        }

        setLoading(true);
        clearError();

        try {
            const response = await listPEAService(subjectId);

            if (response.ok) {
                const hasPEAData = response.data !== null;
                
                setHasPEA(hasPEAData);
                setPeaData(response.data);
                setLastFetch(new Date().toISOString());

                // Calcular estadísticas si hay datos
                if (hasPEAData && response.data) {
                    setStatistics({
                        totalConcepts: response.data.totalConcepts || 0,
                        totalUnits: response.data.totalUnits || 0,
                        conceptsByUnit: response.data.conceptsByUnit || []
                    });
                } else {
                    setStatistics({
                        totalConcepts: 0,
                        totalUnits: 0,
                        conceptsByUnit: []
                    });
                }

                // Callback de datos cargados
                if (onDataLoaded) {
                    onDataLoaded(response.data, hasPEAData);
                }

                // Mostrar mensaje informativo si no hay PEA
                if (!hasPEAData) {
                    showInfo('No hay PEA registrado para esta materia');
                }

                return { 
                    success: true, 
                    data: response.data, 
                    hasPEA: hasPEAData,
                    message: response.message 
                };

            } else {
                const errorMessage = response.message || 'Error al obtener PEA';
                
                setError(errorMessage);
                setHasPEA(false);
                setPeaData(null);
                showError(errorMessage);

                // Callback de error
                if (onError) {
                    onError(errorMessage);
                }
                
                return { success: false, error: errorMessage };
            }

        } catch (err) {
            const errorMessage = err.message || 'Error inesperado al cargar PEA';
            
            setError(errorMessage);
            setHasPEA(false);
            setPeaData(null);
            showError(errorMessage);

            // Callback de error
            if (onError) {
                onError(errorMessage);
            }
            
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [subjectId]);

    // Refresca los datos manualmente
    const refreshPEA = useCallback(async () => {
        return await fetchPEAData();
    }, [fetchPEAData]);

    // Resetea el estado
    const resetState = useCallback(() => {
        setLoading(false);
        clearError();
        setHasPEA(false);
        setPeaData(null);
        setLastFetch(null);
        setStatistics({
            totalConcepts: 0,
            totalUnits: 0,
            conceptsByUnit: []
        });
    }, []);

    // Obtiene conceptos de una unidad específica
    const getConceptsByUnit = useCallback((unitNumber) => {
        if (!peaData?.conceptsByUnit) return [];
        
        const unit = peaData.conceptsByUnit.find(u => u.unit === unitNumber);
        return unit?.concepts || [];
    }, [peaData]);

    // Obtiene resumen del PEA
    const getPEASummary = useCallback(() => {
        if (!hasPEA || !peaData) {
            return {
                exists: false,
                summary: 'No hay PEA registrado para esta materia'
            };
        }

        return {
            exists: true,
            id: peaData.id,
            description: peaData.description?.substring(0, 200) + '...',
            objective: peaData.objective?.substring(0, 150) + '...',
            totalConcepts: peaData.totalConcepts,
            totalUnits: peaData.totalUnits,
            dateCreated: peaData.dateCreated,
            state: peaData.state
        };
    }, [hasPEA, peaData]);

    // Filtra datos según permisos del usuario
    const getFilteredPEAData = useCallback(() => {
        if (!peaData) return null;

        if (viewLevel === 'student') {
            // Solo mostrar información limitada para estudiantes
            return {
                id: peaData.id,
                description: peaData.description,
                objective: peaData.objective,
                dateCreated: peaData.dateCreated,
                conceptsByUnit: peaData.conceptsByUnit,
                totalConcepts: peaData.totalConcepts,
                totalUnits: peaData.totalUnits
            };
        }

        // Admin y tutor ven todo
        return peaData;
    }, [peaData, viewLevel]);

    // Efecto para carga automática
    useEffect(() => {
        if (autoFetch && subjectId) {
            fetchPEAData();
        }
    }, [subjectId, autoFetch, fetchPEAData]);

    // Efecto de cleanup
    useEffect(() => {
        return () => {
            resetState();
        };
    }, []);

    return {
        // Estados principales
        loading,
        error,
        hasPEA,
        peaData: getFilteredPEAData(),
        lastFetch,
        
        // Estadísticas
        statistics,
        
        // Funciones de acción
        fetchPEAData,
        refreshPEA,
        resetState,
        
        // Funciones helper
        getConceptsByUnit,
        getPEASummary,
        
        // Estados de conveniencia
        isEmpty: !hasPEA && !loading && !error,
        isReady: !loading && hasPEA && peaData,
        hasError: !!error,
        
        // Permisos y datos del usuario
        viewLevel,
        canViewPEA: viewLevel !== 'none',
        currentUser,
        
        // Metadata
        subjectId,
        lastFetchFormatted: lastFetch ? 
            new Date(lastFetch).toLocaleString() : null,
            
        // Notificaciones (para que el componente pueda mostrarlas)
        showSuccess,
        showError,
        showInfo,

        // Funciones de error
        clearError,
        setError
    };
};