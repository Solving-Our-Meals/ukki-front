// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AxiosInstance = axios.create({
//     // 기본 설정(Base URL 등)을 추가
//     baseURL : 'http://localhost:8080',
//     timeout : 20000,
//     headers : {
//         'Content-Type' : 'application/json',
//     }
// });

// AxiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//         if(error.response && error.response.status === 500){
//             const navigate = useNavigate();
//             navigate('/500');
//         }
//         return Promise.reject(error);
//     }
// );

// export default AxiosInstance;