// Helper para transformar y mapear datos específicos de la modal de propuestas

import { formatDate, getAuthorName, getSubjectName } from '../../list/helpers/formatData';
import { getRoleDisplayName } from '../../list/helpers/roleMapper';
import { getStatusClass } from '../../list/helpers/styleStates';

// Transforma una propuesta del formato backend al formato modal
export const mapProposalForModal = (proposal) => {
    if (!proposal) return null;

    return {
        // IDs y referencias
        id: proposal.pp_id,
        proposalId: proposal.pp_id,

        // Información básica
        nombre: proposal.pp_name || 'Sin título',
        descripcion: proposal.pp_description || 'Sin descripción disponible',
        
        // Información del autor
        autorId: proposal.pp_user,
        autorNombre: getAuthorName(proposal),
        autorRol: proposal.pp_user_rol,
        autorRolNombre: getRoleDisplayName(proposal.pp_user_rol),

        // Información del proyecto
        tipoProyecto: proposal.tipo_proyecto || 'Sin tipo',
        tipoProyectoId: proposal.pp_project_type,

        // Información de la materia
        materiaId: proposal.pp_subject,
        materiaNombre: getSubjectName(proposal),

        // Estados y configuración
        estadoAprobacion: proposal.pp_approval_status || 'Pendiente',
        nivelDificultad: proposal.pp_difficulty_level || 'No especificado',
        esGrupal: proposal.pp_grupal || false,
        maxIntegrantes: proposal.pp_max_integrantes || 1,

        // Fechas
        fechaLimite: formatDate(proposal.pp_date_limit),
        fechaCreacion: formatDate(proposal.pp_date_creation),
        fechaLimiteRaw: proposal.pp_date_limit,
        fechaCreacionRaw: proposal.pp_date_creation,

        // Estado del registro
        estado: proposal.pp_state || true,

        // Datos originales para referencia
        rawData: proposal
    };
};

// Transforma objetivos del formato backend al formato modal
export const mapObjectivesForModal = (objectives) => {
    if (!Array.isArray(objectives)) return [];

    return objectives.map(objective => ({
        id: objective.op_id,
        nombre: objective.op_name || 'Objetivo sin nombre',
        tipo: objective.op_type || 'General',
        propuestaId: objective.op_prop_proj,
        rawData: objective
    }));
};

// Transforma requerimientos del formato backend al formato modal
export const mapRequirementsForModal = (requirements) => {
    if (!Array.isArray(requirements)) return [];

    return requirements.map(requirement => ({
        id: requirement.rp_id,
        nombre: requirement.rp_name || 'Requerimiento sin nombre',
        propuestaId: requirement.rp_project,
        rawData: requirement
    }));
};

// Verifica si el usuario actual puede editar la propuesta
export const canUserEditProposal = (proposal, currentUser) => {
    if (!proposal || !currentUser) return false;

    // Solo el autor puede editar su propia propuesta
    return proposal.autorId === currentUser.id;
};

// Verifica si el usuario actual puede aprobar/rechazar la propuesta
export const canUserManageApproval = (proposal, currentUser) => {
    if (!proposal || !currentUser) return false;

    // Solo admin y tutores pueden aprobar/rechazar
    const userRole = typeof currentUser.rol === 'string' ? parseInt(currentUser.rol) : currentUser.rol;
    return userRole === 1 || userRole === 2; // Admin o Tutor
};

// Verifica si el estudiante puede aplicar a la propuesta
export const canStudentApply = (proposal, currentUser) => {
    if (!proposal || !currentUser) return false;

    const userRole = typeof currentUser.rol === 'string' ? parseInt(currentUser.rol) : currentUser.rol;
    
    // Solo estudiantes pueden aplicar
    if (userRole !== 3) return false;

    // No puede aplicar a su propia propuesta
    if (proposal.autorId === currentUser.id) return false;

    // Solo puede aplicar a propuestas aprobadas
    return proposal.estadoAprobacion === 'Aprobada';
};

// Obtiene las acciones disponibles para el usuario actual
export const getAvailableActions = (proposal, currentUser) => {
    if (!proposal || !currentUser) return [];

    const actions = [];
    const userRole = typeof currentUser.rol === 'string' ? parseInt(currentUser.rol) : currentUser.rol;

    // Acción de ver detalles (todos pueden ver)
    actions.push({
        type: 'view',
        label: 'Ver Detalles',
        icon: 'EyeIcon',
        enabled: true
    });

    // Acciones para Admin y Tutor
    if (userRole === 1 || userRole === 2) {
        // Editar (solo si es el autor)
        if (canUserEditProposal(proposal, currentUser)) {
            actions.push({
                type: 'edit',
                label: 'Editar Propuesta',
                icon: 'PencilIcon',
                enabled: true
            });
        }

        // Aprobar/Rechazar (si está pendiente)
        if (proposal.estadoAprobacion === 'Pendiente') {
            actions.push({
                type: 'approve',
                label: 'Aprobar',
                icon: 'CheckIcon',
                enabled: true,
                variant: 'approved'
            });

            actions.push({
                type: 'reject',
                label: 'Rechazar',
                icon: 'XMarkIcon',
                enabled: true,
                variant: 'rejected'
            });
        }
    }

    // Acciones para Estudiante
    if (userRole === 3) {
        // Editar (solo si es su propuesta)
        if (canUserEditProposal(proposal, currentUser)) {
            actions.push({
                type: 'edit',
                label: 'Editar Mi Propuesta',
                icon: 'PencilIcon',
                enabled: true
            });
        }

        // Aplicar (si puede aplicar)
        if (canStudentApply(proposal, currentUser)) {
            actions.push({
                type: 'apply',
                label: 'Aplicar a Propuesta',
                icon: 'UserPlusIcon',
                enabled: true,
                variant: 'default'
            });
        }
    }

    return actions;
};

// Obtiene el color del badge de estado
export const getStatusBadgeClass = (status) => {
    return getStatusClass(status);
};

// Prepara los datos completos para la modal
export const prepareModalData = (proposal, objectives, requirements, currentUser) => {
    const mappedProposal = mapProposalForModal(proposal);
    const mappedObjectives = mapObjectivesForModal(objectives);
    const mappedRequirements = mapRequirementsForModal(requirements);
    const availableActions = getAvailableActions(mappedProposal, currentUser);

    return {
        proposal: mappedProposal,
        objectives: mappedObjectives,
        requirements: mappedRequirements,
        actions: availableActions,
        permissions: {
            canEdit: canUserEditProposal(mappedProposal, currentUser),
            canManageApproval: canUserManageApproval(mappedProposal, currentUser),
            canApply: canStudentApply(mappedProposal, currentUser)
        }
    };
};