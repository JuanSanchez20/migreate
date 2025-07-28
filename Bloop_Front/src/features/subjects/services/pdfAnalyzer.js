/**
 * Servicio para comunicación con la API de análisis PEA
 * Maneja peticiones HTTP, validaciones y transformación de datos
 */

class PEAAnalyzer {
    constructor() {
        // ✅ URL base SIN process.env - configuración manual
        this.baseURL = 'http://localhost:5000/api';
        
        // Configuración por defecto para las peticiones
        this.defaultConfig = {
            headers: {
                // No incluimos 'Content-Type' para FormData - el navegador lo gestiona automáticamente
            },
            // CORS está habilitado en tu Flask, pero especificamos el modo por claridad
            mode: 'cors'
        };
    }

    /**
     * Verifica que la API esté disponible
     * @returns {Promise<boolean>} - true si la API responde
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
            const data = await response.json();

            return data.status === 'healthy';
        } catch (error) {
            console.error('Error verificando salud de la API:', error);
            return false;
        }
    }

    /**
     * Analiza un archivo PDF extrayendo información PEA
     * @param {File} archivo - Archivo PDF del input file
     * @param {Function} onProgress - Callback opcional para progreso de subida
     * @returns {Promise<Object>} - Resultado del análisis o error
     */
    async analizarPDF(archivo, onProgress = null) {
        // PASO 1: Validaciones del lado cliente
        this._validarArchivo(archivo);

        // PASO 2: Preparar FormData
        const formData = new FormData();
        formData.append('archivo-pdf', archivo);

        // PASO 3: Configurar opciones de la petición
        const opciones = {
            method: 'POST',
            body: formData,
            ...this.defaultConfig
        };

        try {
            // PASO 4: Realizar petición HTTP
            const response = await fetch(`${this.baseURL}/procesar-pdf`, opciones);

            // PASO 5: Procesar respuesta
            const resultado = await this._procesarRespuesta(response);

            return {
                success: true,
                data: resultado
            };

        } catch (error) {
            console.error('Error analizando PDF:', error);

            return {
                success: false,
                error: error.message,
                tipo: error.name || 'Error'
            };
        }
    }

    /**
     * Valida el archivo antes de enviarlo al servidor
     * @param {File} archivo - Archivo a validar
     * @throws {Error} - Si el archivo no es válido
     */
    _validarArchivo(archivo) {
        // Verificar que existe
        if (!archivo) {
            throw new Error('No se ha seleccionado ningún archivo');
        }

        // Verificar tipo
        if (!archivo.type || archivo.type !== 'application/pdf') {
            throw new Error('El archivo debe ser un PDF válido');
        }

        // Verificar extensión (doble validación)
        if (!archivo.name.toLowerCase().endsWith('.pdf')) {
            throw new Error('El archivo debe tener extensión .pdf');
        }

        // Verificar tamaño (10MB máximo, igual que tu Flask)
        const maxSize = 10 * 1024 * 1024; // 10MB en bytes
        if (archivo.size > maxSize) {
            const sizeMB = (archivo.size / (1024 * 1024)).toFixed(1);
            throw new Error(`Archivo muy grande. Máximo 10MB, seleccionado: ${sizeMB}MB`);
        }

        // Verificar que no esté vacío
        if (archivo.size === 0) {
            throw new Error('El archivo está vacío');
        }
    }

    /**
     * Procesa la respuesta HTTP del servidor
     * @param {Response} response - Respuesta fetch
     * @returns {Promise<Object>} - Datos procesados
     * @throws {Error} - Si hay error en la respuesta
     */
    async _procesarRespuesta(response) {
        // Verificar status HTTP
        if (!response.ok) {
            // Intentar extraer mensaje de error del servidor
            let errorMessage = `Error HTTP ${response.status}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Si no puede parsear JSON, usar mensaje genérico
                errorMessage = `Error del servidor (${response.status})`;
            }

            throw new Error(errorMessage);
        }

        // Parsear JSON
        const data = await response.json();

        // Verificar estructura de respuesta
        if (!data || data.status !== 'success') {
            throw new Error(data?.message || 'Respuesta inválida del servidor');
        }

        return data;
    }

    /**
     * Formatea los datos del PEA para mostrar en la UI
     * @param {Object} datosPEA - Datos extraídos del PDF
     * @returns {Object} - Datos formateados para la UI
     */
    formatearDatosPEA(datosPEA) {
        if (!datosPEA || !datosPEA.datos_pea) {
            return null;
        }

        const datos = datosPEA.datos_pea;

        return {
            informacionGeneral: {
                carrera: datos.carrera || 'No especificada',
                asignatura: datos.asignatura || 'No especificada',
                nucleoEstructurante: datos.nucleo_estructurante || 'No especificado'
            },
            contenidoAcademico: {
                descripcion: datos.descripcion || 'No disponible',
                objetivoGeneral: datos.objetivo_general || 'No disponible',
                relacionPerfilEgreso: datos.relacion_perfil_egreso || 'No disponible'
            },
            unidadesCurriculares: this._formatearUnidades(datos.unidades || []),
            estadisticas: {
                totalUnidades: datos.unidades ? datos.unidades.length : 0,
                totalResultadosAprendizaje: this._contarResultadosAprendizaje(datos.unidades || [])
            }
        };
    }

    /**
     * Formatea las unidades curriculares
     * @param {Array} unidades - Array de unidades extraídas
     * @returns {Array} - Unidades formateadas
     */
    _formatearUnidades(unidades) {
        return unidades.map(unidad => ({
            numero: unidad.numero,
            nombre: unidad.nombre || `Unidad ${unidad.numero}`,
            resultadosAprendizaje: unidad.resultados_aprendizaje || [],
            totalResultados: (unidad.resultados_aprendizaje || []).length
        }));
    }

    /**
     * Cuenta el total de resultados de aprendizaje
     * @param {Array} unidades - Array de unidades
     * @returns {number} - Total de resultados
     */
    _contarResultadosAprendizaje(unidades) {
        return unidades.reduce((total, unidad) => {
            return total + (unidad.resultados_aprendizaje ? unidad.resultados_aprendizaje.length : 0);
        }, 0);
    }

    /**
     * Convierte bytes a formato legible (KB, MB)
     * @param {number} bytes - Tamaño en bytes
     * @returns {string} - Tamaño formateado
     */
    formatearTamano(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    }

    /**
     * Valida que un archivo sea PDF sin necesidad de subirlo
     * @param {File} archivo - Archivo a validar
     * @returns {Object} - {valid: boolean, error: string}
     */
    validarArchivoPDF(archivo) {
        try {
            this._validarArchivo(archivo);
            return { valid: true, error: null };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

// ✅ CREAR Y EXPORTAR UNA INSTANCIA (no la clase)
const PEAAnalyzerInstance = new PEAAnalyzer();

// Exportar la instancia con el mismo nombre
export { PEAAnalyzerInstance as PEAAnalyzer };
