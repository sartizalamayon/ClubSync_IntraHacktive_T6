import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/accepted-events')
      .then((res) => {
        setEvents(res.data);
        
        console.log(res.data);
        // Calculate upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = res.data
          .filter(event => new Date(event?.date) >= today)
          .slice(0, 3);

        setUpcomingEvents(upcoming);
      })
      .catch(error => console.error('Error fetching events:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    return (
      <div className="px-2 py-1">
        <div className="font-medium text-xs truncate">
          {event?.title}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] font-medium">
            {event?.extendedProps?.club}
          </span>
          {event?.extendedProps?.room && (
            <span className="text-[10px] bg-white/20 px-1 rounded">
              {event?.extendedProps?.room}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[rgb(240,241,255)]">
      {/* Header - remains same */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#303972]">Central Calendar</h1>
        </div>
        <div className="flex-none gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 w-64 rounded-xl bg-white border-2 border-[#4c44b3] border-opacity-30 
                       focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent"
            />
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c44b3] h-5 w-5" />
          </div>
          
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 mt-4">
        {/* Calendar Section */}
        <div className="w-[70%] bg-white rounded-xl shadow-sm p-6">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth'
            }}
            events={events}
            eventContent={renderEventContent}
            eventClassNames={[
              'bg-[#4d44b5]',
              'border-0',
              'rounded-md',
              'shadow-sm'
            ]}
            dayMaxEvents={true}
            eventDisplay="block"
            height="auto"
            dayHeaderFormat={{ weekday: 'short' }}
            firstDay={0}
            dayCellClassNames={info => ({
              'bg-[#fb7d5b]/5 !rounded-lg': info.isToday
            })}
          />
        </div>

        {/* Sidebar */}
        <div className="w-[30%] space-y-4">
          {/* Legend Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-[#363B64] mb-4">Event Indicators</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-md bg-[#4d44b5]"></div>
                <span>Scheduled Events</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-md bg-[#FB7D5B]"></div>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-[#363B64] mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#4d44b5] rounded-lg">
                        <BsCalendarEvent className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#303972]">{event?.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {formatDate(event?.date)}
                          </span>
                          {event?.extendedProps?.room && (
                            <span className="text-xs px-2 py-0.5 bg-[#4d44b5]/10 text-[#4d44b3] rounded">
                              {event?.extendedProps?.room}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#4d44b3] font-medium mt-1">
                          {event?.extendedProps?.club}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;