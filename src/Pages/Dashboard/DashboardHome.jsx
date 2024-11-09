import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "axios";
import { MdNotificationsActive } from "react-icons/md";
import icon from "../../../public/arrow.ong.png";
import event from "../../../public/event.png";
import budget from "../../../public/cash.png";
import pass from "../../../public/icons8-pass-50.png";
import party from "../../../public/party.png";
import qut from "../../../public/quat.png";
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
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className="relative -mt-4 ml-2 flex items-center"
          >
            <img
              className="rounded-full h-28"
              src={data.photo_url}
              alt="Profile"
            />
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-[#303972]">{data.name}</h1>
              <p className="text-lg font-semibold ">{data.role}</p>
              <p className="text-lg font-semibold">{data.email}</p>
            </div>
          </div>
          {/* Additional content below */}
          <section>
            {/* Analytics */}
            <div
              data-aos="fade-down"
              data-aos-duration="1000"
              className="flex justify-around p-2 my-4 pt-12  shadow-lg"
            >
              <div className="flex justify-center items-center ">
                <div className="w-[70px] h-[70px]">
                  <img src={event} alt="" />
                </div>
                <div className="text-[#303972] pl-2">
                  <h1 className="text-lg font-normal ">Total Event</h1>
                  <h1 className=" text-4xl font-bold text-center">
                    {events.length}
                  </h1>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="w-[70px] h-[70px]">
                  <img className="" src={budget} alt="" />
                </div>
                <div className="text-[#303972]">
                  <h1 className="text-lg font-normal">Total Budget</h1>
                  <h1 className=" text-4xl font-bold text-center">99</h1>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="h-[80px]">
                  <img src={pass} alt="" />
                </div>
                <div className="text-[#303972]">
                  <h1 className="text-lg font-normal">Total Gate Pass</h1>
                  <h1 className=" text-4xl font-bold text-center">77</h1>
                </div>
              </div>
              <div className="flex justify-center items-center ">
                <div className="w-[70px] h-[70px]">
                  <img src={party} alt="" />
                </div>
                <div className="text-[#303972] pl-2">
                  <h1 className="text-lg font-normal ">Total Party</h1>
                  <h1 className=" text-4xl font-bold text-center">
                    66
                  </h1>
                </div>
              </div>
            </div>
          </section>
          <div className="flex items-center pt-8 pb-6">
            <h1 className="text-2xl font-bold text-[#303972]">
              Upcoming Events
            </h1>
          </div>
          <div className="m-2overflow-x-auto shadow-lg  ">
            <table
              data-aos="fade-up"
              data-aos-duration="1000"
              className="w-full  text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 "></thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <th
                      scope="row"
                      className="px-3 py-3 font-medium whitespace-nowrap"
                    >
                      <div className="flex items-center text-[#303972] text-lg">
                        <svg
                          className="mr-2"
                          width="32"
                          height="32"
                          viewBox="0 0 56 56"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            id="bg"
                            rx="28"
                            width="56"
                            height="56"
                            fill="#FF4550"
                          />
                          <rect
                            id="trending"
                            rx="0"
                            width="31"
                            height="31"
                            transform="translate(12.5 12.5)"
                            fill="#FFFFFF"
                            fillOpacity="0"
                          />
                          <g clipPath="url(#clip36_1307)">
                            <g opacity="0">
                              <path
                                id="Vector"
                                d="M12 44L12 12L44 12L44 44L12 44Z"
                                fill="#FFFFFF"
                                fillOpacity="1"
                                fillRule="evenodd"
                              />
                            </g>
                            <path
                              id="Vector"
                              d="M40 21.33C40.01 21.24 40.01 21.14 40 21.05C39.98 20.97 39.96 20.89 39.93 20.82C39.89 20.76 39.85 20.69 39.81 20.64C39.76 20.55 39.7 20.47 39.62 20.41L39.46 20.32C39.38 20.26 39.3 20.21 39.21 20.18L38.94 20.18C38.86 20.1 38.77 20.04 38.66 20L32 20C31.64 20 31.3 20.14 31.05 20.39C30.8 20.64 30.66 20.97 30.66 21.33C30.66 21.68 30.8 22.02 31.05 22.27C31.3 22.52 31.64 22.66 32 22.66L35.77 22.66L30.44 28.94L24.68 25.52C24.4 25.35 24.08 25.29 23.77 25.35C23.46 25.4 23.17 25.56 22.97 25.81L16.3 33.81C16.19 33.94 16.11 34.1 16.05 34.27C16 34.43 15.98 34.61 16 34.78C16.01 34.96 16.07 35.13 16.15 35.28C16.23 35.44 16.34 35.58 16.48 35.69C16.72 35.89 17.02 36 17.33 36C17.52 36 17.72 35.95 17.9 35.87C18.07 35.79 18.23 35.67 18.36 35.52L24.29 28.4L29.98 31.81C30.25 31.97 30.57 32.03 30.88 31.98C31.19 31.93 31.47 31.77 31.68 31.53L37.33 24.93L37.33 28C37.33 28.35 37.47 28.69 37.72 28.94C37.97 29.19 38.31 29.33 38.66 29.33C39.02 29.33 39.35 29.19 39.61 28.94C39.86 28.69 40 28.35 40 28L40 21.33Z"
                              fill="#FFFFFF"
                              fillOpacity="1"
                              fillRule="nonzero"
                            />
                          </g>
                        </svg>
                        {event.title}
                      </div>
                    </th>
                    <td className="px-2 py-2">{event.date}</td>
                    <td className="px-2 py-2 text-lg font-semibold text-[#303972]">
                      {event.clubMail}
                    </td>
                    <td className="px-2 py-2 text-lg font-semibold">
                      {event.roomNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-duration="1000" className="col-span-1">
          <div>
            <h1 className="text-2xl font-bold text-[#303972]">Announcement</h1>
          </div>
          <div className="shadow-lg m-4 p-4">
            <img className="h-10" src={qut} alt="" />
            <h1 className="p-2 text-sm font-normal">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam,
              rem? Blanditiis quod suscipit nobis sapiente doloribus similique
              facere eum neque.
            </h1>
            <div className="flex items-center">
              <img className="h-12" src={data.photo_url} alt="" />
              <div>
                <h1 className="text-lg font-semibold text-[#303972]">
                  {data.name}
                </h1>
                <h1 className="text-center text-sm font-normal">04/06/2024</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
