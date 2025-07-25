import React from 'react';
import { XMarkIcon, UserIcon, PencilIcon } from '@heroicons/react/24/outline';
import { NotificationBanner } from '@/services';

// Header del modal con información básica del usuario y controles
const ModalHeader = ({ 
    user, 
    editMode, 
    onToggleEdit, 
    onClose, 
    notification, 
    onHideNotification 
}) => {
    return (
        <div>
            {/* Barra de navegación del header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center space-x-4">
                    {/* Avatar del usuario */}
                    <div className="w-12 h-12 rounded-full bg-[#278bbd]/20 flex items-center justify-center border-2 border-[#278bbd]/30">
                        <UserIcon className="h-6 w-6 text-[#278bbd]" />
                    </div>

                    {/* Información básica */}
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.u_name}</h2>
                        <p className="text-slate-400">{user.rol_name} • ID: {user.u_id}</p>
                    </div>

                    {/* Botón de editar */}
                    <button
                        onClick={onToggleEdit}
                        className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 ml-auto mr-2 transition-colors"
                        title={editMode ? 'Cancelar edición' : 'Editar usuario'}
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Botón de cerrar */}
                <button 
                    onClick={onClose} 
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Cerrar modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Banner de notificaciones */}
            <NotificationBanner 
                notification={notification} 
                onClose={onHideNotification}
            />
        </div>
    );
};

export default ModalHeader;