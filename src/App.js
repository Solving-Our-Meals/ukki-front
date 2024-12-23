
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from '../src/user/pages/signup/pages/Signup';
import Login from '../src/user/pages/login/pages/Login'
import Info from './user/pages/info/Info';
import UserLayout from './user/layouts/UserLayout';
import UserDoInquiry from './common/inquiry/components/UserDoInquiry';
import Main from './user/pages/main/Main';
import InquiryEnter from './common/inquiry/components/StoreInquiryEnter';
import UserStorePage from './user/pages/storedetail/pages/UserStorePage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="auth/signup" element={<Signup/>}/>
      <Route path="auth/login" element={<Login/>}/>
      <Route path="/" element={<UserLayout/>}>
      <Route index element={<Main/>}/>
      <Route path="info" element={<Info/>}/>
      <Route path="main" element={<Main/>}/>
      <Route path="store" element={<UserStorePage/>}/>
      <Route path="inquiries" element={<UserDoInquiry/>}/>
      <Route path="sinquiries" element={<InquiryEnter/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;