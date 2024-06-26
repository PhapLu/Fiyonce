// Imports
import { Outlet } from "react-router-dom";

// Resources
import Navbar from "../../components/navbar/Navbar";
import DashboardSidebar from "../dashboardSidebar/DashboardSidebar";

// Styling
import "./DashboardLayout.scss";

export default function DashboardLayout() {
    return (
        <>
            <Navbar />
            <div className="app with-sidebar">
                <DashboardSidebar />
                <div className="dashboard-outlet-content">
                    <Outlet />
                </div>
            </div>
        </>
    )
}