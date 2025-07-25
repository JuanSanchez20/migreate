import React, { createContext, useContext, useState, useEffect } from "react";

// Crea el contexto de autenticación.
const AuthContext = createContext();

// Hook para usar el contexto
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Función para decodificar el JWT (Sin la firma)
const decodeJWT = (token) => {
    try {
        // Valida las partes del token
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decodificación del payload
        const payload = parts[1];
        // Agregamos padding si es necesario para base64
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedPayload = atob(paddedPayload);

        return JSON.parse(decodedPayload);
    } catch (e) {
        return null;
    }
}

// Función para verificar si el token ha expirado
const isTokenExpired = (token) => {
    try {
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) {
            return true;
        }

        // Transfomando la fecha en milisegundos
        const currentTime = Date.now() / 1000;
        const isExpired = decoded.exp < currentTime;

        return isExpired;
    } catch (error) {
        console.error('Error al verificar expiración del token:', error);
        return true; // Si hay error, asumimos que expiró
    }
};

// Proveedor del contexto
const AuthProvider = ({ children }) => {
    // Estados que manejan la autenticación
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Usuario
    const [userRole, setUserRole] = useState(null); // Rol
    const [token, setToken] = useState(null); // Token
    const [sessionId, setSessionId] = useState(null); // Id Session
    const [isLoading, setIsLoading] = useState(true);

    // Verificación inicial
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            setIsLoading(true);

            // Verificamos si hay datos guardados en el sessionStorage
            const storedToken = sessionStorage.getItem('token');
            const rol = sessionStorage.getItem('rol');
            const userString = sessionStorage.getItem('user');

            if (storedToken && rol && userString) {

                // Verificación de la expiración del token
                if (isTokenExpired(storedToken)) {
                    clearAuthData();
                    return;
                }

                // Verificación de la decodificación del token
                const decodedToken = decodeJWT(storedToken);
                if (!decodedToken) {
                    clearAuthData();
                    return;
                }

                // Verificación de concordancia de los datos del usuario con el token
                const usuario = JSON.parse(userString);
                if (usuario.id !== decodedToken.id) {
                    clearAuthData();
                    return;
                }

                // Verificación de concordancia del rol
                if (parseInt(rol) !== decodedToken.rol) {
                    clearAuthData();
                    return;
                }

                setIsAuthenticated(true);
                setUser(usuario);
                setUserRole(parseInt(rol));
                setToken(storedToken);
                setSessionId(decodedToken.sessionId || null);

                console.log('Usuario autenticado:', {
                    id: usuario.id,
                    email: decodedToken.email,
                    rol: rol,
                    sessionId: decodedToken.sessionId
                });
            } else {
                clearAuthData();
            }
        } catch (e) {
            clearAuthData();
        } finally {
            setIsLoading(false);
        }
    };

    // Función al logearse correctamente
    const login = (newToken, rol, userData) => {
        try {
            // Verificación de la expiración del token
            if (isTokenExpired(newToken)) {
                throw new Error('El token recibido del servidor ya está expirado');
            }

            // Verificación de la decodificación del token
            const decodedToken = decodeJWT(newToken);
            if (!decodedToken) {
                throw new Error('Token inválido recibido del servidor');
            }

            // Verificación de concordancia de los datos
            if (userData.id !== decodedToken.id) {
                throw new Error('Los datos del usuario no coinciden con el token');
            }
            if (parseInt(rol) !== decodedToken.rol) {
                throw new Error('El rol del usuario no coincide con el token');
            }

            // Guarda los datos en el sessionStorage
            sessionStorage.setItem('token', newToken);
            sessionStorage.setItem('rol', rol.toString());
            sessionStorage.setItem('usuario', JSON.stringify(userData));

            // Actualización de estados
            setIsAuthenticated(true);
            setUser(userData);
            setUserRole(parseInt(rol));
            setToken(newToken);
            setSessionId(decodedToken.sessionId || null);

        } catch (e) {
            throw new Error('Error al guardar los datos de sesión: ' + e.message);
        }
    };

    // Función al deslogearse
    const logout = async (callServer = true) => {
        try {
            // Si exite un token y sessionId se lo manda a la API
            if (callServer && token && sessionId) {
                try {
                    const response = await fetch('http://localhost:3000/api/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        console.warn('Error al notificar logout al servidor:', response.status);
                    } else {
                        console.log('Logout notificado correctamente al servidor');
                    }
                } catch (fetchError) {
                    console.warn('Error de red al notificar logout:', fetchError);
                }
            }

            // Limpiar los datos locales
            clearAuthData();
        } catch (e) {
            console.error('Error durante logout:', e);
            clearAuthData();
        }
    };

    // Función para limpiar todos los datos de autenticación
    const clearAuthData = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('rol');
        sessionStorage.removeItem('usuario');
        
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setToken(null);
        setSessionId(null);
    };

    // Función para verificar si el usuario tiene un rol específico
    const hasRole = (requiredRole) => {
        return userRole === parseInt(requiredRole);
    };

    // Función para verificar si el usuario tiene uno de varios roles
    const hasAnyRole = (requiredRoles) => {
        return requiredRoles.some(role => userRole === parseInt(role));
    };

    // Función para obtener headers de autorización para peticiones
    const getAuthHeaders = () => {
        if (!token || isTokenExpired(token)) {
            return {};
        }

        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Función para obtener el token válido
    const getValidToken = () => {
        if (!token) {
            return null;
        }

        if (isTokenExpired(token)) {
            console.log('Token expirado, haciendo logout automático...');
            logout(false);
            return null;
        }

        return token;
    };

    // Valores disponibles en toda la aplicación.
    const value = {
        // Estados básicos
        isAuthenticated,
        user,
        userRole,
        token,
        sessionId, // ← NUEVO: Exponemos el sessionId
        isLoading,
        
        // Funciones principales
        login,
        logout,
        checkAuthStatus,
        
        // Funciones de verificación de roles
        hasRole,
        hasAnyRole,
        
        // Funciones para peticiones HTTP
        getAuthHeaders,
        getValidToken,
        
        // Información adicional
        isTokenExpired: () => token ? isTokenExpired(token) : true
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export {
    useAuth,
    AuthProvider
};