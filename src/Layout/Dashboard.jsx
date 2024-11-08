import { CgAdd, CgLogOut } from "react-icons/cg";
import { FaBookmark, FaHome } from "react-icons/fa";
import { GiGymBag } from "react-icons/gi";
import { MdSettingsApplications } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";


const Dashboard = () => {
  const role = "club";
  return (
    <div>
      <div >
        <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12 border border-red-600">
          <div className="col-span-4 lg:col-span-3 bg-[#4D44B4]  w-[300px]  h-screen p-2">
            <ul className="menu space-y-5 mt-2 p-4 text-lg text-[#C1BBEB] ">
              {/* OCA navbar */}
              {role == "oca" && (
                <>
                  <li className="text-center text-4xl font-semibold text-white">
                    OCA
                  </li>
                  <li className="">
                    <NavLink to={"/dashboard"}>
                      <FaHome className="text-3xl"/>Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={"/dashboard/all-trainers"}>
                      <GiGymBag className="text-3xl" />{" "}
                      <span className="text-xl">All Trainers</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={"/dashboard/applied-trainers"}>
                      <MdSettingsApplications className="text-3xl" />{" "}
                      <span className="xl">Applied Trainers</span>
                    </NavLink>
                  </li>
                </>
              )}
              {/* CLUB Navbar */}
              {role == "club" && (
                <>
                  <li className="text-center text-4xl font-semibold text-white">
                    Club Panel
                  </li>
                  <li className="">
                    <NavLink to={"/dashboard"}>
                      <FaHome className="text-3xl" /> Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={"/dashboard/add-new-slot"}>
                      {" "}
                      <CgAdd className="text-3xl" />{" "}
                      <p className="text-xl">Add New Slot</p>{" "}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={"/dashboard/room_bookings"}>
                      {" "}
                      <FaBookmark className="text-3xl" />{" "}
                      <span className="text-x">Room-Booking</span>{" "}
                    </NavLink>
                  </li>
                </>
              )}

              <div className="divider "></div>

              <li>
                <NavLink to={"/"}>
                  <FaHome className="text-3xl" />
                  <span className="text-xl">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/"}>
                  <CgLogOut className="text-3xl" />
                  <span className="text-xl">Logout</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-span-4 lg:col-span-9 p-[50px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
