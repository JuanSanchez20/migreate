import { useState, useCallback } from 'react';
import { createProposalService } from '../../services/createProposal';
import { validateProposal } from '../helpers/validationForm';
import { transformProposalData, getProposalStats } from '../helpers/formHelpers';
import { getSuccessMessage } from '../helpers/proposalValidate'

// Maneja el envío de propuestas
export const useProposalSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Envía la propuesta al backend
    const submitProposal = useCallback(async (formData, userInfo) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Transformar datos para el backend
            const proposalData = transformProposalData(formData, userInfo);
            
            // Validar datos
            const validationErrors = validateProposal(proposalData);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join('. '));
            }

            // Enviar al backend
            const response = await createProposalService(proposalData);
            
            // Generar mensaje de éxito
            const stats = getProposalStats(formData);
            const successMessage = getSuccessMessage(proposalData.name, userInfo.rol, stats);
            
            return {
                success: true,
                message: successMessage,
                data: response
            };

        } catch (error) {
            const errorMessage = error.message || 'Error desconocido al crear la propuesta';
            setSubmitError(errorMessage);
            
            return {
                success: false,
                message: errorMessage,
                error
            };
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // Limpia errores de envío
    const clearSubmitError = useCallback(() => {
        setSubmitError(null);
    }, []);

    return {
        isSubmitting,
        submitError,
        submitProposal,
        clearSubmitError
    };
};