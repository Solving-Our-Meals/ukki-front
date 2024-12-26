import axios from 'axios';
import { useRefreshToken } from './RefreshToken';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const { accessToken, refreshAccessToken } = useRefreshToken();
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Authorization': `Bearer ${accessToken}`,  // 엑토 헤더로
        },
    });

    // 요청 전 엑토 만료되는 예외상황 위함
    api.interceptors.response.use(
        response => response,
        async (error) => {
            if (error.response.status === 401) {
                await refreshAccessToken();

                const newAccessToken = accessToken;
                if (!newAccessToken) {
                    navigate('/login');
                }

                // 갱신된 엑토 재요청
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(error.config);
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default useAuth;
