
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useEffect } from 'react';
import Signup from '../src/user/pages/signup/pages/Signup';
import Login from '../src/user/pages/login/pages/Login'
import Find from '../src/user/pages/find/pages/Find'
import Mypage from '../src/user/pages/mypage/component/Mypage'
import Info from './user/pages/info/Info';
import UserLayout from './user/layouts/UserLayout';
import Main from './user/pages/main/Main';
import InquiryEnter from './common/inquiry/components/StoreInquiryEnter';
import UserStorePage from './user/pages/storedetail/pages/UserStorePage';
import QrRoutes from './store/pages/qrCheck/routes/QrRoutes';
import AdminRoutes from './admin/route/AdminRoutes';
import Search from './user/pages/search/Search';
import useAuth from './common/authContext/useAuth'

function App() {
  const { authToken, refreshAuthToken } = useAuth();

  useEffect(() => {
    if (!authToken) {
      refreshAuthToken();
    }
  }, [authToken, refreshAuthToken]);

  const ProtectedRoute = ({ children }) => {
    if (!authToken) {
      return <Navigate to="/auth/login" />; // 인증되지 않으면 로그인 페이지로 리디렉션
    }

    return children;
  };

  return (
    <BrowserRouter>
    <Routes>
      <Route path="auth/signup" element={<Signup/>}/>
      <Route path="auth/login" element={<Login/>}/>
      <Route path="auth/find/:type" element={<Find/>}/>
      <Route element={<ProtectedRoute />}>
      <Route path="user/mypage" element={<Mypage/>}/>
      <Route path="/" element={<UserLayout/>}>
      <Route index element={<Main/>}/>
      <Route path="search" element={<Search/>}/>
      <Route path="info" element={<Info/>}/>
      <Route path="main" element={<Main/>}/>
      <Route path="store" element={<UserStorePage/>}/>
      <Route path="sinquiries" element={<InquiryEnter/>}/>
      </Route>
      <Route path="qr/*" element={<QrRoutes/>}/>
      <Route path='admin/*' element={<AdminRoutes/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;