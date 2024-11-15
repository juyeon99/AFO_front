import { Outlet } from "react-router-dom";
import React from 'react';
import Sidebar from "../components/commons/sidebar/Sidebar";
import Footer from "../components/commons/footer/Footer";

const Layout = () => {
    return (
        <>
            <div className="layout-container">
                <Sidebar/>
                <div className="layout-content-wrapper">
                    <div className="layout-main">
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </div>
            
        </>
    );
};

export default Layout;