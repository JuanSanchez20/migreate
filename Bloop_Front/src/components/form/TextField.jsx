import Input from './Input';
import React from 'react';

// Un textField siempre tiene un input donde le permita ingresar algo al usuario
const TextField = ({
    label, // Mostrar texto descriptivo encima del textField (No obligatorio)
    id, // Identificador Principal
    icon: Icon, // Icono que se manda al input
    helpText, // Placeholder
    ...inputProps // Información que ingresa el usuario
}) => (
    <div className="space-y-2">
        {/* Solo renderiza el label si existe */}
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
            {label}
        </label>
        {/* Input */}
        <Input id={id} icon={Icon} {...inputProps} className='bg-slate-500 border-s-slate-400 text-white placeholder:text-slate-400'/>
        {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
);

export default TextField;