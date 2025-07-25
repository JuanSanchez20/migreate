import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

// Información básica del usuario
const UserBasicInfo = ({ user }) => (
    <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                    from-teal-400 to-cyan-400 truncate leading-tight mb-1">
            {user.u_name}
        </h3>
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{user.u_email}</span>
        </div>
    </div>
);

export default UserBasicInfo;