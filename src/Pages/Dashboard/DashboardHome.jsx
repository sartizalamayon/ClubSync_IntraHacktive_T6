import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "axios";
import { MdNotificationsActive } from "react-icons/md";
import Dashboard_Analytics from "./Dashboard_Analytics";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/dashboard-info/${user.email}`)
      .then((res) => {
        setData(res.data);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:3000/dashboard-events`).then((res) => {
      setEvents(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <>
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Dashboard Panel</a>
        </div>
        <div className="flex-none gap-2">
          <span className="p-3 bg-white rounded-3xl">
            <MdNotificationsActive />
          </span>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 min-h-screen border">
        <div className="col-span-2 m-2  relative">
          {/* Background SVG */}
          <div className="relative">
            <svg
              width="full"
              height="140px"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 0L997 0C1008.05 0 1017 8.95 1017 20L1017 140L0 140L0 20C0 8.95 8.95 0 20 0Z"
                fill="#428777"
              />
            </svg>
          </div>

          {/* Profile image and name */}
          <div className="relative -mt-12 ml-2 flex items-center rounded-full">
            <img className=" rounded-full" src={data.photo_url} alt="Profile" />
            <div className="ml-4">
              <h1 className="text-5xl font-bold text-black">{data.name}</h1>
              <p className="text-3xl font-bold text-green-800">{data.role}</p>
              <p className="text-lg font-bold text-black">{data.email}</p>
            </div>
          </div>

          {/* Additional content below */}
          <div className="m-2 border flex border-red-900">
            {events.map((i) => {
              return <Dashboard_Analytics key={i._id} analytics={i} />;
            })}
          </div>
        </div>

        <div className="col-span-1 border border-green-700 m-4">
          <div>
            <h1>Notice Board Comming</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
