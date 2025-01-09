export async function AddrToCoordinate(address) {
    const GOOGLE_API_KEY = 'AIzaSyBjZUum-AEcLwRbevT19c1CU1AaLka5o5Q';

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
        
        console.log('Google API Response:', data); // API 응답 확인용

        // 응답 상태 확인
        if (data.status !== 'OK') {
            console.error('Geocoding 실패:', data.status);
            return null;
        }

        // 결과 데이터 안전하게 확인
        if (data.results && 
            data.results[0] && 
            data.results[0].geometry && 
            data.results[0].geometry.location) {
            
            const { lat, lng } = data.results[0].geometry.location;
            console.log(`위도: ${lat}, 경도: ${lng}`);
            return [lat, lng];
        } else {
            console.error('위치 정보를 찾을 수 없습니다.');
            return null;
        }
    } catch (error) {
        console.error('좌표 변환 중 오류 발생:', error);
        return null;
    }
}