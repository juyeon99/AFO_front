import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import React from 'react';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>}>
          <Route index element={<Main/>}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
