import { useState, useCallback, useMemo } from "react";

// Maneja el formulario de datos del usuario
const useCreateUserForm = () => {
    // Estado inicial del formulario
    const initialFormData = {
        name: "",
        email: "",
        password: "",
        semester: "",
        role: "estudiante"
    };

    // Estados del formulario
    const [formData, setFormData] = useState(initialFormData);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Cambios de valores en los inputs
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }, [fieldErrors]);

    // Cambios en los selects y radios
    const handleSelectChange = useCallback((fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value,
            // Si cambia el rol a tutor, limpiar semestre
            ...(fieldName === "role" && value === "tutor" ? { semester: "" } : {})
        }));

        // Limpiar errores relacionados
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => ({
                ...prev,
                [fieldName]: null,
                // Si cambió a tutor, también limpiar error de semestre
                ...(fieldName === "role" && value === "tutor" ? { semester: null } : {})
            }));
        }
    }, [fieldErrors]);

    // Validaciones de campos
    const validateField = useCallback((fieldName, value) => {
        switch (fieldName) {
            case 'name':
                if (!value.trim()) return 'El nombre es obligatorio';
                if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
                return null;

            case 'email':
                if (!value.trim()) return 'El correo electrónico es obligatorio';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'El formato del correo no es válido';
                return null;

            case 'password':
                if (!value.trim()) return 'La contraseña es obligatoria';
                if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
                return null;

            case 'semester':
                // Solo requerido para estudiantes
                if (formData.role === 'estudiante' && !value) {
                    return 'El semestre es obligatorio para estudiantes';
                }
                return null;

            case 'role':
                if (!value) return 'El rol es obligatorio';
                if (!['estudiante', 'tutor'].includes(value)) return 'Rol no válido';
                return null;

            default:
                return null;
        }
    }, [formData.role]);

    // Validacion de campos y actualización de errores
    const validateSingleField = useCallback((fieldName) => {
        const value = formData[fieldName];
        const error = validateField(fieldName, value);
        
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
        
        return !error;
    }, [formData, validateField]);

    // Valida todo el formulario
    const validateForm = useCallback(() => {
        const errors = {};
        let isValid = true;

        // Validar cada campo
        Object.keys(formData).forEach(fieldName => {
            const error = validateField(fieldName, formData[fieldName]);
            if (error) {
                errors[fieldName] = error;
                isValid = false;
            }
        });

        setFieldErrors(errors);
        return isValid;
    }, [formData, validateField]);

    // Validaacion del formulario sin errores
    const isFormValid = useMemo(() => {
        // Campos básicos siempre requeridos
        const basicFieldsValid = formData.name.trim() && 
                                formData.email.trim() && 
                                formData.password.trim();
        
        // Para estudiantes: semestre también requerido
        if (formData.role === "estudiante") {
            return basicFieldsValid && formData.semester;
        }
        
        return basicFieldsValid;
    }, [formData]);

    // Verifica si hay errores
    const hasVisibleErrors = useMemo(() => {
        return Object.values(fieldErrors).some(error => error !== null);
    }, [fieldErrors]);

    // Reinicia el formulario
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setFieldErrors({});
        setShowPassword(false);
    }, []);

    // Actualiza el formulario con nuevos datos
    const updateFormData = useCallback((newData) => {
        setFormData(prev => ({
            ...prev,
            ...newData
        }));
    }, []);

    return {
        // Estados
        formData,
        fieldErrors,
        showPassword,
        
        // Estados calculados
        isFormValid,
        hasVisibleErrors,
        
        // Funciones de cambio
        handleInputChange,
        handleSelectChange,
        setShowPassword,
        
        // Funciones de validación
        validateField,
        validateSingleField,
        validateForm,
        
        // Funciones de utilidad
        resetForm,
        updateFormData
    };
}

export default useCreateUserForm;