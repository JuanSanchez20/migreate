import { 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    AcademicCapIcon 
} from '@heroicons/react/24/outline';

// Encabezado del sidebar con logo y botón para colapsar/expandir
const SidebarHeader = ({ collapsed, setCollapsed }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className={`flex items-center space-x-3 transition-all duration-500 ease-in-out overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}>
            <AcademicCapIcon className="h-8 w-8 text-teal-400 flex-shrink-0" />
            <span className="text-xl font-bold tracking-tight select-none whitespace-nowrap">Bloop</span>
        </div>

        {/* Botón para alternar el colapso del sidebar */}
        <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="p-1 rounded-full hover:bg-cyan-700 transition-all duration-200 flex-shrink-0"
        >
            {/* Íconos que cambian según el estado */}
            <div className="relative w-5 h-5">
                <ChevronRightIcon className={`h-5 w-5 text-gray-200 absolute transition-all duration-300 ${collapsed ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'
                    }`} />
                <ChevronLeftIcon className={`h-5 w-5 text-gray-200 absolute transition-all duration-300 ${collapsed ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                    }`} />
            </div>
        </button>
    </div>
);

export { SidebarHeader }