import React from "react";
import { BsEye } from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";

const Approval = () => {
  return (
    <div>
      {/* header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Approval Request</a>
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
      <div className="bg-white p-8 rounded-xl mt-2">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead className="text-[12px] font-semibold text-[#303972]">
              <tr>
                <th></th>
                <th>Title</th>
                <th>Club</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td className="text-lg font-semibold text-[#303972]">
                  Cy Ganderton
                </td>
                <td>Quality Control Specialist</td>
                <td className="text-sm font-normal text-[#A098AE]">
                  25-11-2024
                </td>
                <td>
                  <button className="btn bg-[#FB7D5B] rounded-xl text-white font-normal">
                    <BsEye />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Approval;
