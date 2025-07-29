import React from 'react';
import { TextField, SelectField, RadioGroupField } from '@/components'
import { JOURNEY_OPTIONS, SEMESTER_OPTIONS } from '../helpers/selectOptions';

// Subcomponente que maneja los campos básicos de información de la materia
const SubjectBasicInfo = ({
    formData,
    onChange,
    onSelectChange,
    onJourneyChange,
    focusHandlers = {},
    errors = {},
    disabled = false
}) => {
    return (
        <div className="space-y-4">
            {/* Campo de nombre de materia */}
            <TextField
                label="Nombre de la materia"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={onChange}
                placeholder="Ej. Fundamentos de Programación"
                disabled={disabled}
                error={errors.name}
                onFocus={focusHandlers.name?.onFocus}
                onBlur={focusHandlers.name?.onBlur}
                required
            />

            {/* Fila con semestre y jornada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campo de semestre */}
                <SelectField
                    label="Semestre"
                    id="semester"
                    value={formData.semester || ''}
                    onValueChange={(value) => onSelectChange('semester', value)}
                    options={SEMESTER_OPTIONS}
                    placeholder="Selecciona semestre"
                    disabled={disabled}
                    error={errors.semester}
                    required
                />

                {/* Campo de jornada */}
                <div className="space-y-2">
                    <RadioGroupField
                        label="Jornada"
                        value={formData.journey || ''}
                        onValueChange={onJourneyChange}
                        options={JOURNEY_OPTIONS}
                        disabled={disabled}
                        error={errors.journey}
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default SubjectBasicInfo;