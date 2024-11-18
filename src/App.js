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
import SpicesList from './pages/booklist/SpicesList';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>}/>
          <Route path='/CookiePolicy' element={<CookiePolicy/>}/>
          <Route path='/TermsofUse' element={<TermsOfUse/>}/>
          <Route path='/FAQ' element={<FAQ/>}/>
          <Route path='/spiceslist' element={<SpicesList/>}/>

        </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="/login-info" element={<LoginInfo/>}/>
          <Route path="/" element={<Main/>}/>
          <Route index element={<Main/>}/>
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/history" element={<History/>}/>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
