import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProjectTypes, getSubjects } from '../../services/listCatalog';

export const useCatalogList = (catalogTypes = [], userData = null) => {
    const [catalogs, setCatalogs] = useState({
        projectTypes: [],
        subjects: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estabilizar catalogTypes para evitar recreación
    const stableCatalogTypes = useMemo(() => catalogTypes, [catalogTypes.join(',')]);
    
    // Extraer propiedades específicas del userData
    const userId = userData?.user_id;
    const userRol = userData?.user_rol;

    // Carga tipos de proyecto
    const loadProjectTypes = useCallback(async () => {
        try {
            const response = await getProjectTypes();
            const types = response.data.map(type => ({
                value: type.tp_id,
                label: type.tp_name,
                description: type.tp_description
            }));
            
            setCatalogs(prev => ({ ...prev, projectTypes: types }));
        } catch (err) {
            throw new Error('Error al cargar tipos de proyecto');
        }
    }, []);

    // Carga materias según rol del usuario
    const loadSubjects = useCallback(async () => {
        try {
            if (!userId || !userRol) {
                throw new Error('Datos de usuario requeridos para cargar materias');
            }

            const response = await getSubjects(userId, userRol);
            const subjects = response.data.map(subject => ({
                value: subject.s_id,
                label: subject.s_name,
                originalData: subject
            }));
            
            setCatalogs(prev => ({ ...prev, subjects }));
        } catch (err) {
            throw new Error('Error al cargar materias');
        }
    }, [userId, userRol]);

    // Carga los catálogos solicitados
    const loadCatalogs = useCallback(async () => {
        if (stableCatalogTypes.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const promises = [];

            if (stableCatalogTypes.includes('projectTypes')) {
                promises.push(loadProjectTypes());
            }

            if (stableCatalogTypes.includes('subjects') && userId && userRol) {
                promises.push(loadSubjects());
            }

            await Promise.all(promises);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [stableCatalogTypes, userId, userRol, loadProjectTypes, loadSubjects]);

    // Recarga catálogos
    const reloadCatalogs = useCallback(() => {
        loadCatalogs();
    }, [loadCatalogs]);

    useEffect(() => {
        loadCatalogs();
    }, [loadCatalogs]);

    return {
        catalogs,
        loading,
        error,
        reloadCatalogs
    };
};