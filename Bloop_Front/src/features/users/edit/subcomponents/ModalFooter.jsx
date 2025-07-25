import React from 'react';
import { Button } from '@/components';

// Footer del modal con botones de acción
const ModalFooter = ({ 
    editMode, 
    loading, 
    onSave, 
    onCancel, 
    onClose, 
    hasChanges = false,
    canSave = false 
}) => {
    return (
        <div className="flex justify-end gap-3 border-t border-slate-700 p-4 bg-slate-800 sticky bottom-0">        
            {editMode ? (
                // Botones de edición
                <>
                    <div className="w-32">
                        <Button
                            onClick={onCancel}
                            disabled={loading}
                            variant="outline"
                            size="default"
                        >
                            Cancelar
                        </Button>
                    </div>
                    <div className="w-40">
                        <Button
                            onClick={onSave}
                            disabled={loading || !canSave}
                            variant="approved"
                            size="default"
                            isLoading={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </>
            ) : (
                // Botón de cerrar en modo vista
                <div className="w-32">
                    <Button
                        onClick={onClose}
                        variant={hasChanges ? "pending" : "outline"}
                        size="default"
                        className={hasChanges ? "animate-pulse" : ""}
                    >
                        {hasChanges ? 'Cerrar' : 'Cerrar'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ModalFooter;