import { useState, useCallback, useMemo } from 'react';

// Hook para gestionar filtros locales de búsqueda y materia
const useProposalsFilters = () => {

    // Estados de los filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Actualiza el término de búsqueda
    const updateSearchTerm = useCallback((term) => {
        const normalizedTerm = typeof term === 'string' ? term : '';
        setSearchTerm(normalizedTerm);
    }, []);

    // Actualiza la materia seleccionada
    const updateSelectedSubject = useCallback((subject) => {
        console.log('📝 updateSelectedSubject recibido:', {
            subject,
            type: typeof subject,
            isTodasValue: subject === 'todas',
            isEmpty: !subject
        });

        if (subject === 'todas' || !subject) {
            console.log('✅ Estableciendo selectedSubject a null');
            setSelectedSubject(null);
        } else {
            const numericValue = parseInt(subject);
            console.log('🔢 Convirtiendo a número:', {
                original: subject,
                converted: numericValue,
                isNaN: isNaN(numericValue)
            });
            setSelectedSubject(isNaN(numericValue) ? null : numericValue);
        }
    }, []);

    // Limpia todos los filtros
    const clearAllFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedSubject(null);
    }, []);

    // Verifica si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return searchTerm.trim() !== '' || selectedSubject !== null;
    }, [searchTerm, selectedSubject]);

    // Aplica filtros a las propuestas
    const applyFilters = useCallback((proposals) => {
        if (!Array.isArray(proposals)) {
            return [];
        }

        let filtered = [...proposals];

        // Filtro por búsqueda en título
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(proposal => {
                const title = proposal.pp_name || '';
                return title.toLowerCase().includes(searchLower);
            });
        }

        // Filtro por materia usando ID
        if (selectedSubject !== null) {
            console.log('🔍 Filtrando por materia:', {
                selectedSubject,
                type: typeof selectedSubject,
                sampleProposal: filtered[0] ? {
                    pp_subject: filtered[0].pp_subject,
                    materia_nombre: filtered[0].materia_nombre
                } : 'No hay propuestas'
            });
            
            filtered = filtered.filter(proposal => {
                const match = proposal.pp_subject === selectedSubject;
                console.log(`Propuesta ${proposal.pp_name}: pp_subject=${proposal.pp_subject}, selectedSubject=${selectedSubject}, match=${match}`);
                return match;
            });
        }

        console.log('📊 Resultado del filtrado:', {
            originalCount: proposals.length,
            filteredCount: filtered.length,
            searchTerm,
            selectedSubject
        });

        return filtered;
    }, [searchTerm, selectedSubject]);

    // ✅ ELIMINADA: Esta función ya no se necesita porque usaremos useSubjectList
    // para obtener todas las materias directamente de la base de datos

    return {
        // Estados actuales
        searchTerm,
        selectedSubject,
        hasActiveFilters,

        // Acciones principales
        updateSearchTerm,
        updateSelectedSubject,
        clearAllFilters,
        applyFilters,

        // Estados derivados para UI
        isSearching: searchTerm.trim() !== '',
        isFilteringBySubject: selectedSubject !== null
    };
};

export default useProposalsFilters;