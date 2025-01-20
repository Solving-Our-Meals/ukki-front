import '../../common/reset/reset.css'
import './css/AdminHeader.css'
import { NavLink } from "react-router-dom";
import adminHeaderLogo from './css/images/header/adminHeaderLogo.png';  // 이미지 import

function AdminHeader(){
    return(
        <>
        <div id='adminHeader'>
            <NavLink to="/admin/">
                <img id='adminHeaderLogo' src={adminHeaderLogo} alt='header-logo' />
            </NavLink> 
            <NavLink to="/logout"><div id='adminHeaderLogout'>로그아웃</div></NavLink>
        </div>
        </>
    )
}

export default AdminHeader;