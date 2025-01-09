import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: '/auth',
        withCredentials: true,
    });

    // 인증된 상태 확인 함수
    const checkAuthToken = async () => {
        try {
            const response = await axiosInstance.get('/check-auth');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    };

    const refreshAuthToken = async () => {
        try {
            const response = await axiosInstance.post('/refresh-token');
            if (response.data.token) {
                setAuthToken(response.data.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return false;
        }
    };

    useEffect(() => {
        const verifyAuthToken = async () => {
            const isValid = await checkAuthToken();
            if (!isValid) {
                const newToken = await refreshAuthToken();
                if (newToken) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        verifyAuthToken();
    }, [navigate]);

    if (loading) {
        return <div>로딩 만들고 넣을것</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, authToken, setAuthToken, refreshAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
