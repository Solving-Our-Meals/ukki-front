import { API_BASE_URL } from '../../../../config/api.config';

export async function GetBannerAPI(storeNo) {
    try {
        const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storebanner`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        const data = await response.json();
        if(data.length > 1){
            const imageUrls = data.map(filename => `${API_BASE_URL}/store/${storeNo}/api/files?filename=${filename}`);
            console.log('imageUrls : '+imageUrls);
            return imageUrls;
        }else{  
            console.log('data[0] : '+data[0]);
            return [`${API_BASE_URL}/store/${storeNo}/api/files?filename=${data[0]}`];
        }
    } catch (error) {
        console.error('배너 이미지 로드 실패:', error);
        return [];
    }
}