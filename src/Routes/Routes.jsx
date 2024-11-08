import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Root from "../Layout/Root";
import Dashboard from "../Layout/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Login from "../Pages/Login/Login";
import EventPlanner from "../Pages/ClubPages/EventPlanner/EventPlanner";

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
    path: 'dashboard',
    element: <PrivateRoute><Dashboard/></PrivateRoute>,
    children: [
      {
        path: '/dashboard',
        element: <PrivateRoute><DashboardHome/></PrivateRoute>
      },
      {
        path: '/dashboard/event-planner',
        element: <PrivateRoute><EventPlanner/></PrivateRoute>
      }
      
      // Club dashboard
      
      // OCA dashboard
      
      // admin dashboard
      
    ]
  }
]);
