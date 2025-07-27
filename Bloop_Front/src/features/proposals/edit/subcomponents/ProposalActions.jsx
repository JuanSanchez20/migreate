import React, { useState } from 'react';
import { 
    PencilIcon, 
    CheckIcon, 
    XMarkIcon, 
    UserPlusIcon,
    EyeIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components';

// Subcomponente para manejar las acciones disponibles según el rol del usuario
const ProposalActions = ({
    // Datos de la propuesta
    proposal,
    currentUser,
    permissions,
    availableActions,

    // Estados de loading
    loading = {},

    // Callbacks para acciones
    onEdit,
    onApprove,
    onReject,
    onApply,
    onClose,

    // Configuración
    mode = 'view' // 'view' | 'edit'
}) => {
    // Estados locales para confirmaciones
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);

    // Función para manejar aprobación con confirmación
    const handleApprove = async () => {
        if (!showApproveConfirm) {
            setShowApproveConfirm(true);
            return;
        }

        try {
            await onApprove?.(proposal.id);
            setShowApproveConfirm(false);
        } catch (error) {
            // El error se maneja en el componente padre
            setShowApproveConfirm(false);
        }
    };

    // Función para manejar rechazo con razón
    const handleReject = async () => {
        if (!showRejectConfirm) {
            setShowRejectConfirm(true);
            return;
        }

        try {
            await onReject?.(proposal.id, rejectReason.trim());
            setShowRejectConfirm(false);
            setRejectReason('');
        } catch (error) {
            // El error se maneja en el componente padre
            setShowRejectConfirm(false);
        }
    };

    // Función para cancelar confirmaciones
    const cancelConfirmations = () => {
        setShowApproveConfirm(false);
        setShowRejectConfirm(false);
        setRejectReason('');
    };

    // Función para obtener el mensaje contextual según rol y estado
    const getContextualMessage = () => {
        if (!currentUser || !proposal) return null;

        const userRole = typeof currentUser.rol === 'string' ? parseInt(currentUser.rol) : currentUser.rol;
        const isAuthor = proposal.autorId === currentUser.id;
        const status = proposal.estadoAprobacion;

        // Mensajes para el autor
        if (isAuthor) {
            if (status === 'Pendiente') {
                return {
                    type: 'info',
                    message: 'Tu propuesta está pendiente de revisión por parte de un tutor o administrador.'
                };
            } else if (status === 'Aprobada') {
                return {
                    type: 'success',
                    message: 'Tu propuesta ha sido aprobada y está disponible para que los estudiantes apliquen.'
                };
            } else if (status === 'Rechazada') {
                return {
                    type: 'warning',
                    message: 'Tu propuesta ha sido rechazada. Puedes editarla y volver a enviarla para revisión.'
                };
            }
        }

        // Mensajes para estudiantes
        if (userRole === 3 && !isAuthor) {
            if (status === 'Aprobada') {
                return {
                    type: 'success',
                    message: 'Esta propuesta está aprobada y disponible. Puedes aplicar si cumples con los requerimientos.'
                };
            } else {
                return {
                    type: 'info',
                    message: 'Esta propuesta aún no está disponible para aplicaciones.'
                };
            }
        }

        // Mensajes para admin/tutor
        if ((userRole === 1 || userRole === 2) && !isAuthor) {
            if (status === 'Pendiente') {
                return {
                    type: 'warning',
                    message: 'Esta propuesta requiere tu revisión para ser aprobada o rechazada.'
                };
            }
        }

        return null;
    };

    const contextualMessage = getContextualMessage();

    // Si estamos en modo de confirmación de rechazo
    if (showRejectConfirm) {
        return (
            <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                        <h4 className="font-semibold text-red-400">Confirmar Rechazo</h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">
                        ¿Estás seguro de que quieres rechazar esta propuesta? Esta acción cambiará su estado.
                    </p>
                    
                    {/* Campo opcional para razón de rechazo */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Razón del rechazo (opcional)
                        </label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Explica brevemente por qué se rechaza la propuesta..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 resize-none"
                            rows={3}
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {rejectReason.length}/200 caracteres
                        </p>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={cancelConfirmations}
                        disabled={loading.rejecting}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="rejected"
                        onClick={handleReject}
                        disabled={loading.rejecting}
                        isLoading={loading.rejecting}
                        className="flex-1"
                    >
                        Rechazar Propuesta
                    </Button>
                </div>
            </div>
        );
    }

    // Si estamos en modo de confirmación de aprobación
    if (showApproveConfirm) {
        return (
            <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <h4 className="font-semibold text-green-400">Confirmar Aprobación</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                        ¿Estás seguro de que quieres aprobar esta propuesta? 
                        Una vez aprobada, estará disponible para que los estudiantes apliquen.
                    </p>
                </div>
                
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={cancelConfirmations}
                        disabled={loading.approving}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="approved"
                        onClick={handleApprove}
                        disabled={loading.approving}
                        isLoading={loading.approving}
                        className="flex-1"
                    >
                        Aprobar Propuesta
                    </Button>
                </div>
            </div>
        );
    }

    // Vista normal de acciones
    return (
        <div className="space-y-4">
            {/* Mensaje contextual */}
            {contextualMessage && (
                <div className={`rounded-lg p-4 ${
                    contextualMessage.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
                    contextualMessage.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    'bg-blue-500/10 border border-blue-500/20'
                }`}>
                    <p className={`text-sm ${
                        contextualMessage.type === 'success' ? 'text-green-400' :
                        contextualMessage.type === 'warning' ? 'text-yellow-400' :
                        'text-blue-400'
                    }`}>
                        {contextualMessage.message}
                    </p>
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Acciones principales según rol */}
                {availableActions?.map((action) => {
                    const getActionProps = () => {
                        switch (action.type) {
                            case 'edit':
                                return {
                                    onClick: () => onEdit?.(),
                                    disabled: loading.editing,
                                    isLoading: loading.editing,
                                    variant: 'outline',
                                    icon: <PencilIcon className="h-4 w-4" />
                                };
                            
                            case 'approve':
                                return {
                                    onClick: handleApprove,
                                    disabled: loading.approving,
                                    isLoading: loading.approving,
                                    variant: 'approved',
                                    icon: <CheckIcon className="h-4 w-4" />
                                };
                            
                            case 'reject':
                                return {
                                    onClick: () => setShowRejectConfirm(true),
                                    disabled: loading.rejecting,
                                    variant: 'rejected',
                                    icon: <XMarkIcon className="h-4 w-4" />
                                };
                            
                            case 'apply':
                                return {
                                    onClick: () => onApply?.(proposal.id),
                                    disabled: loading.applying,
                                    isLoading: loading.applying,
                                    variant: 'default',
                                    icon: <UserPlusIcon className="h-4 w-4" />
                                };
                            
                            default:
                                return {
                                    onClick: () => {},
                                    variant: 'outline',
                                    icon: <EyeIcon className="h-4 w-4" />
                                };
                        }
                    };

                    const actionProps = getActionProps();

                    return (
                        <Button
                            key={action.type}
                            {...actionProps}
                            className="flex-1 sm:flex-none"
                        >
                            <span className="flex items-center space-x-2">
                                {actionProps.icon}
                                <span>{action.label}</span>
                            </span>
                        </Button>
                    );
                })}
            </div>

            {/* Información adicional sobre permisos */}
            {permissions && (
                <div className="text-xs text-gray-500 space-y-1">
                    {permissions.canEdit && (
                        <p>• Puedes editar esta propuesta porque eres su autor</p>
                    )}
                    {permissions.canManageApproval && (
                        <p>• Puedes aprobar/rechazar propuestas según tu rol</p>
                    )}
                    {permissions.canApply && (
                        <p>• Puedes aplicar a esta propuesta porque está aprobada</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProposalActions;