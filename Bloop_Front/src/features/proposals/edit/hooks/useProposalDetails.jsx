import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts';
import { listProposals } from '../../services/listProposal';
import { useLoadingState, useErrorState } from '@/hooks';

// Hook para obtener detalles completos de una propuesta específica (propuesta + objetivos + requerimientos)
const useProposalDetails = () => {
    const { user } = useAuth();

    // Estados principales
    const [proposalDetails, setProposalDetails] = useState(null);
    const [objectives, setObjectives] = useState([]);
    const [requirements, setRequirements] = useState([]);

    // Estados de UI reutilizables
    const { loading, startLoading, stopLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();

    // Obtiene los detalles completos de una propuesta específica
    const fetchProposalDetails = useCallback(async (proposalId) => {
        try {
            // Validación de entrada
            if (!proposalId || (!Number.isInteger(proposalId) && !Number.isInteger(parseInt(proposalId)))) {
                throw new Error('ID de propuesta inválido');
            }

            // Validación de usuario
            if (!user?.id || !user?.rol) {
                throw new Error('Usuario no autenticado');
            }

            startLoading();
            clearError();

            // Mapeo de rol
            const roleMap = { 'Admin': 1, 'Administrador': 1, 'Tutor': 2, 'Estudiante': 3 };
            const userRole = roleMap[user.rol];

            if (!userRole) {
                throw new Error('Rol de usuario inválido');
            }

            const numericProposalId = parseInt(proposalId);

            // Llamadas paralelas para obtener todos los datos
            const [proposalResponse, objectivesResponse, requirementsResponse] = await Promise.all([
                // Propuesta básica - usando el servicio existente pero solo necesitamos los datos de esta propuesta
                listProposals({
                    userId: user.id,
                    userRole,
                    section: 'general'
                }),
                
                // Objetivos de la propuesta
                listProposals({
                    userId: user.id,
                    userRole,
                    section: 'objetive',
                    proposalId: numericProposalId
                }),
                
                // Requerimientos de la propuesta
                listProposals({
                    userId: user.id,
                    userRole,
                    section: 'requeriments', 
                    proposalId: numericProposalId
                })
            ]);

            // Procesar respuesta de la propuesta - buscar la propuesta específica
            const proposalsData = proposalResponse.data || [];
            const specificProposal = proposalsData.find(proposal => 
                proposal.pp_id === numericProposalId
            );

            if (!specificProposal) {
                throw new Error('Propuesta no encontrada o no tienes permisos para verla');
            }

            // Procesar objetivos
            const objectivesData = objectivesResponse.data || [];
            
            // Procesar requerimientos
            const requirementsData = requirementsResponse.data || [];

            // Actualizar estados
            setProposalDetails(specificProposal);
            setObjectives(objectivesData);
            setRequirements(requirementsData);

            return {
                proposal: specificProposal,
                objectives: objectivesData,
                requirements: requirementsData
            };

        } catch (err) {
            console.error('Error en fetchProposalDetails:', err);
            const errorMessage = err.message || 'Error al cargar los detalles de la propuesta';
            setError(errorMessage);
            
            // Limpiar estados en caso de error
            setProposalDetails(null);
            setObjectives([]);
            setRequirements([]);
            
            throw new Error(errorMessage);
        } finally {
            stopLoading();
        }
    }, [user?.id, user?.rol, startLoading, stopLoading, setError, clearError]);

    // Refresca los datos de la propuesta actual
    const refreshProposalDetails = useCallback(async () => {
        if (proposalDetails?.pp_id) {
            return await fetchProposalDetails(proposalDetails.pp_id);
        }
    }, [proposalDetails?.pp_id, fetchProposalDetails]);

    // Limpia todos los estados
    const clearProposalDetails = useCallback(() => {
        setProposalDetails(null);
        setObjectives([]);
        setRequirements([]);
        clearError();
    }, [clearError]);

    // Verifica si una propuesta específica está cargada
    const isProposalLoaded = useCallback((proposalId) => {
        return proposalDetails && proposalDetails.pp_id === parseInt(proposalId);
    }, [proposalDetails]);

    return {
        // Datos principales
        proposalDetails,
        objectives,
        requirements,

        // Estados
        loading,
        error,

        // Acciones principales
        fetchProposalDetails,
        refreshProposalDetails,
        clearProposalDetails,

        // Estados derivados para UI
        hasDetails: !!proposalDetails,
        hasObjectives: objectives.length > 0,
        hasRequirements: requirements.length > 0,
        isEmpty: !proposalDetails && !loading,
        isProposalLoaded,

        // Contadores para UI
        objectivesCount: objectives.length,
        requirementsCount: requirements.length
    };
};

export default useProposalDetails;