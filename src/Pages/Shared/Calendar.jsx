import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { MdNotificationsActive } from "react-icons/md";
import "../../index.css";

const Calendar = () => {
  const handleDateClick = (info) => {
    alert(info);
  };
  return (
    <div className="">
      {/* nav for this component */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Central Calendar</a>
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
      <div className="flex gap-[30px] mt-[-12px]">
        {/* calender */}
        <div className="w-[70%] h-full mt-5 bg-[#FFFFFF] p-10 rounded-lg">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            dateClick={(dateInfo) => handleDateClick(dateInfo)}
            weekends={true}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            events={[
              { title: "BUCC", date: "2024-11-01" },
              { title: "BUEDF", date: "2024-11-01" },
            ]}
          />
        </div>
        {/* notice */}
        <div className="w-[30%] mt-5 gap-3 flex flex-col">
            {/* heading */}
          <div>
            <h1 className="bg-white p-10 text-center text-2xl font-bold rounded-2xl text-[#363B64]">Our Events</h1>
          </div>
          <div>
            <h1 className="bg-white p-10 text-center text-2xl font-bold rounded-2xl border-l-[30px] border-orange-500 text-[#363B64]">Pending Events</h1>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Calendar;
