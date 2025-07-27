import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SubjectFilterSearch = ({ value, onChange }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-slate-300 mb-2">
            Buscar materia
        </label>
        <div className="relative">
            <input
                type="text"
                placeholder="Nombre de la materia"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-700/50 border border-slate-600 
                        rounded-lg text-slate-200 placeholder-slate-400 
                        focus:outline-none focus:ring-2 focus:ring-[#278bbd] 
                        focus:border-transparent transition-all duration-200
                        hover:border-slate-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                            h-4 w-4 text-slate-400" />
        </div>
    </div>
);

export default SubjectFilterSearch;
