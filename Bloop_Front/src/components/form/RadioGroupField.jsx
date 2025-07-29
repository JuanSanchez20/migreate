import React from 'react';

const RadioGroupField = ({ 
    label, // Texto que se mostrará encima del radio (No obligatorio)
    value, // Valor que tendrá el radio
    onValueChange, // Valor que se modificará según el estado del radio
    options // Identificadores del radio
}) => (
    <div className="flex space-x-4 pt-2">
        {/* Mapeo de todas las opciones dentro del radio */}
        {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 text-slate-300 cursor-pointer focus:ring-2 focus:ring-[#48d1c1]">
                {/* Radio */}
                <input
                    type="radio"
                    id={option.value}
                    name={label}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onValueChange(option.value)}
                />
                {/* Solo renderiza el label si existe */}
                <label htmlFor={option.value}>{option.label}</label>
            </div>
        ))}
    </div>
);

export default RadioGroupField;