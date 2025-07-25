import React from 'react';
import { NavLink } from 'react-router-dom';

export const SideItem = ({ item, collapsed, index = 0 }) => {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `group flex items-center p-3 rounded-lg transition-all duration-300 ease-out
        ${collapsed ? 'justify-center' : 'px-4'} 
        ${isActive
                    ? 'text-teal-400 bg-gray-700/80 shadow-lg shadow-teal-400/10 border-l-2 border-teal-400'
                    : 'text-gray-300 hover:text-teal-300 hover:bg-gray-700/50 border-l-2 border-transparent'
                } 
        relative overflow-hidden hover:scale-[1.02] hover:shadow-md`
            }
        >

            {/* === Efecto hover: resplandor de fondo === */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/5 to-teal-400/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* === Línea decorativa lateral === */}
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-gradient-to-b 
                            from-teal-400 to-teal-500 rounded-r transition-all duration-300 ease-out
                            group-hover:h-8 shadow-sm shadow-teal-400/30" />

            {/* === Ícono principal === */}
            <div className={`relative z-10 flex items-center justify-center transition-all duration-300 ${collapsed ? "text-2xl" : "text-xl mr-3"
                }`}>
                <Icon className={`transition-all duration-300 group-hover:scale-110 ${collapsed ? "h-8 w-8" : "h-6 w-6"
                    }`} />

                {/* === Efecto pulso al estar activo === */}
                <div className="absolute inset-0 bg-teal-400/20 rounded-full scale-0 
                        group-[.active]:animate-pulse group-[.active]:scale-100 
                        transition-transform duration-300"></div>
            </div>

            {/* === Texto del ítem === */}
            {!collapsed && (
                <span className="relative z-10 text-sm font-medium tracking-wide transition-all duration-300
                                group-hover:translate-x-1">
                    {item.label}
                </span>
            )}

            {/* === Tooltip (cuando está colapsado) === */}
            {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800/90 backdrop-blur-sm text-white 
                        text-xs rounded-lg shadow-xl border border-gray-700/50 whitespace-nowrap
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-300 ease-out transform translate-x-2 group-hover:translate-x-0
                        before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 
                        before:-translate-x-1 before:border-4 before:border-transparent 
                        before:border-r-gray-800/90 z-50">
                    {item.label}
                </div>
            )}

            {/* === Indicador redondo si está activo === */}
            <div className="absolute right-2 w-2 h-2 bg-teal-400 rounded-full opacity-0 scale-0
                            transition-all duration-300 [.active_&]:opacity-100 [.active_&]:scale-100"></div>
        </NavLink>
    );
};