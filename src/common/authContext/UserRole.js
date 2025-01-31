import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.config';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext); // 사용자가 Context에 접근할 수 있도록 훅 제공
};

export const UserRole = ({ children }) => {
    const [userRole, setUserRole] = useState(null); // 초기 상태를 null로 설정 (로딩 중을 나타내기 위해)
    const [loading, setLoading] = useState(true);  // 로딩 상태를 관리

    useEffect(() => {
        // 여기서 사용자의 정보를 가져와서 userRole 설정
        const checkUserRole = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/user/info`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 쿠키와 인증 정보 포함
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.userRole); // 사용자 역할 받아오기
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('에러 발생:', error);
            } finally {
                setLoading(false);  // 데이터 로딩 후 로딩 상태 해제
            }
        };

        checkUserRole();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>; // 로딩 중일 때 표시할 화면
    }

    return (
        <UserContext.Provider value={{ userRole }}>
            {children}
        </UserContext.Provider>
    );
};
