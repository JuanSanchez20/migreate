import { useState, useCallback } from 'react';
import { useLoadingState, useErrorState, useNotifications } from '@/hooks';

// Hook para manejar aplicaciones a propuestas y listar aplicantes
const useProjectActions = (userInfo) => {
    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError } = useNotifications();

    // Estado de aplicantes para una propuesta
    const [applicants, setApplicants] = useState([]);
    const [hasApplied, setHasApplied] = useState(false);

    // Aplica a una propuesta (solo estudiantes)
    const applyToProposal = useCallback(async (proposalId) => {
        if (!proposalId) {
            setError('ID de propuesta requerido');
            return false;
        }

        return await withLoading(async () => {
            try {
                const payload = {
                    proposalId,
                    studentId: userInfo.id
                };

                // Aquí iría la llamada al servicio cuando esté implementado
                console.log('Aplicando a propuesta:', payload);
                await new Promise(resolve => setTimeout(resolve, 1000));

                setHasApplied(true);
                showSuccess('Aplicación enviada correctamente');
                clearError();
                return true;

            } catch (err) {
                const errorMessage = err?.message || 'Error al aplicar a la propuesta';
                setError(errorMessage);
                showError(errorMessage);
                return false;
            }
        });
    }, [withLoading, userInfo.id, showSuccess, showError, setError, clearError]);

    // Cancela la aplicación a una propuesta
    const cancelApplication = useCallback(async (proposalId) => {
        if (!proposalId) {
            setError('ID de propuesta requerido');
            return false;
        }

        return await withLoading(async () => {
            try {
                const payload = {
                    proposalId,
                    studentId: userInfo.id
                };

                // Aquí iría la llamada al servicio cuando esté implementado
                console.log('Cancelando aplicación:', payload);
                await new Promise(resolve => setTimeout(resolve, 1000));

                setHasApplied(false);
                showSuccess('Aplicación cancelada');
                clearError();
                return true;

            } catch (err) {
                const errorMessage = err?.message || 'Error al cancelar la aplicación';
                setError(errorMessage);
                showError(errorMessage);
                return false;
            }
        });
    }, [withLoading, userInfo.id, showSuccess, showError, setError, clearError]);

    // Lista los estudiantes que aplicaron a una propuesta
    const loadApplicants = useCallback(async (proposalId) => {
        if (!proposalId) {
            setError('ID de propuesta requerido');
            return;
        }

        return await withLoading(async () => {
            try {
                const payload = {
                    proposalId
                };

                // Aquí iría la llamada al servicio cuando esté implementado
                console.log('Cargando aplicantes para propuesta:', payload);
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Datos simulados
                const mockApplicants = [
                    {
                        studentId: 1,
                        studentName: 'Juan Pérez',
                        studentEmail: 'juan@example.com',
                        applicationDate: '2024-01-15'
                    },
                    {
                        studentId: 2,
                        studentName: 'María García',
                        studentEmail: 'maria@example.com',
                        applicationDate: '2024-01-16'
                    }
                ];

                setApplicants(mockApplicants);
                clearError();

            } catch (err) {
                const errorMessage = err?.message || 'Error al cargar aplicantes';
                setError(errorMessage);
                showError(errorMessage);
                setApplicants([]);
            }
        });
    }, [withLoading, showError, setError, clearError]);

    // Verifica si el usuario actual ha aplicado a una propuesta
    const checkApplicationStatus = useCallback(async (proposalId) => {
        if (!proposalId) return;

        try {
            const payload = {
                proposalId,
                studentId: userInfo.id
            };

            // Aquí iría la llamada al servicio cuando esté implementado
            console.log('Verificando estado de aplicación:', payload);
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulación temporal
            setHasApplied(false);

        } catch (err) {
            console.error('Error al verificar aplicación:', err);
            setHasApplied(false);
        }
    }, [userInfo.id]);



    // Limpia el estado de aplicantes
    const clearApplicants = useCallback(() => {
        setApplicants([]);
        setHasApplied(false);
        clearError();
    }, [clearError]);

    return {
        // Estados
        applicants,
        hasApplied,
        loading,
        error,

        // Funciones para estudiantes
        applyToProposal,
        cancelApplication,
        checkApplicationStatus,

        // Funciones para tutores/admins
        loadApplicants,

        // Utilidades
        clearApplicants
    };
};

export default useProjectActions;