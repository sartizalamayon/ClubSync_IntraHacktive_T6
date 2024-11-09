import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "axios";
import Showing_Dashboard_Info from "./Showing_Dashboard_Info";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/dashboard-info/${user.email}`)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      });
  }, []);

  return (
    <div className="grid grid-cols-3 border border-red-600 min-h-screen">
      <div className="col-span-2 border border-yellow-800 m-2  relative">
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
          <img
            className=" rounded-full"
            src={data.photo_url}
            alt="Profile"
          />
          <div className="ml-4">
            <h1 className="text-5xl font-bold text-black">{data.name}</h1>
            <p className="text-3xl font-bold text-green-800">{data.role}</p>
            <p className="text-lg font-bold text-black">{data.email}</p>
          </div>
        </div>

        {/* Additional content below */}
        <div className="mt-4 p-4 border min-h-screen">
          <h1 className="text-xl font-semibold">jvbdsvbsud</h1>
        </div>
      </div>

      <div className="col-span-1 border border-green-700 m-4">
        <div>
          <h1>Event Comming</h1>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
