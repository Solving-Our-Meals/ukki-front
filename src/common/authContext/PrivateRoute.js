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
        const verifyAuth = async () => {
            if (!isAuthenticated) {
                navigate('/auth/login');  // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
                return;
            }

            if (user?.userRole === 'STORE') {
                if (!window.location.pathname.startsWith('/boss')) {
                    navigate('/boss/mypage');  // /boss 외 다른 페이지로 접근하려면 /main으로 리디렉션
                }
            }

            else if (user?.userRole === 'ADMIN') {
                if (!window.location.pathname.startsWith('/admin')) {
                    navigate('/admin');  // /admin 외 다른 페이지로 접근하려면 /admin으로 리디렉션
                }
            }

            else if (user?.userRole === 'USER') {
                if (window.location.pathname.startsWith('/boss') || window.location.pathname.startsWith('/admin')) {
                    navigate('/');
                }
            }
        };

        verifyAuth();
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return element;
}

export default PrivateRoute;
