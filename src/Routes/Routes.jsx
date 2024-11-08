import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import Root from "../Layout/Root";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import EventPlanner from "../Pages/ClubPages/EventPlanner/EventPlanner";
import Calendar from "../Pages/Shared/Calendar";
import PrivateRoute from "./PrivateRoute";
import Approval from "../Pages/Dashboard/OCA/Approval";
import ClubInfo from "../Pages/Dashboard/OCA/ClubInfo";
import Chat from "../Pages/Dashboard/Club/Chat";

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
      {
        path: '/dashboard/event-planner',
        element: <PrivateRoute><EventPlanner/></PrivateRoute>
      }
      
      // Club dashboard
      {
        path: '/dashboard/chat',
        element: <PrivateRoute><Chat/></PrivateRoute>
      },
      // OCA dashboard
      {
        path: '/dashboard/approval',
        element: <PrivateRoute><Approval/></PrivateRoute>
      },
      {
        path: '/dashboard/club-info',
        element: <PrivateRoute><ClubInfo/></PrivateRoute>
      },
      // shared
      {
        path: '/dashboard/calendar',
        element: <PrivateRoute><Calendar/></PrivateRoute>
      }
      
    ]
  }
]);
