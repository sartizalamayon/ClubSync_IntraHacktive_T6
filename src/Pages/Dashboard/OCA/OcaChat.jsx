import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdNotificationsActive } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";


const OcaChat = () => {
  const [club, setClubs] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/get-club-list")
      .then((response) => setClubs(response.data));
  }, []);
  const clubsOnly = club?.filter((user) => user.name !== "OCA");
  return (
    <div>
      {/* header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Chat</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2 rounded-full">
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
      {/* header end */}
      <div className="flex">
        <div className="w-[300px] p-7 bg-white rounded-lg">
          <p className="text-xl font-bold text-[#303972] text-left">Messages</p>
          {/* search input */}
          <div className="py-6">
            <label className="input input-bordered flex items-center gap-2 border border-[#A098AE] rounded-3xl h-10">
              <input type="text" className="grow" placeholder="Search" />
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
          {/* chat list */}
          <div className="h-[300px] overflow-y-auto overflow-x-hidden flex flex-col gap-3">
            {/* indivisual chats */}
            {clubsOnly.map((club) => (
              <NavLink key={club._id} to={`/dashboard/oca-chat/${club.email}`}>
                <div className="flex items-center justify-between gap-5">
                  {/* chat pic */}
                  <div className="flex items-center gap-3">
                    <div className="avatar ">
                      <div className="mask mask-squircle h-12 w-12 rounded-full">
                        <img
                          src={club.photo_url}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#303972] text-base">
                        {club.name}
                      </div>
                      <div className="text-sm text-[#A098AE] opacity-50">
                       {club.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-sm text-[#A098AE]">time</div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OcaChat;
