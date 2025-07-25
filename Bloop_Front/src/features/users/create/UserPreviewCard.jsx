import React from 'react';
import { UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import SelectedSubjects from './subcomponents/UserSelectedSubjects';
import AssignmentStats from './subcomponents/UserAssignementStats';

// Vista previa del usuario en el formulario de creación
export default function UserPreviewCard({
    formData,
    selectedSubjects = []
}) {
    // Función para obtener avatar con iniciales
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Función para verificar si el perfil está completo
    const isProfileComplete = () => {
        const basicFieldsComplete = formData.name && formData.email && formData.password && formData.role;
        const studentFieldsComplete = formData.role === 'estudiante' ? formData.semester : true;
        return basicFieldsComplete && studentFieldsComplete;
    };

    return (
        <div className="bg-slate-800 shadow-xl rounded-lg border border-slate-700 sticky top-4">
            {/* Header */}
            <div className="p-6 border-b border-slate-700 bg-slate-900 rounded-t-lg">
                <h2 className="text-lg text-slate-50 font-semibold">Vista Previa</h2>
                <p className="text-sm text-slate-300">
                    {selectedSubjects.length > 0 
                        ? "Perfil del usuario y materias seleccionadas" 
                        : "Así se verá el perfil del usuario"
                    }
                </p>
            </div>

            {/* Contenido */}
            <div className="p-6">
                {/* Avatar y datos básicos */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#278bbd]/10 flex items-center justify-center mb-3 border-2 border-[#278bbd]/20">
                        {formData.name ? (
                            <span className="text-2xl font-bold text-[#278bbd]">
                                {getUserInitials(formData.name)}
                            </span>
                        ) : (
                            <UserIcon className="h-10 w-10 text-[#278bbd]" />
                        )}
                    </div>

                    <h3 className="font-medium text-lg text-slate-300 text-center">
                        {formData.name || "Nombre del Usuario"}
                    </h3>
                    
                    <p className="text-sm text-slate-500 mb-3 text-center">
                        {formData.email || "correo@ejemplo.com"}
                    </p>

                    {/* Badges de rol y semestre */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <span className="text-sm px-3 py-1 rounded-full bg-[#278bbd]/10 text-[#278bbd] border border-[#278bbd]/20">
                            {formData.role ? (formData.role === "tutor" ? "Tutor" : "Estudiante") : "Sin rol"}
                        </span>

                        {formData.semester && formData.role === "estudiante" && (
                            <span className="text-sm px-3 py-1 rounded-full bg-[#48d1c1]/10 text-[#48d1c1] border border-[#48d1c1]/20">
                                Semestre {formData.semester}
                            </span>
                        )}
                    </div>

                    {/* Indicador de completitud */}
                    <div className="mt-3 text-xs">
                        {isProfileComplete() ? (
                            <span className="text-green-400">✓ Perfil completo</span>
                        ) : (
                            <span className="text-yellow-400">⚠ Perfil incompleto</span>
                        )}
                    </div>
                </div>

                {/* Sección de materias */}
                <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center">
                            <AcademicCapIcon className="w-4 h-4 mr-2" />
                            Materias {formData.role === "tutor" ? "Asignadas" : "Seleccionadas"}
                        </h4>
                        {selectedSubjects.length > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                                {selectedSubjects.length}
                            </span>
                        )}
                    </div>

                    {selectedSubjects.length > 0 ? (
                        <div className="space-y-4">
                            {/* Lista de materias seleccionadas */}
                            <SelectedSubjects
                                selectedSubjects={selectedSubjects}
                                showRemoveButton={false}
                                compact={true}
                            />

                            {/* Estadísticas de asignación */}
                            {formData.role && (
                                <AssignmentStats
                                    selectedSubjects={selectedSubjects}
                                    userRole={formData.role}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <AcademicCapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No hay materias seleccionadas</p>
                        </div>
                    )}
                </div>

                {/* Progreso general */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                    <div className="text-xs text-slate-400 mb-2">
                        Progreso de creación
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-[#278bbd] h-2 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${isProfileComplete() ? (selectedSubjects.length > 0 ? 100 : 70) : 30}%` 
                            }}
                        />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        {isProfileComplete() 
                            ? (selectedSubjects.length > 0 ? "Listo para crear" : "Datos completos") 
                            : "Completa los datos básicos"
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}