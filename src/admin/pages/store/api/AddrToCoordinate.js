export async function AddrToCoordinate(address) {
    // 환경변수는 REACT_APP_ 접두사가 있는 것만 window._env_에 노출됨
    const KAKAO_API_KEY = window._env_?.REACT_APP_REST_API_KEY || process.env.REACT_APP_REST_API_KEY;


    try {
        if (!KAKAO_API_KEY) {
            throw new Error('Kakao API 키가 설정되지 않았습니다.');
        }

        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    'Authorization': `KakaoAK ${KAKAO_API_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Kakao API Response:', data);

        if (!data.documents || data.documents.length === 0) {
            throw new Error('주소를 찾을 수 없습니다.');
        }

        const { y: lat, x: lng } = data.documents[0];
        console.log(`위도: ${lat}, 경도: ${lng}`);
        return [parseFloat(lat), parseFloat(lng)];

    } catch (error) {
        console.error('좌표 변환 중 오류 발생:', error);
        return null;
    }
}