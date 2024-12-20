import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import {  MdPeople, MdEvent, MdRoom } from 'react-icons/md';
import { BsCurrencyDollar, BsCalendarEvent, BsPeople } from 'react-icons/bs';
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
 const [allClubs] = useAllClubs(); // array of all club objects
 const [allEvents] = useAllEvents(); // array of all event objects
 const [upcomingEvents, setUpcomingEvents] = useState([]);
 const [analyticsData, setAnalyticsData] = useState({
   eventStats: [],
   budgetDistribution: [],
   clubStats: {
     totalClubs: 0,
     activeClubs: 0,
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
 

 const [clubAnalytics, setClubAnalytics] = useState({
  eventMetrics: {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    withBudget: 0,
    withRoom: 0,
    withGuestPasses: 0
  },
  teamStats: {
    totalMembers: 0
  }
});
  const [currUser] = useCurrUser();
 const isOCA = currUser?.role === 'oca';

 useEffect(() => {
  if (allEvents && user?.email && data) {
    try {
      // Filter events for current club
      const clubEvents = allEvents.filter(event => event.clubMail === user.email);
      
      // Count events based on response and status
      const eventCounts = clubEvents.reduce((acc, event) => {
        if (event.response === 'Accepted') {
          acc.approved++;
        } else if (event.response === 'Rejected') {
          acc.rejected++;
        } else if (event.status === 'Pending') {
          acc.pending++;
        }

        // Count requirements for approved events only
        if (event.response === 'Accepted') {
          if (event.needsRoom && event.roomNumber) acc.withRoom++;
          if (event.needsGuestPasses && event.guestPassesCount) acc.withGuestPasses++;
        }
        
        return acc;
      }, { 
        approved: 0, 
        pending: 0, 
        rejected: 0, 
        withRoom: 0, 
        withGuestPasses: 0 
      });

      setClubAnalytics({
        teamStats: {
          totalMembers: data.totalMembers || 0
        },
        eventMetrics: {
          total: clubEvents.length,
          approved: eventCounts.approved,
          pending: eventCounts.pending,
          rejected: eventCounts.rejected,
          withRoom: eventCounts.withRoom,
          withGuestPasses: eventCounts.withGuestPasses
        }
      });

    } catch (error) {
      console.error('Error processing club analytics:', error);
    }
  }
}, [allEvents, user?.email, data]);

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


 // Fetch user/club data
 useEffect(() => {
   if (user?.email) {
     axios.get(`https://clubsyncserver.vercel.app/dashboard-info/${user.email}`)
       .then(res => setData(res.data))
       .catch(err => console.error('Error fetching dashboard info:', err));
   }
 }, [user?.email]);


 // Fetch and process upcoming events
 useEffect(() => {
   axios.get('https://clubsyncserver.vercel.app/dashboard-events')
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


 return (
   <div className="min-h-screen">
     {/* Header */}
     <div className="navbar p-0 mt-[-20px] mb-6">
       <div className="flex-1">
         <h1 className="text-[1.62rem] font-bold text-[#303972]">Dashboard</h1>
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
       <span className="text-white text-xs font-medium">
         {data?.role === 'oca' ? 'OCA' : 'CLUB'}
       </span>
     </div>
   </div>
   <div className="flex-1">
     <div className="flex justify-between items-start">
       <div>
         <h1 className="text-xl font-bold text-[#303972]">{data?.name}</h1>
         <p className="text-gray-500">{data?.email}</p>
         {data?.fullName && (
           <p className="text-[#4c44b3] font-medium mt-1 text-base">{data?.fullName}</p>
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
{!isOCA && (
  <>
    {/* Club Stats Overview */}
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={<BsPeople />}
        title="Total Members"
        value={clubAnalytics.teamStats.totalMembers}
        color="#FB7D5B"
      />
      <StatCard
        icon={<MdRoom />}
        title="Events with Room"
        value={clubAnalytics.eventMetrics.withRoom}
        color="#FFB800"
      />
      <StatCard
        icon={<MdPeople />}
        title="Guest Passes Used"
        value={clubAnalytics.eventMetrics.withGuestPasses}
        color="#303972"
      />
    </div>

    {/* Event Status Overview */}
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-[#303972] mb-6">Event Status Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {clubAnalytics.eventMetrics.approved}
          </p>
          <p className="text-sm text-gray-600">Approved</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">
            {clubAnalytics.eventMetrics.pending}
          </p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">
            {clubAnalytics.eventMetrics.rejected}
          </p>
          <p className="text-sm text-gray-600">Rejected</p>
        </div>
      </div>
    </div>
  </>
)}


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
           <h2 className="text-lg font-bold text-[#303972] mb-4">Upcoming Events</h2>
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
                       <span className="text-xs text-gray-500">
                         {new Date(event.date).toLocaleDateString('en-US', {
                           month: 'long',
                           day: 'numeric',
                           year: 'numeric'
                         })}
                       </span>
                       <span className="text-xs font-medium text-[#4c44b3]">
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
       className="px-3 py-2 rounded-lg"
       style={{ backgroundColor: `${color}10` }}
     >
       {React.cloneElement(icon, { style: { color } })}
     </div>
     <div>
       <p className="text-xs text-gray-500">{title}</p>
       <p className="text-xl font-bold text-[#303972]">{value}</p>
     </div>
   </div>
 </div>
);


export default DashboardHome;



