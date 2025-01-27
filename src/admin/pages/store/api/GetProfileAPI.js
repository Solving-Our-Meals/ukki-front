import { API_BASE_URL } from '../../../../config/api.config';

export async function GetProfileAPI(storeProfile) {
    try {
        return `${API_BASE_URL}/image?fileId=${storeProfile}`; 
    } catch (error) {
        console.error('프로필 이미지 로드 실패:', error);
        return '';
    }
}