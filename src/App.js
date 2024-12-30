
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from '../src/user/pages/signup/pages/Signup';
import Login from '../src/user/pages/login/pages/Login'
import Info from './user/pages/info/Info';
import UserLayout from './user/layouts/UserLayout';
import Main from './user/pages/main/Main';
import InquiryEnter from './common/inquiry/components/StoreInquiryEnter';
import UserStorePage from './user/pages/storedetail/pages/UserStorePage';
import QrRoutes from './store/pages/qrCheck/routes/QrRoutes';
import AdminRoutes from './admin/route/AdminRoutes';
import Search from './user/pages/search/Search';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="auth/signup" element={<Signup/>}/>
      <Route path="auth/login" element={<Login/>}/>
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
    </Routes>
    </BrowserRouter>
  );
}

export default App;