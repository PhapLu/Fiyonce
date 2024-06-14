import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import 'boxicons';

// Dashboard
import AccountDashboard from "./dashboard/accountDashboard/AccountDashboard"

// Components
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import OrderHistory from "./components/orderHistory/OrderHistory";
import Layout from "./Layout";
// import Navbar from "./components/navbar/Navbar";
// import Sidebar from "./components/sidebar/Sidebar";
// import Register from "./components/register/Register";
// import Login from "./components/login/Login";

// Pages
import Profile from "./pages/profile/Profile";
import Forbidden from "./pages/forbidden/Forbidden";
import BasicInfo from "./pages/basicInfo/BasicInfo";
import Explore from "./pages/explore/Explore";
import CommissionMarket from "./pages/commissionMarket/CommissionMarket";

// import Artwork from "./pages/artwork/Artwork";
// import Challenges from "./pages/challenges/Challenges";
// import Challenge from "./pages/challenge/Challenge";
// import Talents from "./pages/talents/Talents";
// import Talent from "./pages/talent/Talent";
// import Messenger from './pages/messenger/Messenger'
// import Success from "./pages/success/Success";
// ... (other imports)

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/users/:id",
    element: <Profile/>,
    children: [
      {
        path: "/users/:id/order-history",
        element: <OrderHistory />,
      },
      {
        path: "/users/:id/basic-info",
        element: <ProtectedRoute><BasicInfo /></ProtectedRoute>,
      }
    ]
  },
  {
    path: "/dashboard/accounts",
    element: <AccountDashboard />,
  },
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/explore",
        element: <Explore showArtworks={true}/>,
      },
      {
        path: "/commission_market",
        element:<CommissionMarket/>
      },
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
  {
    path: "/forbidden",
    element: <Forbidden />,
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
