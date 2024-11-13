import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Main from "./pages/Main";
import React from 'react';
import Layout from './layouts/Layout';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          {/* 다른 페이지도 Layout 내에서 정의 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
