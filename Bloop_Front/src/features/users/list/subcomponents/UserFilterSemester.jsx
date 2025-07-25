import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

// Búsqueda por semestre
const SemesterSelectField = ({ value, onChange, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
            Semestre
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 pl-10 bg-slate-700/50 border border-slate-600 
                        rounded-lg text-slate-200 focus:outline-none focus:ring-2 
                        focus:ring-[#278bbd] focus:border-transparent transition-all duration-200
                        hover:border-slate-500 appearance-none cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="todos">Todos los semestres</option>
                <option value="1">Primer Semestre</option>
                <option value="2">Segundo Semestre</option>
                <option value="3">Tercer Semestre</option>
                <option value="4">Cuarto Semestre</option>
                <option value="5">Quinto Semestre</option>
            </select>
            <AcademicCapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                        h-4 w-4 text-slate-400 pointer-events-none" />
            {/* Flecha personalizada para el select */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

export default SemesterSelectField;