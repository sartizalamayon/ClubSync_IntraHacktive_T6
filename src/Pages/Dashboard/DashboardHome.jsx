import axios from "axios";
import { useContext } from "react";
import { MdNotificationsActive } from "react-icons/md";

import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import budget from "../../../public/cash.png";
import { AuthContext } from "../../Context/AuthProvider";
const DashboardHome = () => {
  const { user } = useContext(AuthContext);

  // Fetch club info
  const { data: data = [], isLoading: isClubInfoLoading } = useQuery({
    queryKey: ["clubInfo", user?.email],
    queryFn: () =>
      axios
        .get(`http://localhost:3000/dashboard-info/${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email, // Only run if user email is available
  });

  // Fetch responded events
  const { data: totalEvents = [], isLoading: isTotalEventsLoading } = useQuery({
    queryKey: ["respondedEvents", user?.email],
    queryFn: () =>
      axios
        .get(`http://localhost:3000/get-responded-events-accepted/${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Fetch all events
  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["dashboardEvents"],
    queryFn: () =>
      axios
        .get(`http://localhost:3000/dashboard-events`)
        .then((res) => res.data),
  });

  if (isClubInfoLoading || isTotalEventsLoading || isEventsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-[#4D44B5]"></span>
      </div>
    );
  }
  const totalBudgetSum = totalEvents.reduce((sum, event) => {
    // Check if budget is a string and convert to an integer, otherwise keep it as is
    const budget = typeof event.budget === 'string' ? parseInt(event.budget, 10) : event.budget;
    return sum + (isNaN(budget) ? 0 : budget); // Add to sum only if budget is a valid number
  }, 0);
  const totalGatePass = totalEvents.reduce((sum, event) => {
    return (
      sum +
      (typeof event.guestPassesCount === "number" ? event.guestPassesCount : 0)
    );
  }, 0);

  return (
    <>
      <div className="navbar p-0 mt-[-20px]">
        {/* header part */}
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Dashboard</a>
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
                <NavLink to={`/dashboard/club-info/${data._id}`}>
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={data.photo_url}
                  />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* header end */}
      <div className="flex gap-3">
        {/* left part */}
        <div className="w-[70%]">
          {/* Background SVG and name */}
          <div className="bg-white pb-3 rounded-b-2xl">
            <div className="relative">
              <svg className="flex-1 w-full rounded-r-2xl rounded-b-none h-[100px]">
                <path
                  d="M20 0L997 0C1008.05 0 1017 8.95 1017 20L1017 140L0 140L0 20C0 8.95 8.95 0 20 0Z"
                  fill="#4D44B5"
                />
              </svg>
            </div>

            {/* Profile image*/}
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              className="relative -mt-20 ml-5 flex items-center"
            >
              <img
                className="rounded-full h-28"
                src={data.photo_url}
                alt="Profile"
              />
              {/* <div className="ml-4">
              <h1 className="text-3xl font-bold text-[#303972]">{data.name}</h1>
              <p className="text-lg font-semibold ">{data.role}</p>
              <p className="text-lg font-semibold">{data.email}</p>
            </div> */}
            </div>
            {/* name and email */}
            <div className="ml-4 bg-white">
              <h1 className="text-3xl font-bold text-[#303972]">{data.name}</h1>
              <p className="text-lg font-semibold">{data.email}</p>
            </div>
          </div>
          {/* Analytics */}
          <div
            data-aos="fade-down"
            data-aos-duration="1000"
            className="flex justify-around items-center p-2 my-4  bg-white rounded-xl"
          >
            {/* card 1 */}
            <div className="flex justify-center items-center gap-2">
              <div>
                <div className="avatar">
                  <div className="mask mask-squircle h-14 w-14 rounded-full bg-[#FB7D5B] text-center flex flex-col justify-center items-center">
                    <div className="ml-[15px] mt-[14px]">
                      <svg
                        width="27.5"
                        height="27.5"
                        viewBox="0 0 27.5 27.5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23.75 2.5H21.25V1.25C21.25 0.91 21.11 0.6 20.88 0.36C20.64 0.13 20.33 0 20 0C19.66 0 19.35 0.13 19.11 0.36C18.88 0.6 18.75 0.91 18.75 1.25V2.5H15V1.25C15 0.91 14.86 0.6 14.63 0.36C14.39 0.13 14.08 0 13.75 0C13.41 0 13.1 0.13 12.86 0.36C12.63 0.6 12.5 0.91 12.5 1.25V2.5H8.75V1.25C8.75 0.91 8.61 0.6 8.38 0.36C8.14 0.13 7.83 0 7.5 0C7.16 0 6.85 0.13 6.61 0.36C6.38 0.6 6.25 0.91 6.25 1.25V2.5H3.75C2.75 2.5 1.8 2.89 1.09 3.59C0.39 4.3 0 5.25 0 6.25V23.75C0 24.74 0.39 25.69 1.09 26.4C1.8 27.1 2.75 27.5 3.75 27.5H23.75C24.74 27.5 25.69 27.1 26.4 26.4C27.1 25.69 27.5 24.74 27.5 23.75V6.25C27.5 5.25 27.1 4.3 26.4 3.59C25.69 2.89 24.74 2.5 23.75 2.5ZM2.5 6.25C2.5 5.91 2.63 5.6 2.86 5.36C3.1 5.13 3.41 5 3.75 5H6.25V6.25C6.25 6.58 6.38 6.89 6.61 7.13C6.85 7.36 7.16 7.5 7.5 7.5C7.83 7.5 8.14 7.36 8.38 7.13C8.61 6.89 8.75 6.58 8.75 6.25V5H12.5V6.25C12.5 6.58 12.63 6.89 12.86 7.13C13.1 7.36 13.41 7.5 13.75 7.5C14.08 7.5 14.39 7.36 14.63 7.13C14.86 6.89 15 6.58 15 6.25V5H18.75V6.25C18.75 6.58 18.88 6.89 19.11 7.13C19.35 7.36 19.66 7.5 20 7.5C20.33 7.5 20.64 7.36 20.88 7.13C21.11 6.89 21.25 6.58 21.25 6.25V5H23.75C24.08 5 24.39 5.13 24.63 5.36C24.86 5.6 25 5.91 25 6.25V10H2.5V6.25ZM25 23.75C25 24.08 24.86 24.39 24.63 24.63C24.39 24.86 24.08 25 23.75 25H3.75C3.41 25 3.1 24.86 2.86 24.63C2.63 24.39 2.5 24.08 2.5 23.75V12.5H25V23.75Z"
                          fill="#FFFFFF"
                          fillOpacity="1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[#303972] flex flex-col justify-center items-center">
                <small className="text-sm font-normal">Events</small>
                <small className="text-4xl font-bold text-center">
                  {totalEvents && totalEvents?.length}
                </small>
              </div>
            </div>
            {/* card 2 */}
            <div className="flex justify-center items-center">
              <div className="w-[70px] h-[70px]">
                <img className="" src={budget} alt="" />
              </div>
              <div className="text-[#303972]">
                <h1 className="text-lg font-normal">Budget</h1>
                <h1 className=" text-4xl font-bold text-center">
                  {totalBudgetSum}
                </h1>
              </div>
            </div>
            {/* card 3 */}
            <div className="flex justify-center items-center gap-2">
              <div>
                <div className="avatar">
                  <div className="mask mask-squircle h-14 w-14 rounded-full bg-[#4D44B5] text-center flex flex-col justify-center items-center">
                    <div className="ml-3 mt-2">
                      <svg
                        width="30"
                        height="37.5"
                        viewBox="0 0 30 37.5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.92 37.5L3.75 37.5C1.67 37.5 0 35.82 0 33.75L0 23.33C0 21.52 1.29 19.97 3.07 19.64C5.72 19.16 10.27 18.33 12.85 17.87C14.27 17.61 15.72 17.61 17.14 17.87C19.72 18.33 24.27 19.16 26.92 19.64C28.7 19.97 30 21.52 30 23.33C30 26.06 30 30.83 30 33.75C30 35.82 28.32 37.5 26.25 37.5L12.92 37.5ZM24.78 21.8L24.79 21.8C25 22.13 25.05 22.54 24.92 22.91L24.04 25.41C23.93 25.74 23.68 26 23.36 26.14L21.7 26.87L22.36 28.19C22.55 28.56 22.54 28.99 22.34 29.35L19.2 35L26.25 35C26.94 35 27.5 34.43 27.5 33.75C27.5 30.83 27.5 26.06 27.5 23.33C27.5 22.73 27.06 22.21 26.47 22.1L24.78 21.8ZM21.36 21.17L16.69 20.32C15.57 20.12 14.42 20.12 13.3 20.32L8.63 21.17L7.63 22.67L8.12 24.07L10.5 25.1C10.81 25.24 11.05 25.5 11.17 25.82C11.29 26.14 11.27 26.5 11.11 26.8L10.16 28.71L13.65 35L16.34 35L19.83 28.71L18.88 26.8C18.72 26.5 18.7 26.14 18.82 25.82C18.94 25.5 19.18 25.24 19.5 25.1L21.87 24.07L22.36 22.67L21.36 21.17ZM5.21 21.8L3.52 22.1C2.93 22.21 2.5 22.73 2.5 23.33L2.5 33.75C2.5 34.43 3.05 35 3.75 35L10.79 35L7.65 29.35C7.45 28.99 7.44 28.56 7.63 28.19L8.29 26.87L6.63 26.14C6.31 26 6.06 25.74 5.95 25.41L5.07 22.91C4.94 22.54 4.99 22.13 5.2 21.8L5.21 21.8ZM23.75 28.75L23.75 31.25C23.75 31.94 24.3 32.5 25 32.5C25.69 32.5 26.25 31.94 26.25 31.25L26.25 28.75C26.25 28.06 25.69 27.5 25 27.5C24.3 27.5 23.75 28.06 23.75 28.75ZM15 0C10.51 0 6.87 3.64 6.87 8.12C6.87 12.6 10.51 16.25 15 16.25C19.48 16.25 23.12 12.6 23.12 8.12C23.12 3.64 19.48 0 15 0ZM15 2.5C18.1 2.5 20.62 5.02 20.62 8.12C20.62 11.23 18.1 13.75 15 13.75C11.89 13.75 9.37 11.23 9.37 8.12C9.37 5.02 11.89 2.5 15 2.5Z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[#303972]">
                <h1 className="text-lg font-normal">Gate Pass</h1>
                <h1 className=" text-4xl font-bold text-center">
                  {totalGatePass}
                </h1>
              </div>
            </div>
          </div>
          {/* upcomming events */}
          <div>
            <h1 className="text-2xl font-bold text-[#303972]">
              Upcoming Events
            </h1>
            <div className=" w-full mt-2">
              <table className="table bg-white">
                <thead className="">
                  <th></th>
                  <th></th>
                  <th></th>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <th
                        scope="row"
                        className=" font-medium flex items-center text-[#303972] text-lg text-wrap"
                      >
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
                      </th>
                      <td className="text-[20px] text-wrap">{event.date}</td>
                      <td className=" text-lg font-semibold text-[#303972]">
                        {event?.clubMail?.split("@")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* announcement */}
        <div className="w-[30%] bg-white rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold text-[#303972] text-center  rounded-2xl mt-3">
              Announcements
            </h1>
          </div>
          <div className="bg-white rounded-xl m-4">
            <ul className="timeline timeline-vertical">
              <li>
                <div className="timeline-start">1984</div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">
                  First Macintosh computer
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-start">1998</div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">iMac</div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-start">2001</div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">iPod</div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-start">2007</div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">iPhone</div>
                <hr />
              </li>
              <li>
                <hr />
                <div className="timeline-start">2015</div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box">Apple Watch</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
