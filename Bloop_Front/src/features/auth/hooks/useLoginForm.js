import { useState, useCallback } from 'react'

// Hook que maneja el estado y validación del formulario del login
const useLoginForm = () => {
    // Estados del formulario
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    // Validación de los campos del formulario
    const validateForm = useCallback(() => {
        const errors = {};

        // Validación del email
        if (!formData.email){
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)){
            errors.email = 'El email no es válido';
        }

        // Validación del password
        if (!formData.password){
            errors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6){
            errors.password = 'La contraseña debe tener al menos 6 carácteres'
        }

        return{
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }, [formData.email, formData.password]);

    // Actualiza los valores del formulario cuando el usuario escribe
    const updateFormField = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // Resetea el formulario con los valores iniciales
    const resetForm = useCallback(() => {
        setFormData({ email: '', password: '' });
    }, []);

    return {
        formData,
        validateForm,
        updateFormField,
        resetForm
    }
}

export default useLoginForm;