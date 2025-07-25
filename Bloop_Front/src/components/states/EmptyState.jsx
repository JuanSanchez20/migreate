import React from 'react';
import { 
    UserGroupIcon, 
    DocumentTextIcon, 
    BookOpenIcon,
    FolderIcon 
} from '@heroicons/react/24/outline';

// Componente de estado vacío para mostrar un mensaje cuando no hay datos
const EmptyState = ({ 
    type = "default", // "users" | "proposals" | "subjects" | "projects" | "default"
    hasActiveFilters = false,
    onClearFilters,
    customTitle,
    customDescription,
    customIcon: CustomIcon
}) => {
    // Configuraciones por tipo
    const configs = {
        users: {
            icon: UserGroupIcon,
            title: 'No hay usuarios',
            description: 'No hay usuarios registrados en el sistema',
            filteredTitle: 'Sin usuarios que coincidan',
            filteredDescription: 'No se encontraron usuarios con los filtros aplicados'
        },
        proposals: {
            icon: DocumentTextIcon,
            title: 'No hay propuestas',
            description: 'No hay propuestas registradas en el sistema',
            filteredTitle: 'Sin propuestas que coincidan',
            filteredDescription: 'No se encontraron propuestas con los filtros aplicados'
        },
        subjects: {
            icon: BookOpenIcon,
            title: 'No hay materias',
            description: 'No hay materias registradas en el sistema',
            filteredTitle: 'Sin materias que coincidan',
            filteredDescription: 'No se encontraron materias con los filtros aplicados'
        },
        projects: {
            icon: FolderIcon,
            title: 'No hay proyectos',
            description: 'No hay proyectos registrados en el sistema',
            filteredTitle: 'Sin proyectos que coincidan',
            filteredDescription: 'No se encontraron proyectos con los filtros aplicados'
        },
        default: {
            icon: FolderIcon,
            title: 'No hay elementos',
            description: 'No hay elementos registrados en el sistema',
            filteredTitle: 'Sin resultados',
            filteredDescription: 'No se encontraron elementos con los filtros aplicados'
        }
    };

    const config = configs[type] || configs.default;
    const IconComponent = CustomIcon || config.icon;
    
    const title = customTitle || (hasActiveFilters ? config.filteredTitle : config.title);
    const description = customDescription || (hasActiveFilters ? config.filteredDescription : config.description);

    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className={`text-center max-w-md ${
                hasActiveFilters 
                    ? 'bg-yellow-500/10 border border-yellow-500/20' 
                    : 'bg-slate-400/10 border border-slate-400/20'
            } border-2 border-dashed rounded-2xl p-12`}>
                
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    hasActiveFilters 
                        ? 'bg-yellow-400/10 ring-2 ring-yellow-400/20' 
                        : 'bg-slate-400/10 ring-2 ring-slate-400/20'
                }`}>
                    <IconComponent className={`h-10 w-10 ${
                        hasActiveFilters ? 'text-yellow-400' : 'text-slate-400'
                    }`} />
                </div>

                <h3 className={`text-xl font-semibold mb-2 ${
                    hasActiveFilters ? 'text-yellow-400' : 'text-slate-200'
                }`}>
                    {title}
                </h3>

                <p className="text-slate-400 mb-2">
                    {description}
                </p>

                <p className="text-sm text-slate-500 mb-6">
                    {hasActiveFilters 
                        ? 'Intenta ajustar los filtros para obtener más resultados'
                        : 'Contacta al administrador del sistema'
                    }
                </p>

                {hasActiveFilters && onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-[#278bbd] hover:text-[#48d1c1] 
                                ransition-colors duration-200 underline"
                    >
                        Ver todos los elementos
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;