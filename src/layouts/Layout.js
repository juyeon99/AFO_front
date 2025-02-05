import { Outlet } from "react-router-dom";
import React from 'react';
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";

const Layout = () => {
    return (
        <>
            <div className="layout-container" style={{ 
                minHeight: '100vh', 
                display: 'flex',
                position: 'relative'
            }}>
                <Sidebar/>
                <div className="layout-main" style={{ 
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 'calc(100vh - 300px)',
                    overflowX: 'hidden'
                }}>
                    <div style={{ flex: '1' }}>
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Layout;