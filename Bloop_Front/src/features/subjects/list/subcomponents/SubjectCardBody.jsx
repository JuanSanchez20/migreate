import React from 'react';
import { getPeaStatusConfig } from '../helpers/subjectHelpers';

// Body de la tarjeta con información del estado PEA
const SubjectCardBody = ({ subject }) => {
    const peaConfig = getPeaStatusConfig(subject.pea?.estado);
    const PeaIcon = peaConfig.icon;

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${peaConfig.bgColor}`}>
                <PeaIcon className={`h-4 w-4 ${peaConfig.color}`} />
                <span className={`text-sm font-medium ${peaConfig.color}`}>
                    {peaConfig.label}
                </span>
            </div>
        </div>
    );
};

export default SubjectCardBody;