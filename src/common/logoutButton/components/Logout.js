import React from 'react';
import { useHistory } from 'react-router-dom';
import './LogoutButton.css';

const LogoutButton = () => {
  const history = useHistory();

  // 로그아웃 요청
  const logout = () => {
    fetch('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          history.push('/login');
        } else {
          console.error('로그아웃 실패');
        }
      })
      .catch((error) => {
        console.error('로그아웃 요청 중 오류 발생', error);
      });
  };

  return (
      <button className="logoutBtn" onClick={logout}>
        로그아웃
      </button>
  );
};

export default LogoutButton;
