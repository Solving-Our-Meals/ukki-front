import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증 상태 초기값을 false로 설정
    const [authToken, setAuthToken] = useState(null); // authToken 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const navigate = useNavigate();

    // axiosInstance 설정
    const axiosInstance = axios.create({
        baseURL: '/auth',
        withCredentials: true,
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
            setLoading(false); // 인증 확인이 끝나면 로딩 상태 해제
        };

        verifyAuthToken();
    }, [navigate]);

    if (loading) {
        return <div>로딩 만들고 넣을것</div>;
    }

    // 전역으로 인증 정보를 제공
    return (
        <AuthContext.Provider value={{ isAuthenticated, authToken, setAuthToken, refreshAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
