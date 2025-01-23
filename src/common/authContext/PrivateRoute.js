import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

function PrivateRoute({ element, ...rest }) {
    const { isAuthenticated, user } = useAuth(); // user 정보를 가져옵니다.
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            if (!isAuthenticated) {
                navigate('/auth/login');
            }
        };
        verifyAuth();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.userRole === 'ADMIN') {
                if (!window.location.pathname.startsWith('/admin')) {
                    navigate('/admin');
                }
            } else if (user?.userRole === 'STORE') {
                if (!window.location.pathname.startsWith('/boss')) {
                    navigate('/boss');
                }
            } else if (user?.userRole === 'USER') {
                if (!window.location.pathname.startsWith('/')) {
                    navigate('/');
                }
            }
        }
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return element;
}

export default PrivateRoute;
