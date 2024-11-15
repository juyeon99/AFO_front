import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Main from "./pages/Main";
import React from 'react';
import Login from "./pages/Login";
import History from "./pages/history/History";
import LoginInfo from "./pages/LoginInfo";
import Layout from './layouts/Layout';
import './App.css'
import PrivacyPolicy from './pages/footer/PrivacyPolicy';
import CookiePolicy from './pages/footer/CookiePolicy';
import TermsOfUse from './pages/footer/TermsofUse';
import FAQ from './pages/footer/FAQ';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>}>
          <Route index element={<Main/>}/>

          </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/login-info" element={<LoginInfo/>}/>
        </Routes>
      </BrowserRouter>
    </>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          {/* 다른 페이지도 Layout 내에서 정의 */}
        </Route>
        <Route path="/PrivacyPolicy" element={<Layout />}>
          <Route index element={<PrivacyPolicy/>} />
          {/* 다른 페이지도 Layout 내에서 정의 */}
        </Route>
        <Route path="/CookiePolicy" element={<Layout />}>
          <Route index element={<CookiePolicy/>} />
          {/* 다른 페이지도 Layout 내에서 정의 */}
        </Route>
        <Route path="/TermsofUse" element={<Layout />}>
          <Route index element={<TermsOfUse/>} />
          {/* 다른 페이지도 Layout 내에서 정의 */}
        </Route>
        <Route path="/FAQ" element={<Layout />}>
          <Route index element={<FAQ/>} />
          {/* 다른 페이지도 Layout 내에서 정의 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
