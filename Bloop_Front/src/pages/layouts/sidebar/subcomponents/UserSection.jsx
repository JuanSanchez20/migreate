import {
    ChevronRightIcon,
    UserIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Sección inferior del sidebar con información y menú del usuario
const UserSection = ({
    collapsed,
    userMenuRef,
    isMenuOpen,
    name,
    roleLabel,
    initials,
    handleMenuToggle,
    handleProfileClick,
    handleLogout
}) => (
    <div
        ref={userMenuRef}
        className={`border-t border-gray-700 relative ${collapsed ? 'p-2' : 'p-4'}`}
    >
        {collapsed ? (
            // Vista compacta: solo muestra el avatar con las iniciales
            <div className="flex justify-center">
                <div
                    className="w-12 h-12 rounded-full bg-teal-400 flex items-center justify-center 
                            text-gray-900 font-bold text-sm select-none cursor-pointer 
                            hover:bg-teal-300 transition-colors duration-200 shadow-lg"
                    title={`${name} - ${roleLabel}`}
                    onClick={handleMenuToggle}
                >
                    {initials}
                </div>
            </div>
        ) : (
            // Vista expandida: muestra nombre, rol y opciones del menú
            <div>
                {/* Botón con datos del usuario */}
                <div
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 
                                rounded-lg p-2 transition-colors duration-200"
                    onClick={handleMenuToggle}
                    title="Click para ver opciones"
                >
                    <div className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center 
                                        text-gray-900 font-semibold select-none">
                        {initials}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-white select-none">
                            {name}
                        </p>
                        <p className="text-xs text-gray-400 select-none">
                            {roleLabel}
                        </p>
                    </div>
                    <div className="text-gray-400">
                        {/* Flecha que rota al abrir el menú */}
                        <ChevronRightIcon
                            className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''
                                }`}
                        />
                    </div>
                </div>

                {/* Menú desplegable con acciones del usuario */}
                {isMenuOpen && (
                    <div className="mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden
                                        animate-in slide-in-from-top-2 fade-in-0 duration-200 ease-out">
                        {/* Opción para ver el perfil */}
                        <button
                            onClick={handleProfileClick}
                            className="profile-button w-full px-4 py-3 flex items-center space-x-3 
                                    hover:bg-gray-700 transition-colors duration-200 text-left"
                        >
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-200">Perfil</span>
                        </button>

                        {/* Línea divisoria */}
                        <div className="border-t border-gray-700"></div>

                        {/* Opción para cerrar sesión */}
                        <button
                            onClick={handleLogout}
                            className="logout-button w-full px-4 py-3 flex items-center space-x-3 
                                    hover:bg-red-600 transition-colors duration-200 text-left"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-200">Cerrar Sesión</span>
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
);

export { UserSection }