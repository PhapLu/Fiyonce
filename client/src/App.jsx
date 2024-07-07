import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import 'boxicons';

// Components
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import OrderHistory from "./components/orderHistory/OrderHistory";
import Layout from "./Layout";
import Talents from "./components/talents/Talents";
import CommissionServices from "./components/commissionServices/CommissionServices";
import ProfileCommissionServices from "./profile/profileCommissionServices/ProfileCommissionServices";
import ProfilePosts from "./profile/profilePosts/ProfilePosts";
// import Navbar from "./components/navbar/Navbar";
// import Sidebar from "./components/sidebar/Sidebar";
// import Register from "./components/register/Register";
// import Login from "./components/login/Login";

// Pages
import ProfileLayout from "./profile/profileLayout/ProfileLayout";
import Forbidden from "./pages/forbidden/Forbidden";
import BasicInfo from "./pages/basicInfo/BasicInfo";
import Explore from "./pages/explore/Explore";
import ExplorePosts from "./pages/explorePosts/ExplorePosts";
import CommissionMarket from "./pages/commissionMarket/CommissionMarket";


// Dashboard
import DashboardLayout from "./dashboard/dashboardLayout/DashboardLayout";
import OverviewDashboard from "./dashboard/overviewDashboard/OverviewDashboard";
import ArtDashboard from "./dashboard/artDashboard/ArtDashboard";
import TransactionDashboard from "./dashboard/transactionDashboard/TransactionDashboard";
import AccountDashboard from "./dashboard/accountDashboard/AccountDashboard";
import ChallengeDashboard from "./dashboard/challengeDashboard/ChallengeDashboard";
import HelpDashboard from "./dashboard/helpDashboard/HelpDashboard";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/users/:userId",
    element: <ProfileLayout />,
    children: [
      {
        path: "/users/:userId/profile_commission_services",
        element: <ProfileCommissionServices />,
      },
      {
        path: "/users/:userId/profile_posts",
        element: <ProfilePosts />,
      },
      {
        path: "/users/:userId/order-history",
        element: <OrderHistory />,
      },
      {
        path: "/users/:userId/basic-info",
        element: <ProtectedRoute><BasicInfo /></ProtectedRoute>,
      }
    ]
  },
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/explore",
        element: <Explore></Explore>,
        children: [
          {
            path: "/explore",
            element: <ExplorePosts showPosts={true} />,
          },
          {
            path: "/explore/talents",
            element: <Talents showTalents={true} />,
          },
          {
            path: "/explore/commissionServices",
            element: <CommissionServices showCommissionServices={true} />,
          },
        ]
      },
      {
        path: "/commission_market",
        element: <CommissionMarket />
      },
    ]
  },
  {
    path: "/dashboard/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard/overview",
        element: <OverviewDashboard />,
      },
      {
        path: "/dashboard/art",
        element: <ArtDashboard />,
      },
      {
        path: "/dashboard/transactions",
        element: <TransactionDashboard />,
      },
      {
        path: "/dashboard/accounts",
        element: <AccountDashboard />,
      },
      {
        path: "/dashboard/challenges",
        element: <ChallengeDashboard />,
      },
      {
        path: "/dashboard/help",
        element: <HelpDashboard />,
      },
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
