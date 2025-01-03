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

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // 토큰 검증 로직
                const response = await fetch('/auth/check-auth', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsLoggedIn(false);
            }
        };

        checkAuthStatus();
    }, []);

    const handleLogout = async () => {
        // 로그아웃 요청
        await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        setIsLoggedIn(false);
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
