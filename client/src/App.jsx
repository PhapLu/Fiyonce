// Imports
import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import 'boxicons';

// Components
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import OrderHistory from "./components/orderHistory/OrderHistory";
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

// Static pages
import StaticLayout from "./statics/staticLayout/StaticLayout.jsx";
import Glaze from "./statics/glaze/Glaze.jsx";
import About from "./statics/about/About.jsx";

// Profiles
import ProfilePosts from "./profile/profilePosts/ProfilePosts";

// Dashboard
import DashboardLayout from "./dashboard/dashboardLayout/DashboardLayout";
import OverviewDashboard from "./dashboard/overviewDashboard/OverviewDashboard";
import ArtDashboard from "./dashboard/artDashboard/ArtDashboard";
import TransactionDashboard from "./dashboard/transactionDashboard/TransactionDashboard";
import AccountDashboard from "./dashboard/accountDashboard/AccountDashboard";
import NewsDashboard from "./dashboard/newsDashboard/NewsDashboard";
import CreatePost from "./components/crudPost/create/CreatePost";
import UpdatePost from "./components/crudPost/update/UpdatePost";
import DeletePost from "./components/crudPost/delete/DeletePost";
import ProfileArchive from "./profile/profileArchive/ProfileArchive.jsx";
import HelpCenter from "./help/helpCenter/HelpCenter.jsx";
import UpgradeAccount from "./components/upgradeAccount/UpgradeAccount.jsx";
import MyProfile from "./profile/myProfile/MyProfile.jsx";
import RenderTalentRequest from "./components/upgradeAccount/RenderTalentRequest.jsx";
import SearchResult from "./pages/searchResult/SearchResult.jsx";
import RenderCommissionOrder from "./components/crudCommissionOrder/render/RenderCommissionOrder.jsx";
import CreateProposal from "./components/crudProposal/create/CreateProposal.jsx";
import UpdateCommissionOrder from "./components/crudCommissionOrder/update/UpdateCommissionOrder.jsx";
import RenderProposals from "./components/crudProposal/render/RenderProposals.jsx";
import RenderProposal from "./components/crudProposal/render/RenderProposal.jsx";
import RejectCommissionOrder from "./components/crudCommissionOrder/reject/RejectCommissionOrder.jsx";
import CommissionOrderLayout from "./components/crudCommissionOrder/layout/CommissionOrderLayout.jsx";
import StartWipCommissionOrder from "./components/crudCommissionOrder/startWip/StartWipCommissionOrder.jsx";
import DeliverCommissionOrder from "./components/crudCommissionOrder/deliver/DeliverCommissionOrder.jsx";
import FinishCommissionOrder from "./components/crudCommissionOrder/finish/FinishCommissionOrder.jsx";
import HelpTopic from "./help/helpTopic/HelpTopic.jsx";
import HelpArticle from "./help/helpArticle/HelpArticle.jsx";
import HelpCenterLayout from "./help/layout/HelpCenterLayout.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import ProfileTermOfService from "./profile/profileTermOfService/ProfileTermOfService.jsx";
import RejectResponse from "./components/crudCommissionOrder/rejectResponse/RejectResponse.jsx";
import RenderMilestones from "./components/crudCommissionOrder/renderMilestones/RenderMilestones.jsx";
import Resources from "./statics/resources/Resources.jsx";
import CreateMilestone from "./components/crudCommissionOrder/createMilestone/CreateMilestone.jsx";
import ArchivedOrderHistory from "./components/orderHistory/ArchivedOrderHistory.jsx";
import UnarchiveCommissionOrder from "./components/crudCommissionOrder/archive/UnarchiveCommissionOrder.jsx";
import ArchiveCommissionOrder from "./components/crudCommissionOrder/archive/ArchiveCommissionOrder.jsx";
import ReportCommissionOrder from "./components/crudCommissionOrder/report/ReportCommissionOrder.jsx";
import CommissionReviews from "./components/crudCommissionReviews/render/RenderCommissionReviews.jsx";
import ReviewCommissionOrder from "./components/crudCommissionOrder/review/ReviewCommissionOrder.jsx";
import ReportDashboard from "./dashboard/reportDashboard/ReportDashboard.jsx";
import SupplementTalentRequest from "./components/upgradeAccount/SupplementTalentRequest.jsx";
import RenderFinalDelivery from "./components/crudCommissionOrder/renderFinalDelivery/RenderFinalDelivery.jsx";
import RenderCommissionOrderReviews from "./components/crudCommissionOrder/renderReviews/RenderCommissionOrderReviews.jsx";
import CreateCommissionService from "./components/crudCommissionService/create/CreateCommissionService.jsx";
import DeleteCommissionService from "./components/crudCommissionService/delete/DeleteCommissionService.jsx";
import UpdateCommissionService from "./components/crudCommissionService/update/UpdateCommissionService.jsx";
import UpdateCommissionServiceCategory from "./components/crudCommissionServiceCategory/update/UpdateCommissionServiceCategory.jsx";
import DeleteCommissionServiceCategory from "./components/crudCommissionServiceCategory/delete/DeleteCommissionServiceCategory.jsx";
import MakeDecision from "./components/crudCommissionOrder/makeDecision/MakeDecision.jsx";
import TermsOfServices from "./statics/termsOfServices/TermsOfServices.jsx";

const queryClient = new QueryClient();

const commissionOrderRoutes = [
  {
    path: "commission-orders/:commission-order-id",
    element: <CommissionOrderLayout />,
    children: [
      // CRUD commission order
      {
        path: "",
        element: <RenderCommissionOrder />,
      },
      {
        path: "update",
        element: <UpdateCommissionOrder />,
      },

      // CRUD proposals
      {
        path: "proposals",
        element: <RenderProposals />,
      },
      {
        path: "proposals/:proposal-id",
        element: <RenderProposal />,
      },
      {
        path: "create-proposal",
        element: <CreateProposal />,
      },

      // Other operations
      {
        path: "reject",
        element: <RejectCommissionOrder />,
      },
      {
        path: "reject-response",
        element: <RejectResponse />,
      },
      {
        path: "start-wip",
        element: <StartWipCommissionOrder />,
      },
      {
        path: "render-milestones",
        element: <RenderMilestones />,
      },
      {
        path: "create-milestone",
        element: <CreateMilestone />,
      },
      {
        path: "deliver",
        element: <DeliverCommissionOrder />,
      },
      {
        path: "render-final-delivery",
        element: <RenderFinalDelivery />,
      },
      {
        path: "finish",
        element: <FinishCommissionOrder />,
      },
      {
        path: "report",
        element: <ReportCommissionOrder />,
      },
      {
        path: "review",
        element: <ReviewCommissionOrder />,
      },
      {
        path: "render-reviews",
        element: <RenderCommissionOrderReviews />,
      },
      // More actions
      {
        path: "archive",
        element: <ArchiveCommissionOrder />,
      },
      {
        path: "unarchive",
        element: <UnarchiveCommissionOrder />,
      },
    ],
  },
];


const routes = [
  // Displaying static content
  {
    path: "",
    element: <Layout />,
    children: [
      // Explore layout
      {
        path: "/",
        element: <ExploreLayout />,
        children: [
          {
            path: "/commission-services",
            element: <ExploreCommissionServices showCommissionServices={true} />,
            children: [
              {
                path: "/commission-services/:commission-service-id",
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
        path: "/statics",
        element: <StaticLayout />,
        children: [
          {
            path: "/statics/glaze",
            element: <Glaze />,
          },
          {
            path: "/statics/terms-of-services",
            element: <TermsOfServices />,
          },
          {
            path: "/statics/about",
            element: <About />,
          },
          {
            path: "/statics/resources",
            element: <Resources />,
          },
        ]
      },
      // Pages for managing profile/portfolio
      {
        path: "/users/:userId",
        element: <ProfileLayout />,
        children: [
          {
            path: "/users/:userId",
            element: (
              <MyProfile />
            ),
          },
          {
            path: "/users/:userId/upgrade-account",
            element: (
              <UpgradeAccount />
            ),
          },
          {
            path: "/users/:userId/supplement-talent-request",
            element: (
              <SupplementTalentRequest />
            ),
          },
          {
            path: "/users/:userId/render-talent-request",
            element: (
              <RenderTalentRequest />
            ),
          },
          {
            path: "/users/:userId/profile-commission-services",
            element: <ProfileCommissionServices />,
            children: [
              {
                path: "/users/:userId/profile-commission-services/create",
                element: <CreateCommissionService />,
              },
              {
                path: "/users/:userId/profile-commission-services/:commission-service-id",
                element: <RenderCommissionService />,
              },
              {
                path: "/users/:userId/profile-commission-services/:commission-service-id/delete",
                element: <DeleteCommissionService />,
              },
              {
                path: "/users/:userId/profile-commission-services/:commission-service-id/update",
                element: <UpdateCommissionService />,
              },
              {
                path: "/users/:userId/profile-commission-services/service-categories/:service-category-id/update",
                element: <UpdateCommissionServiceCategory />,
              },
              {
                path: "/users/:userId/profile-commission-services/service-categories/:service-category-id/delete",
                element: <DeleteCommissionServiceCategory />,
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
            path: "/users/:userId/term-of-services",
            element: <ProfileTermOfService />,
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





      // General Layout
      {
        path: "order-history",
        element: <ProtectedRoute allowedRoles={['all-exclude-guest']}><OrderHistory /></ProtectedRoute>,
        children: commissionOrderRoutes,
      },
      {
        path: "commission-market",
        element: <CommissionMarket />,
        children: commissionOrderRoutes
      },
      {
        path: "newss/:news-id",
        element: <RenderNews />,
      },
      {
        path: "search",
        element: <SearchResult />,
        children: [
          {
            path: "commission-services/:commission-service-id",
            element: <RenderCommissionService />,
          },
        ]
      },

      // Admin dashboard
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
            path: "/dashboard/reports",
            element: <ReportDashboard />,
            children: [
              {
                path: "commission-reports/:commission-report-id/make-decision",
                element: <MakeDecision />,
              }
            ]
          },
        ],
      },
    ]
  },
  {
    path: "help-center",
    element: <HelpCenterLayout />,
    children: [
      {
        path: "",
        element: <HelpCenter />,
      },
      {
        path: "topics/:topic-id",
        element: <HelpTopic />,
      },
      {
        path: "topics/:topic-id/articles/:article-id",
        element: <HelpArticle />
      }
      // {
      //   path: "topics/:topic-id",
      //   element: <HelpTopic />,
      // },
      // {
      //   path: "topics/:topic-id/:article-id",
      //   element: <HelpArticle />,
      // },
      // {
      //   path: "",
      //   element: <HelpCenter />,
      //   children: [
      //     {
      //       path: "articles/for-talents",
      //       element: <ForTalents />,
      //     },
      //   ]
      // },
    ]
  },


  // Other pages
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
