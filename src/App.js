import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import React from 'react';
import Login from "./pages/Login";
import History from "./pages/history/History";
import LoginInfo from "./pages/LoginInfo";

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
  );
}

export default App;
