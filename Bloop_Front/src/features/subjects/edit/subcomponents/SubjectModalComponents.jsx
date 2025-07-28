import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Utilizado para mostrar estados booleanos con estilos consistentes
export const StatusBadge = ({ active, trueText = "Activa", falseText = "Inactiva" }) => (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
        active ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
    }`}>
        {active ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
        <span>{active ? trueText : falseText}</span>
    </div>
);

// Sección de información con título y icono
export const InfoSection = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 ${className}`}>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            {Icon && <Icon className="h-5 w-5 text-[#278bbd]" />}
            <span>{title}</span>
        </h4>
        {children}
    </div>
);

// Campo de información con etiqueta y valor
export const InfoField = ({ label, value, icon: Icon, children }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4 text-slate-400" />}
            <span className="text-slate-400">{label}:</span>
        </div>
        {children || <span className="text-white font-medium">{value}</span>}
    </div>
);