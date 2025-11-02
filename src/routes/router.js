import { createBrowserRouter } from "react-router";

import RootLayout from "../layouts/RootLayout";
import rootLayoutLoader from "../pages/Dashboard/Loader/rootLayoutLoader";
import Dashboard from "../pages/Dashboard/Dashboard";
import dashboardLoader from "../pages/Dashboard/Loader/dashboardLoader";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import loginPostAction from "../pages/Login/Actions/postAction";
import UserManagement from "../pages/UserManagement/UserManagement";
import userManagementLoader from "../pages/UserManagement/Loader/userManagementLoader";
import { addUserAction } from "../pages/UserManagement/Actions/addUserAction";
import EndUserDashboard from "../pages/EndUser/EndUserDashboard";
import { endUserDashboardLoader } from "../pages/EndUser/Loader/endUserDashboardLoader";
import { createTicketAction } from "../pages/EndUser/Actions/createTicketAction";

export const router = createBrowserRouter([
  {
    path: "/end-user-dashboard",
    Component: EndUserDashboard,
    action: createTicketAction,
    loader: endUserDashboardLoader,
    // shouldRevalidate: () => false
  },
  {
    path: "/",
    Component: Login,
    action: loginPostAction,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    id: 'root',
    path: "/dashboard",
    Component: RootLayout,
    loader: rootLayoutLoader, // uncomment this when commiting
    children: [
      {
        index: true,
        Component: Dashboard,
        loader: dashboardLoader,
      },
      {
        path: "user-management",
        Component: UserManagement,
        loader: userManagementLoader,
        action: addUserAction,
      },
    ],
  },
]);
