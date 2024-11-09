import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import Root from "../Layout/Root";
import EventPlanner from "../Pages/ClubPages/EventPlanner/EventPlanner";
import Chat from "../Pages/Dashboard/Club/Chat";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Approval from "../Pages/Dashboard/OCA/Approval";
import ChatWithClub from "../Pages/Dashboard/OCA/ChatWithClub";
import ClubInfo from "../Pages/Dashboard/OCA/ClubInfo";
import OcaChat from "../Pages/Dashboard/OCA/OcaChat";
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
      {
        path: '/dashboard/event-planner',
        element: <PrivateRoute><EventPlanner/></PrivateRoute>
      }
      ,
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
      // chat routes
      {
        path: '/dashboard/oca-chat',
        element: <PrivateRoute><OcaChat/></PrivateRoute>,
        children: [{
          path: '/dashboard/oca-chat',
          element: <ChatWithClub/>
        },
        {
          path: '/dashboard/oca-chat/:email',
          element: <ChatWithClub/>
        }
      ]
      },
      // shared
      {
        path: '/dashboard/calendar',
        element: <PrivateRoute><Calendar/></PrivateRoute>
      }
      
    ]
  }
]);
