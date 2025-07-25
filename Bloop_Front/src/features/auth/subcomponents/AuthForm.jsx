import { Button } from '@/components';

export function AuthForm({
    children,
    buttonText, // Texto del botón
    isLoading = false, // Estado de carga
    onSubmit, // Función a ejecutar al enviar
    error = null, // Mensaje de error a mostrar
    buttonVariant = "default" // Variante del botón
}) {
    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">
                        {error}
                    </p>
                </div>
            )}

            {/* Campos del formulario */}
            <div className="space-y-4">
                {children}
            </div>

            {/* Botón de submit */}
            <Button
                type="submit"
                variant={buttonVariant}
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
            >
                {buttonText}
            </Button>
        </form>
    );
}