import React from 'react';
import { SunIcon } from '@heroicons/react/24/outline';
import { getJornadaOptions } from '../helpers/subjectHelpers';

const SubjectFilterJornada = ({ value, onChange }) => {
    const options = getJornadaOptions();

    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                Jornada
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-slate-700/50 border border-slate-600 
                            rounded-lg text-slate-200 focus:outline-none focus:ring-2 
                            focus:ring-[#278bbd] focus:border-transparent transition-all duration-200
                            hover:border-slate-500 appearance-none cursor-pointer"
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <SunIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                    h-4 w-4 text-slate-400 pointer-events-none" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SubjectFilterJornada;