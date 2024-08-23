import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import 'boxicons';

// Components
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import OrderHistory from "./components/orderHistory/OrderHistory";
import Talents from "./components/talents/Talents";
import ProfileCommissionServices from "./profile/profileCommissionServices/ProfileCommissionServices.jsx";
import RenderPost from "./components/crudPost/render/RenderPost";
import RenderNews from "./components/crudNews/render/RenderNews";
import RenderCommissionService from "./components/crudCommissionService/render/RenderCommissionService.jsx";

// Pages
import ProfileLayout from "./profile/profileLayout/ProfileLayout";
import Forbidden from "./pages/forbidden/Forbidden";
import ProfileBasicInfo from "./profile/profileBasicInfo/ProfileBasicInfo.jsx";
import ExploreLayout from "./explore/exploreLayout/ExploreLayout.jsx";
import ExplorePosts from "./explore/explorePosts/ExplorePosts.jsx";
import CommissionMarket from "./pages/commissionMarket/CommissionMarket";
import InMaintainance from "./pages/inMaintainance/InMaintainance";
import InDevelopment from "./pages/inDevelopment/InDevelopment";
import NotFound from "./pages/notFound/NotFound";
import ExploreCommissionServices from "./explore/exploreCommissionServices/ExploreCommissionServices";
import Layout from "./pages/layout/Layout.jsx";
import Challenge from "./pages/challenge/Challenge.jsx";

// Statics
import StaticLayout from "./statics/staticLayout/StaticLayout.jsx";
import Glaze from "./statics/glaze/Glaze.jsx";
import AboutTeam from "./statics/aboutTeam/AboutTeam.jsx";


// Profiles
import ProfilePosts from "./profile/profilePosts/ProfilePosts";

// Dashboard
import DashboardLayout from "./dashboard/dashboardLayout/DashboardLayout";
import OverviewDashboard from "./dashboard/overviewDashboard/OverviewDashboard";
import ArtDashboard from "./dashboard/artDashboard/ArtDashboard";
import TransactionDashboard from "./dashboard/transactionDashboard/TransactionDashboard";
import AccountDashboard from "./dashboard/accountDashboard/AccountDashboard";
import NewsDashboard from "./dashboard/newsDashboard/NewsDashboard";
import ChallengeDashboard from "./dashboard/challengeDashboard/ChallengeDashboard";
import HelpDashboard from "./dashboard/helpDashboard/HelpDashboard";
import CreatePost from "./components/crudPost/create/CreatePost";
import UpdatePost from "./components/crudPost/update/UpdatePost";
import DeletePost from "./components/crudPost/delete/DeletePost";
import ProfileArchive from "./profile/profileArchive/ProfileArchive.jsx";
import HelpCenter from "./help/center/HelpCenter.jsx";

const queryClient = new QueryClient();

const routes = [
  {
    path: "/help-center",
    element: <HelpCenter />,
  },
  {
    path: "/terms-and-policies",
    element: <InDevelopment />,
  },
  {
    path: "/statics",
    element: <StaticLayout />,
    children: [
      {
        path: "/statics/glaze",
        element: <Glaze />,
      },
      {
        path: "/statics/about-team",
        element: <AboutTeam />,
      },
    ]
  },
  {
    path: "/users/:userId",
    element: <ProfileLayout />,
    children: [
      {
        path: "/users/:userId/profile-commission-services",
        element: <ProfileCommissionServices />,
        children: [
          {
            path: "/users/:userId/profile-commission-services/:commissionServiceId",
            element: <RenderCommissionService />,
          },
        ]
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
      {
        path: "/users/:userId/archive",
        element: <ProtectedRoute><ProfileArchive /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/",
    element: <ExploreLayout />,
    children: [
      {
        path: "/commission-services",
        element: <ExploreCommissionServices showCommissionServices={true} />,
        children: [
          {
            path: "/commission-services/:commissionServiceId",
            element: <RenderCommissionService />,
          },
        ]
      },
      // {
      //   path: "/talents",
      //   element: <Talents showTalents={true} />,
      // },
      {
        path: "/",
        element: <ExplorePosts showPosts={true} />,
        children: [
          {
            path: "/posts/:postId",
            element: <RenderPost />,
          },
        ],
      },
    ],
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/commission-market",
        element: <CommissionMarket />,
      },
      {
        path: "/challenges",
        element: <Challenge />,
      },
      {
        path: "/newss/:newsId",
        element: <RenderNews />,
      },
    ]
  },
  {
    path: "/dashboard/",
    element: <ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>,
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
        path: "/dashboard/news",
        element: <NewsDashboard />,
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
