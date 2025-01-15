export async function GetBannerAPI(storeNo) {
    try {
        const response = await fetch(`/store/${storeNo}/storebanner`);
        const data = await response.json();
        console.log(data);
        if(data.length > 1){
            return data.map(filename => `/store/${storeNo}/api/files?filename=${filename}`);
        }else{  
            return `/store/${storeNo}/api/files?filename=${data[0]}`;
        }
    } catch (error) {
        console.error('배너 이미지 로드 실패:', error);
        return [];
    }
}