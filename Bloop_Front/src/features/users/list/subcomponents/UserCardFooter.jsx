import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

// Pie de la tarjeta del usuario
const CardFooter = () => (
    <div className="flex items-center justify-center pt-3 border-t border-slate-700/50">
        <div className="flex items-center space-x-2 text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
            <EyeIcon className="h-3 w-3" />
            <span>Click para ver detalles</span>
        </div>
    </div>
);

export default CardFooter;