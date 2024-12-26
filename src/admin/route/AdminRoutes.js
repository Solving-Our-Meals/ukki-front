import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/dashboard/pages/AdminDashboard";
import AdminReview from "../pages/review/pages/AdminReview";
import AdminStore from "../pages/store/pages/AdminStore";
import AdminUser from "../pages/user/pages/AdminUser";
import AdminNotice from "../pages/notice/pages/AdminNotice";
import AdminReservation from "../pages/reservation/pages/AdminReservation";
import AdminInquiry from "../pages/inquiry/pages/AdminInquiry";

function AdminRoutes(){
    return(
        <Routes>
            <Route path="/" element={<AdminLayout/>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />}/>
                <Route path="/dashboard" element={<AdminDashboard/>}/>
                <Route path="/stores" element={<AdminStore/>}/>
                <Route path="/users" element={<AdminUser/>}/>
                <Route path="/reservations" element={<AdminReservation/>}/>
                <Route path="/reviews" element={<AdminReview/>}/>
                <Route path="/inquiries" element={<AdminInquiry/>}/>
                <Route path="/notices" element={<AdminNotice/>}/>
            </Route>
        </Routes>
    )
}

export default AdminRoutes;