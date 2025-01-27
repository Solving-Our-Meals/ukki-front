import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext); // 사용자가 Context에 접근할 수 있도록 훅 제공
};

export const UserRole = ({ children }) => {
    const [userRole, setUserRole] = useState('user'); // 초기 userRole 설정 (기본값 'user')

    useEffect(() => {
        // 여기서 사용자의 정보를 가져와서 userRole 설정
        const checkUserRole = async () => {
            try {
                const response = await fetch('/user/info', {
                    method: 'GET',
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
            }
        };

        checkUserRole();
    }, []);

    return (
        <UserContext.Provider value={{ userRole }}>
            {children}
        </UserContext.Provider>
    );
};