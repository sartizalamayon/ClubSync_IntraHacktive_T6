import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdNotificationsActive } from "react-icons/md";
import "../../index.css";

const Calendar = () => {
  const [acceptedEvents, setAcceptedEvents] = useState([]);
  console.log(acceptedEvents)
  useEffect(()=>{
    axios.get('http://localhost:3000/accepted-events')
     .then(res => setAcceptedEvents(res.data))
  },[])
  return (
    <div className="">
      {/* nav for this component */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Central Calendar</a>
        </div>
        <div className="flex-none gap-2">
          {/* <span className="p-3 bg-white rounded-3xl">
            <MdNotificationsActive />
          </span> */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW710hPlb48q-g88rWvxavK9XmOeFOXU1ZMA&s"
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
            
            weekends={true}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            events={acceptedEvents}
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
