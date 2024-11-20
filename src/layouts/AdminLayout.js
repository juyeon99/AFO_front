import { Outlet } from "react-router-dom";
import React from 'react';
import Footer from "../components/commons/footer/Footer";
import AdminSidebar from "../components/commons/sidebar/AdminSidebar";

const AdminLayout = () => {
    return (
        <>
            <div className="layout-container">
                <AdminSidebar/>
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

export default AdminLayout;