import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { TextField } from '@/components';
import { ROLE_OPTIONS, STATE_OPTIONS, SEMESTER_OPTIONS } from '../helpers/modalConstants';

const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            {Icon && <Icon className="h-5 w-5 text-[#278bbd]" />}
            <span>{title}</span>
        </h4>
        {children}
    </div>
);

const EditableField = ({
    label,
    value,
    onChange,
    type = "text",
    options = [],
    fieldId,
    placeholder,
    helpText,
    showPasswordToggle = false,
    onTogglePassword,
    showPassword = false
}) => {
    if (type === "select") {
        return (
            <div className="space-y-1">
                <label htmlFor={fieldId} className="text-sm font-medium text-slate-300">
                    {label}
                </label>
                <select
                    id={fieldId}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-[#278bbd] focus:ring-2 focus:ring-[#278bbd]/50 focus:outline-none transition-all duration-200"
                >
                    <option value="">Seleccionar...</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {helpText && (
                    <p className="text-xs text-slate-400">{helpText}</p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <TextField
                label={label}
                id={fieldId}
                type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                showPasswordToggle={showPasswordToggle}
                onTogglePassword={onTogglePassword}
                showPassword={showPassword}
            />
            {helpText && (
                <p className="text-xs text-slate-400">{helpText}</p>
            )}
        </div>
    );
};

const UserEditForm = ({
    editedUser,
    onUserChange,
    showEditPassword,
    onTogglePassword
}) => {
    if (!editedUser) {
        return (
            <InfoSection title="Editar Usuario" icon={PencilIcon}>
                <div className="text-center text-slate-400 py-4">
                    <p>No hay datos de usuario para editar</p>
                </div>
            </InfoSection>
        );
    }

    const isStudent = editedUser.rol?.toLowerCase() === 'estudiante';

    return (
        <InfoSection title="Editar Usuario" icon={PencilIcon}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField
                        label="Nombre completo"
                        fieldId="edit-name"
                        value={editedUser.u_name}
                        onChange={value => onUserChange('u_name', value)}
                        placeholder="Ingrese el nombre completo"
                    />

                    <EditableField
                        label="Correo electrónico"
                        fieldId="edit-email"
                        type="email"
                        value={editedUser.u_email}
                        onChange={value => onUserChange('u_email', value)}
                        placeholder="usuario@ejemplo.com"
                    />
                </div>

                <EditableField
                    label="Contraseña"
                    fieldId="edit-password"
                    value={editedUser.u_password || ''}
                    onChange={value => onUserChange('u_password', value)}
                    placeholder="Dejar vacío para no cambiar"
                    helpText="Dejar vacío si no deseas cambiar la contraseña"
                    showPasswordToggle={true}
                    onTogglePassword={onTogglePassword}
                    showPassword={showEditPassword}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField
                        label="Rol"
                        fieldId="edit-role"
                        type="select"
                        value={editedUser.rol}
                        onChange={value => onUserChange('rol', value)}
                        options={ROLE_OPTIONS}
                        helpText="Seleccione el rol del usuario"
                    />

                    <EditableField
                        label="Estado"
                        fieldId="edit-state"
                        type="select"
                        value={editedUser.u_state.toString()}
                        onChange={value => onUserChange('u_state', parseInt(value))}
                        options={STATE_OPTIONS}
                        helpText="Estado actual del usuario"
                    />
                </div>

                {isStudent && (
                    <EditableField
                        label="Semestre"
                        fieldId="edit-semester"
                        type="select"
                        value={editedUser.u_semester}
                        onChange={value => onUserChange('u_semester', value)}
                        options={SEMESTER_OPTIONS}
                        helpText="Semestre académico del estudiante"
                    />
                )}
            </div>
        </InfoSection>
    );
};

export default UserEditForm;