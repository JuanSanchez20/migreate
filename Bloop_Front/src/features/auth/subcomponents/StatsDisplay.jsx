import React from 'react';

// Componente para mostrar las estadísticas del sistema
export const StatsDisplay = React.memo(({ stats }) => (
    <div className="flex justify-center space-x-8 pt-2">
        {stats.map((stat) => (
            <div key={stat.id} className="text-center">
                <div className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                </div>
                <div className="text-xs text-slate-400">
                    {stat.label}
                </div>
            </div>
        ))}
    </div>
));