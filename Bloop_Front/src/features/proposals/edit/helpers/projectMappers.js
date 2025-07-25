import { 
    formatDate, 
    formatRole, 
    formatAuthorInfo, 
    formatModality,
    formatDateForInput 
} from './projectFormatters';

// Helper para transformar datos entre API y UI de manera consistente

// Transforma datos de propuesta de API a formato UI para las tarjetas de lista
export const mapProposalToCard = (proposal) => {
    return {
        id: proposal.pp_id,
        title: proposal.pp_name,
        author: formatAuthorInfo(
            proposal.autor_nombre, 
            proposal.pp_user, 
            proposal.pp_user_rol
        ),
        projectType: proposal.tipo_proyecto || 'Sin tipo',
        description: proposal.pp_description,
        priority: proposal.pp_difficulty_level,
        dueDate: formatDate(proposal.pp_date_limit),
        status: proposal.pp_approval_status,
        subject: proposal.materia_nombre || 'Sin materia',
        rawData: proposal
    };
};

// Transforma datos de propuesta de API a formato completo para la modal
export const mapProposalToModal = (proposal) => {
    return {
        // Datos básicos
        pp_id: proposal.pp_id,
        pp_name: proposal.pp_name || '',
        pp_description: proposal.pp_description || '',
        pp_approval_status: proposal.pp_approval_status || 'Pendiente',
        pp_difficulty_level: proposal.pp_difficulty_level || 'Medio',
        pp_max_integrantes: proposal.pp_max_integrantes || 2,
        pp_date_limit: proposal.pp_date_limit || '',
        pp_grupal: proposal.pp_grupal || false,
        
        // Datos del autor
        pp_user: proposal.pp_user,
        pp_user_rol: proposal.pp_user_rol,
        autor_nombre: proposal.autor_nombre,
        
        // Datos relacionados
        pp_project_type: proposal.pp_project_type,
        tipo_proyecto: proposal.tipo_proyecto,
        pp_subject: proposal.pp_subject,
        materia_nombre: proposal.materia_nombre,
        
        // Fechas formateadas
        fechaCreacion: formatDate(proposal.pp_date_creation),
        fechaLimite: formatDate(proposal.pp_date_limit),
        fechaLimiteInput: formatDateForInput(proposal.pp_date_limit),
        
        // Información del autor formateada
        authorInfo: formatAuthorInfo(
            proposal.autor_nombre, 
            proposal.pp_user, 
            proposal.pp_user_rol
        ),
        
        // Modalidad formateada
        modalityText: formatModality(proposal.pp_grupal, proposal.pp_max_integrantes),
        
        // Estado activo
        pp_state: proposal.pp_state
    };
};

// Transforma objetivos de API a formato UI
export const mapObjectivesToUI = (objectives) => {
    if (!Array.isArray(objectives)) return [];
    
    return objectives.map(obj => ({
        op_id: obj.op_id,
        op_name: obj.op_name || '',
        op_type: obj.op_type || 'General',
        op_description: obj.op_description || '',
        proposal_id: obj.op_prop_proj
    }));
};

// Transforma requerimientos de API a formato UI
export const mapRequirementsToUI = (requirements) => {
    if (!Array.isArray(requirements)) return [];
    
    return requirements.map(req => ({
        rp_id: req.rp_id,
        rp_name: req.rp_name || '',
        proposal_id: req.rp_project,
        dateCreated: formatDate(req.rp_date_create),
        status: req.rp_status
    }));
};

// Transforma aplicantes de API a formato UI
export const mapApplicantsToUI = (applicants) => {
    if (!Array.isArray(applicants)) return [];
    
    return applicants.map(applicant => ({
        studentId: applicant.studentId || applicant.student_id,
        studentName: applicant.studentName || applicant.student_name || 'Estudiante',
        studentEmail: applicant.studentEmail || applicant.student_email || '',
        applicationDate: formatDate(applicant.applicationDate || applicant.application_date),
        status: applicant.status || 'Pendiente'
    }));
};

// Transforma datos de edición de UI a formato API para guardar
export const mapEditDataToAPI = (editData, userInfo) => {
    return {
        // Datos básicos de la propuesta
        proposal: {
            pp_id: editData.basic.pp_id,
            pp_name: editData.basic.pp_name?.trim(),
            pp_description: editData.basic.pp_description?.trim(),
            pp_approval_status: editData.basic.pp_approval_status,
            pp_difficulty_level: editData.basic.pp_difficulty_level,
            pp_max_integrantes: editData.basic.pp_grupal ? editData.basic.pp_max_integrantes : 1,
            pp_date_limit: editData.basic.pp_date_limit,
            pp_grupal: editData.basic.pp_grupal,
            editor_id: userInfo.id
        },
        
        // Objetivos
        objectives: editData.objectives.map(obj => ({
            op_id: obj.op_id,
            op_name: obj.op_name?.trim(),
            op_type: obj.op_type,
            op_description: obj.op_description?.trim(),
            op_prop_proj: editData.basic.pp_id
        })),
        
        // Requerimientos
        requirements: editData.requirements.map(req => ({
            rp_id: req.rp_id,
            rp_name: req.rp_name?.trim(),
            rp_project: editData.basic.pp_id
        }))
    };
};

// Transforma datos de aplicación de UI a formato API
export const mapApplicationToAPI = (proposalId, userInfo) => {
    return {
        proposalId: proposalId,
        studentId: userInfo.id,
        applicationDate: new Date().toISOString()
    };
};

// Transforma múltiples propuestas para las estadísticas
export const mapProposalsToStats = (proposals) => {
    if (!Array.isArray(proposals)) {
        return {
            pendientes: 0,
            aprobadas: 0,
            rechazadas: 0,
            totales: 0
        };
    }
    
    const stats = proposals.reduce((acc, proposal) => {
        const status = proposal.pp_approval_status;
        
        if (status === 'Pendiente') acc.pendientes++;
        else if (status === 'Aprobada') acc.aprobadas++;
        else if (status === 'Rechazada') acc.rechazadas++;
        
        acc.totales++;
        return acc;
    }, {
        pendientes: 0,
        aprobadas: 0,
        rechazadas: 0,
        totales: 0
    });
    
    return stats;
};

// Transforma datos de usuario del contexto para los hooks
export const mapUserContextToInfo = (user) => {
    if (!user) return null;
    
    return {
        id: user.id,
        rol: user.rol,
        subjects: user.subjects || []
    };
};

// Transforma respuesta de API con múltiples secciones
export const mapAPIResponse = (response) => {
    return {
        proposals: Array.isArray(response?.proposals) 
            ? response.proposals.map(mapProposalToModal)
            : [],
        objectives: Array.isArray(response?.objectives)
            ? mapObjectivesToUI(response.objectives)
            : [],
        requirements: Array.isArray(response?.requirements)
            ? mapRequirementsToUI(response.requirements)
            : [],
        applicants: Array.isArray(response?.applicants)
            ? mapApplicantsToUI(response.applicants)
            : []
    };
};