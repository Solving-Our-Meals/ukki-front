import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './common/authContext/AuthContext';

import Signup from './user/pages/signup/pages/Signup';
import Login from './user/pages/login/pages/Login';
import Find from './user/pages/find/pages/Find';
import Mypage from './user/pages/mypage/route/Mypage';
import Info from './user/pages/info/Info';
import UserLayout from './user/layouts/UserLayout';
import Main from './user/pages/main/Main';
import InquiryEnter from './common/inquiry/components/StoreInquiryEnter';
import UserStorePage from './user/pages/storedetail/pages/UserStorePage';
import QrRoutes from './store/pages/qrCheck/routes/QrRoutes';
import AdminRoutes from './admin/route/AdminRoutes';
import Search from './user/pages/search/Search';
import Reservation from './user/pages/reservation/pages/ReservationPage';
import PrivateRoute from './common/authContext/PrivateRoute';
import UserNotice from './user/pages/announcement/pages/UserNotice';
import BossLayout from './store/layouts/BossLayout';
import BossTotalNotice from './store/pages/bossNotice/components/BossTotalNotice';
import UserSpecificNotice from './user/pages/announcement/pages/UserSpecificNotice';
import BossSpecificPage from './store/pages/bossNotice/pages/BossSpecificPage';
import Error404 from './common/error/pages/Error404';
import Error403 from './common/error/pages/Error403';
import Error500 from './common/error/pages/Error500';
import BossPage from './store/pages/bossStore/pages/BossPage';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* 로그인 인증이 필요 없는 라우트 넣기 */}
                    <Route path="auth/signup" element={<Signup />} />
                    <Route path="auth/login" element={<Login />} />
                    <Route path="auth/find/:type" element={<Find />} />
                    <Route path="/" element={<UserLayout />}>
                        <Route path="/" element={<Main />} />
                        <Route path="/main" element={<Main />} />
                        <Route path="info" element={<Info />} />
                    </Route>

                    {/* 로그인 인증이 필요한 라우트들 넣고 element에 PrivateRoute 붙여주세요. */}
                    <Route path="user/mypage/*" element={<PrivateRoute element={<Mypage />} />} />
                    <Route path="/" element={<UserLayout />}>
                        <Route path="search" element={<PrivateRoute element={<Search />} />} />
                        <Route path="store/:storeNo" element={<PrivateRoute element={<UserStorePage />} />} />
                        <Route path="reservation" element={<PrivateRoute element={<Reservation />} />} />
                        <Route path="sinquiries" element={<PrivateRoute element={<InquiryEnter />} />} />
                        <Route path="notice" element={<PrivateRoute element={<UserNotice/>}/>}/> 
                        <Route path="notice/:noticeNo" element={<PrivateRoute element={<UserSpecificNotice/>}/>}/> 
                    </Route>
                    <Route path="/boss" element={<BossLayout />}>
                        <Route path="mypage" element={<PrivateRoute element={<BossPage/>}/>}/> 
                        <Route path="notice" element={<PrivateRoute element={<BossTotalNotice/>}/>}/> 
                        <Route path="notice/:noticeNo" element={<PrivateRoute element={<BossSpecificPage/>}/>}/> 
                    </Route>

                    {/* QR 관련 및 관리자 관련 라우팅 */}
                    <Route path="qr/*" element={<QrRoutes />} />
                    <Route path="admin/*" element={<AdminRoutes />} />

                    {/* 500 INTERNAL SERVER ERROR */}
                    <Route path='/500' element={<Error500/>}/>

                    {/* 403 FORBIDDEN ERROR */}
                    <Route path='/403' element={<Error403/>}/>

                    {/* 404 NOT FOUND ERROR */}
                    <Route path="/*" element={<Error404/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}


export default App;
