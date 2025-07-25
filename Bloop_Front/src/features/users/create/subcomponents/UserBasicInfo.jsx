import React from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { TextField, CardSectionTitle } from '@/components';

// Componente para mostrar la sección de información básica del usuario [Nombre, Email, Contraseña]
export default function UserBasicInfo({
    formData,
    fieldErrors = {},
    onInputChange,
    showPassword = false,
    onTogglePassword,
    isLoading = false
}) {
    // Función simple para obtener mensaje de error o ayuda
    const getHelpText = (fieldName, defaultHelp) => {
        return fieldErrors[fieldName] || defaultHelp;
    };

    // Función simple para verificar si hay error
    const hasError = (fieldName) => !!fieldErrors[fieldName];

    return (
        <div className="space-y-5">
            <CardSectionTitle>Información Personal</CardSectionTitle>

            {/* Grid de campos básicos */}
            <div className="grid md:grid-cols-2 gap-5">
                <TextField
                    label="Nombre completo"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={onInputChange}
                    placeholder="Ingresa el nombre completo"
                    icon={UserIcon}
                    helpText={getHelpText('name', 'Nombre y apellidos del usuario')}
                    disabled={isLoading}
                    style={{ borderColor: hasError('name') ? '#ef4444' : undefined }}
                />

                <TextField
                    label="Correo electrónico"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={onInputChange}
                    placeholder="usuario@ejemplo.com"
                    icon={EnvelopeIcon}
                    helpText={getHelpText('email', 'Se usará para el inicio de sesión')}
                    disabled={isLoading}
                    style={{ borderColor: hasError('email') ? '#ef4444' : undefined }}
                />
            </div>

            {/* Campo Contraseña */}
            <TextField
                label="Contraseña"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={onInputChange}
                placeholder="Contraseña segura"
                icon={LockClosedIcon}
                helpText={getHelpText('password', 'Mínimo 6 caracteres recomendado')}
                showPasswordToggle={true}
                onTogglePassword={onTogglePassword}
                showPassword={showPassword}
                disabled={isLoading}
                style={{ borderColor: hasError('password') ? '#ef4444' : undefined }}
            />
        </div>
    );
}