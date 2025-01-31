import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import headerLogo from '../images/header-logo.png';
import menuIcon from '../images/menu-icon.png'; // 햄버거 아이콘 추가
import '../css/reset.css';
import '../css/bossHeader.module.css';
import {API_BASE_URL} from '../../../config/api.config';

function BossHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeMenu, setActiveMenu] = useState('/main'); // 현재 활성화된 메뉴 항목을 추적
    const [visibleMenuItems, setVisibleMenuItems] = useState([]);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // 토큰 검증 로직
                const response = await fetch(`${API_BASE_URL}/auth/check-auth`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    setIsLoggedIn(true);

                    const userResponse = await fetch(`${API_BASE_URL}/user/info`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUserName(userData.nickname);
                        console.log(userData)
                    } else {
                        console.error('사용자 정보를 가져오는 데 실패했습니다.');
                    }
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
    // 로그아웃
    const handleLogout = async () => {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        setIsLoggedIn(false);
        navigate('/auth/login');
        /*window.location.reload();*/
    };

    const handleMenuClick = (path) => {
        setActiveMenu(path); // 클릭한 메뉴 항목을 활성화
    };

    useEffect(() => {
        // 각 메뉴 항목을 순차적으로 표시
        const menuItems = [
            '/', '/search', '/info', '/boss/notice', '/boss/mypage'
        ];

        menuItems.forEach((item, index) => {
            setTimeout(() => {
                setVisibleMenuItems(prevItems => [...prevItems, item]);
            }, index * 150); // 150ms 간격으로 순차적 표시
        });

        // 로그인, 회원가입, 로그아웃 메뉴 항목은 0.7초 뒤에 표시
        setTimeout(() => {
            const authItems = isLoggedIn ? ['/logout'] : ['/auth/login', '/auth/signup'];
            authItems.forEach((item, index) => {
                setTimeout(() => {
                    setVisibleMenuItems(prevItems => [...prevItems, item]);
                }, index * 150);
            });
        }, 700);

    }, [isLoggedIn]);

    return (
        <>
            <header>
                <NavLink to="/" className={`menu-item ${activeMenu === '/' ? 'active' : ''} ${visibleMenuItems.includes('/') ? 'visible' : ''}`} onClick={() => handleMenuClick('/')}><img src={headerLogo} alt='header-logo' /></NavLink>
                <span className={`menu ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" className={`menu-item ${activeMenu === '/' ? 'active' : ''} ${visibleMenuItems.includes('/') ? 'visible' : ''}`} onClick={() => handleMenuClick('/')}>메인</NavLink>
                    <NavLink to="/search" className={`menu-item ${activeMenu === '/search' ? 'active' : ''} ${visibleMenuItems.includes('/search') ? 'visible' : ''}`} onClick={() => handleMenuClick('/search')}>검색</NavLink>
                    <NavLink to="/info" className={`menu-item ${activeMenu === '/info' ? 'active' : ''} ${visibleMenuItems.includes('/info') ? 'visible' : ''}`} onClick={() => handleMenuClick('/info')}>소개</NavLink>
                    {/* <NavLink to="/reservation" className={`menu-item ${activeMenu === '/reservation' ? 'active' : ''} ${visibleMenuItems.includes('/reservation') ? 'visible' : ''}`} onClick={() => handleMenuClick('/reservation')}>예약</NavLink> */}
                    <NavLink to="/boss/notice" className={`menu-item ${activeMenu === '/boss/notice' ? 'active' : ''} ${visibleMenuItems.includes('/boss/notice') ? 'visible' : ''}`} onClick={() => handleMenuClick('/boss/notice')}>공지사항</NavLink>
                    <NavLink to="/boss/mypage" className={`menu-item ${activeMenu === '/boss/mypage' ? 'active' : ''} ${visibleMenuItems.includes('/boss/mypage') ? 'visible' : ''}`} onClick={() => handleMenuClick('/boss/mypage')}>마이페이지</NavLink>
                    {!isLoggedIn ? (
                        <>
                            <NavLink to="/auth/login" className={`menu-item auth ${activeMenu === '/auth/login' ? 'active' : ''} ${visibleMenuItems.includes('/auth/login') ? 'visible' : ''}`} onClick={() => handleMenuClick('/auth/login')}>로그인</NavLink>
                            <NavLink to="/auth/signup" className={`menu-item auth ${activeMenu === '/auth/signup' ? 'active' : ''} ${visibleMenuItems.includes('/auth/signup') ? 'visible' : ''}`} onClick={() => handleMenuClick('/auth/signup')}>회원가입</NavLink>
                        </>
                    ) : (
                        <NavLink to="#" onClick={() => { handleLogout(); handleMenuClick('/logout'); }} className={`menu-item auth userLogout ${visibleMenuItems.includes('/logout') ? 'visible' : ''}`}>로그아웃</NavLink>
                    )}
                </span>
                <button className="menu-button" onClick={toggleMenu}>
                    <img src={menuIcon} alt="Menu" />
                </button>
            </header>
        </>
    );
}

export default BossHeader;
