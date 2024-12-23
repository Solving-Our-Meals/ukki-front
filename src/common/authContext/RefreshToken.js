import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RefreshTokenContext = createContext();

export const useRefreshToken = () => {
  return useContext(RefreshTokenContext);
};

const RefreshToken = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getRefreshTokenFromCookies = () => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('refreshToken='));
    return cookie ? cookie.split('=')[1] : null;  // 리프토 반환인데 없으면 널
  };

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshTokenFromCookies();

    if (refreshToken) {
      try {
        const response = await fetch('/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
          setAccessToken(data.token); // 새로운 액세스 토큰 저장
        } else {
          console.error('리프레시 토큰이 유효하지 않음');
          navigate('/login');
        }
      } catch (error) {
        console.error('엑세스 토큰 갱신 실패:', error);
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    refreshAccessToken().finally(() => setLoading(false));
  }, []);

  return (
      <RefreshTokenContext.Provider value={{ accessToken, refreshAccessToken }}>
        {!loading ? children : <div>로딩중 !</div>}
      </RefreshTokenContext.Provider>
  );
};

export default RefreshToken;