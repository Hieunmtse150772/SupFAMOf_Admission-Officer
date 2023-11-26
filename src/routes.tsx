import AuthGuard from "components/authentication/AuthGuard";
import GuestGuard from "components/authentication/GuestGuard";
import DashboardLayout2 from "components/Layouts/antdesgin";
import DashboardLayout from "components/Layouts/DashboardLayout";
import LoadingScreen from "components/LoadingScreen";
import { FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loadable = (Component: LazyExoticComponent<FC>) => (props: any) =>
(
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// authentication pages
const Login = Loadable(lazy(() => import("./pages/Authentication/Login")));
const Register = Loadable(
  lazy(() => import("./pages/Authentication/Register"))
);
const ForgetPassword = Loadable(
  lazy(() => import("./pages/Authentication/ForgetPassword"))
);

// Dashboard pages
const DashboardSaaS = Loadable(lazy(() => import("./pages/Dashboards/SaaS")));

// user profile
const UserProfile = Loadable(lazy(() => import("./pages/UserProfile")));

// user management
const UserList = Loadable(
  lazy(() => import("./pages/CollabManagement/ViewListCollab"))
);
const UserGrid = Loadable(
  lazy(() => import("./pages/UserManagement/UserGrid"))
);
const AddNewUser = Loadable(
  lazy(() => import("./pages/UserManagement/AddNewUser"))
);
const AddNewPost = Loadable(
  lazy(() => import("./pages/Post Management/CreatePost"))
);
const ViewPostList = Loadable(
  lazy(() => import("./pages/Post Management/ViewPost"))
);
const ViewRegistration = Loadable(
  lazy(() => import("./pages/RegistrationManagement/ViewRegistration"))
);
const ViewContract = Loadable(
  lazy(() => import("./pages/ContractManagement/ViewContractList"))
);
const AddContract = Loadable(
  lazy(() => import("./pages/ContractManagement/AddContract"))
);
const Map = Loadable(
  lazy(() => import("./pages/Map/map"))
);
const ViewRequest = Loadable(
  lazy(() => import("./pages/Request Management/ViewRequest"))
);
// error
const Error = Loadable(lazy(() => import("./pages/404")));

// routes
const routes = [
  {
    path: "/",
    element: <Navigate to="dashboard" />,
  },
  {
    path: "login",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "register",
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    ),
  },
  {
    path: "forget-password",
    element: (
      <GuestGuard>
        <ForgetPassword />
      </GuestGuard>
    ),
  },
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <DashboardSaaS />,
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },

      {
        path: "user-list",
        element: <UserList />,
      },
      {
        path: "user-grid",
        element: <UserGrid />,
      },
      {
        path: "add-user",
        element: <AddNewUser />,
      },
      {
        path: "post-list",
        element: <ViewPostList />,
      },
      {
        path: "add-post",
        element: <AddNewPost />,
      },
      {
        path: "registration-list",
        element: <ViewRegistration />
      },
      {
        path: "contract-list",
        element: <ViewContract />
      }
      ,
      {
        path: "add-contract",
        element: <AddContract />
      }
      ,
      {
        path: "request-list",
        element: <ViewRequest />
      }
      ,
      {
        path: "map",
        element: <Map />
      }
    ],
  },
  {
    path: "dashboard2",
    element: (
      <AuthGuard>
        <DashboardLayout2 />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <DashboardSaaS />,
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },
      {
        path: "user-list",
        element: <UserList />,
      },
      {
        path: "user-grid",
        element: <UserGrid />,
      },
      {
        path: "add-user",
        element: <AddNewUser />,
      },
      {
        path: "post-list",
        element: <ViewPostList />,
      },
      {
        path: "add-post",
        element: <AddNewPost />,
      },
      {
        path: "registration-list",
        element: <ViewRegistration />
      }
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
];

export default routes;
