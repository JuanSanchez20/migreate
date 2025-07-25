import {
    AdminHome, 
    LoginPage,
    HomeGlobal,
    ProposalListPage,
    UserListPage,
    CreateUserPage,
    // UserProfile
} from '@/pages';

// Crea las rutas y llama al componente respectivo
export const routeConfig = [
    // Login
    {
        path: '/',
        element: LoginPage,
        isPublic: true,
        hasSmartRedirect: true,
        title: 'Iniciar Sesión'
    },

    // Solo Administradores (rol 1)
    {
        path: '/adminHome',
        element: AdminHome,
        allowedRoles: [1],
        title: 'Panel de Administración',
        description: 'Dashboard exclusivo para administradores'
    },

    // Tutores y Administradores (roles 1 y 2)
    {
        path: '/home',
        element: HomeGlobal,
        allowedRoles: [1, 2],
        title: 'Panel de Tutores',
        description: 'Herramientas para tutores y administradores'
    },

    // Cualquier usuario autenticado
    {
        path: '/home',
        element: HomeGlobal,
        allowedRoles: [1, 2, 3],
        title: 'Dashboard Principal',
        description: 'Panel principal para todos los usuarios'
    },

    // Listado de propuestas (Solo admins)
    {
        path: '/proposals',
        element: ProposalListPage,
        allowedRoles: [1, 2, 3],
        title: 'Listado de Propuestas',
        description: 'Gestión de propuestas del sistema'
    },

    // Listado de usuarios (Solo admins)
    {
        path: '/users',
        element: UserListPage,
        allowedRoles: [1],
        title: 'Listado de Usuarios',
        description: 'Gestión de usuarios del sistema'
    },

    // Creación de usuarios (Solo admins)
    {
        path: '/users/create',
        element: CreateUserPage,
        allowedRoles: [1],
        title: 'Creación de Usuarios',
        description: 'Gestión de usuarios del sistema'
    },

    // {
    //     path: '/profile',
    //     element: UserProfile,
    //     allowedRoles: [1, 2, 3],
    //     title: 'Mi Perfil',
    //     description: 'Configuración del perfil de usuario'
    // }
];

// Configuración de redirecciones por rol
export const roleRedirects = {
    1: '/adminHome',
    2: '/home',
    3: '/home'
};

// Obtiene la ruta de redirección para un rol específico
export const getRedirectPathForRole = (userRole) => {
    return roleRedirects[userRole] || '/home';
};