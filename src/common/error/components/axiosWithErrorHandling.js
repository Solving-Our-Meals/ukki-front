// utils/axiosWithErrorHandling.js
import axios from 'axios';
import { useError } from './ErrorContext';

export const axiosWithErrorHandling = (url, options = {}) => {
    const { setGlobalError } = useError();

    return axios(url, options)
        .then(response => {
            return response.data; // 성공적인 응답 처리
        })
        .catch(error => {
            let message = '알 수 없는 오류가 발생했습니다.';
            let statusCode = 'unknown';

            if (error.response) {
                statusCode = error.response.status;
                switch (statusCode) {
                    case 404:
                        message = '페이지를 찾을 수 없습니다 (404).';
                        break;
                    case 403:
                        message = '접근이 거부되었습니다 (403).';
                        break;
                    case 500:
                        message = '서버에서 문제가 발생했습니다 (500).';
                        break;
                }
            } else {
                message = '네트워크 오류 또는 서버가 응답하지 않습니다.';
            }

            setGlobalError(message, statusCode);
            return Promise.reject(new Error(message));
        });
};

// 사용법
// import { axiosWithErrorHandling } from './utils/axiosWithErrorHandling';

// useEffect(() => {
//     axiosWithErrorHandling(`${API_BASE_URL}/store/${storeNo}/getInfo`)
//         .then(data => {
//             const newStoreNo = data.storeNo;

//             axiosWithErrorHandling(`${API_BASE_URL}/store/${newStoreNo}/storebanner`)
//                 .then(data => {
//                     const imageUrls = data.map(filename => `${API_BASE_URL}/store/${newStoreNo}/api/files?filename=${filename}`);
//                     setImages(imageUrls);
//                 });
//         });
// }, []);
