import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

function PrivateRoute({ element, ...rest }) {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = () => {
            // 인증되지 않은 경우 로그인 페이지로 리디렉션
            if (!isAuthenticated) {
                navigate('/auth/login');
                return;
            }

            // 사용자 역할에 따른 경로 리디렉션
            if (user?.userRole === 'STORE') {
                if (!window.location.pathname.startsWith('/boss')) {
                    navigate('/boss/mypage');
                }
            } else if (user?.userRole === 'ADMIN') {
                if (!window.location.pathname.startsWith('/admin')) {
                    navigate('/admin');
                }
            } else if (user?.userRole === 'USER') {
                if (window.location.pathname.startsWith('/boss') || window.location.pathname.startsWith('/admin')) {
                    navigate('/');
                }
            }
        };

        verifyAuth();
    }, [isAuthenticated, user, navigate]);

    // 인증되지 않은 사용자는 리디렉션되므로 null 반환
    if (!isAuthenticated) {
        return null; // 로딩 화면을 대신 표시할 수 있습니다
    }

    return element;
}

export default PrivateRoute;
