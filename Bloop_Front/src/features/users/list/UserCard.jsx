import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import UserAvatar from './subcomponents/UserCardAvatar';
import UserBasicInfo from './subcomponents/UserCardInfo';
import RoleBadge from './subcomponents/UserCardRole';
import StatusBadge from './subcomponents/UserCardStatus';
import AcademicInfo from './subcomponents/UserCardAcademic';
import SubjectsSection from './subcomponents/UserCardSubject';
import CardFooter from './subcomponents/UserCardFooter';

// Tarjeta individual para cada usuario
const UserCard = ({
    user,
    onCardClick,
    disabled = false,
    className = '',
    ...props
}) =>{
    // Validación de datos del usuario
    if (!user || !user.id) {
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <XCircleIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 text-sm">Usuario inválido</p>
            </div>
    }

    // Estilos
    const baseClasses = `
        group relative 
        bg-gradient-to-br from-gray-800/90 via-gray-800/95 to-gray-900/90 
        backdrop-blur-sm p-6 rounded-3xl 
        shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 
        hover:scale-[1.02] transition-all duration-500 
        border border-gray-700/50 hover:border-teal-500/30
        flex flex-col justify-between
        before:absolute before:inset-0 before:rounded-3xl before:p-[1px]
        before:bg-gradient-to-br before:from-teal-500/20 before:to-transparent
        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        overflow-hidden min-h-[350px]
        ${onCardClick && !disabled ? 'cursor-pointer' : 'cursor-default'}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
    `.trim().replace(/\s+/g, ' ');

    const handleClick = (e) => {
        if (!disabled && onCardClick) {
            onCardClick(user);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`${baseClasses} ${className}`}
            {...props}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Contenido Principal */}
            <div className="relative z-0 flex flex-col h-full w-full">
                {/* Avatar + Información básica */}
                <div className="flex items-start space-x-4 mb-4">
                    <UserAvatar user={user} />
                    <UserBasicInfo user={user} />
                </div>

                {/* Rol y Estado */}
                <div className="flex items-center space-x-2 mb-4">
                    <RoleBadge user={user} />
                    <StatusBadge user={user} />
                </div>

                {/* Información académica (solo estudiantes) */}
                <AcademicInfo user={user} />

                {/* Sección de materias - Flex grow para ocupar espacio */}
                <div className="flex-grow space-y-3 mb-4">
                    <SubjectsSection user={user} />
                </div>

                {/* Footer */}
                <CardFooter />
            </div>
        </div>
    );
}

export default UserCard;