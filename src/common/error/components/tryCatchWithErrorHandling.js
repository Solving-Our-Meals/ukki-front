// utils/tryCatchWithErrorHandling.js
import { useError } from './ErrorContext';

export const tryCatchWithErrorHandling = async (asyncFunc) => {
    const { setGlobalError } = useError();

    try {
        const result = await asyncFunc();
        return result;
    } catch (error) {
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
        }

        setGlobalError(message, statusCode);
        return Promise.reject(new Error(message));
    }
};

// 사용법
// import { tryCatchWithErrorHandling } from './utils/tryCatchWithErrorHandling';

// useEffect(() => {
//     tryCatchWithErrorHandling(async () => {
//         const response = await fetch(`${API_BASE_URL}/store/${storeNo}/getInfo`);
//         const data = await response.json();
//         const newStoreNo = data.storeNo;

//         const bannerResponse = await fetch(`${API_BASE_URL}/store/${newStoreNo}/storebanner`);
//         const bannerData = await bannerResponse.json();

//         const imageUrls = bannerData.map(filename => `${API_BASE_URL}/store/${newStoreNo}/api/files?filename=${filename}`);
//         setImages(imageUrls);
//     });
// }, []);

