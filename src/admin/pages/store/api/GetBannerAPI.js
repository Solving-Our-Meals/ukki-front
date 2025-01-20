export async function GetBannerAPI(storeNo) {
    try {
        const response = await fetch(`/store/${storeNo}/storebanner`);
        const data = await response.json();
        if(data.length > 1){
            const imageUrls = data.map(filename => `/store/${storeNo}/api/files?filename=${filename}`);
            console.log('imageUrls : '+imageUrls);
            return imageUrls;
        }else{  
            console.log('data[0] : '+data[0]);
            return [`/store/${storeNo}/api/files?filename=${data[0]}`];
        }
    } catch (error) {
        console.error('배너 이미지 로드 실패:', error);
        return [];
    }
}