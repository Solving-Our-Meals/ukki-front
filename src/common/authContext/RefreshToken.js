import axios from 'axios';

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
        '/auth/refresh-token',
        {},
        { withCredentials: true });

    const { token } = response.data;

    document.cookie = `authToken=${token}; path=/; max-age=3600`;
    console.log(token);

    return token;
  } catch (error) {
    console.error('리프레시 토큰 갱신 실패', error);
    throw new Error('리프레시 토큰 갱신 실패');
  }
};
