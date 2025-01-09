export async function GetMenuAPI(storeNo) {
    try {
        const response = await fetch(`/store/storeMenu/${storeNo}`);
        const data = await response.text();
        return `/store/api/menu?menuName=${data}`;
    } catch (error) {
        console.error('메뉴 이미지 로드 실패:', error);
        return '';
    }
}