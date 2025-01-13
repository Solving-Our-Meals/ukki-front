export async function GetBannerAPI(storeNo) {
    try {
        const response = await fetch(`/store/storebanner/${storeNo}`);
        const data = await response.json();
        console.log(data);
        if(data.length > 1){
            return data.map(filename => `/store/api/files?filename=${filename}`);
        }else{  
            return `/store/api/files?filename=${data[0]}`;
        }
    } catch (error) {
        console.error('배너 이미지 로드 실패:', error);
        return [];
    }
}