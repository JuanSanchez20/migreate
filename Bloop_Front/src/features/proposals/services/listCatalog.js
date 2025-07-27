import { api } from '@/services';

// Secciones válidas de catálogos
export const CATALOG_SECTIONS = {
    TYPE_PROJECT: 'type_project',
    SUBJECTS: 'subjects'
};

// Servicio para obtener catálogos según la sección indicada
export const listCatalogs = async (section, userData = null) => {
    try {
        if (!section) {
            throw {
                status: 400,
                message: 'El parámetro section es requerido',
                ok: false,
                data: null
            };
        }

        const validSections = Object.values(CATALOG_SECTIONS);
        if (!validSections.includes(section)) {
            throw {
                status: 400,
                message: `Sección no válida. Secciones permitidas: ${validSections.join(', ')}`,
                ok: false,
                data: null
            };
        }

        if (section === CATALOG_SECTIONS.SUBJECTS) {
            if (!userData || !userData.user_id || !userData.user_rol) {
                throw {
                    status: 400,
                    message: 'Para la sección "subjects" se requieren user_id y user_rol',
                    ok: false,
                    data: null
                };
            }
        }

        const url = `/list/catalogs/${section}`;
        let response;

        if (section === CATALOG_SECTIONS.SUBJECTS) {
            response = await api.get(url, {
                params: {
                    user_id: userData.user_id,
                    user_rol: userData.user_rol
                }
            });
        } else {
            response = await api.get(url);
        }

        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Retorna tipos de proyecto
export const getProjectTypes = async () => {
    return await listCatalogs(CATALOG_SECTIONS.TYPE_PROJECT);
};

// Retorna materias según usuario
export const getSubjects = async (user_id, user_rol) => {
    return await listCatalogs(CATALOG_SECTIONS.SUBJECTS, {
        user_id,
        user_rol
    });
};

// Manejo de errores de API
const handleApiError = (error) => {
    console.log('Error details:', error);

    if (error.response) {
        if (error.response.status === 403) {
            return {
                status: 403,
                message: error.response.data?.message || 'No tienes permisos para acceder a este catálogo',
                ok: false,
                data: error.response.data
            };
        }

        if (error.response.status === 404) {
            return {
                status: 404,
                message: 'Endpoint no encontrado. Verifica la configuración de rutas.',
                ok: false,
                data: error.response.data
            };
        }

        return {
            status: error.response.status,
            message: error.response.data?.message || 'Error del servidor',
            ok: false,
            data: error.response.data
        };
    } else if (error.request) {
        return {
            status: 0,
            message: 'No se pudo conectar con el servidor',
            ok: false,
            data: null
        };
    } else {
        return {
            status: 0,
            message: error.message || 'Error desconocido',
            ok: false,
            data: null
        };
    }
};