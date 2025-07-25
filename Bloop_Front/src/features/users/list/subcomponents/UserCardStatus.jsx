import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getStatusColor, mapStatusToText } from '../helpers/userHelpers';

const StatusBadge = ({ user }) => {
    const statusColorClass = getStatusColor(user.u_state);
    const statusText = mapStatusToText(user.u_state);
    const IconComponent = user.u_state ? CheckCircleIcon : XCircleIcon;
    
    return (
        <div className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full border ${statusColorClass}`}>
            <IconComponent className="h-3 w-3" />
            <span className="font-medium">{statusText}</span>
        </div>
    );
};

export default StatusBadge;