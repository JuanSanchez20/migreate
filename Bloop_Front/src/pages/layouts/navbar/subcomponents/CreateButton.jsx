import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// Componente del botón de creación dinámico del navbar
const CreateButton = ({ 
    routeMetadata, 
    currentPath, 
    addFocused, 
    addHandlers 
}) => {
    // Determinar si estamos en una ruta de creación
    const isCreateRoute = currentPath.includes('/create');
    
    // Configuración del botón basada en el contexto
    const buttonConfig = {
        icon: isCreateRoute ? ClipboardDocumentListIcon : routeMetadata.icon,
        text: isCreateRoute 
            ? routeMetadata.createLabel 
            : `Agregar ${routeMetadata.label?.toLowerCase()}`,
        path: routeMetadata.createPath
    };
    
    const IconComponent = buttonConfig.icon;
    
    return (
        <div className={`relative transition-all duration-200 ${addFocused ? 'ring-2 ring-teal-400/50' : ''}`}>
            <Link
                to={buttonConfig.path}
                {...addHandlers}
                className={`p-1.5 rounded-lg flex items-center space-x-1.5 ${
                    addFocused
                        ? 'bg-teal-50 dark:bg-teal-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    } transition-all duration-200 group`}
                aria-label={buttonConfig.text}
                title={buttonConfig.text}
            >
                <IconComponent
                    className={`h-4 w-4 ${
                        addFocused
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        } transition-colors`}
                />
                <span className={`text-xs font-medium hidden sm:inline ${
                    addFocused
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    } transition-colors`}>
                    {buttonConfig.text}
                </span>
            </Link>
            
            {/* Indicador visual cuando está enfocado */}
            {addFocused && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-teal-500 rounded-full"></div>
            )}
        </div>
    );
};

export default CreateButton;