export async function GetBannerAPI(storeNo) {
    try {
        const response = await fetch(`/store/storebanner/${storeNo}`);
        const data = await response.json();
        return data.map(filename => `/store/api/files?filename=${filename}`);
    } catch (error) {
        console.error('배너 이미지 로드 실패:', error);
        return [];
    }
}