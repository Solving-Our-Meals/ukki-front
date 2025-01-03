import { useState, useEffect } from 'react';
import { refreshAccessToken } from './RefreshToken'

const useAuth = () => {
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('authToken='));
        if (token) {
            console.log('authToken found in cookie:', token.split('=')[1]);
            setAuthToken(token.split('=')[1]);
        }
    }, []);

    const refreshAuthToken = async () => {
        try {
            console.log('Refreshing auth token...');
            const newToken = await refreshAccessToken();
            setAuthToken(newToken);
            console.log('New auth token:', newToken);
        } catch (error) {
            console.error('Token refresh failed');
        }
    };

    return { authToken, refreshAuthToken };
};

export default useAuth;