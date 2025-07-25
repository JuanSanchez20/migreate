import { useState, useEffect } from 'react';
import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES } from '../helpers/modalConstants';

// Hook personalizado para manejar notificaciones temporales
// Permite mostrar mensajes de éxito, error y advertencia con auto-ocultado
export const useNotifications = () => {
    const [notification, setNotification] = useState(null);

    // Muestra una notificación del tipo especificado
    const showNotification = (message, type = NOTIFICATION_TYPES.SUCCESS) => {
        setNotification({
            message,
            type,
            timestamp: Date.now()
        });
    };

    // Oculta la notificación actual manualmente
    const hideNotification = () => {
        setNotification(null);
    };

    // Muestra una notificación de éxito
    const showSuccess = (message) => {
        showNotification(message, NOTIFICATION_TYPES.SUCCESS);
    };

    // Muestra una notificación de error
    const showError = (message) => {
        showNotification(message, NOTIFICATION_TYPES.ERROR);
    };

    // Muestra una notificación de advertencia
    const showWarning = (message) => {
        showNotification(message, NOTIFICATION_TYPES.WARNING);
    };

    // Efecto para auto-ocultar la notificación después del tiempo configurado
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, NOTIFICATION_CONFIG.DURATION);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    return {
        notification,
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showWarning
    };
};