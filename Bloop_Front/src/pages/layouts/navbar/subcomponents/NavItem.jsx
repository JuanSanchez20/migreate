import React from 'react';

export default function NavItem({
    focused,
    onFocus,
    onBlur,
    onClick,
    icon,
    showDot = false,
    ariaLabel,
    extraClass = '',
}) {
    return (
        <div className={`relative transition-all duration-200 ${focused ? 'ring-2 ring-teal-400/50' : ''}`}>
            <button
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onClick}
                aria-label={ariaLabel}
                className={`p-2 rounded-lg 
                    ${focused ? 'bg-teal-50 dark:bg-teal-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} 
                    transition-all duration-200 group relative ${extraClass}`}
            >
                {icon}
                {showDot && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                )}
            </button>
            {focused && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-teal-500 rounded-full"></div>
            )}
        </div>
    );
}