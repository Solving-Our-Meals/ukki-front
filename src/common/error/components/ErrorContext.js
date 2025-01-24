// ErrorContext.js
import React, { createContext, useState, useContext } from 'react';

// 에러 상태를 관리하는 컨텍스트 생성
const ErrorContext = createContext();

// 커스텀 훅으로 ErrorContext를 쉽게 사용할 수 있도록 만들기
export const useError = () => {
    return useContext(ErrorContext)
};

// ErrorProvider 컴포넌트 : Context를 제공하는 컴포넌트
export const ErrorProvider = ({children}) => {
    const [error, setError] = useState(null); // 에러 메세지
    const [statusCode, setStatusCode] = useState(null) // Http 상태 코드

    const setGlobalError = (errorMessage, code) => {
        setError(errorMessage);
        setStatusCode(code); // 에러 상태 코드도 저장
    };

    const clearError = () => {
        setError(null);
        setStatusCode(null);
    };

    return(
        <ErrorContext.Provider value={{ error, statusCode, setGlobalError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};