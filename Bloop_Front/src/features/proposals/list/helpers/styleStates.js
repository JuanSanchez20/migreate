// Helper minimalista para estilos y colores

// Clases CSS para niveles de prioridad
export const getPriorityClass = (priority) => {
    const priorityClasses = {
        'Avanzado': 'bg-red-600 text-white',
        'Intermedio': 'bg-yellow-500 text-white',
        'Básico': 'bg-green-500 text-white'
    };
    return priorityClasses[priority] || 'bg-gray-500 text-white';
};

// Colores para estados de propuestas (solo los que usas)
export const getStatusColors = (status) => {
    const statusColors = {
        'Aprobada': {
            primary: '#10b981', // green-500
            border: 'rgba(16, 185, 129, 0.6)',
            background: 'rgba(16, 185, 129, 0.1)',
            hover: 'rgba(16, 185, 129, 0.2)'
        },
        'Pendiente': {
            primary: '#f59e0b', // yellow-500
            border: 'rgba(245, 158, 11, 0.6)',
            background: 'rgba(245, 158, 11, 0.1)',
            hover: 'rgba(245, 158, 11, 0.2)'
        },
        'Rechazada': {
            primary: '#ef4444', // red-500
            border: 'rgba(239, 68, 68, 0.6)',
            background: 'rgba(239, 68, 68, 0.1)',
            hover: 'rgba(239, 68, 68, 0.2)'
        }
    };
    
    return statusColors[status] || {
        primary: '#6b7280', // gray-500
        border: 'rgba(107, 114, 128, 0.6)',
        background: 'rgba(107, 114, 128, 0.1)',
        hover: 'rgba(107, 114, 128, 0.2)'
    };
};

// Clases CSS para estados (complemento a getStatusColors)
export const getStatusClass = (status) => {
    const statusClasses = {
        'Aprobada': 'bg-green-500 text-white',
        'Pendiente': 'bg-yellow-500 text-white',
        'Rechazada': 'bg-red-500 text-white'
    };
    return statusClasses[status] || 'bg-gray-500 text-white';
};