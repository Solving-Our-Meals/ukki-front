import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

function PrivateRoute({ element, ...rest }) {
    const { isAuthenticated, checkAuthToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            if (!isAuthenticated) {
                navigate('/auth/login');
            }
        };

        verifyAuth();
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return element;
}

export default PrivateRoute;
