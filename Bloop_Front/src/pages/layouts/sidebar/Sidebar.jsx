import { useSidebar } from './hooks/useSidebar';
import { useUserMenu } from './hooks/useUserMenu';
import { SidebarHeader } from './subcomponents/SideHeader';
import { Navigation } from './subcomponents/Navigation';
import { UserSection } from './subcomponents/UserSection';

// Componente principal del sidebar, maneja colapso y menú de usuario
const Sidebar = ({ collapsed: propCollapsed, onToggle }) => {
    // Estado del sidebar (colapsado o expandido) y del menú de usuario
    const {
        collapsed,
        setCollapsed,
        isMenuOpen,
        setIsMenuOpen
    } = useSidebar(propCollapsed, onToggle);

    // Datos y acciones del usuario para el menú inferior
    const {
        userMenuRef,
        name,
        userRole,
        roleLabel,
        initials,
        handleLogout,
        handleProfileClick,
        handleMenuToggle
    } = useUserMenu(isMenuOpen, setIsMenuOpen);

    return (
        <aside
            className={`
                bg-gray-900 text-gray-200 h-screen p-4 fixed 
                transition-[width] duration-500 ease-in-out z-20
                ${collapsed ? 'w-20' : 'w-64'}
                flex flex-col justify-between
                transform-gpu will-change-[width]
            `}
        >
            <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
            <Navigation collapsed={collapsed} userRole={userRole} />
            <UserSection
                collapsed={collapsed}
                userMenuRef={userMenuRef}
                isMenuOpen={isMenuOpen}
                name={name}
                roleLabel={roleLabel}
                initials={initials}
                handleMenuToggle={handleMenuToggle}
                handleProfileClick={handleProfileClick}
                handleLogout={handleLogout}
            />
        </aside>
    );
};

export default Sidebar;