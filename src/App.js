import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './module/AuthModule';
import './App.css'

import Main from "./pages/Main";
import Login from "./pages/Login";
import History from "./pages/history/History";
import Layout from './layouts/Layout';
import PrivacyPolicy from './pages/footer/PrivacyPolicy';
import CookiePolicy from './pages/footer/CookiePolicy';
import TermsOfUse from './pages/footer/TermsofUse';
import FAQ from './pages/footer/FAQ';
import Chat from "./pages/chat/Chat";
import PerfumeList from './pages/booklist/PerfumeList';
import SpicesList from './pages/booklist/SpicesList';
import AdminSpicesList from './pages/admin/AdminSpicesList';
import AdminMembers from './pages/admin/AdminMembers';
import AdminPerfumeList from './pages/admin/AdminPerfumeList';
import ErrorScreen from './Fail';

// 원래 로그인
import LoginTest from "./pages/test/LoginTest";
import KakaoRedirectPage from './pages/test/KakaoRedirectPage';
import MemberTest from './pages/test/MemberTest';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    // 로그인 상태를 localStorage에서 가져오기
    const storedUser = JSON.parse(localStorage.getItem('auth'));
    const isLogin = !!storedUser; // 사용자가 로컬 스토리지에 존재하는지 확인

    if (isLogin && storedUser.role) {
      dispatch(loginSuccess(storedUser)); // Redux에 로그인 정보 업데이트
    } else {
      dispatch(logout()); // Redux 상태 초기화
    }
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
            <Route path='/CookiePolicy' element={<CookiePolicy />} />
            <Route path='/TermsofUse' element={<TermsOfUse />} />
            <Route path='/FAQ' element={<FAQ />} />
            <Route path='/spiceslist' element={<SpicesList />} />
            <Route path='/perfumelist' element={<PerfumeList />} />
            <Route path="/history" element={<History />} />
            <Route path='/member' element={<AdminMembers />} />
          </Route>

          <Route index element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/redirected/kakao" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin/spices" element={<AdminSpicesList />} />
          <Route path="/admin/perfumes" element={<AdminPerfumeList />} />
          <Route path='/fail' element={<ErrorScreen />} />

          {/* <Route path='/logintest' element={<LoginTest />} />
          <Route path='/oauth/redirected/kakao' element={<KakaoRedirectPage />} />
          <Route path='/membertest' element={<MemberTest />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;