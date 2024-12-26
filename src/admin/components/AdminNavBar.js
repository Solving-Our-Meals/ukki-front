import '../../common/reset/reset.css'
import './css/AdminNavBar.css'
import { NavLink } from "react-router-dom";

function AdminNavBar(){

    const  activeStyle = {
        backgroundColor: '#B3E7FF',
        boxShadow: 'inset 0px 8px 8px rgba(0, 0, 0, 0.25)'
    }

    return(
        <div id='adminNavBar'>
            <NavLink id='adminEnterDashboard' to="/admin/dashboard"
                    end style={({ isActive, isPending }) => (isActive || isPending) ? activeStyle : undefined}>
                    <img src='/images/admin/navbar/dashboard.png'/>
            </NavLink>
            <NavLink id='adminEnterStore' to="/admin/stores"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src='/images/admin/navbar/store.png'/>
            </NavLink>
            <NavLink id='adminEnterUser' to="/admin/users"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src='/images/admin/navbar/user.png'/>
            </NavLink>
            <NavLink id='adminEnterReservation' to="/admin/reservations"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src='/images/admin/navbar/reservation.png'/>
            </NavLink>
            <NavLink id='adminEnterReview' to="/admin/reviews"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src='/images/admin/navbar/review.png'/>
            </NavLink>
            <NavLink id='adminEnterInquiry' to="/admin/inquiries"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src='/images/admin/navbar/inquiry.png'/>
            </NavLink>
            <NavLink id='adminEnterNotice' to="/admin/notices"
                    style={({ isActive }) => isActive? activeStyle : undefined}>
                    <img src='/images/admin/navbar/notice.png'/>
            </NavLink>
        </div>
    )

}
export default AdminNavBar;