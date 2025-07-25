// Helper que Transforma los datos de los usuarios
// Mapea el rol de usuario a texto
export const mapRoleToText = (rolNumber) => {
    const roleMap = {
        1: 'Administrador',
        2: 'Tutor',
        3: 'Estudiante'
    };

    return roleMap[rolNumber] || 'Desconocido';
};

// Mapea el texto del rol a número
export const mapTextToRole = (rolText) => {
    const roleMap = {
        'administrador': 1,
        'tutor': 2,
        'estudiante': 3
    };

    return roleMap[rolText?.toLowerCase()] || 0;
};

// Obtiene las clases de color según el rol
export const getRoleColor = (role) => {
    // Si recibe texto, convertir a número
    const roleNumber = typeof role === 'string' ? mapTextToRole(role) : role;

    const colorMap = {
        1: 'bg-purple-500/10 text-purple-400 border-purple-500/20', // Administrador - Morado
        2: 'bg-[#278bbd]/10 text-[#278bbd] border-[#278bbd]/20',    // Tutor - Azul
        3: 'bg-[#48d1c1]/10 text-[#48d1c1] border-[#48d1c1]/20'    // Estudiante - Verde azulado
    };

    return colorMap[roleNumber] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

// Obtiene las clases de color para el estado del usuario
export const getStatusColor = (isActive) => {
    return isActive 
        ? 'text-green-400 bg-green-400/10 border-green-400/20'
        : 'text-red-400 bg-red-400/10 border-red-400/20';
};

// Mapea el estado booleano a texto
export const mapStatusToText = (isActive) => {
    return isActive ? 'Activo' : 'Inactivo';
};

// Obtiene el ícono correspondiente al estado
export const getStatusIcon = (isActive) => {
    return isActive ? 'CheckCircleIcon' : 'XCircleIcon';
};

// Transforma el string de materias separado por comas en un arreglo
export const parseSubjectsString = (materiasString) => {
    if (!materiasString || typeof materiasString !== 'string') {
        return [];
    }
    
    return materiasString
        .split(',')
        .map(materia => materia.trim())
        .filter(materia => materia.length > 0);
};

// Convierte el arreglo de materias a string separado por comas
export const stringifySubjectsArray = (subjectsArray) => {
    if (!Array.isArray(subjectsArray)) {
        return '';
    }
    
    return subjectsArray
        .filter(materia => materia && materia.trim().length > 0)
        .join(', ');
};

// Obtiene las clases de color para el semestre
export const getSemesterColor = (semester) => {
    const semesterColors = {
        1: 'bg-blue-500/10 text-blue-400 border-blue-500/20',      // Primer semestre
        2: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',      // Segundo semestre  
        3: 'bg-teal-500/10 text-teal-400 border-teal-500/20',      // Tercer semestre
        4: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', // Cuarto semestre
        5: 'bg-green-500/10 text-green-400 border-green-500/20'    // Quinto semestre
    };
    
    return semesterColors[semester] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

// Formate la fecha de creación o actualización del usuario
export const formatUserDate = (dateString, includeTime = false) => {
    if (!dateString) return 'No disponible';
    
    try {
        const date = new Date(dateString);
        
        if (includeTime) {
            return date.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
};

// Obtiene el texto completo del usuario para búsquedas (nombre, email)
export const getUserSearchText = (user) => {
    if (!user) return '';
    
    const name = user.u_name || '';
    const email = user.u_email || '';
    
    return `${name} ${email}`.toLowerCase();
};

// Valida si un usuario tiene los campos mínimos requeridos
export const isValidUser = (user) => {
    if (!user || typeof user !== 'object') return false;
    
    const requiredFields = ['u_id', 'u_name', 'u_email', 'rol_name', 'u_rol'];
    
    return requiredFields.every(field => 
        user[field] !== undefined && 
        user[field] !== null && 
        user[field] !== ''
    );
};

// Obtiene un resumen del usuario para mostrar
export const getUserSummary = (user) => {
    if (!isValidUser(user)) return 'Usuario inválido';
    
    const materias = parseSubjectsString(user.materias);
    const materiasCount = materias.length;
    const estado = mapStatusToText(user.u_state);
    
    let summary = `${user.u_name} (${user.rol_name}) - ${estado}`;
    
    // Solo mostrar semestre para estudiantes
    if (user.u_rol === 3 && user.u_semester) {
        summary += ` - Semestre ${user.u_semester}`;
    }
    
    // Mostrar conteo de materias cursando para estudiantes
    if (user.u_rol === 3 && user.cursando_count !== undefined) {
        summary += ` - ${user.cursando_count} cursando`;
    }
    
    // Mostrar total de materias si hay
    if (materiasCount > 0) {
        summary += ` - ${materiasCount} materia${materiasCount > 1 ? 's' : ''} total`;
    }
    
    return summary;
};

// Filtra usuarios
export const filterUsersList = (users, filters) => {
    if (!Array.isArray(users)) return [];
    if (!filters || typeof filters !== 'object') return users;
    
    return users.filter(user => {
        // Filtro por email o nombre
        if (filters.email && filters.email.trim() !== '') {
            const searchText = getUserSearchText(user);
            const emailFilter = filters.email.toLowerCase().trim();
            if (!searchText.includes(emailFilter)) return false;
        }
        
        // Filtro por rol usando u_rol
        if (filters.rol && filters.rol !== 'todos') {
            if (filters.rol === '2' && user.u_rol !== 2) return false;
            if (filters.rol === '3' && user.u_rol !== 3) return false;
        }
        
        // Filtro por semestre (solo para estudiantes)
        if (filters.semestre && filters.semestre !== 'todos') {
            if (user.u_rol === 3) { // Solo estudiantes
                if (user.u_semester?.toString() !== filters.semestre) return false;
            }
        }
        
        // Filtro por estado usando u_state
        if (filters.estado && filters.estado !== 'todos') {
            const isActive = user.u_state === true || user.u_state === 1;
            if (filters.estado === 'activo' && !isActive) return false;
            if (filters.estado === 'suspendido' && isActive) return false;
        }
        
        return true;
    });
};