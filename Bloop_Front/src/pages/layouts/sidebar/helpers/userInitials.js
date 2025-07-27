// Helper simple para iniciales de usuario
export const getUserInitials = (fullName) => {
    if (!fullName) return 'US';
    
    const words = fullName.trim().split(' ');
    
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    
    // Primer nombre + primer apellido
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};