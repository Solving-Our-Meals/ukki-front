import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "../../user/pages/mypage/css/Mypage.module.css";
import Loading from "../../common/inquiry/img/loadingInquiryList.gif";
import {API_BASE_URL} from '../../config/api.config';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null); // 사용자 정보 추가
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: `${API_BASE_URL}/auth`,
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
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

    // 사용자 정보 가져오기
    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('/me');
            if (response.status === 200) {
                setUser(response.data); // 사용자 정보 저장
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    useEffect(() => {
        const verifyAuthToken = async () => {
            const isValid = await checkAuthToken();
            if (!isValid) {
                const newToken = await refreshAuthToken();
                if (newToken) {
                    setIsAuthenticated(true);
                    await fetchUser();
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(true);
                await fetchUser();
            }
            setLoading(false);
        };

        verifyAuthToken();
    }, [navigate]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <img src={Loading} alt="로딩 중"/>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, authToken, user, setAuthToken, refreshAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
