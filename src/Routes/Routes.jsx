import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import Root from "../Layout/Root";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Calendar from "../Pages/Shared/Calendar";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <p>Error</p>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login/>,
      }
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><Dashboard/></PrivateRoute>,
    children: [
      {
        path: '/dashboard',
        element: <PrivateRoute><DashboardHome/></PrivateRoute>
      },
      
      // Club dashboard
      
      // OCA dashboard
      
      // shared
      {
        path: '/dashboard/calendar',
        element: <PrivateRoute><Calendar/></PrivateRoute>
      }
      
    ]
  }
]);
