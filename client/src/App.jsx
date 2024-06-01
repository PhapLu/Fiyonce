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
    <div className={`app ${showSidebar ? 'with-sidebar' : 'without-sidebar'}`}>
        <Navbar />
        {showSidebar && <Sidebar />}
        <Outlet /> 
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout showSidebar={true}></Layout>,
    children: [
      {
        path: "/talents/:id",
        element: <Talent />,
      },
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
