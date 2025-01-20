import '../../common/reset/reset.css'
import './css/AdminNavBar.css'
import { NavLink } from "react-router-dom";
import dashboardIcon from './css/images/navbar/dashboard.png';
import storeIcon from './css/images/navbar/store.png';
import userIcon from './css/images/navbar/user.png';
import reservationIcon from './css/images/navbar/reservation.png';
import reviewIcon from './css/images/navbar/review.png';
import inquiryIcon from './css/images/navbar/inquiry.png';
import noticeIcon from './css/images/navbar/notice.png';

function AdminNavBar(){

    const  activeStyle = {
        backgroundColor: '#B3E7FF',
        boxShadow: 'inset 0px 8px 8px rgba(0, 0, 0, 0.25)'
    }

    return(
        <div id='adminNavBar'>
            <NavLink id='adminEnterDashboard' to="/admin/dashboard"
                    end style={({ isActive, isPending }) => (isActive || isPending) ? activeStyle : undefined}>
                    <img src={dashboardIcon} alt="dashboard"/>
            </NavLink>
            <NavLink id='adminEnterStore' to="/admin/stores"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src={storeIcon} alt="store"/>
            </NavLink>
            <NavLink id='adminEnterUser' to="/admin/users"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src={userIcon} alt="user"/>
            </NavLink>
            <NavLink id='adminEnterReservation' to="/admin/reservations"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src={reservationIcon} alt="reservation"/>
            </NavLink>
            <NavLink id='adminEnterReview' to="/admin/reviews"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src={reviewIcon} alt="review"/>
            </NavLink>
            <NavLink id='adminEnterInquiry' to="/admin/inquiries"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src={inquiryIcon} alt="inquiry"/>
            </NavLink>
            <NavLink id='adminEnterNotice' to="/admin/notices"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src={noticeIcon} alt="notice"/>
            </NavLink>
        </div>
    )

}
export default AdminNavBar;