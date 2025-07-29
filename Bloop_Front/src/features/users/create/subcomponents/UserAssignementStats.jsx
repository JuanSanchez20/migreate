import React from 'react';

// Muestra las estadísticas de asignación de materias del usuario
export default function AssignmentStats({
    selectedSubjects = [],
    userRole,
    maxCursando = 2
}) {
    // Función simple para calcular estadísticas
    const calculateStats = () => {
        const stats = {
            total: selectedSubjects.length,
            cursando: selectedSubjects.filter(s => s.status === 'Cursando').length,
            repitiendo: selectedSubjects.filter(s => s.status === 'Repitiendo').length,
            encargado: selectedSubjects.filter(s => s.status === 'Encargado').length
        };

        return stats;
    };

    const stats = calculateStats();

    // Función para verificar si hay límite alcanzado
    const isAtLimit = () => {
        return userRole === 'estudiante' && stats.cursando >= maxCursando;
    };

    // Función para obtener el color del indicador
    const getIndicatorColor = (current, max) => {
        if (current === max) return 'text-yellow-400';
        if (current > max) return 'text-red-400';
        return 'text-green-400';
    };

    // No mostrar nada si no hay materias seleccionadas
    if (selectedSubjects.length === 0) {
        return null;
    }

    return (
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                Resumen de Asignación
            </h4>

            {/* Estadísticas para Estudiantes */}
            {userRole === 'estudiante' && (
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Cursando:</span>
                            <span className={`font-medium ${getIndicatorColor(stats.cursando, maxCursando)}`}>
                                {stats.cursando}/{maxCursando}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-400">🔄 Repitiendo:</span>
                            <span className="text-orange-400 font-medium">
                                {stats.repitiendo}
                            </span>
                        </div>
                    </div>

                    {/* Indicador de límite */}
                    {isAtLimit() && (
                        <div className="mt-3 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                            Límite de materias "Cursando" alcanzado
                        </div>
                    )}

                    {/* Consejo visual */}
                    {stats.cursando < maxCursando && stats.total > 0 && (
                        <div className="mt-3 text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                            Puedes agregar {maxCursando - stats.cursando} materia(s) más como "Cursando"
                        </div>
                    )}
                </div>
            )}

            {/* Estadísticas para Tutores */}
            {userRole === 'tutor' && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">📋 Materias como tutor:</span>
                        <span className="text-blue-400 font-medium">
                            {stats.encargado} asignadas
                        </span>
                    </div>

                    {stats.encargado > 5 && (
                        <div className="mt-2 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                            Tienes muchas materias asignadas. Considera la carga de trabajo.
                        </div>
                    )}
                </div>
            )}

            {/* Total general */}
            <div className="mt-3 pt-2 border-t border-slate-600">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total seleccionadas:</span>
                    <span className="text-slate-300 font-medium">{stats.total}</span>
                </div>
            </div>
        </div>
    );
}