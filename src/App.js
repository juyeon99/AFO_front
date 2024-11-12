import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import React from 'react';
import Chat from "./pages/chat/Chat";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route index element={<Main/>}/>
          <Route path="/chat" element={<Chat/>}/>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
