// // src/context/ApiContext.js
// import React, { createContext, useContext } from 'react';
// import axios from 'axios';

// // 1. axios 인스턴스 생성
// const api = axios.create({
//   baseURL: 'http://localhost:8080', // API 기본 주소
// });

// // 2. Axios 인스턴스를 관리하는 Context 생성
// const ApiContext = createContext();

// // 3. ApiProvider 컴포넌트 생성
// export const ApiProvider = ({ children }) => {
//   return (
//     <ApiContext.Provider value={api}>
//       {children}
//     </ApiContext.Provider>
//   );
// };

// // 4. 컴포넌트에서 Axios 인스턴스를 사용하려면, useApi 훅을 사용
// export const useApi = () => {
//   return useContext(ApiContext);
// };
