import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import React from 'react';
import LoginPage from "./pages/LoginPage";
import KakaoRedirectPage from "./pages/KakaoRedirectPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Main />} />

          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/redirected/kakao" element={<KakaoRedirectPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
