import { 
    SunIcon, 
    MoonIcon, 
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon 
} from '@heroicons/react/24/outline';

// Mapeo de roles string a números
export const mapRolStringToNumber = (rolString) => {
    const roleMap = {
        'Admin': 1,
        'Administrador': 1,
        'Tutor': 2,
        'Estudiante': 3
    };
    return roleMap[rolString] || null;
};

// Configuración de colores por semestre
export const getSemestreConfig = (semestre) => {
    const configs = [
        { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
        { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
        { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
        { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
        { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' }
    ];
    return configs[(semestre - 1) % configs.length] || configs[0];
};

// Configuración de iconos y colores por jornada
export const getJornadaConfig = (modalidad) => {
    const configs = {
        'matutina': { 
            icon: SunIcon, 
            color: 'text-yellow-400',
            bgSection: 'bg-gradient-to-br from-yellow-500/5 to-orange-500/5'
        },
        'nocturna': { 
            icon: MoonIcon, 
            color: 'text-purple-400',
            bgSection: 'bg-gradient-to-br from-purple-500/5 to-indigo-500/5'
        }
    };
    
    const modalidadLower = modalidad?.toLowerCase();
    return configs[modalidadLower] || { 
        icon: ClockIcon, 
        color: 'text-gray-400',
        bgSection: 'bg-gradient-to-br from-gray-500/5 to-slate-500/5'
    };
};

// Configuración de estado PEA
export const getPeaStatusConfig = (peaState) => {
    if (peaState === null || peaState === undefined) {
        return {
            icon: XCircleIcon,
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/10',
            label: 'Sin PEA'
        };
    }
    
    return peaState ? {
        icon: CheckCircleIcon,
        color: 'text-green-400', 
        bgColor: 'bg-green-500/10',
        label: 'PEA Activo'
    } : {
        icon: XCircleIcon,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10', 
        label: 'PEA Inactivo'
    };
};

// Agrupar materias por jornada
export const groupSubjectsByJornada = (subjects) => {
    const grouped = {
        matutina: [],
        nocturna: []
    };
    
    subjects.forEach(subject => {
        const jornada = subject.modalidad?.toLowerCase();
        if (jornada === 'matutina' || jornada === 'nocturna') {
            grouped[jornada].push(subject);
        } else {
            // Si no es matutina ni nocturna, agregar a matutina por defecto
            grouped.matutina.push(subject);
        }
    });
    
    return grouped;
};

// Obtener contadores de usuarios por rol
export const getUserCounts = (usuariosAsignados) => {
    if (!usuariosAsignados || !Array.isArray(usuariosAsignados)) {
        return { estudiantes: 0, tutores: 0 };
    }
    
    const estudiantes = usuariosAsignados.filter(u => u.rol === 3).length;
    const tutores = usuariosAsignados.filter(u => u.rol === 2).length;
    
    return { estudiantes, tutores };
};

// Obtener tutor asignado
export const getAssignedTutor = (usuariosAsignados) => {
    if (!usuariosAsignados || !Array.isArray(usuariosAsignados)) {
        return null;
    }
    
    return usuariosAsignados.find(user => user.rol === 2) || null;
};

// Verificar si usuario puede ver filtro de estado
export const canSeeStatusFilter = (userRole) => {
    const numericRole = typeof userRole === 'string' 
        ? mapRolStringToNumber(userRole) 
        : userRole;
    
    return numericRole === 1 || numericRole === 2; // Admin o Tutor
};

// Obtener opciones para select de semestre
export const getSemestreOptions = () => [
    { value: 'todos', label: 'Todos los semestres' },
    { value: '1', label: 'Primer Semestre' },
    { value: '2', label: 'Segundo Semestre' },
    { value: '3', label: 'Tercer Semestre' },
    { value: '4', label: 'Cuarto Semestre' },
    { value: '5', label: 'Quinto Semestre' }
];

// Obtener opciones para select de jornada
export const getJornadaOptions = () => [
    { value: 'todas', label: 'Todas las jornadas' },
    { value: 'matutina', label: 'Matutina' },
    { value: 'nocturna', label: 'Nocturna' }
];

// Obtener opciones para select de estado (solo Admin/Tutor)
export const getEstadoOptions = () => [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'activo', label: 'Materias Activas' },
    { value: 'inactivo', label: 'Materias Inactivas' }
];