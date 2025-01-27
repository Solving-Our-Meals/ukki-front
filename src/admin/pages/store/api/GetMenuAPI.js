import { API_BASE_URL } from '../../../../config/api.config';

export async function GetMenuAPI(storeMenu) {
    try {
        return `${API_BASE_URL}/image?fileId=${storeMenu}`;
    } catch (error) {
        console.error('메뉴 이미지 로드 실패:', error);
        return '';
    }
}