import React from 'react';

const Button = ({
    children, // Contenido del componente hijo
    onClick, // Función que se ejecutará
    className = '', // Clases extras de los botones
    disabled = false, // El estado del botón para hacer o no accesible el botón al usuario
    type = 'button',  // Tipo que va ser (Por defecto button)
    variant = 'default', // Variante que ocupará para saber la clase de botón que es (Por defecto default)
    isLoading = false, // Estado que permitirá hacer una animación de carga al hacer click en un botón.
    size = 'default'  // Tamaño del botón (Por defecto default)
}) => {

    // Estilos base simplificados - solo lo esencial
    const baseStyles = `
    w-full font-semibold rounded-lg transition-colors duration-200
    flex items-center justify-center focus:outline-none focus:ring-2`

    // Variantes de color simplificadas
    const variants = {
        default: 'bg-[#48d1c1] hover:bg-[#52A298] text-slate-900 focus:ring-[#48d1c1]/50',
        outline: 'bg-transparent border-2 border-gray-600 text-gray-200 hover:bg-gray-600 focus:ring-gray-600/50',
        approved: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/50',
        pending: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500/50',
        rejected: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50',
        primary: 'bg-transparent border-2 border-[#48d1c1] text-[#48d1c1] hover:bg-[#48d1c1] hover:text-white focus:ring-[#48d1c1]/50',
        secondary: 'bg-transparent border-2 border-[#278bbd] text-[#278bbd] hover:bg-[#278bbd] hover:text-white focus:ring-[#278bbd]/50',
        dark: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 focus:ring-gray-600/50',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500/50'
    }

    // Tamaños - sin cambios, están bien
    const sizes = {
        sm: 'py-2 px-3 text-sm',
        default: 'py-3 px-4',
        lg: 'py-4 px-6 text-lg',
        xl: 'py-5 px-8 text-xl'
    }

    // Estados especiales simplificados
    const isDisabled = disabled || isLoading
    const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : ''

    // Combinar clases
    const finalClasses = [
        baseStyles,
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        disabledStyles,
        className
    ].filter(Boolean).join(' ')

    return (
        <button
            disabled={isDisabled}
            onClick={onClick}
            type={type}
            className={finalClasses}
        >
            {/* Contenido simplificado */}
            <span className="flex items-center space-x-2">
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {children}
            </span>
        </button>
    )
};

export default Button;