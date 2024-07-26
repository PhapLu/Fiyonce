import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import 'boxicons';

// Components
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import OrderHistory from "./components/orderHistory/OrderHistory";
import Layout from "./Layout";
import Talents from "./components/talents/Talents";
import ProfileCommissionServices from "./profile/profileCommissionServices/ProfileCommissionServices.jsx";
import RenderPost from "./components/crudPost/render/RenderPost";

// Pages
import ProfileLayout from "./profile/profileLayout/ProfileLayout";
import Forbidden from "./pages/forbidden/Forbidden";
import ProfileBasicInfo from "./profile/profileBasicInfo/ProfileBasicInfo.jsx";
import Explore from "./pages/explore/Explore";
import ExplorePosts from "./pages/explorePosts/ExplorePosts";
import CommissionMarket from "./pages/commissionMarket/CommissionMarket";
import HelpCenter from "./pages/helpCenter/HelpCenter";
import InMaintainance from "./pages/inMaintainance/InMaintainance";
import InDevelopment from "./pages/inDevelopment/InDevelopment";
import NotFound from "./pages/notFound/NotFound";

// Profiles
import ProfilePosts from "./profile/profilePosts/ProfilePosts";

// Dashboard
import DashboardLayout from "./dashboard/dashboardLayout/DashboardLayout";
import OverviewDashboard from "./dashboard/overviewDashboard/OverviewDashboard";
import ArtDashboard from "./dashboard/artDashboard/ArtDashboard";
import TransactionDashboard from "./dashboard/transactionDashboard/TransactionDashboard";
import AccountDashboard from "./dashboard/accountDashboard/AccountDashboard";
import ChallengeDashboard from "./dashboard/challengeDashboard/ChallengeDashboard";
import HelpDashboard from "./dashboard/helpDashboard/HelpDashboard";
import CreatePost from "./components/crudPost/create/CreatePost";
import UpdatePost from "./components/crudPost/update/UpdatePost";
import DeletePost from "./components/crudPost/delete/DeletePost";

const queryClient = new QueryClient();

const routes = [
  {
    path: "/users/:userId",
    element: <ProfileLayout />,
    children: [
      {
        path: "/users/:userId/profile-commission-services",
        element: <ProfileCommissionServices />,
      },
      {
        path: "/users/:userId/profile-posts",
        element: <ProfilePosts />,
        children: [
          {
            path: "/users/:userId/profile-posts/create",
            element: (
              <CreatePost />
            ),
          },
          {
            path: "/users/:userId/profile-posts/:postId",
            element: (
              <RenderPost />
            ),
          },
          {
            path: "/users/:userId/profile-posts/:postId/update",
            element: (
              <UpdatePost />
            ),
          },
          {
            path: "/users/:userId/profile-posts/:postId/delete",
            element: (
              <DeletePost />
            ),
          },
        ]
      },
      {
        path: "/users/:userId/order-history",
        element: <ProtectedRoute><OrderHistory /></ProtectedRoute>,
      },
      {
        path: "/users/:userId/basic-info",
        element: <ProtectedRoute><ProfileBasicInfo /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/help-center",
    element: <InDevelopment />,
  },
  {
    path: "/terms-and-policies",
    element: <InDevelopment />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Explore />,
        children: [
          {
            path: "/",
            element: <ExplorePosts showPosts={true} />,
            children: [
              {
                path: "/:postId",
                element: <RenderPost />,
              },
            ],
          },
          {
            path: "/talents",
            element: <Talents showTalents={true} />,
          },
          {
            path: "/commissionServices",
            // element: <CommissionServices showCommissionServices={true} />,
          },

        ],
      },
      {
        path: "/commission-market",
        element: <CommissionMarket />,
      },
      {
        path: "/challenges",
        element: <InDevelopment />,
      },
    ],
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
    ],
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "*",
    element: <NotFound />, // Catch-all route for 404 Not Found
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
