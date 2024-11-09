import { CgEventbrite, CgLogOut } from "react-icons/cg";
import { FaCalendar, FaHome } from "react-icons/fa";
import { MdAnalytics, MdChat, MdEvent } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";

import { useContext } from "react";
import { BiCalendar, BiChat } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import { AuthContext } from "../Context/AuthProvider";
import './Dash.css';

const Dashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const role = user?.email === 'oca@bracu.ac.bd' ? 'oca' : 'club';
  const email = user?.email;
  const username = email.split('@')[0];
  const uppercaseUsername = username.toUpperCase();



  return (
    <div>
      <div className="flex">
        <div className="bg-[#4D44B4] w-[250px] min-h-screen">
          <ul className="menu pr-0 space-y-5 mt-2 p-4 text-base text-[#C1BBEB] font-medium">
            {/* OCA navbar */}
            {role === "oca" && (
              <>
                <li className="text-center text-4xl font-semibold text-white">
                  OCA
                </li>
                <li>
                  <NavLink to={"/dashboard"}>
                    <FaHome className="text-3xl" />
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/approval"}>
                    <CgEventbrite className="text-2xl" />
                    <span className="text-xl">Approval</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/calendar"}>
                    <BiCalendar className="text-3xl" />
                    <span className="text-xl">Calendar</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/club-info"}>
                    <BsInfo className="text-4xl" />
                    <span className="text-xl">Club Info</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/oca-chat"}>
                    <BiChat className="text-3xl" />
                    <span className="text-xl">Chat</span>
                  </NavLink>
                </li>
              </>
            )}
            {/* CLUB Navbar */}
            {role === "club" && (
              <>
                <li className="text-center text-4xl font-semibold text-white">
                  {uppercaseUsername}
                </li>
                <li>
                  <NavLink to={"/dashboard"}>
                    <FaHome className="text-3xl" />
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/event-planner"}>
                    <MdEvent className="text-3xl" />
                    <span className="text-xl">Event Planner</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/calendar"}>
                    <FaCalendar className="text-3xl" />
                    <span className="text-xl">Calendar</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/analytics"}>
                    <MdAnalytics className="text-3xl" />
                    <span className="text-xl">Analytics</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/chat"}>
                    <MdChat className="text-3xl" />
                    <span className="text-xl">Chat</span>
                  </NavLink>
                </li>
              </>
            )}

            <div className="divider"></div>

            <li>
              <NavLink to={"/"}>
                <FaHome className="text-3xl" />
                <span className="text-xl">Home</span>
              </NavLink>
            </li>
            <li onClick={() => logOut()}>
              <NavLink to={"/"}>
                <CgLogOut className="text-3xl" />
                <span className="text-xl">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="p-[30px] bg-[rgb(243,244,255)] w-full">
          <div className="w-full  min-h-screen bg-[#F3F4FF]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
