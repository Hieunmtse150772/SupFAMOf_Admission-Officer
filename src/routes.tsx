import AuthGuard from "components/authentication/AuthGuard";
import AuthGuardAdmin from "components/authentication/AuthGuardAdmin";
import GuestGuard from "components/authentication/GuestGuard";
import DashboardLayout from "components/Layouts/DashboardLayout";
import DashboardLayoutAdmin from "components/Layouts/DashboardLayoutAdmin";

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
const DashboardSaaS = Loadable(lazy(() => import("./pages/DashboardsAdmission/SaaS")));
// user profile
const UserProfile = Loadable(lazy(() => import("./pages/UserProfile")));

// user management
const UserList = Loadable(
  lazy(() => import("./pages/CollabManagement/ViewListCollab"))
);
const ClassList = Loadable(
  lazy(() => import("./pages/ClassManagement/index"))
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
const ViewClass = Loadable(
  lazy(() => import("./pages/ClassManagement/ViewClass"))
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
    title: 'Login'
  },
  {
    path: "register",
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    ),
    title: 'Register'

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
        title: 'Dashboard'
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },
      {
        path: "user-list",
        element: <UserList />,
        title: 'Collab Management'
      },
      {
        path: "class-list",
        element: <ClassList />,
        title: 'Certificate Management'

      },
      {
        path: "class-list/:id",
        element: <ViewClass />,
        title: 'Class Management'

      },
      {
        path: "post-list",
        element: <ViewPostList />,
        title: 'Post Management'
      },
      {
        path: "add-post",
        element: <AddNewPost />,
        title: 'Add Post'
      },
      {
        path: "registration-list",
        element: <ViewRegistration />,
        title: 'Registration Management'
      },
      {
        path: "contract-list",
        element: <ViewContract />,
        title: 'Contract Management'
      }
      ,
      {
        path: "add-contract",
        element: <AddContract />,
        title: 'Add Contract'

      }
      ,
      {
        path: "request-list",
        element: <ViewRequest />,
        title: 'Request Management'

      }
      ,
      {
        path: "map",
        element: <Map />
      }
    ],
  },
  {
    path: "administrator/dashboard",
    element: (
      <AuthGuardAdmin>
        <DashboardLayoutAdmin />
      </AuthGuardAdmin>
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
