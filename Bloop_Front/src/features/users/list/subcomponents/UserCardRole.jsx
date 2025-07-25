import React from 'react';
import { getRoleColor } from '../helpers/userHelpers';

// Muestra el rol del usuario como etiqueta y con el nombre del rol
const RoleBadge = ({ user }) => {
    const roleColorClass = getRoleColor(user.u_rol);
    
    return (
        <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${roleColorClass}`}>
            {user.rol_name}
        </span>
    );
};

export default RoleBadge;