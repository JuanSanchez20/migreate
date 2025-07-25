// NUEVO
import React from "react";
import {
    ExclamationTriangleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

import UserFilter from './UserFilter';

import { LoadingState, ErrorState, EmptyState } from '@/components';
import ListHeader from './subcomponents/UserListHeader';
import UsersGrid from './subcomponents/UserListGrid';

const UserList = ({
    // Lista de usuarios
    users = [],

    // Props para UserFilter
    filterProps = {},

    // Estadísticas
    stats = {
        filtered: 0,
        total: 0,
        hasFilters: false
    },

    // Estados de carga y error
    loading = false,
    error = null,

    // Callbacks
    onRefresh,
    onCardClick,

    // Props adicionales
    className = "",
    ...props
}) => {
    // Verifica props esenciales
    if (!filterProps.filters) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 text-sm">
                    Error: Se requieren las props del hook useUserFilters
                </p>
            </div>
        );
    }

    // Estados de carga
    if (loading && users.length === 0) {
        return (
            <div className={`space-y-6 ${className}`} {...props}>
                <UserFilter {...filterProps} disabled={loading} />
                <LoadingState 
                    message="Cargando usuarios..." 
                    description="Obteniendo la lista de usuarios del sistema"
                />
            </div>
        );
    }

    // Estados de error
    if (error && users.length === 0) {
        return (
            <div className={`space-y-6 ${className}`} {...props}>
                <UserFilter {...filterProps} disabled={loading} />
                <ErrorState 
                    title="Error al cargar usuarios"
                    error={error} 
                    onRetry={onRefresh} 
                />
            </div>
        );
    }

    // Estado vacío
    if (users.length === 0) {
        return (
            <div className={`space-y-6 ${className}`} {...props}>
                <UserFilter {...filterProps} disabled={loading} />
                <EmptyState 
                    type="users"
                    hasActiveFilters={stats.hasFilters}
                    onClearFilters={filterProps.clearFilters}
                />
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`} {...props}>
            {/* Filtros */}
            <UserFilter {...filterProps} disabled={loading} />

            {/* Header con estadísticas */}
            <ListHeader 
                stats={stats}
                onRefresh={onRefresh}
                loading={loading}
            />

            {/* Grid de usuarios */}
            <UsersGrid 
                users={users}
                onCardClick={onCardClick}
                loading={loading}
            />

            {/* Indicador de carga durante refresh */}
            {loading && users.length > 0 && (
                <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-2 text-slate-400">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Actualizando...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;