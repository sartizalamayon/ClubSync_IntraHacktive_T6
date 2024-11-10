<<<<<<< Updated upstream
import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { MdNotificationsActive, MdPeople, MdEvent } from 'react-icons/md';
import { BsCurrencyDollar, BsCalendarEvent } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import Announcements from '../Shared/Announcement';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthProvider';
import useAllClubs from '../../hooks/useAllClubs';
import useAllEvents from '../../hooks/useAllEvents';
import useCurrUser from '../../hooks/useCurrUser';
=======
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsCalendarEvent, BsCurrencyDollar } from "react-icons/bs";
import { MdEvent, MdPeople } from "react-icons/md";
import { NavLink } from "react-router-dom";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AuthContext } from "../../Context/AuthProvider";
import useAllClubs from "../../hooks/useAllClubs";
import useAllEvents from "../../hooks/useAllEvents";
import useCurrUser from "../../hooks/useCurrUser";
import FullCalendar from "@fullcalendar/react";

// No duplicated imports or hooks now
>>>>>>> Stashed changes

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [allClubs] = useAllClubs();
  const [allEvents] = useAllEvents();
  const [data, setData] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    eventStats: [],
    budgetDistribution: [],
    clubStats: {
      totalClubs: 0,
      activeClubs: 0,
      totalEvents: 0,
      totalBudget: 0,
      currentMonth: {
        budget: 0,
        events: 0,
        guestPasses: 0,
      },
      averages: {
        budgetPerEvent: 0,
        eventsPerClub: 0,
      },
    },
  });

  const [currUser] = useCurrUser();
  const isOCA = currUser?.role === "oca";

  // Fetch user/club data
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:3000/dashboard-info/${user.email}`)
        .then((res) => setData(res.data))
        .catch((err) => console.error("Error fetching dashboard info:", err));
    }
  }, [user?.email]);

  // Fetch and process upcoming events
  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard-events")
      .then((res) => {
        const sortedEvents = res.data
          .filter((event) => new Date(event.date) >= new Date()) // Only future events
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5); // Only show next 5 events
        setUpcomingEvents(sortedEvents);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Process analytics data
  useEffect(() => {
    if (allEvents && allClubs) {
      try {
        const eventsByMonth = allEvents.reduce((acc, event) => {
          const month = new Date(event.date).toLocaleString("default", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const budgetByClub = allEvents.reduce((acc, event) => {
          if (event.budget) {
            const clubName = event?.clubMail?.split("@")[0].toUpperCase();
            acc[clubName] = (acc[clubName] || 0) + Number(event.budget);
          }
          return acc;
        }, {});

        const clubEventCounts = allEvents.reduce((acc, event) => {
          const clubEmail = event.clubMail;
          acc[clubEmail] = (acc[clubEmail] || 0) + 1;
          return acc;
        }, {});

        const mostActiveClub = Object.entries(clubEventCounts).sort(
          ([, a], [, b]) => b - a
        )[0];

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const currentMonthStats = allEvents.reduce(
          (stats, event) => {
            const eventDate = new Date(event.date);
            if (
              eventDate.getMonth() === currentMonth &&
              eventDate.getFullYear() === currentYear
            ) {
              stats.eventCount++;
              if (event.budget) stats.budget += Number(event.budget);
              if (event.guestPassesCount)
                stats.guestPasses += Number(event.guestPassesCount);
            }
            return stats;
          },
          { eventCount: 0, budget: 0, guestPasses: 0 }
        );

        const lastMonthStats = allEvents.reduce(
          (stats, event) => {
            const eventDate = new Date(event.date);
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const yearToCheck =
              currentMonth === 0 ? currentYear - 1 : currentYear;

            if (
              eventDate.getMonth() === lastMonth &&
              eventDate.getFullYear() === yearToCheck
            ) {
              stats.eventCount++;
              if (event.budget) stats.budget += Number(event.budget);
              if (event.guestPassesCount)
                stats.guestPasses += Number(event.guestPassesCount);
            }
            return stats;
          },
          { eventCount: 0, budget: 0, guestPasses: 0 }
        );

        const calculateTrend = (current, previous) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return ((current - previous) / previous) * 100;
        };

        const trends = {
          events: calculateTrend(
            currentMonthStats.eventCount,
            lastMonthStats.eventCount
          ),
          budget: calculateTrend(
            currentMonthStats.budget,
            lastMonthStats.budget
          ),
          guestPasses: calculateTrend(
            currentMonthStats.guestPasses,
            lastMonthStats.guestPasses
          ),
        };

        const roomStats = allEvents.reduce((acc, event) => {
          if (event.roomNumber) {
            acc[event.roomNumber] = (acc[event.roomNumber] || 0) + 1;
          }
          return acc;
        }, {});

        const mostUsedRoom = Object.entries(roomStats).sort(
          ([, a], [, b]) => b - a
        )[0];

        const eventsWithBudget = allEvents.filter((event) => event.budget);
        const avgBudget =
          eventsWithBudget.length > 0
            ? eventsWithBudget.reduce(
                (sum, event) => sum + Number(event.budget),
                0
              ) / eventsWithBudget.length
            : 0;

        const activeClubEmails = new Set(allEvents.map((e) => e.clubMail));
        const activeClubsCount = activeClubEmails.size;
        const clubParticipationRate =
          (activeClubsCount / allClubs.length) * 100;

        setAnalyticsData({
          eventStats: Object.entries(eventsByMonth)
            .map(([month, count]) => ({ month, events: count }))
            .sort((a, b) => {
              const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
              ];
              return months.indexOf(a.month) - months.indexOf(b.month);
            }),
          budgetDistribution: Object.entries(budgetByClub)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5),
          clubStats: {
            totalClubs: allClubs.length,
            activeClubs: activeClubsCount,
            clubParticipationRate: Math.round(clubParticipationRate),
            totalEvents: allEvents.length,
            totalBudget: allEvents.reduce(
              (sum, event) => sum + (Number(event.budget) || 0),
              0
            ),
            totalGuestPasses: allEvents.reduce(
              (sum, event) => sum + (Number(event.guestPassesCount) || 0),
              0
            ),
            mostActiveClub: {
              email: mostActiveClub?.[0],
              name: mostActiveClub?.[0]?.split("@")[0].toUpperCase(),
              eventCount: mostActiveClub?.[1],
            },
            currentMonth: {
              name: new Date().toLocaleString("default", { month: "long" }),
              events: currentMonthStats.eventCount,
              budget: currentMonthStats.budget,
              guestPasses: currentMonthStats.guestPasses,
            },
            trends: {
              events: Math.round(trends.events),
              budget: Math.round(trends.budget),
              guestPasses: Math.round(trends.guestPasses),
            },
            averages: {
              budgetPerEvent: avgBudget,
              eventsPerClub: Math.round(allEvents.length / allClubs.length),
            },
            mostUsedRoom: mostUsedRoom?.[0],
          },
        });
      } catch (err) {
        console.error("Error processing analytics data:", err);
      }
    }
<<<<<<< Updated upstream
  }
}, [allEvents, allClubs]);

  const COLORS = ['#4c44b3', '#FB7D5B', '#303972', '#FFB800', '#45B7D1'];

  // Custom tooltip for budget chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Budget: ৳{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };
=======
  }, [allEvents, allClubs]);
>>>>>>> Stashed changes

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="navbar p-0 mt-[-20px] mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#303972]">Dashboard</h1>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring-2 ring-[#4c44b3] ring-opacity-30"
            >
              <div className="w-10 rounded-full">
                <NavLink to={`/dashboard/club-info/${data?._id}`}>
                  <img
                    src={data?.photo_url}
                    alt="avatar"
                    className="object-cover"
                  />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Section */}
        <div className="w-[70%] space-y-6">
          {/* Club Info Card */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-start gap-8">
              <div className="relative">
                <img
                  src={data?.photo_url}
                  alt={data?.name}
                  className="w-24 h-24 rounded-xl object-cover ring-4 ring-[#4c44b3]/10"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-[#4c44b3] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {data?.role === "oca" ? "OCA" : "CLUB"}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-[#303972]">
                      {data?.name}
                    </h1>
                    <p className="text-gray-500">{data?.email}</p>
                    {data?.fullName && (
                      <p className="text-[#4c44b3] font-medium mt-1">
                        {data?.fullName}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {data?.advisors && (
                      <div className="text-center px-4 py-2 bg-[#4c44b3]/5 rounded-lg">
                        <p className="text-2xl font-bold text-[#4c44b3]">
                          {data?.advisors?.length}
                        </p>
                        <p className="text-sm text-gray-600">Advisors</p>
                      </div>
                    )}
                    {data?.panel && (
                      <div className="text-center px-4 py-2 bg-[#FB7D5B]/5 rounded-lg">
                        <p className="text-2xl font-bold text-[#FB7D5B]">
                          {data?.panel?.length}
                        </p>
                        <p className="text-sm text-gray-600">Panel Members</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
<<<<<<< Updated upstream
          )}
          {data?.panel && (
            <div className="text-center px-4 py-2 bg-[#FB7D5B]/5 rounded-lg">
              <p className="text-2xl font-bold text-[#FB7D5B]">{data?.panel?.length}</p>
              <p className="text-sm text-gray-600">Panel Members</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

{isOCA && (
  <>
            {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
  <StatCard 
    icon={<MdEvent />}
    title="Total Events"
    value={analyticsData?.clubStats.totalEvents}
    color="#4c44b3"
  />
  <StatCard 
    icon={<BsCurrencyDollar />}
    title="Total Budget"
    value={`৳${analyticsData?.clubStats?.totalBudget?.toLocaleString()}`}
    color="#FB7D5B"
  />
  <StatCard 
    icon={<MdPeople />}
    title="Guest Passes"
    value={analyticsData?.clubStats?.totalGuestPasses}
    color="#FFB800"
  />
  <StatCard 
    icon={<MdPeople />}
    title="Active Clubs"
    value={analyticsData?.clubStats?.activeClubs}
    color="#303972"
  />
  
<StatCard 
  icon={<BsCurrencyDollar />}
  title="This Month Budget"
  value={`৳${analyticsData?.clubStats?.currentMonth?.budget?.toLocaleString() || '0'}`}
  color="#45B7D1"
/>
<StatCard 
  icon={<BsCurrencyDollar />}
  title="Avg. Budget/Event"
  value={`৳${analyticsData?.clubStats?.averages?.budgetPerEvent?.toLocaleString() || '0'}`}
  color="#4c44b3"
/>
  <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">Most Active Club</p>
        <p className="text-xl font-bold text-[#303972] mt-1">
          {analyticsData?.clubStats?.mostActiveClub?.name || 'N/A'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {analyticsData?.clubStats?.mostActiveClub?.eventCount || 0} events
        </p>
      </div>
      <div 
        className="p-3 rounded-lg"
        style={{ backgroundColor: '#FB7D5B10' }}
      >
        <MdEvent style={{ color: '#FB7D5B' }} className="h-6 w-6" />
      </div>
    </div>
  </div>
</div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Events by Month */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-[#303972] mb-4">Event Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.eventStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="events" 
                    fill="#4c44b3"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Budget Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-[#303972] mb-4">Budget Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.budgetDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.budgetDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
=======
          </div>

          {isOCA && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  icon={<MdEvent />}
                  title="Total Events"
                  value={analyticsData?.clubStats.totalEvents}
                  color="#4c44b3"
                />
                <StatCard
                  icon={<BsCurrencyDollar />}
                  title="Total Budget"
                  value={`৳${analyticsData?.clubStats?.totalBudget?.toLocaleString()}`}
                  color="#FB7D5B"
                />
                <StatCard
                  icon={<MdPeople />}
                  title="Guest Passes"
                  value={analyticsData?.clubStats?.totalGuestPasses}
                  color="#FFB800"
                />
                <StatCard
                  icon={<MdPeople />}
                  title="Active Clubs"
                  value={analyticsData?.clubStats?.activeClubs}
                  color="#303972"
                />
                <StatCard
                  icon={<BsCurrencyDollar />}
                  title="This Month Budget"
                  value={`৳${
                    analyticsData?.clubStats?.currentMonth?.budget?.toLocaleString() ||
                    "0"
                  }`}
                  color="#45B7D1"
                />
                <StatCard
                  icon={<BsCurrencyDollar />}
                  title="Avg. Budget/Event"
                  value={`৳${
                    analyticsData?.clubStats?.averages?.budgetPerEvent?.toLocaleString() ||
                    "0"
                  }`}
                  color="#4c44b3"
                />
                <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Most Active Club</p>
                      <p className="text-xl font-bold text-[#303972] mt-1">
                        {analyticsData?.clubStats?.mostActiveClub?.name ||
                          "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {analyticsData?.clubStats?.mostActiveClub?.eventCount ||
                          0}{" "}
                        events
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: "#FB7D5B10" }}
                    >
                      <MdEvent
                        style={{ color: "#FB7D5B" }}
                        className="h-6 w-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-6">
                {/* Event Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-bold text-[#303972] mb-4">
                    Event Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.eventStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        fontSize={12}
>>>>>>> Stashed changes
                      />
                      <YAxis axisLine={false} tickLine={false} fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="events"
                        fill="#4c44b3"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Budget Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-bold text-[#303972] mb-4">
                    Budget Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.budgetDistribution}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsData.budgetDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {analyticsData.budgetDistribution.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm">{entry?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#303972] mb-4">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-3 bg-[#4c44b3]/10 rounded-lg">
                      <BsCalendarEvent className="text-[#4c44b3] h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#303972]">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-sm font-medium text-[#4c44b3]">
                          {event?.clubMail?.split("@")[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-[#4c44b3] font-semibold">
                      {event.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming events available.</p>
              )}
            </div>
          </div>
        </div>

<<<<<<< Updated upstream
        {/* Right Section - Announcements */}
        <div className="w-[30%] h-[85vh] overflow-y-scroll">
          <Announcements />
=======
        {/* Right Sidebar */}
        <div className="w-[30%] space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#303972] mb-4">Calendar</h2>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              // events={formattedEvents}
              eventContent={(eventInfo) => (
                <div className="text-xs text-white bg-[#4c44b3] rounded px-1">
                  {eventInfo.event.title}
                </div>
              )}
            />
          </div>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

