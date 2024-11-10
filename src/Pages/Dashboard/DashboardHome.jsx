
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

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [allClubs] = useAllClubs();
  const [allEvents] = useAllEvents();
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
        guestPasses: 0
      },
      averages: {
        budgetPerEvent: 0,
        eventsPerClub: 0
      }
    }
  });
  
  const [currUser] = useCurrUser();
  const isOCA = currUser?.role === 'oca';

  // Fetch user/club data
  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:3000/dashboard-info/${user.email}`)
        .then(res => setData(res.data))
        .catch(err => console.error('Error fetching dashboard info:', err));
    }
  }, [user?.email]);

  // Fetch and process upcoming events
  useEffect(() => {
    axios.get('http://localhost:3000/dashboard-events')
      .then(res => {
        const sortedEvents = res.data
          .filter(event => new Date(event.date) >= new Date()) // Only future events
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5); // Only show next 5 events
        setUpcomingEvents(sortedEvents);
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  // Process analytics data

useEffect(() => {
  if (allEvents && allClubs) {
    try {
      // Event statistics by month
      const eventsByMonth = allEvents.reduce((acc, event) => {
        const month = new Date(event.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Budget distribution by club
      const budgetByClub = allEvents.reduce((acc, event) => {
        if (event.budget) {
          const clubName = event?.clubMail?.split('@')[0].toUpperCase();
          acc[clubName] = (acc[clubName] || 0) + Number(event.budget);
        }
        return acc;
      }, {});

      // Calculate most active club
      const clubEventCounts = allEvents.reduce((acc, event) => {
        const clubEmail = event.clubMail;
        acc[clubEmail] = (acc[clubEmail] || 0) + 1;
        return acc;
      }, {});

      const mostActiveClub = Object.entries(clubEventCounts)
        .sort(([,a], [,b]) => b - a)[0];

      // Calculate current month stats
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const currentMonthStats = allEvents.reduce((stats, event) => {
        const eventDate = new Date(event.date);
        if (eventDate.getMonth() === currentMonth && 
            eventDate.getFullYear() === currentYear) {
          stats.eventCount++;
          if (event.budget) stats.budget += Number(event.budget);
          if (event.guestPassesCount) stats.guestPasses += Number(event.guestPassesCount);
        }
        return stats;
      }, { eventCount: 0, budget: 0, guestPasses: 0 });

      // Calculate trend percentages (comparing with last month)
      const lastMonthStats = allEvents.reduce((stats, event) => {
        const eventDate = new Date(event.date);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        if (eventDate.getMonth() === lastMonth && 
            eventDate.getFullYear() === yearToCheck) {
          stats.eventCount++;
          if (event.budget) stats.budget += Number(event.budget);
          if (event.guestPassesCount) stats.guestPasses += Number(event.guestPassesCount);
        }
        return stats;
      }, { eventCount: 0, budget: 0, guestPasses: 0 });

      // Calculate percentage changes
      const calculateTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const trends = {
        events: calculateTrend(currentMonthStats.eventCount, lastMonthStats.eventCount),
        budget: calculateTrend(currentMonthStats.budget, lastMonthStats.budget),
        guestPasses: calculateTrend(currentMonthStats.guestPasses, lastMonthStats.guestPasses)
      };

      // Calculate room usage statistics
      const roomStats = allEvents.reduce((acc, event) => {
        if (event.roomNumber) {
          acc[event.roomNumber] = (acc[event.roomNumber] || 0) + 1;
        }
        return acc;
      }, {});

      const mostUsedRoom = Object.entries(roomStats)
        .sort(([,a], [,b]) => b - a)[0];

      // Calculate average metrics
      const eventsWithBudget = allEvents.filter(event => event.budget);
      const avgBudget = eventsWithBudget.length > 0 
        ? eventsWithBudget.reduce((sum, event) => sum + Number(event.budget), 0) / eventsWithBudget.length 
        : 0;

      // Calculate active clubs metrics
      const activeClubEmails = new Set(allEvents.map(e => e.clubMail));
      const activeClubsCount = activeClubEmails.size;
      const clubParticipationRate = (activeClubsCount / allClubs.length) * 100;

      // Set all analytics data
      setAnalyticsData({
        eventStats: Object.entries(eventsByMonth).map(([month, count]) => ({
          month,
          events: count
        })).sort((a, b) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(a.month) - months.indexOf(b.month);
        }),
        budgetDistribution: Object.entries(budgetByClub)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5), // Show top 5 clubs by budget
        clubStats: {
          totalClubs: allClubs.length,
          activeClubs: activeClubsCount,
          clubParticipationRate: Math.round(clubParticipationRate),
          totalEvents: allEvents.length,
          totalBudget: allEvents.reduce((sum, event) => sum + (Number(event.budget) || 0), 0),
          totalGuestPasses: allEvents.reduce((sum, event) => sum + (Number(event.guestPassesCount) || 0), 0),
          mostActiveClub: {
            email: mostActiveClub?.[0],
            name: mostActiveClub?.[0]?.split('@')[0].toUpperCase(),
            eventCount: mostActiveClub?.[1]
          },
          currentMonth: {
            name: new Date().toLocaleString('default', { month: 'long' }),
            events: currentMonthStats.eventCount,
            budget: currentMonthStats.budget,
            guestPasses: currentMonthStats.guestPasses
          },
          trends: {
            events: Math.round(trends.events),
            budget: Math.round(trends.budget),
            guestPasses: Math.round(trends.guestPasses)
          },
          averages: {
            budgetPerEvent: Math.round(avgBudget),
            eventsPerClub: Math.round(allEvents.length / activeClubsCount)
          },
          roomStats: {
            mostUsedRoom: mostUsedRoom?.[0],
            usageCount: mostUsedRoom?.[1]
          }
        }
      });
    } catch (error) {
      console.error('Error processing analytics:', error);
    }
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
                  <img src={data?.photo_url} alt="avatar" className="object-cover" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <div className="flex gap-8">
        {/* Left Section */}
        <div className="w-[70%] space-y-6">
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
          {data?.role === 'oca' ? 'OCA' : 'CLUB'}
        </span>
      </div>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#303972]">{data?.name}</h1>
          <p className="text-gray-500">{data?.email}</p>
          {data?.fullName && (
            <p className="text-[#4c44b3] font-medium mt-1">{data?.fullName}</p>
          )}
        </div>
        <div className="flex gap-3">
          {data?.advisors && (
            <div className="text-center px-4 py-2 bg-[#4c44b3]/5 rounded-lg">
              <p className="text-2xl font-bold text-[#4c44b3]">{data?.advisors?.length}</p>
              <p className="text-sm text-gray-600">Advisors</p>
            </div>
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
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {analyticsData.budgetDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    <span className="text-sm">{entry?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div></>
)}

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#303972] mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents?.length > 0 ? (
                upcomingEvents?.map((event, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-3 bg-[#4c44b3]/10 rounded-lg">
                      <BsCalendarEvent className="text-[#4c44b3] h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#303972]">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-sm font-medium text-[#4c44b3]">
                          {event?.clubMail?.split('@')[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {event.roomNumber && (
                      <span className="px-3 py-1 bg-[#4c44b3]/10 text-[#4c44b3] text-sm rounded-lg">
                        {event?.roomNumber}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming events
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Right Section - Announcements */}
        <div className="w-[30%] h-[85vh] overflow-y-scroll">
          <Announcements />

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
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div 
        className="p-3 rounded-lg"
        style={{ backgroundColor: `${color}10` }}
      >
        {React.cloneElement(icon, { style: { color } })}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-[#303972]">{value}</p>
      </div>
    </div>
  </div>
);

export default DashboardHome;
