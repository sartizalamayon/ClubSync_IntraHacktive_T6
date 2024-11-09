import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "axios";
import { MdNotificationsActive } from "react-icons/md";
import icon from "../../../public/arrow.ong.png";
import event from "../../../public/event.png";
import budget from "../../../public/cash.png";
import pass from "../../../public/icons8-pass-50.png";
import party from "../../../public/party.png";
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
              <div className="w-10 rounded-full ">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3  shadow-lg">
        <div className="col-span-2 m-2  relative ">
          {/* Background SVG */}
          <div className="relative">
            <svg
              width="full"
              height="140px"
              fill="none"
              // xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 0L997 0C1008.05 0 1017 8.95 1017 20L1017 140L0 140L0 20C0 8.95 8.95 0 20 0Z"
                fill="#4D44B5"
              />
            </svg>
          </div>

          {/* Profile image and name */}
          <div className="relative -mt-20 ml-2 flex items-center">
            <img
              className="rounded-full h-28 border"
              src={data.photo_url}
              alt="Profile"
            />
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-black">{data.name}</h1>
              <p className="text-xl font-bold ">{data.role}</p>
              <p className="text-lg font-bold">{data.email}</p>
            </div>
          </div>
          <div className="flex justify-center items-center pt-12 pb-6">
            <h1 className="text-4xl font-semibold">Upcoming Events</h1>
          </div>

          {/* Additional content below */}
          <div className="m-2 border  overflow-x-auto shadow-lg">
            <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-2 text-2xl font-semibold">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-2xl font-semibold">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-2xl font-semibold">
                    Organize By
                  </th>
                  <th scope="col" className="px-6 py-3 text-2xl font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className=" border-yellow-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >
                      <div className="flex items-center">
                        <img className="h-8" src={icon} alt="" />
                        {event.title}
                      </div>
                    </th>
                    <td className="px-6 py-4">{event.date}</td>
                    <td className="px-6 py-4">{event.clubMail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <section>
            {/* Analytics */}
            <div className="flex justify-between p-2 my-4 pt-12  shadow-lg">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-12 rounded-full">
                  <img src={event} alt="" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Total Event</h1>
                  <h1 className=" text-xl font-bold text-center">{events.length}</h1>
                </div>
              </div>
              <div className="flex justify-center items-center  space-x-2">
                <img className="h-12" src={budget} alt="" />
                <div>
                  <h1 className="text-xl font-bold">Total Budget</h1>
                  <h1 className=" text-xl font-bold text-center">99</h1>
                </div>
              </div>
              <div className="flex justify-center items-center  space-x-2">
                <img className="h-12 " src={pass} alt="" />
                <div>
                  <h1 className="text-xl font-bold">Total Gate Pass</h1>
                  <h1 className=" text-xl font-bold text-center">99</h1>
                </div>
              </div>
              <div className="flex justify-center items-center  space-x-2">
                <img className="h-12" src={party} alt="" />
                <div>
                  <h1 className="text-xl font-bold">Party</h1>
                  <h1 className=" text-xl font-bold text-center">2/4/2024</h1>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-1">
          <div className="">
            <h1 className="text-center text-4xl font-semibold">Announcement</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
