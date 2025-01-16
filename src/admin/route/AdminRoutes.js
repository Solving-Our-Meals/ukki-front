import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/dashboard/pages/AdminDashboard";
import AdminNotice from "../pages/notice/pages/AdminNotice";
import UserList from "../pages/user/pages/UserList";
import UserInfo from "../pages/user/pages/UserInfo";
import StoreList from "../pages/store/pages/StoreList";
import StoreInfo from "../pages/store/pages/StoreInfo";
import StoreEdit from "../pages/store/pages/StoreEdit";
import StoreUserRegist from "../pages/store/pages/StoreUserRegist";
import StoreInfoRegist from "../pages/store/pages/StoreInfoRegist";
import ReservationList from "../pages/reservation/pages/ReservationList";
import ReservationTodayInfo from "../pages/reservation/pages/ReservationTodayInfo";
import ReservationEndInfo from "../pages/reservation/pages/ReservationEndInfo";
import ReviewList from "../pages/review/pages/ReviewList";
import ReviewInfo from "../pages/review/pages/ReviewInfo";
import InquiryList from "../pages/inquiry/pages/InquiryList";
import InquiryInfo from "../pages/inquiry/pages/InquiryInfo";
import ReportInfo from "../pages/inquiry/pages/ReportInfo";
import NoticeList from "../pages/notice/pages/NoticeList";
import NoticeInfo from "../pages/notice/pages/NoticeInfo";
import NoticeRegist from "../pages/notice/pages/NoticeRegist";

function AdminRoutes(){
    return(
        <Routes>
            <Route path="" element={<AdminLayout/>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />}/>
                <Route path="/dashboard" element={<AdminDashboard/>}/>
                <Route path="/users" >
                    <Route index element={<Navigate to="list" replace/>}/>
                    <Route path="list" element={<UserList/>}/>
                    <Route path="info/:userNo" element={<UserInfo/>}/>
                </Route>
                <Route path="/stores" >
                    <Route index element={<Navigate to="list" replace/>}/>
                    <Route path="list" element={<StoreList/>}/>
                    <Route path="info/:storeNo" element={<StoreInfo/>}/>
                    <Route path="info/:storeNo/edit" element={<StoreEdit/>}/>
                    <Route path="regist/user" element={<StoreUserRegist/>}/>
                    <Route path="regist/store" element={<StoreInfoRegist/>}/>
                </Route>
                <Route path="/reservations">
                    <Route index element={<Navigate to="list" replace/>}/>
                    <Route path="list" element={<ReservationList/>}/>
                    <Route path="info/today/:reservationNo" element={<ReservationTodayInfo/>}/>
                    <Route path="info/end/:reservationNo" element={<ReservationEndInfo/>}/>
                </Route>
                <Route path="/reviews">
                    <Route index element={<Navigate to="list" replace/>}/>
                    <Route path="list" element={<ReviewList/>}/>
                    <Route path="info/:reviewNo" element={<ReviewInfo/>}/>
                </Route>
                <Route path="/inquiries" >
                    <Route index element={<Navigate to="list" replace/>}/>
                    <Route path="list" element={<InquiryList/>}/>
                    <Route path="info/:inquiryNo" element={<InquiryInfo/>}/>
                    <Route path="info/report/:reportNo" element={<ReportInfo/>}/>
                </Route>
                <Route path="/notices" >
                    <Route index element={<Navigate to="list" replace/>}/>
                    <Route path="list" element={<NoticeList/>}/>
                    <Route path="info/:noticeNo" element={<NoticeInfo/>}/>
                    <Route path="regist" element={<NoticeRegist/>}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default AdminRoutes;