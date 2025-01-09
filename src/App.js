import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './common/authContext/AuthContext';

import Signup from './user/pages/signup/pages/Signup';
import Login from './user/pages/login/pages/Login';
import Find from './user/pages/find/pages/Find';
import Mypage from './user/pages/mypage/component/Mypage';
import Info from './user/pages/info/Info';
import UserLayout from './user/layouts/UserLayout';
import Main from './user/pages/main/Main';
import InquiryEnter from './common/inquiry/components/StoreInquiryEnter';
import UserStorePage from './user/pages/storedetail/pages/UserStorePage';
import QrRoutes from './store/pages/qrCheck/routes/QrRoutes';
import AdminRoutes from './admin/route/AdminRoutes';
import Search from './user/pages/search/Search';
import Reservation from './user/pages/reservation/pages/ReservationPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="auth/signup" element={<Signup />} />
                <Route path="auth/login" element={<Login />} />
                <Route path="auth/find/:type" element={<Find />} />
                <Route path="/" element={<UserLayout />}>
                <Route path="/" element={<Main />} />
                <Route path="info" element={<Info />} />
                </Route>

                <Route element={<AuthProvider />}>
                    <Route path="user/mypage" element={<Mypage />} />
                    <Route path="/" element={<UserLayout />}>
                        <Route path="search" element={<Search />} />
                        <Route path="store" element={<UserStorePage />} />
                        <Route path="reservation" element={<Reservation />} />
                        <Route path="sinquiries" element={<InquiryEnter />} />
                    </Route>
                </Route>

                <Route path="qr/*" element={<QrRoutes />} />
                <Route path="admin/*" element={<AdminRoutes />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
