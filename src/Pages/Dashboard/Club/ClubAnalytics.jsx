import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { AuthContext } from "../../../Context/AuthProvider";
import useCurrUser from "../../../hooks/useCurrUser";

const ClubAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [currUser] = useCurrUser();
  // const [clubInfo, setClubInfo] = useState([]);
  // const [events, setEvents] = useState([]);

  // State for singleEvent, managed independently
  const [singleEvent, setSingleEvent] = useState([]);

  // Fetch club info with loading state
  const { data: clubInfo = [], isLoading: isClubInfoLoading } = useQuery({
    queryKey: ["clubInfo", user?.email],
    queryFn: () => axios.get(`https://clubsyncserver.vercel.app/dashboard-info/${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Fetch responded events with loading state
  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["respondedEvents", user?.email],
    queryFn: () => axios.get(`https://clubsyncserver.vercel.app/get-responded-events-accepted/${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Calculate total budget sum
  const totalBudgetSum = events.reduce((sum, event) => {
    // Convert the budget to an integer if it's a string, and add it to the sum
    const budget = typeof event.budget === 'string' ? parseInt(event.budget, 10) : event.budget;
    return sum + (isNaN(budget) ? 0 : budget); // Ensure the value is a valid number
  }, 0);
console.log(events);
  // Check if either data is loading
  if (isClubInfoLoading || isEventsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-[#4D44B5]"></span>
      </div>
    );
  }
 
  return (
    <div>
      {/* header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Club Activity</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2 rounded-full bg-white">
              <input type="text" className="grow " placeholder="Search" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
         
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={currUser?.photo_url}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* body part */}
      <div className="w-full mt-2 flex flex-col gap-4">
        {/* card like analytics */}
        <div className="flex gap-8">
          {/* card  1 */}
          <div className="p-8 bg-white rounded-2xl w-[270px] h-[120px] justify-center items-start flex flex-col">
            <div className="flex items-center gap-3">
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
              <div>
                <div className="text-sm text-[#A098AE]">Total Member</div>
                <div className="font-bold text-3xl text-[#303972]">{clubInfo.totalMembers}</div>
                <div className="text-sm opacity-50">{clubInfo.name}</div>
              </div>
            </div>
          </div>
          {/* card  2 */}
          <div className="p-8 bg-white rounded-2xl w-[270px] h-[120px] justify-center items-start flex flex-col">
            <div className="flex items-center gap-3">
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
              <div>
                <div className="text-sm text-[#A098AE]">Total Events</div>
                <div className="font-bold text-3xl text-[#303972]">
                  {events?.length}
                </div>
                {/* <div className="text-sm opacity-50">United States</div> */}
              </div>
            </div>
          </div>
          {/* card  3 */}
          <div className="p-8 bg-white rounded-2xl flex-1 h-[120px] justify-center items-start flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-14 w-14 rounded-full bg-[#FCC43E] text-center flex flex-col justify-center items-center">
                  <div className="ml-2 mt-2">
                    <svg
                      width="36.5811"
                      height="40"
                      viewBox="0 0 36.5811 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M34.52 21.84C32.28 21.03 29.79 21.21 27.69 22.33L24.27 23.87C23.99 22.3 22.78 21.11 21.28 21.06C21.27 21.06 16.14 21.01 16.14 21.01C12.04 19.88 9.37 21.33 7.85 22.75C7.54 23.04 7.26 23.34 7.02 23.64C6.61 23.2 5.89 23.08 5.36 23.37L0.7 25.93C0.1 26.26 -0.16 26.99 0.09 27.63L4.64 39.13C4.94 39.89 5.86 40.22 6.58 39.83L11.23 37.27C11.67 37.03 11.92 36.58 11.94 36.11L18.89 36.11C20.02 36.11 21.14 35.81 22.12 35.25C22.12 35.25 35.19 27.75 35.27 27.69C37.1 26.02 37.15 22.79 34.52 21.84ZM6.62 36.68L3.08 27.75L5.32 26.52L8.85 35.45L6.62 36.68ZM33.52 25.57L20.76 32.88C20.19 33.2 19.54 33.38 18.89 33.38L10.98 33.38L8.32 26.66C8.55 26.2 9 25.43 9.72 24.75C11.21 23.35 13.18 22.99 15.56 23.68C15.68 23.72 15.81 23.74 15.93 23.74L21.2 23.8C21.34 23.81 21.59 24.11 21.59 24.56C21.59 25.03 21.33 25.33 21.2 25.33L16.02 25.33L16.02 28.06L21.2 28.06C21.84 28.06 22.43 27.85 22.93 27.47L28.86 24.81C28.89 24.79 28.92 24.78 28.96 24.76C30.38 23.99 32.07 23.86 33.59 24.41C34.19 24.63 33.75 25.33 33.52 25.57ZM25.29 19.7C19.85 19.7 15.43 15.28 15.43 9.85C15.43 4.42 19.85 0 25.29 0C30.72 0 35.14 4.42 35.14 9.85C35.14 15.28 30.72 19.7 25.29 19.7ZM25.29 2.73C21.36 2.73 18.17 5.92 18.17 9.85C18.17 13.77 21.36 16.97 25.29 16.97C29.21 16.97 32.4 13.77 32.4 9.85C32.4 5.92 29.21 2.73 25.29 2.73Z"
                        fill="#FFFFFF"
                        fillOpacity="1"
                        fillRule="nonzero"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-center items-center">
                <div>
                  <div className="text-sm text-[#A098AE]">Received</div>
                  <div className="font-bold text-3xl text-[#303972]">
                    {totalBudgetSum}tk
                  </div>
                </div>
                <div>
                  <svg
                    width="100"
                    height="83"
                    viewBox="0 0 281 83"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        x1="140.5"
                        y1="0"
                        x2="140.5"
                        y2="83"
                        id="paint_linear_29_2_0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#4CBC9A" />
                        <stop offset="1" stopColor="#4CBC9A" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 54.32C17.41 54.32 25.78 31.28 46.75 29.84C65.96 28.52 74.32 72.22 93.5 70.67C115.28 68.91 119.12 31.47 140.73 28.57C159.16 26.1 168.85 39.97 187.49 39.97C211.14 39.97 214.49 3.43 234.24 0.19C252.21 -2.76 263.38 28.64 281 24.35L280.97 83L26.42 83L0 83L0 54.32Z"
                      fill="url(#paint_linear_29_2_0)"
                      fillOpacity="0.25"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-2xl text-[#303972]">
              {singleEvent.title}
            </h3>
            <div>
              <p className="py-4 text-lg text-[#A098AE]">
                {singleEvent.description}
              </p>
              <div className="flex gap-6">
                {/* left side */}
                <div>
                  <h1 className="text-2xl font-bold text-[#303972]">Details</h1>
                  <ul>
                    <li>
                      Budget:{" "}
                      {singleEvent.budget ? singleEvent.budget + " tk" : "N/A"}
                    </li>
                    <li>Room: {singleEvent.roomNumber}</li>
                    <li>Date: {singleEvent.date}</li>
                  </ul>
                </div>
                {/* right side */}
                <div>
                  <h1 className="text-2xl font-bold text-[#303972]">
                    Additional
                  </h1>
                  <ul>
                    <li>Budget Details: {singleEvent.budgetDetails}</li>
                    <li>Guest: {singleEvent.guestPassesCount}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </dialog>
        {/* events with engagement and budget */}
        <div className="overflow-x-auto p-8 rounded-xl bg-white h-full overflow-y-scroll">
          <h2 className="text-2xl font-bold text-[#303972]">Budget History</h2>
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row */}
              {events.map((event, idx) => (
                <tr key={event._id} className="hover">
                  <th>{idx + 1}</th>
                  <td
                    onClick={() => {
                      document.getElementById("my_modal_3").showModal();
                      setSingleEvent(event);
                    }}
                    className="text-lg font-semibold text-[#303972] hover:cursor-pointer"
                  >
                    {event.title}
                  </td>
                  <td className="text-lg font-semibold text-[#303972]">
                    {`${event.budget ? event.budget + " Bdt" : "N/A"}`}
                  </td>
                  <td className="text-base text-[#A098AE] flex gap-2 justify-center items-center">
                    <CiCalendarDate />
                    {event.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClubAnalytics;
