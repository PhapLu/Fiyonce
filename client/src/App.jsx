import React from "react";
import "./assets/scss/base.scss";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import 'boxicons';

// Components
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

// import Navbar from "./components/navbar/Navbar";
// import Sidebar from "./components/sidebar/Sidebar";
// import Register from "./components/register/Register";
// import Login from "./components/login/Login";

// Pages
import Talent from "./pages/talent/Talent";
import Profile from "./pages/profile/Profile";
import BasicInfo from "./pages/basicInfo/BasicInfo";

// import Artworks from "./pages/artworks/Artworks";
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
  return (
    <>
      <Navbar />

      <div className={`app ${showSidebar ? 'with-sidebar' : 'without-sidebar'}`}>
        {showSidebar && <Sidebar />}

        <div className="outlet-content">
          {showSidebar && <div className="profile">
            <ul className="profile-nav-container">
              <li className="profile-nav-item btn btn-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 profile-nav-item__ic">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="profile-nav-item__title">
                  Đơn hàng của tôi
                </span>
              </li>
              <li className="profile-nav-item btn btn-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 profile-nav-item__ic">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <span className="profile-nav-item__title">
                  Thông tin cơ bản
                </span>
              </li>
            </ul>
          </div>}
          <Outlet />
        </div>
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout showSidebar={true}></Layout>,
    children: [
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
        // path: "/artworks",
        // element: <Artworks />,
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
