export const getUserInfo = async () => {
    try {
        const response = await fetch('/user/mypage/inquiry', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('유저 정보를 가져오는 데 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};