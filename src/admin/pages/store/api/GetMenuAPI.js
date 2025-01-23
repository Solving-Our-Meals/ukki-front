import { API_BASE_URL } from '../../../../config/api.config';

export async function GetMenuAPI(storeNo) {
    try {
        const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storeMenu`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        const data = await response.text();
        return `${API_BASE_URL}/store/${storeNo}/api/menu?menuName=${data}`;
    } catch (error) {
        console.error('메뉴 이미지 로드 실패:', error);
        return '';
    }
}