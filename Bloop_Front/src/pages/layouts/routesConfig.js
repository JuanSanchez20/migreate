import {
    HomeIcon,
    FolderPlusIcon,
    CogIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    AcademicCapIcon,
    UserPlusIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

export const routesConfig = {
    '/adminHome': {
        // header
        title: 'Panel Principal',
        description: 'Bienvenido al panel principal de Bloop',
        headerIcon: HomeIcon,
        // sidebar
        label: 'Inicio',
        sideIcon: HomeIcon,
        allowedRoles: [1],
    },
    '/home': {
        // header
        title: 'Panel Principal',
        description: 'Bienvenido al sistema de gestión académica',
        headerIcon: HomeIcon,
        // sidebar
        label: 'Inicio',
        sideIcon: HomeIcon,
        allowedRoles: [2, 3],
    },
    '/proposals': {
        // header
        title: 'Propuestas',
        description: 'Gestiona las propuestas de los usuarios',
        headerIcon: CogIcon,

        // sidebar
        label: 'Propuestas',
        sideIcon: ClipboardDocumentListIcon,
        allowedRoles: [1, 2, 3],
        // Botón para agregar una nueva propuesta
        icon: FolderPlusIcon,
        createPath: '/proposals/create',
        createLabel: 'Agregar Propuesta'
    },
    '/proposals/create': {
        // header
        title: 'Crear Nueva Propuesta',
        description: 'Completa el formulario para crear una nueva propuesta en el sistema',
        headerIcon: FolderPlusIcon,
        // sidebar
        label: 'Propuestas',
        sideIcon: FolderPlusIcon,
        allowedRoles: [1, 2],
        // Botón para listar las propuestas
        createPath: '/proposals',
        createLabel: 'Listar Propuestas'
    },
    '/users': {
        // header
        title: 'Gestión de Usuarios',
        description: 'Administra los usuarios del sistema',
        headerIcon: UsersIcon,
        // sidebar
        label: 'Usuarios',
        sideIcon: UsersIcon,
        allowedRoles: [1],
        // Botón para agregar un nuevo usuario
        icon: UserPlusIcon,
        createPath: '/users/create',
        createLabel: 'Agregar Usuario'
    },
    '/users/create': {
        // header
        title: 'Crear Nuevo Usuario',
        description: 'Completa el formulario para registrar un nuevo usuario en el sistema',
        headerIcon: UsersIcon,
        // sidebar
        label: 'Usuarios',
        sideIcon: UsersIcon,
        allowedRoles: [1],
        // Botón para ver los usuarios
        createPath: '/users',
        createLabel: 'Ver Usuarios'
    },
    '/courses': {
        // header
        title: 'Gestión de Materias',
        description: 'Administra las materias del sistema',
        headerIcon: AcademicCapIcon,
        // sidebar
        label: 'Materias',
        sideIcon: AcademicCapIcon,
        allowedRoles: [1, 2, 3],
        // Botón para agregar una nueva materia
        icon: BookOpenIcon,
        createPath: '/courses/create',
        createLabel: 'Agregar Materia'
    },
    '/courses/create': {
        // header
        title: 'Crear Nueva Materia',
        description: 'Completa el formulario para crear una nueva materia en el sistema',
        headerIcon: AcademicCapIcon,
        // sidebar
        label: 'Materias',
        sideIcon: AcademicCapIcon,
        allowedRoles: [1],
        // Botón para ver las materias
        createPath: '/courses',
        createLabel: 'Ver Materias'
    },
    default: {
        title: 'Página no encontrada',
        description: 'Ruta no válida',
        headerIcon: HomeIcon, // O cualquier ícono por defecto
        createPath: '/',
        createLabel: 'Volver al inicio',
        icon: HomeIcon // Asegúrate de incluir el campo 'icon'
    }
};