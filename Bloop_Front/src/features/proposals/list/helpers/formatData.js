// Helper minimalista para formateo de datos

// Formatea fechas
export const formatDate = (dateString) => {
    if (!dateString) return 'No establecido';
    
    // Si la fecha viene en formato ISO con hora, extraer solo la fecha
    let dateToFormat = dateString;
    
    // Si viene con hora UTC (termina en Z), extraer solo la parte de fecha
    if (typeof dateString === 'string' && dateString.includes('T')) {
        dateToFormat = dateString.split('T')[0]; // "2025-08-15T00:00:00.000Z" → "2025-08-15"
    }
    
    const date = new Date(dateToFormat + 'T12:00:00'); // Agregar hora del mediodía para evitar problemas de zona horaria
    
    if (isNaN(date.getTime()) || date.getFullYear() < 1971) {
        return 'No establecido';
    }
    
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Obtiene el nombre de la materia de una propuesta
export const getSubjectName = (proposal) => {
    if (!proposal) return 'Sin materia';

    // Tu estructura actual: proposal.materia_nombre viene del SP
    return proposal.materia_nombre || 'Sin materia';
};

// Obtiene el nombre del autor de una propuesta
export const getAuthorName = (proposal) => {
    if (!proposal) return 'Autor desconocido';

    return proposal.autor_nombre || 'Autor desconocido';
};

// Formatea descripción limitando caracteres para las tarjetas
export const formatDescription = (description, maxLength = 150) => {
    if (!description || typeof description !== 'string') {
        return 'Sin descripción disponible';
    }

    const clean = description.trim();
    if (clean.length <= maxLength) return clean;

    return clean.substring(0, maxLength).trim() + '...';
};

// Obtiene el tipo de proyecto de una propuesta
export const getProjectType = (proposal) => {
    if (!proposal) return 'Sin tipo';

    return proposal.tipo_proyecto || 'Sin tipo';
};