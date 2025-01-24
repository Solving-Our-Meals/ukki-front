import '../../common/reset/reset.css'
import './css/AdminHeader.css'
import { NavLink } from "react-router-dom";
import adminHeaderLogo from './css/images/header/adminHeaderLogo.png';  // 이미지 import
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminHeader(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        setIsLoggedIn(false);
        navigate('/main');
        /*window.location.reload();*/
    };

    return(
        <>
        <div id='adminHeader'>
            <NavLink to="/admin/">
                <img id='adminHeaderLogo' src={adminHeaderLogo} alt='header-logo' />
            </NavLink> 
            <div id='adminHeaderLogout' onClick={handleLogout}>로그아웃</div>
        </div>
        </>
    )
}

export default AdminHeader;