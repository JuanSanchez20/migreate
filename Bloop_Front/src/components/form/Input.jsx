import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React from 'react';

export function Input({
    icon: Icon, // Icono que se mostrará dentro del input
    className = '', // Clases únicas del componente hijo
    showPasswordToggle = false, // Estado que permitirá al usuario ver o no el contenido del input en caso de que sea contraseña
    onTogglePassword, // Estado que se encuentra seleccionado
    showPassword, // Estado para cambiar el icono según la selección el estado anterior
    ...props // Placeholder que estarán dentro del input para dar indicio de que se ingresará
}) {
    return (
        <div className="relative">
            { /* Icono dentro del input */ }
            {Icon && (
                <Icon className="h-5 w-5 text-accent absolute left-3 top-1/2 transform -translate-y-1/2" />
            )}
            { /* Input principal */ }
            <input
                {...props}
                className={`
                    w-full pl-10 pr-4 py-3 
                    bg-slate-700 border border-slate-600 rounded-lg 
                    text-white placeholder:text-slate-400 
                    focus:border-accent focus:ring-2 focus:ring-accent/50 
                    focus:outline-none transition-all duration-200 
                    ${showPasswordToggle ? "pr-10" : ""}
                    ${className}`}
            />
            { /* Icono que permite al usuario ver la información oculta */ }
            {showPasswordToggle && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-3 top-3 text-slate-400 hover:text-[#278bbd]"
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                        <EyeIcon className="h-4 w-4" />
                    )}
                </button>
            )}
        </div>
    );
}

export default Input;