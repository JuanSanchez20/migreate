import React from 'react';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ExclamationTriangleIcon, 
    InformationCircleIcon,
    XMarkIcon 
} from '@heroicons/react/24/outline';
import { NOTIFICATION_TYPES } from '@/hooks';

// Configuración de estilos para cada tipo de notificación
const NOTIFICATION_STYLES = {
    [NOTIFICATION_TYPES.SUCCESS]: {
        container: 'bg-green-500/10 border-green-500/20 text-green-400',
        icon: CheckCircleIcon,
        iconColor: 'text-green-400'
    },
    [NOTIFICATION_TYPES.ERROR]: {
        container: 'bg-red-500/10 border-red-500/20 text-red-400',
        icon: XCircleIcon,
        iconColor: 'text-red-400'
    },
    [NOTIFICATION_TYPES.WARNING]: {
        container: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        icon: ExclamationTriangleIcon,
        iconColor: 'text-yellow-400'
    },
    [NOTIFICATION_TYPES.INFO]: {
        container: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        icon: InformationCircleIcon,
        iconColor: 'text-blue-400'
    }
};

// Componente global para mostrar notificaciones temporales
// Puede ser usado en cualquier parte de la aplicación
const NotificationBanner = ({ 
    notification, 
    onClose,
    className = "",
    position = "top", // "top" | "bottom" | "center"
    showCloseButton = true,
    autoClose = true
}) => {
    if (!notification) return null;

    const config = NOTIFICATION_STYLES[notification.type] || NOTIFICATION_STYLES[NOTIFICATION_TYPES.SUCCESS];
    const IconComponent = config.icon;

    // Clases de posición
    const positionClasses = {
        top: 'animate-in slide-in-from-top duration-300',
        bottom: 'animate-in slide-in-from-bottom duration-300',
        center: 'animate-in fade-in duration-300'
    };

    const animationClass = positionClasses[position] || positionClasses.top;

    return (
        <div className={`rounded-lg p-3 border flex items-center justify-between ${config.container} ${animationClass} ${className}`}>
            <div className="flex items-center space-x-3">
                <IconComponent className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
                <p className="text-sm font-medium">{notification.message}</p>
            </div>
            
            {showCloseButton && onClose && (
                <button
                    onClick={onClose}
                    className="ml-4 p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                    title="Cerrar notificación"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default NotificationBanner;