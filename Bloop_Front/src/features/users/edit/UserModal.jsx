import React, { useEffect } from 'react';
import useUserModalModule from './hooks/useUserModalModule';
import { useClickOutside, useNotification } from '@/hooks';

// Importar subcomponentes
import ModalHeader from './subcomponents/ModalHeader';
import ModalFooter from './subcomponents/ModalFooter';
import UserInfoSection from './subcomponents/ModalUserInfo';
import UserEditForm from './subcomponents/ModalEditMode';
import SubjectManagement from './subcomponents/ModalSubjetInfo';

// Contenido principal del modal dividido en dos columnas
const ModalContent = ({
    user,
    editMode,
    editedUser,
    onUserChange,
    showPassword,
    onTogglePassword,
    assignedSubjects,
    subjectsToShow,
    selectedSubjectToAdd,
    onSubjectSelect,
    onAddSubject,
    onRemoveSubject,
    loading
}) => {
    // Verificar si el usuario puede gestionar materias
    const canManageSubjects = user?.rol_name?.toLowerCase() !== 'admin';
    
    return (
        <div className={`grid ${canManageSubjects ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`} 
            style={{ height: 'calc(90vh - 200px)' }}>
            
            {/* Columna izquierda: Información/Edición del usuario */}
            <div className={`p-5 overflow-y-auto ${canManageSubjects ? 'border-r border-slate-700' : ''}`}>
                {editMode ? (
                    <UserEditForm
                        editedUser={editedUser}
                        onUserChange={onUserChange}
                        showEditPassword={showPassword}
                        onTogglePassword={onTogglePassword}
                    />
                ) : (
                    <UserInfoSection user={user} />
                )}
            </div>

            {/* Columna derecha: Gestión de materias (Solo para Tutores y Estudiantes) */}
            {canManageSubjects && (
                <div className="p-6 overflow-y-auto">
                    <SubjectManagement
                        assignedSubjects={assignedSubjects}
                        subjectsToShow={subjectsToShow}
                        selectedSubjectToAdd={selectedSubjectToAdd}
                        onSubjectSelect={onSubjectSelect}
                        onAddSubject={onAddSubject}
                        onRemoveSubject={onRemoveSubject}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};

// Componente principal del modal de usuario
// Permite ver y editar información del usuario, así como gestionar sus materias
const UserModal = ({
    user,
    isOpen = false,
    onClose,
    onUserUpdate,
    isEditing = false
}) => {
    // Hook para manejo de notificaciones
    const {
        notification,
        hideNotification,
        showSuccess,
        showError
    } = useNotification({
        DURATION: 3000 // 3 segundos para notificaciones del modal
    });

    // Hook principal con toda la lógica del modal
    const {
        // Estados del modal
        editMode,
        showPassword,
        loading,

        // Datos del usuario
        editedUser,
        hasUnsavedChanges,

        // Datos de materias
        assignedSubjects,
        subjectsToShow,
        selectedSubjectToAdd,
        hasSubjectChanges,

        // Funciones del modal
        toggleEditMode,
        togglePasswordVisibility,
        closeModal,

        // Funciones de edición
        updateUserField,
        saveUser,
        cancelEdit,
        canSave,

        // Funciones de materias
        setSelectedSubjectToAdd,
        addSubject,
        removeSubject,

        // Estados derivados
        hasChanges
    } = useUserModalModule(user, onUserUpdate, showSuccess, showError, hideNotification);

    // Hook para cerrar modal al hacer clic fuera
    const modalRef = useClickOutside(
        () => {
            hideNotification();
            if (hasChanges) {
                const confirm = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?');
                if (confirm) {
                    closeModal();
                }
            } else {
                closeModal();
            }
        },
        isOpen && !loading, // Solo activo si está abierto y no está cargando
        ['notification-banner'] // Ignorar clics en notificaciones
    );

    // Configurar modo edición inicial si se especifica
    useEffect(() => {
        if (isEditing && isOpen) {
            toggleEditMode();
        }
    }, [isEditing, isOpen]);

    // Manejar el cierre del modal
    const handleModalClose = () => {
        hideNotification();
        closeModal();
        if (onClose) {
            onClose();
        }
    };

    // Validación de props
    if (!user) {
        return null; // No renderizar si no hay usuario
    }

    // No renderizar si no está abierto
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Contenedor principal del modal */}
            <div
                ref={modalRef}
                className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4"
            >
                {/* Header con notificaciones */}
                <ModalHeader 
                    user={user}
                    editMode={editMode}
                    onToggleEdit={toggleEditMode}
                    onClose={handleModalClose}
                    notification={notification}
                    onHideNotification={hideNotification}
                />

                {/* Contenido principal */}
                <ModalContent
                    user={user}
                    editMode={editMode}
                    editedUser={editedUser}
                    onUserChange={updateUserField}
                    showPassword={showPassword}
                    onTogglePassword={togglePasswordVisibility}
                    assignedSubjects={assignedSubjects}
                    subjectsToShow={subjectsToShow}
                    selectedSubjectToAdd={selectedSubjectToAdd}
                    onSubjectSelect={setSelectedSubjectToAdd}
                    onAddSubject={addSubject}
                    onRemoveSubject={removeSubject}
                    loading={loading}
                />

                {/* Footer con botones */}
                <ModalFooter
                    editMode={editMode}
                    loading={loading}
                    onSave={saveUser}
                    onCancel={cancelEdit}
                    onClose={handleModalClose}
                    hasChanges={hasChanges}
                    canSave={canSave}
                />
            </div>
        </div>
    );
};

export default UserModal;