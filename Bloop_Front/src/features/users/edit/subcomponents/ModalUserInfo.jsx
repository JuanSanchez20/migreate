import React from 'react';
import { UserIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getRoleColor, getStateColor } from '../helpers/userMappers';

// Badge de estado para mostrar si el usuario está activo o inactivo
const StatusBadge = ({ active }) => {
    const colorClasses = getStateColor(active);
    
    return (
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${colorClasses}`}>
            {active ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
            <span>{active ? "Activo" : "Inactivo"}</span>
        </div>
    );
};

// Sección reutilizable para mostrar información agrupada
const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            {Icon && <Icon className="h-5 w-5 text-[#278bbd]" />}
            <span>{title}</span>
        </h4>
        {children}
    </div>
);

// Componente para mostrar la información del usuario en modo lectura
const UserInfoSection = ({ user }) => {
    if (!user) {
        return (
            <div className="p-4 text-center text-slate-400">
                <p>No hay información del usuario disponible</p>
            </div>
        );
    }

    const roleColorClasses = getRoleColor(user.rol_name);

    return (
        <div className="space-y-4">
            {/* Información personal del usuario */}
            <InfoSection title="Información Personal" icon={UserIcon}>
                <div className="space-y-3 text-slate-300">
                    <div>
                        <span className="text-slate-400">Nombre:</span> {user.u_name}
                    </div>
                    <div>
                        <span className="text-slate-400">Email:</span> {user.u_email}
                    </div>
                    {user.u_semester && (
                        <div>
                            <span className="text-slate-400">Semestre:</span> {user.u_semester}°
                        </div>
                    )}
                </div>
            </InfoSection>

            {/* Estado y rol del usuario */}
            <InfoSection title="Estado y Rol">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Rol:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${roleColorClasses}`}>
                            {user.rol_name}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Estado:</span>
                        <StatusBadge active={user.u_state} />
                    </div>
                </div>
            </InfoSection>
        </div>
    );
};

export default UserInfoSection;