export async function GetProfileAPI(storeNo) {
    try {
        const response = await fetch(`/store/${storeNo}/storeProfile`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        const data = await response.text();
        return `/store/${storeNo}/api/profile?profileName=${data}`;
    } catch (error) {
        console.error('프로필 이미지 로드 실패:', error, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        return '';
    }
}