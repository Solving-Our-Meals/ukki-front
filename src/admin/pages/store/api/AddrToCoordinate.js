export async function AddrToCoordinate(address) {
    const KAKAO_API_KEY = process.env.REACT_APP_REST_API_KEY;

    try {
        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    'Authorization': `KakaoAK ${KAKAO_API_KEY}`
                }
            }
        );
        const data = await response.json();
        
        console.log('Kakao API Response:', data); // API 응답 확인용

        // 응답 확인
        if (!data.documents || data.documents.length === 0) {
            console.error('주소를 찾을 수 없습니다.');
            return null;
        }

        // 첫 번째 결과의 좌표 반환
        const { y: lat, x: lng } = data.documents[0];
        console.log(`위도: ${lat}, 경도: ${lng}`);
        return [parseFloat(lat), parseFloat(lng)];

    } catch (error) {
        console.error('좌표 변환 중 오류 발생:', error);
        return null;
    }
}