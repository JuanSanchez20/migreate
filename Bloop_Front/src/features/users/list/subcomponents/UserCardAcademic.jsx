import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { getSemesterColor } from '../helpers/userHelpers';

// Información académica del usuario
const AcademicInfo = ({ user }) => {
    // Solo mostrar para estudiantes que tengan semestre
    if (user.u_rol !== 3 || !user.u_semester) return null;

    const semesterColorClass = getSemesterColor(user.u_semester);

    return (
        <div className={`flex items-center space-x-2 text-sm rounded-lg px-3 py-2 border ${semesterColorClass}`}>
            <AcademicCapIcon className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Semestre {user.u_semester}</span>
        </div>
    );
};

export default AcademicInfo;