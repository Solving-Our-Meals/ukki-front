import { useAuth } from './AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
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
        if (isAuthenticated && user?.role === 'BOSS') {
            // 가게 관리자일 경우 BossPage로 리디렉션
            navigate('/boss/mypage');
        }
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated) {
        return null; // 로그인 상태가 아니면 아무것도 렌더링하지 않음
    }

    return element; // 로그인 된 경우, 전달된 컴포넌트를 렌더링
}

export default PrivateRoute;
