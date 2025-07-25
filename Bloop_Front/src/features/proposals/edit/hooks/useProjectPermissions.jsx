import { useMemo } from 'react';

// Hook para verificar permisos de usuario sobre propuestas
const useProjectPermissions = (proposal = null, userInfo = null) => {

    // Obtiene el rol numérico del usuario
    const userRole = useMemo(() => {
        const roleMap = {
            'Admin': 1,
            'Administrador': 1,
            'Tutor': 2,
            'Estudiante': 3
        };
        return roleMap[userInfo?.rol] || null;
    }, [userInfo?.rol]);

    // Verifica si el usuario es el creador de la propuesta
    const isOwner = useMemo(() => {
        if (!proposal || !userInfo?.id) return false;
        return proposal.pp_user === userInfo.id;
    }, [proposal?.pp_user, userInfo?.id]);

    // Verifica si el usuario es tutor de la materia de la propuesta
    const isTutorOfSubject = useMemo(() => {
        if (!proposal || userRole !== 2 || !userInfo?.subjects) return false;
        return userInfo.subjects.includes(proposal.pp_subject);
    }, [proposal?.pp_subject, userRole, userInfo?.subjects]);

    // Verifica si el usuario puede ver la propuesta
    const canView = useMemo(() => {
        if (!proposal || !userRole) return false;

        // Admin ve todo
        if (userRole === 1) return true;

        // Tutor ve propuestas de sus materias
        if (userRole === 2) return isTutorOfSubject;

        // Estudiante solo ve propuestas aprobadas de sus materias
        if (userRole === 3) {
            const isApproved = proposal.pp_approval_status === 'Aprobada';
            const isInUserSubjects = userInfo?.subjects?.includes(proposal.pp_subject);
            return isApproved && isInUserSubjects;
        }

        return false;
    }, [proposal, userRole, isTutorOfSubject, userInfo?.subjects]);

    // Verifica si el usuario puede editar la propuesta
    const canEdit = useMemo(() => {
        if (!proposal || !userRole) return false;

        // Solo el tutor creador puede editar sus propuestas
        return userRole === 2 && isOwner && isTutorOfSubject;
    }, [proposal, userRole, isOwner, isTutorOfSubject]);

    // Verifica si el usuario puede aplicar a la propuesta
    const canApply = useMemo(() => {
        if (!proposal || userRole !== 3) return false;

        // Estudiante puede aplicar si:
        // - La propuesta está aprobada
        // - No es el creador (aunque estudiante no crea propuestas)
        // - Está en sus materias
        const isApproved = proposal.pp_approval_status === 'Aprobada';
        const isInUserSubjects = userInfo?.subjects?.includes(proposal.pp_subject);
        
        return isApproved && !isOwner && isInUserSubjects;
    }, [proposal, userRole, isOwner, userInfo?.subjects]);

    // Verifica si el usuario puede ver los aplicantes
    const canViewApplicants = useMemo(() => {
        if (!proposal || !userRole) return false;

        // Admin ve aplicantes de todas las propuestas
        if (userRole === 1) return true;

        // Tutor ve aplicantes de sus propuestas aprobadas
        if (userRole === 2) {
            const isApproved = proposal.pp_approval_status === 'Aprobada';
            return isOwner && isTutorOfSubject && isApproved;
        }

        return false;
    }, [proposal, userRole, isOwner, isTutorOfSubject]);

    // Obtiene el contexto de permisos para mostrar en UI
    const getPermissionContext = useMemo(() => {
        if (!userRole) return { role: 'Sin rol', canInteract: false };

        const contexts = {
            1: { role: 'Administrador', canInteract: canView },
            2: { role: 'Tutor', canInteract: canView },
            3: { role: 'Estudiante', canInteract: canView }
        };

        return contexts[userRole] || { role: 'Desconocido', canInteract: false };
    }, [userRole, canView]);

    // Obtiene las acciones disponibles para el usuario
    const getAvailableActions = useMemo(() => {
        const actions = [];

        if (canView) actions.push('view');
        if (canEdit) actions.push('edit');
        if (canApply) actions.push('apply');
        if (canViewApplicants) actions.push('viewApplicants');

        return actions;
    }, [canView, canEdit, canApply, canViewApplicants]);

    // Verifica si el usuario tiene algún permiso sobre la propuesta
    const hasAnyPermission = useMemo(() => {
        return canView || canEdit || canApply || canViewApplicants;
    }, [canView, canEdit, canApply, canViewApplicants]);

    // Obtiene mensaje de restricción si no tiene permisos
    const getRestrictionMessage = useMemo(() => {
        if (!proposal || hasAnyPermission) return null;

        const messages = {
            1: 'Sin acceso a esta propuesta',
            2: 'Esta propuesta no pertenece a tus materias',
            3: 'Esta propuesta no está disponible o no pertenece a tus materias'
        };

        return messages[userRole] || 'Sin permisos para esta propuesta';
    }, [proposal, hasAnyPermission, userRole]);

    return {
        // Información del usuario
        userRole,
        isOwner,
        isTutorOfSubject,

        // Permisos específicos
        canView,
        canEdit,
        canApply,
        canViewApplicants,

        // Información contextual
        getPermissionContext,
        getAvailableActions,
        hasAnyPermission,
        getRestrictionMessage
    };
};

export default useProjectPermissions;