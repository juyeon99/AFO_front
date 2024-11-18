import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import React from 'react';
import './App.css'

import Main from "./pages/Main";
import Login from "./pages/Login";
import History from "./pages/history/History";
import LoginInfo from "./pages/LoginInfo";
import Layout from './layouts/Layout';
import PrivacyPolicy from './pages/footer/PrivacyPolicy';
import CookiePolicy from './pages/footer/CookiePolicy';
import TermsOfUse from './pages/footer/TermsofUse';
import FAQ from './pages/footer/FAQ';
import Chat from "./pages/chat/Chat";
import PerfumeList from './pages/booklist/PerfumeList';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
        </Route>
        <Route path="/PrivacyPolicy" element={<Layout />}>
          <Route index element={<PrivacyPolicy/>} />
        </Route>
        <Route path="/CookiePolicy" element={<Layout />}>
          <Route index element={<CookiePolicy/>} />
        </Route>
        <Route path="/TermsofUse" element={<Layout />}>
          <Route index element={<TermsOfUse/>} />
        </Route>
        <Route path="/FAQ" element={<Layout />}>
          <Route index element={<FAQ/>} />
        </Route>
        <Route path="/PerfumeList" element={<Layout />}>
          <Route index element={<PerfumeList/>} />
          {/* 다른 페이지도 Layout 내에서 정의 */}
        </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/login-info" element={<LoginInfo/>}/>
          <Route path="/" element={<Main/>}/>
          <Route index element={<Main/>}/>
          <Route path="/chat" element={<Chat/>}/>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
