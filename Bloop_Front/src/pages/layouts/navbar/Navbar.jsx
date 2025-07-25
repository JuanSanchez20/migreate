import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useNavbar } from './hooks/useNavbar';
import { useNavbarPermissions } from './hooks/useNavbarPermissions';

import { PageHeader } from '@/components';

import NavItem from './subcomponents/NavItem';
import PermissionGate from './subcomponents/PermissionGate';
import CreateButton from './subcomponents/CreateButton';

import { MoonIcon, SunIcon, BellIcon } from '@heroicons/react/24/outline';

// Componente principal
export default function Navbar() {
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);

    // Hooks para funcionalidad del navbar
    const {
        themeFocused,
        notifFocused,
        addFocused,
        themeHandlers,
        notifHandlers,
        addHandlers,
    } = useNavbar();

    // Hook para permisos del navbar
    const { 
        routeMetadata, 
        canShowCreateButton 
    } = useNavbarPermissions(location.pathname);

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-none mx-0 sm:mx-4 mt-0 sm:mt-4 transition-all duration-300">
            <div className="flex items-center justify-between max-w-[calc(100%_-_4rem)] mx-1">
                
                {/* Título dinámico */}
                <div className="flex-1 min-w-0">
                    <PageHeader
                        title={routeMetadata.title}
                        description={routeMetadata.description}
                        icon={routeMetadata.headerIcon}
                        compact={true}
                    />
                </div>

                {/* Controles del navbar */}
                <div className="flex items-center space-x-3 flex-shrink-0">

                    {/* Botón de creación con validación de permisos */}
                    <PermissionGate canAccess={canShowCreateButton}>
                        <CreateButton
                            routeMetadata={routeMetadata}
                            currentPath={location.pathname}
                            addFocused={addFocused}
                            addHandlers={addHandlers}
                        />
                    </PermissionGate>

                    {/* Botón de modo claro/oscuro */}
                    <NavItem
                        focused={themeFocused}
                        {...themeHandlers}
                        onClick={() => setDarkMode(!darkMode)}
                        ariaLabel="Toggle dark mode"
                        icon={
                            darkMode ? (
                                <SunIcon className={`h-4 w-4 ${themeFocused ? 'text-teal-600 dark:text-teal-400' : 'text-yellow-400 group-hover:text-yellow-500'} transition-colors`} />
                            ) : (
                                <MoonIcon className={`h-4 w-4 ${themeFocused ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'} transition-colors`} />
                            )
                        }
                    />

                    {/* Botón de notificaciones */}
                    <NavItem
                        focused={notifFocused}
                        {...notifHandlers}
                        ariaLabel="Notificaciones"
                        showDot={true}
                        icon={
                            <BellIcon className={`h-4 w-4 ${notifFocused ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'} transition-colors`} />
                        }
                    />

                    {/* Información del usuario */}
                    <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 dark:border-gray-700">
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-tight">Diseño Web</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}