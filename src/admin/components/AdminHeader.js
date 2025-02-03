import '../../common/reset/reset.css'
import './css/AdminHeader.css'
import { NavLink } from "react-router-dom";
import adminHeaderLogo from './css/images/header/adminHeaderLogo.png';  // 이미지 import
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from '../../config/api.config';

function AdminHeader(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

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

    return(
        <>
        <div id='adminHeader'>
            <NavLink to="/admin/">
                <img id='adminHeaderLogo' src={adminHeaderLogo} alt='header-logo' />
            </NavLink>
            <button id='adminHeaderLogout' onClick={handleLogout}>로그아웃</button>
        </div>
        </>
    )
}

export default AdminHeader;