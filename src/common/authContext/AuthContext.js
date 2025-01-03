import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // 인증 상태
    const [authToken, setAuthToken] = useState(null); // authToken 상태
    const navigate = useNavigate();

    // axiosInstance 설정
    const axiosInstance = axios.create({
        baseURL: '/auth',
        withCredentials: true, // 쿠키를 포함하여 요청
    });

    // 인증된 상태 확인 함수
    const checkAuthToken = async () => {
        try {
            const response = await axiosInstance.get('/check-auth'); // 인증 상태 확인
            return response.status === 200;
        } catch (error) {
            return false;
        }
    };

    // Refresh Token을 사용하여 authToken을 갱신하는 함수
    const refreshAuthToken = async () => {
        try {
            const response = await axiosInstance.post('/refresh-token'); // refreshToken으로 새로운 authToken을 발급
            if (response.data.token) {
                setAuthToken(response.data.token); // 새로운 authToken 저장
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
                // authToken이 없거나 만료된 경우 refreshToken을 통해 갱신
                const newToken = await refreshAuthToken();
                if (newToken) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate('/auth/login');
                }
            } else {
                setIsAuthenticated(true);
            }
        };

        verifyAuthToken();
    }, [navigate]);

    // 전역으로 인증 정보를 제공
    return (
        <AuthContext.Provider value={{ isAuthenticated, authToken, setAuthToken, refreshAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};