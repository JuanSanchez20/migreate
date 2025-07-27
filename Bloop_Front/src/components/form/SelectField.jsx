import React from 'react';

const SelectField = ({
    label, // Componente opcional para mostrar texto descriptivo encima del select
    id, // Identificador único para conectar label con select (accesibilidad)
    icon: Icon, // Componente de ícono opcional (no implementado visualmente aún)
    value, // Valor actual seleccionado, controlado por el componente padre
    onValueChange, // Función callback que se ejecuta cuando cambia la selección
    options, // Array de objetos con {value, label} para las opciones del select
    placeholder // Texto que aparece cuando no hay selección
}) => (
    <div className="space-y-2">
        {/* Solo renderiza el label si existe */}
        {label && (
            <label 
                htmlFor={id} 
                className="block text-sm font-medium text-slate-300"
            >
                {label}
            </label>
        )}
        {/* Contenedor relativo para posicionar elementos internos */}
        <div className="relative">
            <select
                id={id} // ID que conecta con el label para accesibilidad
                value={value} // Valor controlado desde el componente padre
                onChange={(e) => onValueChange(e.target.value)} // Ejecuta callback con el nuevo valor
                className="h-12 w-full border rounded-lg px-4 py-3 text-sm bg-slate-800 text-white
                    focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 hover:border-blue-300
                    transition-colors duration-200 appearance-none
                "
                style={{backgroundColor: '#334155'}} // Fondo
            >
                <option 
                    value="" 
                    disabled // No seleccionable, solo informativo
                    className="text-slate-400" // Color más claro para distinguir del placeholder
                >
                    {placeholder}
                </option>
                {/* Itera sobre las opciones disponibles */}
                {options.map((option) => (
                    <option 
                        key={option.value} 
                        value={option.value}
                        className="bg-slate-800 text-white"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            
            {/* Flecha personalizada para el select */}
            <div className="
                absolute right-3 top-1/2 // Posición absoluta: derecha 12px, centrado verticalmente
                transform -translate-y-1/2 // Centra perfectamente la flecha
                pointer-events-none // No interfiere con los clicks del select
                text-slate-400 // Color gris medio para la flecha
            ">
                <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="currentColor" // Usa el color del texto del contenedor
                >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
    </div>
);

export default SelectField;