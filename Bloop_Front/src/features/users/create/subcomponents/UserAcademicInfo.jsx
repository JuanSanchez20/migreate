import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { CardSectionTitle } from '@/components';

// Información académica del usuario [Rol, Semestre]
export default function UserAcademicInfo({
    formData,
    fieldErrors = {},
    onSelectChange,
    isLoading = false
}) {
    // Opciones de rol
    const roleOptions = [
        { value: "estudiante", label: "Estudiante" },
        { value: "tutor", label: "Tutor" }
    ];

    // Opciones de semestre
    const semesterOptions = [
        { value: "1", label: "Primer Semestre" },
        { value: "2", label: "Segundo Semestre" },
        { value: "3", label: "Tercer Semestre" },
        { value: "4", label: "Cuarto Semestre" },
        { value: "5", label: "Quinto Semestre" }
    ];

    // Función simple para verificar si hay error
    const hasError = (fieldName) => !!fieldErrors[fieldName];
    
    // Función para obtener mensaje de error
    const getErrorText = (fieldName) => fieldErrors[fieldName] || '';

    return (
        <div className="space-y-5">
            <CardSectionTitle>Información Académica</CardSectionTitle>

            <div className="grid md:grid-cols-2 gap-5">
                {/* Campo Rol */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                        Rol *
                    </label>
                    <div className="space-y-3">
                        {roleOptions.map((option) => (
                            <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value={option.value}
                                    checked={formData.role === option.value}
                                    onChange={() => onSelectChange("role", option.value)}
                                    disabled={isLoading}
                                    className="w-4 h-4 text-[#278bbd] bg-slate-800 border-slate-600 
                                             focus:ring-[#278bbd]/50 focus:ring-2"
                                />
                                <span className="text-slate-300 group-hover:text-slate-200 transition-colors">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                    {hasError('role') && (
                        <p className="text-sm text-red-400">{getErrorText('role')}</p>
                    )}
                </div>

                {/* Campo Semestre - Solo para estudiantes */}
                {formData.role === "estudiante" && (
                    <div className="space-y-2">
                        <label htmlFor="semester" className="text-sm font-medium text-slate-300">
                            Semestre *
                        </label>
                        <div className="relative">
                            <AcademicCapIcon className="h-5 w-5 text-accent absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <select
                                id="semester"
                                value={formData.semester || ''}
                                onChange={(e) => onSelectChange("semester", e.target.value)}
                                disabled={isLoading}
                                className={`
                                    w-full pl-10 pr-4 py-3 
                                    bg-slate-700 border rounded-lg 
                                    text-white 
                                    focus:border-accent focus:ring-2 focus:ring-accent/50 
                                    focus:outline-none transition-all duration-200
                                    ${hasError('semester') ? 'border-red-500' : 'border-slate-600'}
                                `}
                            >
                                <option value="" className="bg-slate-800 text-slate-400">
                                    Seleccionar semestre
                                </option>
                                {semesterOptions.map((option) => (
                                    <option 
                                        key={option.value} 
                                        value={option.value} 
                                        className="bg-slate-800 text-slate-200"
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {hasError('semester') ? (
                            <p className="text-sm text-red-400">{getErrorText('semester')}</p>
                        ) : (
                            <p className="text-xs text-slate-500">Selecciona el semestre actual del estudiante</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}