export async function GetMenuAPI(storeNo) {
    try {
        const response = await fetch(`/store/${storeNo}/storeMenu`);
        const data = await response.text();
        return `/store/${storeNo}/api/menu?menuName=${data}`;
    } catch (error) {
        console.error('메뉴 이미지 로드 실패:', error);
        return '';
    }
}