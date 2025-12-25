// Decodifica un token JWT sin verificación
export const decodeToken = (token) => {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

        return decoded;
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
};

// Verifica si el token ha expirado
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
};

// Verifica si el token necesita renovación (expira en menos de 5 minutos)
export const shouldRefreshToken = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const fiveMinutes = 5 * 60 * 1000;
    return decoded.exp * 1000 - Date.now() < fiveMinutes;
};

// Obtiene el tiempo hasta la expiración del token en milisegundos
export const getTimeUntilExpiration = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;

    const timeRemaining = decoded.exp * 1000 - Date.now();
    return Math.max(0, timeRemaining);
};

// Almacena los tokens en localStorage
export const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

// Obtiene los tokens almacenados desde localStorage
export const getStoredTokens = () => {
    return {
        accessToken: localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken'),
    };
};

// Elimina todos los tokens de localStorage
export const clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};
