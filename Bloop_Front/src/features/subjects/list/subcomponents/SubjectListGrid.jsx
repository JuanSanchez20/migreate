import React from 'react';
import SubjectCard from '../SubjectCard';
import { getJornadaConfig } from '../helpers/subjectHelpers';

const SubjectGrid = ({ groupedSubjects, onCardClick, loading }) => {
    const jornadaMatutina = getJornadaConfig('matutina');
    const jornadaNocturna = getJornadaConfig('nocturna');

    return (
        <div className="space-y-8">
            {/* Sección Matutina */}
            {groupedSubjects.matutina.length > 0 && (
                <div className={`p-6 rounded-2xl border border-yellow-500/20 ${jornadaMatutina.bgSection}`}>
                    <div className="flex items-center space-x-3 mb-6">
                        <jornadaMatutina.icon className="h-6 w-6 text-yellow-400" />
                        <h3 className="text-xl font-semibold text-yellow-400">
                            Jornada Matutina
                        </h3>
                        <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm">
                            {groupedSubjects.matutina.length}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groupedSubjects.matutina.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onCardClick={onCardClick}
                                disabled={loading}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sección Nocturna */}
            {groupedSubjects.nocturna.length > 0 && (
                <div className={`p-6 rounded-2xl border border-purple-500/20 ${jornadaNocturna.bgSection}`}>
                    <div className="flex items-center space-x-3 mb-6">
                        <jornadaNocturna.icon className="h-6 w-6 text-purple-400" />
                        <h3 className="text-xl font-semibold text-purple-400">
                            Jornada Nocturna
                        </h3>
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full text-sm">
                            {groupedSubjects.nocturna.length}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groupedSubjects.nocturna.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onCardClick={onCardClick}
                                disabled={loading}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectGrid;