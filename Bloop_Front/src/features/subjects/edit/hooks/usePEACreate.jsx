import { useState, useEffect, useRef } from 'react';
import { PEAAnalyzer } from '../../services/pdfAnalyzer';
import { createPeaService } from '../../services/createPEA';
import { validatePEAFile, validateKeyConcepts } from '../helpers/subjectValidator';
import { canManagePEA } from '../helpers/subjectPermissions';
import { useAuth } from '@/contexts';
import { useLoadingState, useErrorState, useNotification } from '@/hooks';

// Hook para manejar creación de nuevo PEA
export const usePEACreate = (subject, onPEACreated) => {
    const { user, userRole } = useAuth();
    const currentUser = {
        ...user,
        rol: parseInt(userRole)
    };

    // Hooks globales
    const { loading, withLoading } = useLoadingState();
    const { error, setError, clearError } = useErrorState();
    const { showSuccess, showError, showWarning } = useNotification();

    // Estados del proceso de creación
    const [createState, setCreateState] = useState({
        status: 'empty', // 'empty', 'uploading', 'reviewing', 'creating', 'completed'
        currentFile: null,
        extractedData: null,
        validations: {
            carreraMatch: true,
            asignaturaMatch: true,
            warnings: []
        },
        createdPeaId: null
    });

    // Estado de conexión Flask
    const [flaskStatus, setFlaskStatus] = useState({
        isHealthy: null,
        isChecking: false
    });

    // Referencia al input de archivo
    const fileInputRef = useRef(null);

    // Verificar permisos
    const canCreate = canManagePEA(currentUser.rol);

    // Verificar conexión Flask al inicializar
    useEffect(() => {
        checkFlaskConnection();
    }, []);

    // Verifica la conectividad con Flask
    const checkFlaskConnection = async () => {
        setFlaskStatus(prev => ({ ...prev, isChecking: true }));

        try {
            const isHealthy = await PEAAnalyzer.checkHealth();
            setFlaskStatus({
                isHealthy,
                isChecking: false
            });

            if (!isHealthy) {
                showWarning('API Flask no disponible. Algunas funciones pueden no funcionar');
            }

            return { success: isHealthy };
        } catch (err) {
            setFlaskStatus({
                isHealthy: false,
                isChecking: false
            });
            showError('Error conectando con API Flask');
            return { success: false };
        }
    };

    // Inicia el proceso de subida
    const startUpload = () => {
        if (!canCreate) {
            const errorMsg = 'No tiene permisos para crear PEA';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        if (!flaskStatus.isHealthy) {
            const errorMsg = 'API Flask no disponible';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        fileInputRef.current?.click();
        return { success: true };
    };

    // Procesa archivo seleccionado
    const handleFileSelected = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return { success: false };
        }

        // Validar archivo
        const validation = validatePEAFile(file);
        if (!validation.isValid) {
            setError(validation.errors[0]);
            showError(validation.errors[0]);
            event.target.value = '';
            return { success: false, error: validation.errors[0] };
        }

        // Procesar archivo
        return await processFile(file);
    };

    // Procesa el archivo PDF
    const processFile = async (file) => {
        setCreateState(prev => ({
            ...prev,
            status: 'uploading',
            currentFile: file
        }));

        try {
            const result = await withLoading(async () => {
                return await PEAAnalyzer.analizarPDF(file);
            });

            if (result.success) {
                const formattedData = PEAAnalyzer.formatearDatosPEA(result.data);
                const validations = validatePEAConcordance(formattedData, subject);

                setCreateState(prev => ({
                    ...prev,
                    status: 'reviewing',
                    extractedData: formattedData,
                    validations
                }));

                clearError();
                showSuccess('Archivo procesado correctamente');

                return { success: true, data: formattedData };
            } else {
                setCreateState(prev => ({ ...prev, status: 'empty' }));
                const errorMsg = `Error analizando PEA: ${result.error}`;
                setError(errorMsg);
                showError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (err) {
            setCreateState(prev => ({ ...prev, status: 'empty' }));
            const errorMsg = 'Error inesperado procesando archivo';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Valida concordancia entre PEA y materia
    const validatePEAConcordance = (extractedData, subject) => {
        const warnings = [];
        let carreraMatch = true;
        let asignaturaMatch = true;

        // Verificar coincidencia de asignatura
        const nombrePEA = extractedData?.informacionGeneral?.asignatura?.toLowerCase();
        const nombreMateria = subject?.nombre?.toLowerCase();

        if (nombrePEA && nombreMateria && !nombrePEA.includes(nombreMateria.split(' ')[0])) {
            asignaturaMatch = false;
            warnings.push(`Nombre de asignatura no coincide: PEA (${extractedData.informacionGeneral.asignatura}) vs Materia (${subject.nombre})`);
        }

        // Validar contenido mínimo
        if (!extractedData?.contenidoAcademico?.descripcion || extractedData.contenidoAcademico.descripcion === 'No disponible') {
            warnings.push('No se encontró descripción en el PEA');
        }

        if (!extractedData?.contenidoAcademico?.objetivoGeneral || extractedData.contenidoAcademico.objetivoGeneral === 'No disponible') {
            warnings.push('No se encontró objetivo general en el PEA');
        }

        if (!extractedData?.estadisticas?.totalUnidades || extractedData.estadisticas.totalUnidades === 0) {
            warnings.push('No se encontraron unidades curriculares');
        }

        // Mostrar advertencias
        if (warnings.length > 0) {
            showWarning(`Se encontraron ${warnings.length} advertencias en el PEA`);
        }

        return { carreraMatch, asignaturaMatch, warnings };
    };

    // Transforma datos para creación
    const transformDataForCreation = (extractedData) => {
        if (!extractedData) {
            throw new Error('No hay datos extraídos para procesar');
        }

        const descripcion = extractedData.contenidoAcademico?.descripcion || '';
        const objetivo = extractedData.contenidoAcademico?.objetivoGeneral || '';

        if (!descripcion || descripcion === 'No disponible') {
            throw new Error('La descripción del PEA es requerida');
        }

        if (!objetivo || objetivo === 'No disponible') {
            throw new Error('El objetivo general del PEA es requerido');
        }

        // Generar conceptos clave
        const key_concepts = [];
        const MAX_CONCEPT_LENGTH = 100;

        if (extractedData.unidadesCurriculares?.length > 0) {
            extractedData.unidadesCurriculares.forEach(unidad => {
                const numeroUnidad = parseInt(unidad.numero);

                if (numeroUnidad >= 1 && numeroUnidad <= 3 && unidad.resultadosAprendizaje?.length > 0) {
                    unidad.resultadosAprendizaje.forEach(resultado => {
                        if (resultado?.trim()) {
                            let conceptName = resultado.trim();

                            if (conceptName.length > MAX_CONCEPT_LENGTH) {
                                const lastSpaceIndex = conceptName.substring(0, MAX_CONCEPT_LENGTH).lastIndexOf(' ');
                                conceptName = lastSpaceIndex > 0 ? 
                                    conceptName.substring(0, lastSpaceIndex) + '...' :
                                    conceptName.substring(0, MAX_CONCEPT_LENGTH) + '...';
                            }

                            key_concepts.push({
                                kc_unit: numeroUnidad,
                                kc_name: conceptName
                            });
                        }
                    });
                }
            });
        }

        if (key_concepts.length === 0) {
            throw new Error('No se encontraron conceptos clave válidos');
        }

        // Validar conceptos clave
        const conceptValidation = validateKeyConcepts(key_concepts);
        if (!conceptValidation.isValid) {
            throw new Error(conceptValidation.errors[0]);
        }

        return {
            user: currentUser.id,
            userRol: currentUser.rol,
            p_subject: subject.id,
            p_description: descripcion,
            p_objetive: objetivo,
            key_concepts
        };
    };

    // Crea el PEA en la base de datos
    const createPEA = async () => {
        if (!canCreate) {
            const errorMsg = 'No tiene permisos para crear PEA';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        if (!createState.extractedData) {
            const errorMsg = 'No hay datos de PEA para crear';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }

        setCreateState(prev => ({ ...prev, status: 'creating' }));

        try {
            const result = await withLoading(async () => {
                const peaData = transformDataForCreation(createState.extractedData);
                return await createPeaService(peaData);
            });

            if (result.ok) {
                setCreateState(prev => ({
                    ...prev,
                    status: 'completed',
                    createdPeaId: result.data?.pea_id
                }));

                clearError();
                showSuccess('PEA creado exitosamente');

                // Notificar al componente padre
                onPEACreated?.(result.data);

                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'Error al crear PEA');
            }
        } catch (err) {
            setCreateState(prev => ({ ...prev, status: 'reviewing' }));
            const errorMsg = err.message || 'Error inesperado al crear PEA';
            setError(errorMsg);
            showError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Rechaza y reinicia el proceso
    const rejectPEA = () => {
        setCreateState({
            status: 'empty',
            currentFile: null,
            extractedData: null,
            validations: {
                carreraMatch: true,
                asignaturaMatch: true,
                warnings: []
            },
            createdPeaId: null
        });

        clearError();

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        return { success: true };
    };

    // Resetea completamente el estado
    const resetState = () => {
        rejectPEA();
        clearError();
        return { success: true };
    };

    return {
        // Estados principales
        createState,
        flaskStatus,
        loading,
        error,

        // Referencias
        fileInputRef,

        // Funciones principales
        startUpload,
        handleFileSelected,
        createPEA,
        rejectPEA,
        resetState,
        checkFlaskConnection,

        // Datos y permisos
        canCreate,
        currentUser,

        // Estados de conveniencia
        isUploading: createState.status === 'uploading',
        isReviewing: createState.status === 'reviewing',
        isCreating: createState.status === 'creating',
        isCompleted: createState.status === 'completed',
        isEmpty: createState.status === 'empty',

        // Notificaciones
        showSuccess,
        showError,
        showWarning,

        // Funciones de error
        clearError,
        setError
    };
};