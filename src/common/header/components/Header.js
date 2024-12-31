import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import headerLogo from '../images/header-logo.png';
import menuIcon from '../images/menu-icon.png'; // 햄버거 아이콘 추가
import '../css/reset.css';
import '../css/header.css';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    useEffect(() => {
        const authToken = getCookie('authToken');
        if (authToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = async () => {
        // 서버에 로그아웃 요청 보내기
        await fetch('/auth/logout', {
            method: 'POST', // 로그아웃 요청은 POST 방식으로 보낼 수 있습니다.
            credentials: 'include', // 쿠키를 서버에 함께 전송
        });

        // 로그아웃 후 로그인 상태를 false로 변경
        setIsLoggedIn(false);

        // 로그인 페이지로 리다이렉트 (또는 원하는 페이지로 이동)
        navigate('/main');
        window.location.reload();
    };

    return (
        <>
            <header>
                <NavLink to="/main"><img src={headerLogo} alt='header-logo' /></NavLink>
                <span className={`menu ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/search">검색</NavLink>
                    <NavLink to="/info">소개</NavLink>
                    <NavLink to="/">공지사항</NavLink>
                    <NavLink to="/user/mypage">마이페이지</NavLink>
                    {!isLoggedIn ? (
                        <>
                            <NavLink to="/auth/login">로그인</NavLink>
                            <NavLink to="/auth/signup">회원가입</NavLink>
                        </>
                    ) : (
                        <NavLink to="#" onClick={handleLogout} className="userLogout">로그아웃</NavLink>
                    )}
                </span>
                <button className="menu-button" onClick={toggleMenu}>
                    <img src={menuIcon} alt="Menu" />
                </button>
            </header>
        </>
    );
}

export default Header;
