import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BsCalendarEvent } from "react-icons/bs";
import auth from "../../Firebase/Firebase.config";

const Calendar = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["acceptedEvents"],
    queryFn: () =>
      axios.get("http://localhost:3000/accepted-events").then((res) => res.data),
  });

  // Calculate upcoming events after data is fetched
  const upcomingEvents = events
    .filter(event => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(event?.date) >= today;
    })
    .slice(0, 3);

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

  // Display loading indicator if data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-[#4D44B5]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(240,241,255)]">
      {/* Header - remains same */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <h1 className="text-[1.62rem] font-bold text-[#303972]">Central Calendar</h1>
        </div>
        <div className="flex-none gap-4">
          
          
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW710hPlb48q-g88rWvxavK9XmOeFOXU1ZMA&s"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 mt-4">
  {/* Calendar Section */}
  <div className="w-[70%] bg-white rounded-xl shadow-sm p-4">
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
  <div className="w-[30%] space-y-3">
    {/* Legend Card */}
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-[#363B64] mb-3">Event Indicators</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-md bg-[#4d44b5]"></div>
          <span className="text-sm">Scheduled Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-md bg-[#FB7D5B]"></div>
          <span className="text-sm">Today</span>
        </div>
      </div>
    </div>

    {/* Upcoming Events Card */}
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-[#363B64] mb-3">Upcoming Events</h2>
      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className="p-1 bg-[#4d44b5] rounded-lg">
                  <BsCalendarEvent className="text-white text-xs" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#303972] text-sm">{event?.title}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {formatDate(event?.date)}
                    </span>
                    {event?.extendedProps?.room && (
                      <span className="text-xs px-1 py-0.5 bg-[#4d44b5]/10 text-[#4d44b3] rounded">
                        {event?.extendedProps?.room}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4d44b3] font-medium mt-0.5">
                    {event?.extendedProps?.club}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-3 text-sm">No upcoming events</p>
        )}
      </div>
    </div>
  </div>
</div>

      
    </div>
  );
};

export default Calendar;