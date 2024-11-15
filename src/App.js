import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Main from "./pages/Main";
import React from 'react';
import Layout from './layouts/Layout';
import './App.css'
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TermsOfUse from './pages/TermsofUse';
import FAQ from './pages/FAQ';

function App() {
  return (
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
