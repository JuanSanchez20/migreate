// Helper para formatear datos de propuestas de manera consistente

// Formatea fechas de manera consistente en toda la aplicación
export const formatDate = (dateString) => {
    if (!dateString || dateString === null) return 'No establecido';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() < 1971) {
        return 'No establecido';
    }
    
    return date.toLocaleDateString('es-ES');
};

// Formatea fechas para inputs de tipo date
export const formatDateForInput = (dateString) => {
    if (!dateString || dateString === null) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
};

// Convierte números de rol a texto legible
export const formatRole = (roleNumber) => {
    const roleMap = {
        1: 'Administrador',
        2: 'Tutor',
        3: 'Estudiante'
    };
    return roleMap[roleNumber] || 'Desconocido';
};

// Obtiene las clases CSS para el estado de aprobación
export const getStatusStyles = (status) => {
    const statusStyles = {
        'Aprobada': {
            container: 'text-green-400 bg-green-400/10 border-green-400/20',
            text: 'text-green-400',
            bg: 'bg-green-400/10'
        },
        'Pendiente': {
            container: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            text: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        },
        'Rechazada': {
            container: 'text-red-400 bg-red-400/10 border-red-400/20',
            text: 'text-red-400',
            bg: 'bg-red-400/10'
        }
    };
    
    return statusStyles[status] || statusStyles['Pendiente'];
};

// Obtiene las clases CSS para el nivel de dificultad
export const getDifficultyStyles = (difficulty) => {
    const difficultyStyles = {
        'Alto': 'bg-red-600 text-white',
        'Medio': 'bg-yellow-600 text-white',
        'Bajo': 'bg-green-600 text-white'
    };
    
    return difficultyStyles[difficulty] || 'bg-gray-600 text-white';
};

// Formatea la modalidad del proyecto
export const formatModality = (isGroupal, maxMembers = null) => {
    if (!isGroupal) return 'Individual';
    
    if (maxMembers && maxMembers > 1) {
        return `Grupal (máx. ${maxMembers} integrantes)`;
    }
    
    return 'Grupal';
};

// Formatea una lista de texto separada por punto y coma
export const formatTextList = (text, emptyText = 'No especificado') => {
    if (!text || !text.trim()) return emptyText;
    
    const items = text.split(';')
        .map(item => item.trim())
        .filter(Boolean);
    
    if (items.length === 0) return emptyText;
    
    return items;
};

// Formatea el tipo de objetivo
export const formatObjectiveType = (type) => {
    const typeMap = {
        'General': 'General',
        'Específico': 'Específico'
    };
    return typeMap[type] || 'General';
};

// Formatea el nombre completo del autor con su rol
export const formatAuthorInfo = (authorName, authorId, roleNumber) => {
    const name = authorName || `Usuario ${authorId}`;
    const role = formatRole(roleNumber);
    return { name, role };
};

// Formatea el estado de una aplicación
export const formatApplicationStatus = (status) => {
    const statusMap = {
        'Pendiente': 'Pendiente',
        'Aceptado': 'Aceptado',
        'Rechazado': 'Rechazado'
    };
    return statusMap[status] || 'Pendiente';
};

// Trunca texto largo y agrega puntos suspensivos
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Formatea un número para mostrar como contador
export const formatCount = (count) => {
    if (!count || count === 0) return '0';
    if (count > 999) return '999+';
    return count.toString();
};