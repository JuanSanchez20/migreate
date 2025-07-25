import React from "react";
import { useAuth } from '@/contexts';
import { useState, useEffect } from 'react';

import { useUsersModule, UserList, UserModal } from '@/features';

// Estdado de acceso denegado
const AccessDeniedState = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2zM12 13a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
            </div>

            <h3 className="text-xl font-semibold text-red-400 mb-2">
                Acceso Denegado
            </h3>
            <p className="text-red-300 mb-4">
                No tienes permisos para acceder a la gestión de usuarios
            </p>
            <p className="text-sm text-slate-500">
                Solo los administradores pueden ver esta sección
            </p>
        </div>
    </div>
);

// Componete principal de la página
const UserListPage = () => {
    // Hook de autenticación
    const { user: currentUser, userRole, isAuthenticated, isLoading: authLoading } = useAuth();

    // Verificacion de permisos
    const canAccessUsers = () => {
        if (!isAuthenticated || !userRole) {
            return false;
        }
        
        const hasPermission = userRole === 1; // Solo administradores
        return hasPermission;
    };

    // Hook principal de usuarios
    const {
        // Datos
        users, // Usuarios filtrados
        allUsers,
        loading,
        error,

        // Filtros (props para UserFilter)
        filters,
        updateEmail,
        updateRol,
        updateSemestre,
        updateEstado,
        clearFilters,
        hasActiveFilters,
        getActiveFiltersInfo,
        
        // Estadísticas
        stats,

        // Funciones principales
        onRefresh,
        onUserUpdate,

        // Funciones auxiliares
        resetModule,
        getCompleteModuleState
    } = useUsersModule({
        initialMode: 'todos',
        autoLoad: canAccessUsers()  // Cargar automáticamente al montar
    });

    // Modal de usuario seleccionado
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openInEditMode, setOpenInEditMode] = useState(false);

    // Manejo de click en tarjeta de usuario (abrir en modo vista)
    const handleCardClick = (user) => {
        setSelectedUser(user);
        setOpenInEditMode(false); // Abrir en modo vista
        setIsModalOpen(true);
    };

    // Manejo de click en botón editar (abrir en modo edición)
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setOpenInEditMode(true); // Abrir en modo edición
        setIsModalOpen(true);
    };

    // Manejo de cierre de modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setOpenInEditMode(false);
    };

    // Manejo de actualización desde modal
    const handleUserUpdateFromModal = async () => {
        // Refrescar datos después de actualización
        await onUserUpdate();
        // No cerrar el modal aquí, el modal se encarga de su propio cierre
    };

    // Log de cambios importantes
    useEffect(() => {
    }, [users.length, loading, error, hasActiveFilters, stats]);

    // Verificar autenticación al montar
    if (authLoading) {
        // Mostrar loading mientras se verifica la autenticación
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-[#278bbd] mx-auto mb-4"></div>
                    <p className="text-slate-400">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // Validación de acceso
    if (!canAccessUsers()) {
        return <AccessDeniedState />;
    }

    // Preparar props para UserFilter
    const filterProps = {
        filters,
        updateEmail,
        updateRol,
        updateSemestre,
        updateEstado,
        clearFilters,
        hasActiveFilters,
        getActiveFiltersInfo
    };

    // Layout principal
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4 pt-10">
            <div className="w-full max-w-7xl mx-auto">

                {/* Componente principal de la lista */}
                <UserList
                    users={users}
                    filterProps={filterProps}
                    stats={stats}
                    loading={loading}
                    error={error}
                    onRefresh={onRefresh}
                    onCardClick={handleCardClick}
                />

                {/* Modal de usuario */}
                <UserModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onUserUpdate={handleUserUpdateFromModal}
                    isEditing={openInEditMode}
                />
            </div>
        </div>
    );
};

export default UserListPage;