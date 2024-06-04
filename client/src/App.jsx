import React, { useState } from "react";
import "./assets/scss/base.scss";
import { useParams, useLocation, Link } from "react-router-dom";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import 'boxicons';

// Components
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import OrderHistory from "./components/orderHistory/OrderHistory";

// import Navbar from "./components/navbar/Navbar";
// import Sidebar from "./components/sidebar/Sidebar";
// import Register from "./components/register/Register";
// import Login from "./components/login/Login";

// Pages
import Talent from "./pages/talent/Talent";
import Profile from "./pages/profile/Profile";
import BasicInfo from "./pages/basicInfo/BasicInfo";
import { useAuth } from "./contexts/auth/AuthContext";

import Explore from "./pages/explore/Explore";
// import Artwork from "./pages/artwork/Artwork";
// import Challenges from "./pages/challenges/Challenges";
// import Challenge from "./pages/challenge/Challenge";
// import Talents from "./pages/talents/Talents";
// import Talent from "./pages/talent/Talent";
// import Messenger from './pages/messenger/Messenger'

// import Success from "./pages/success/Success";
// ... (other imports)

const queryClient = new QueryClient();

const Layout = ({ showSidebar }) => {
  const [profileBtnActive, setProfileNavActive] = useState(null);
  const { userInfo, setUserInfo } = useAuth();

  const { id } = useParams();
  const location = useLocation();

  return (
    <>
      <Navbar />

      <div className={`app ${showSidebar ? 'with-sidebar' : 'without-sidebar'}`}>
        {showSidebar && <Sidebar />}

        <div className="outlet-content">
          {showSidebar && (<div className="profile">
            <div className="profile-nav-container">
              <Link to={`/users/${id}/order-history`} className={"profile-nav-item btn btn-md " + (location.pathname.includes('/order-history') ? "btn-2" : "btn-3")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 profile-nav-item__ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <span>Đơn hàng của tôi</span>
              </Link>
              <Link to={`/users/${id}/basic-info`} className={"profile-nav-item btn btn-md " + (location.pathname.includes('/basic-info') ? "btn-2" : "btn-3")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 profile-nav-item__ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <span>Thông tin cơ bản</span>
              </Link>
            </div>
          </div>)}
          <Outlet />
        </div>
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/users/:id",
    element: <Layout showSidebar={true}></Layout>,
    children: [
      {
        path: "/users/:id/order-history",
        element: <OrderHistory />,
      },
      {
        path: "/users/:id/basic-info",
        element: <BasicInfo />,
      }
    ]
  },
  {
    path: "/",
    element: <Layout showSidebar={false}></Layout>,
    children: [
      {
        path: "/explore",
        element: <Explore />,
      },
      // {
      //   path: "/messenger",
      //   element:<Messenger/>
      // },
      // {
      //   path: "/artworks/:id",
      //   element: <Artwork />,
      // },
      // {
      //   path: "/challenges",
      //   element: <Challenges />,
      // },
      // {
      //   path: "/challenges/:id",
      //   element: <Challenge />,
      // },
      // {
      //   path: "/talents",
      //   element: <Talents />,
      // },
    ]
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <SharedDataProvider> */}
      <RouterProvider router={router} />
      {/* </SharedDataProvider> */}
    </QueryClientProvider>
  );
}

export default App;
