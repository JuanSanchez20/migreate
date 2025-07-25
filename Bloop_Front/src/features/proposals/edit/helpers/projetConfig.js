import { 
    CheckCircleIcon, 
    ClockIcon, 
    XCircleIcon,
    UserIcon,
    BookOpenIcon,
    DocumentTextIcon,
    CalendarIcon,
    ChartBarIcon,
    PencilIcon,
    EyeIcon,
    UserGroupIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/solid';

// Configuraciones centralizadas para propuestas

// Configuración de estados de aprobación
export const APPROVAL_STATUS_CONFIG = {
    'Aprobada': {
        label: 'Aprobada',
        icon: CheckCircleIcon,
        color: 'green',
        styles: {
            text: 'text-green-400',
            bg: 'bg-green-400/10',
            border: 'border-green-400/20',
            container: 'text-green-400 bg-green-400/10 border-green-400/20'
        }
    },
    'Pendiente': {
        label: 'Pendiente',
        icon: ClockIcon,
        color: 'yellow',
        styles: {
            text: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            border: 'border-yellow-400/20',
            container: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
        }
    },
    'Rechazada': {
        label: 'Rechazada',
        icon: XCircleIcon,
        color: 'red',
        styles: {
            text: 'text-red-400',
            bg: 'bg-red-400/10',
            border: 'border-red-400/20',
            container: 'text-red-400 bg-red-400/10 border-red-400/20'
        }
    }
};

// Configuración de niveles de dificultad
export const DIFFICULTY_CONFIG = {
    'Bajo': {
        label: 'Bajo',
        color: 'green',
        styles: 'bg-green-600 text-white',
        order: 1
    },
    'Medio': {
        label: 'Medio',
        color: 'yellow',
        styles: 'bg-yellow-600 text-white',
        order: 2
    },
    'Alto': {
        label: 'Alto',
        color: 'red',
        styles: 'bg-red-600 text-white',
        order: 3
    }
};

// Configuración de roles de usuario
export const ROLE_CONFIG = {
    1: {
        name: 'Administrador',
        label: 'Admin',
        icon: UserIcon,
        color: 'blue',
        permissions: ['view_all', 'view_applicants']
    },
    2: {
        name: 'Tutor',
        label: 'Tutor',
        icon: BookOpenIcon,
        color: 'teal',
        permissions: ['view_subject', 'edit_own', 'view_applicants']
    },
    3: {
        name: 'Estudiante',
        label: 'Estudiante',
        icon: UserGroupIcon,
        color: 'green',
        permissions: ['view_approved', 'apply', 'edit_own']
    }
};

// Configuración de tipos de objetivos
export const OBJECTIVE_TYPE_CONFIG = {
    'General': {
        label: 'General',
        color: 'blue',
        description: 'Objetivo principal del proyecto'
    },
    'Específico': {
        label: 'Específico',
        color: 'teal',
        description: 'Objetivos específicos a cumplir'
    }
};

// Configuración de modalidades de proyecto
export const MODALITY_CONFIG = {
    individual: {
        label: 'Individual',
        value: false,
        icon: UserIcon,
        description: 'Proyecto para un solo integrante'
    },
    grupal: {
        label: 'Grupal',
        value: true,
        icon: UserGroupIcon,
        description: 'Proyecto para múltiples integrantes'
    }
};

// Configuración de acciones disponibles en la modal
export const MODAL_ACTIONS_CONFIG = {
    view: {
        label: 'Ver Detalles',
        icon: EyeIcon,
        color: 'blue',
        description: 'Ver información completa'
    },
    edit: {
        label: 'Editar',
        icon: PencilIcon,
        color: 'yellow',
        description: 'Modificar propuesta'
    },
    apply: {
        label: 'Aplicar',
        icon: CheckIcon,
        color: 'green',
        description: 'Solicitar unirse al proyecto'
    },
    viewApplicants: {
        label: 'Ver Aplicantes',
        icon: UserGroupIcon,
        color: 'teal',
        description: 'Ver quién ha aplicado'
    }
};

// Configuración de vistas de la modal
export const MODAL_VIEWS_CONFIG = {
    details: {
        title: 'Detalles de la Propuesta',
        icon: DocumentTextIcon,
        showBack: false
    },
    edit: {
        title: 'Editar Propuesta',
        icon: PencilIcon,
        showBack: true
    },
    actions: {
        title: 'Acciones de la Propuesta',
        icon: ChartBarIcon,
        showBack: true
    }
};

// Rangos válidos para configuraciones
export const VALIDATION_RANGES = {
    maxIntegrantes: {
        min: 2,
        max: 10,
        default: 2
    },
    nameLength: {
        min: 5,
        max: 40
    },
    descriptionLength: {
        min: 10,
        max: 500
    },
    objectiveNameLength: {
        min: 5,
        max: 155
    },
    requirementNameLength: {
        min: 5,
        max: 50
    }
};

// Opciones para selects en formularios
export const SELECT_OPTIONS = {
    approvalStatus: Object.keys(APPROVAL_STATUS_CONFIG).map(key => ({
        value: key,
        label: APPROVAL_STATUS_CONFIG[key].label
    })),
    
    difficulty: Object.keys(DIFFICULTY_CONFIG)
        .sort((a, b) => DIFFICULTY_CONFIG[a].order - DIFFICULTY_CONFIG[b].order)
        .map(key => ({
            value: key,
            label: DIFFICULTY_CONFIG[key].label
        })),
    
    objectiveType: Object.keys(OBJECTIVE_TYPE_CONFIG).map(key => ({
        value: key,
        label: OBJECTIVE_TYPE_CONFIG[key].label
    })),
    
    modality: [
        {
            value: false,
            label: MODALITY_CONFIG.individual.label
        },
        {
            value: true,
            label: MODALITY_CONFIG.grupal.label
        }
    ]
};

// Configuración de textos por defecto
export const DEFAULT_TEXTS = {
    emptyState: {
        noProposals: 'No hay propuestas disponibles',
        noObjectives: 'No hay objetivos definidos',
        noRequirements: 'No hay requerimientos especificados',
        noApplicants: 'Nadie ha aplicado a esta propuesta',
        loading: 'Cargando propuestas...',
        error: 'Error al cargar datos'
    },
    placeholders: {
        searchProposals: 'Buscar propuestas...',
        proposalName: 'Nombre de la propuesta',
        description: 'Describe el proyecto...',
        objectiveName: 'Título del objetivo',
        requirementName: 'Título del requerimiento'
    },
    messages: {
        success: {
            proposalSaved: 'Propuesta guardada correctamente',
            applicationSent: 'Aplicación enviada correctamente',
            applicationCanceled: 'Aplicación cancelada'
        },
        errors: {
            loadProposals: 'Error al cargar propuestas',
            saveProposal: 'Error al guardar la propuesta',
            applyProposal: 'Error al aplicar a la propuesta'
        }
    }
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
    modal: {
        enter: 'animate-in fade-in duration-300',
        exit: 'animate-out fade-out duration-200'
    },
    card: {
        hover: 'transition-all duration-200 hover:scale-105',
        loading: 'animate-pulse'
    },
    notification: {
        enter: 'animate-in slide-in-from-top duration-300',
        exit: 'animate-out slide-out-to-top duration-200'
    }
};

// Funciones helper para obtener configuraciones
export const getStatusConfig = (status) => {
    return APPROVAL_STATUS_CONFIG[status] || APPROVAL_STATUS_CONFIG['Pendiente'];
};

export const getDifficultyConfig = (difficulty) => {
    return DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG['Medio'];
};

export const getRoleConfig = (roleNumber) => {
    return ROLE_CONFIG[roleNumber] || ROLE_CONFIG[3];
};

export const getModalViewConfig = (view) => {
    return MODAL_VIEWS_CONFIG[view] || MODAL_VIEWS_CONFIG['details'];
};