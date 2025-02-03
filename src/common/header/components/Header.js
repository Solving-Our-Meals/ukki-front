import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import headerLogo from '../images/header-logo.png';
import menuIcon from '../images/menu-icon.png'; // 햄버거 아이콘 추가
import '../css/reset.css';
import '../css/header.css';
import {API_BASE_URL} from '../../../config/api.config';

function Header() {
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
                    fetchUserInfo();
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsLoggedIn(false);
            }
        };

        const fetchUserInfo = async () => {
            try {
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
                } else {
                    console.error('Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        checkAuthStatus();
    }, []);


    // 로그아웃
    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                setIsLoggedIn(false);
                // 로그아웃 후 경로 이동
                navigate('/auth/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };



    const handleMenuClick = (path) => {
        setActiveMenu(path); // 클릭한 메뉴 항목을 활성화
    };

    useEffect(() => {
        // 로그인 상태에 따라 메뉴 항목 업데이트
        const menuItems = [
            '/', '/search', '/info', '/reservation',
            '/notice', '/user/mypage'
        ];

        menuItems.forEach((item, index) => {
            setTimeout(() => {
                setVisibleMenuItems(prevItems => [...prevItems, item]);
            }, index * 150);
        });

        setTimeout(() => {
            const authItems = isLoggedIn ? ['/logout'] : ['/auth/login', '/auth/signup'];
            authItems.forEach((item, index) => {
                setTimeout(() => {
                    setVisibleMenuItems(prevItems => [...prevItems, item]);
                }, index * 150);
            });
        }, 700);
    }, [isLoggedIn]);

    const greetingStyle = {
        position: 'absolute',
        top: '5px',
        left: '80%',
        transform: 'translateX(-50%)',
        color: 'blue',
        fontWeight: 'bold',
        fontSize: '18px',
    };


    return (
        <>
            <header>
                <NavLink to="/" className={`menu-item ${activeMenu === '/' ? 'active' : ''} ${visibleMenuItems.includes('/') ? 'visible' : ''}`} onClick={() => handleMenuClick('/')}><img src={headerLogo} alt='header-logo' /></NavLink>
                <span className={`menu ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" className={`menu-item ${activeMenu === '/' ? 'active' : ''} ${visibleMenuItems.includes('/') ? 'visible' : ''}`} onClick={() => handleMenuClick('/')}>메인</NavLink>
                    <NavLink to="/search" className={`menu-item ${activeMenu === '/search' ? 'active' : ''} ${visibleMenuItems.includes('/search') ? 'visible' : ''}`} onClick={() => handleMenuClick('/search')}>검색</NavLink>
                    <NavLink to="/info" className={`menu-item ${activeMenu === '/info' ? 'active' : ''} ${visibleMenuItems.includes('/info') ? 'visible' : ''}`} onClick={() => handleMenuClick('/info')}>소개</NavLink>
                 
                    <NavLink to="/notice" className={`menu-item ${activeMenu === '/notice' ? 'active' : ''} ${visibleMenuItems.includes('/notice') ? 'visible' : ''}`} onClick={() => handleMenuClick('/notice')}>공지사항</NavLink>
                    <NavLink to="/user/mypage" className={`menu-item ${activeMenu === '/user/mypage' ? 'active' : ''} ${visibleMenuItems.includes('/user/mypage') ? 'visible' : ''}`} onClick={() => handleMenuClick('/user/mypage')}>마이페이지</NavLink>
                    {!isLoggedIn ? (
                        <>
                            <NavLink to="/auth/login" className={`menu-item auth ${activeMenu === '/auth/login' ? 'active' : ''} ${visibleMenuItems.includes('/auth/login') ? 'visible' : ''}`} onClick={() => handleMenuClick('/auth/login')}>로그인</NavLink>
                            <NavLink to="/auth/signup" className={`menu-item auth ${activeMenu === '/auth/signup' ? 'active' : ''} ${visibleMenuItems.includes('/auth/signup') ? 'visible' : ''}`} onClick={() => handleMenuClick('/auth/signup')}>회원가입</NavLink>
                        </>
                    ) : (
                        <>
                            <p className="user-greeting" style={greetingStyle}>안녕하세요, {userName}님!</p>
                            <NavLink to="#" onClick={() => {
                                handleLogout();
                                handleMenuClick('/logout');
                            }}
                                     className={`menu-item auth userLogout ${visibleMenuItems.includes('/logout') ? 'visible' : ''}`}>로그아웃</NavLink>
                        </>
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
