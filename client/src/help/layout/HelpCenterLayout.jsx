// Imports
import { Link, Outlet, useNavigate } from "react-router-dom";

// Styling
import "./HelpCenterLayout.scss";
import HelpNavbar from "../helpNavbar/HelpNavbar";
import Footer from "../../components/footer/Footer";

export default function HelpCenterLayout() {
    const navigate = useNavigate();
    return (
        <div className="help-center-layout">
            <HelpNavbar />

            <div className="outlet-content">
                {/* <button className="back-btn btn btn-round icon-only btn-7" onClick={() => { navigate(-1) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </button> */}
                <Outlet />
            </div>

            <Footer />
        </div>
    )
}