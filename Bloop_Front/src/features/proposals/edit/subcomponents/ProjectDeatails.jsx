import React, { useState, useEffect } from 'react';
import { 
    BulletListIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { listProposals } from '../../../services/listProposals';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState } from '@/hooks';
import { mapObjectivesToUI, mapRequirementsToUI } from '../helpers/projectMappers';
import { OBJECTIVE_TYPE_CONFIG } from '../helpers/projectConfig';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';

// Componente para mostrar objetivos y requerimientos de la propuesta
const ProjectDetails = ({ proposal }) => {
    const { user } = useAuth();
    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();

    const [objectives, setObjectives] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [expandedSections, setExpandedSections] = useState({
        objectives: true,
        requirements: true
    });

    // Carga objetivos y requerimientos al montar el componente
    useEffect(() => {
        if (proposal?.pp_id) {
            loadDetails();
        }
    }, [proposal?.pp_id]);

    // Carga los detalles de objetivos y requerimientos
    const loadDetails = async () => {
        if (!proposal?.pp_id || !user?.id) return;

        await withLoading(async () => {
            try {
                clearError();

                // Cargar objetivos
                const objectivesResponse = await listProposals({
                    userId: user.id,
                    userRole: user.rol === 'Administrador' ? 1 : user.rol === 'Tutor' ? 2 : 3,
                    section: 'objetive'
                });

                // Cargar requerimientos
                const requirementsResponse = await listProposals({
                    userId: user.id,
                    userRole: user.rol === 'Administrador' ? 1 : user.rol === 'Tutor' ? 2 : 3,
                    section: 'requeriments'
                });

                // Filtrar por propuesta actual
                const proposalObjectives = objectivesResponse?.data?.filter(
                    obj => obj.op_prop_proj === proposal.pp_id
                ) || [];

                const proposalRequirements = requirementsResponse?.data?.filter(
                    req => req.rp_project === proposal.pp_id
                ) || [];

                setObjectives(mapObjectivesToUI(proposalObjectives));
                setRequirements(mapRequirementsToUI(proposalRequirements));

            } catch (err) {
                console.error('Error cargando detalles:', err);
                setError(err?.message || 'Error al cargar objetivos y requerimientos');
            }
        });
    };

    // Alterna la expansión de una sección
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Componente para mostrar un objetivo
    const ObjectiveItem = ({ objective, index }) => {
        const typeConfig = OBJECTIVE_TYPE_CONFIG[objective.op_type] || OBJECTIVE_TYPE_CONFIG['General'];
        
        return (
            <div className="bg-gray-600/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                typeConfig.color === 'blue' 
                                    ? 'bg-blue-500/20 text-blue-400' 
                                    : 'bg-teal-500/20 text-teal-400'
                            }`}>
                                {typeConfig.label}
                            </span>
                            <span className="text-gray-400 text-sm">#{index + 1}</span>
                        </div>
                        
                        <h5 className="font-semibold text-white mb-2">
                            {objective.op_name || 'Sin título'}
                        </h5>
                        
                        {objective.op_description && (
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {objective.op_description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Componente para mostrar un requerimiento
    const RequirementItem = ({ requirement, index }) => {
        return (
            <div className="bg-gray-600/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                            <span className="text-teal-400 text-xs font-semibold">
                                {index + 1}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <h5 className="font-semibold text-white">
                            {requirement.rp_name || 'Sin título'}
                        </h5>
                        
                        {requirement.dateCreated && (
                            <p className="text-gray-400 text-xs mt-1">
                                Creado: {requirement.dateCreated}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Componente para una sección expandible
    const ExpandableSection = ({ title, icon: Icon, children, sectionKey, count }) => {
        const isExpanded = expandedSections[sectionKey];
        const ChevronIcon = isExpanded ? ChevronDownIcon : ChevronRightIcon;

        return (
            <div className="bg-gray-700/30 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-600/20 transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-teal-400" />
                        <h4 className="text-lg font-semibold text-teal-400">
                            {title}
                        </h4>
                        <span className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full text-sm">
                            {count}
                        </span>
                    </div>
                    <ChevronIcon className="h-5 w-5 text-gray-400" />
                </button>

                {isExpanded && (
                    <div className="p-4 pt-0 space-y-3">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    if (!proposal) {
        return (
            <div className="text-center text-gray-400 py-8">
                <ExclamationCircleIcon className="h-12 w-12 mx-auto mb-4" />
                <p>No hay propuesta seleccionada</p>
            </div>
        );
    }

    if (loading) {
        return <LoadingState message="Cargando objetivos y requerimientos..." />;
    }

    if (error) {
        return (
            <ErrorState
                title="Error al cargar detalles"
                error={error}
                onRetry={loadDetails}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Sección de Objetivos */}
            <ExpandableSection
                title="Objetivos"
                icon={CheckCircleIcon}
                sectionKey="objectives"
                count={objectives.length}
            >
                {objectives.length > 0 ? (
                    objectives.map((objective, index) => (
                        <ObjectiveItem
                            key={objective.op_id || index}
                            objective={objective}
                            index={index}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">No hay objetivos definidos</p>
                    </div>
                )}
            </ExpandableSection>

            {/* Sección de Requerimientos */}
            <ExpandableSection
                title="Requerimientos"
                icon={BulletListIcon}
                sectionKey="requirements"
                count={requirements.length}
            >
                {requirements.length > 0 ? (
                    requirements.map((requirement, index) => (
                        <RequirementItem
                            key={requirement.rp_id || index}
                            requirement={requirement}
                            index={index}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <BulletListIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">No hay requerimientos especificados</p>
                    </div>
                )}
            </ExpandableSection>
        </div>
    );
};

export default ProjectDetails;