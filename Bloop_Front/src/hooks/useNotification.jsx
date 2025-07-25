import { useState, useEffect } from 'react';

// Tipos de notificación disponibles
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Configuración por defecto de notificaciones
const DEFAULT_CONFIG = {
    DURATION: 3000, // 3 segundos por defecto
    FADE_DURATION: 300 // 300ms para animación
};

// Hook genérico para manejar notificaciones temporales
const useNotifications = (config = {}) => {
    // Configuración personalizable
    const notificationConfig = {
        ...DEFAULT_CONFIG,
        ...config
    };

    // Estado de la notificación actual
    const [notification, setNotification] = useState(null);

    // Muestra una notificación del tipo especificado
    const showNotification = (message, type = NOTIFICATION_TYPES.SUCCESS, customDuration = null) => {
        if (!message) {
            console.warn('useNotifications: No se puede mostrar notificación sin mensaje');
            return;
        }

        setNotification({
            message,
            type,
            timestamp: Date.now(),
            duration: customDuration || notificationConfig.DURATION
        });
    };

    // Oculta la notificación actual manualmente
    const hideNotification = () => {
        setNotification(null);
    };

    // Muestra una notificación de éxito
    const showSuccess = (message, duration) => {
        showNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
    };

    // Muestra una notificación de error
    const showError = (message, duration) => {
        showNotification(message, NOTIFICATION_TYPES.ERROR, duration);
    };

    // Muestra una notificación de advertencia
    const showWarning = (message, duration) => {
        showNotification(message, NOTIFICATION_TYPES.WARNING, duration);
    };

    // Muestra una notificación informativa
    const showInfo = (message, duration) => {
        showNotification(message, NOTIFICATION_TYPES.INFO, duration);
    };

    // Verifica si hay una notificación activa
    const hasNotification = () => {
        return notification !== null;
    };

    // Obtiene el tipo de la notificación actual
    const getCurrentType = () => {
        return notification?.type || null;
    };

    // Limpia todas las notificaciones
    const clearNotifications = () => {
        setNotification(null);
    };

    // Efecto para auto-ocultar la notificación después del tiempo configurado
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, notification.duration || notificationConfig.DURATION);

            return () => clearTimeout(timer);
        }
    }, [notification, notificationConfig.DURATION]);

    return {
        // Estado
        notification,
        hasNotification,

        // Funciones principales
        showNotification,
        hideNotification,
        clearNotifications,

        // Funciones por tipo
        showSuccess,
        showError,
        showWarning,
        showInfo,

        // Funciones de utilidad
        getCurrentType,

        // Configuración actual
        config: notificationConfig
    };
};

export default useNotifications;