export async function GetProfileAPI(storeNo) {
    try {
        const response = await fetch(`/store/storeProfile/${storeNo}`);
        const data = await response.text();
        return `/store/api/profile?profileName=${data}`;
    } catch (error) {
        console.error('프로필 이미지 로드 실패:', error);
        return '';
    }
}