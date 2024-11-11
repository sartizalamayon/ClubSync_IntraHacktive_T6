import axios from "axios";
import { useMemo, useState } from 'react';
import { BiSearch } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import Swal from "sweetalert2";
import useAllPendingRequests from "../../../hooks/useAllPendingRequests";

const Approval = () => {
  const [allPendingRequests, allPendingRequestsRefetch, isLoading] = useAllPendingRequests();
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtered requests
  const filteredRequests = useMemo(() => {
    return allPendingRequests.filter(request => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        request.title?.toLowerCase().includes(searchTerm) ||
        request.clubMail?.toLowerCase().includes(searchTerm) ||
        request.date?.toLowerCase().includes(searchTerm)
      );
    });
  }, [allPendingRequests, searchQuery]);

  const handleView = async (id) => {
    try {
      const response = await axios.get(`https://clubsyncserver.vercel.app/events/${id}`);
      const event = response.data;
  
      // Helper function to format date
      const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
  
      // Helper function to check and format values
      const formatValue = (value, type = 'text') => {
        if (value === null || value === undefined || value === '') {
          return 'Not specified';
        }
        if (type === 'currency' && value) {
          return `৳${value.toLocaleString()}`;
        }
        if (type === 'number') {
          return value.toString();
        }
        return value;
      };
  
      const modalContent = `
        <div class="text-left p-4">
          <div class="grid gap-4">
            <!-- Club Info Section -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-[#303972] font-semibold mb-2 text-lg border-b pb-2">Club Information</h3>
              <div class="grid gap-2">
              
                <p class="text-sm"><span class="font-medium text-[#303972]">Club:</span> 
                  <span class="text-gray-600">${formatValue(event.clubMail.split('@')[0].toUpperCase())}</span>
                </p>
                <p class="text-sm"><span class="font-medium text-[#303972]">Event Date:</span> 
                  <span class="text-gray-600">${formatDate(event.date)}</span>
                </p>
              </div>
            </div>
  
            <!-- Event Details Section -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-[#303972] font-semibold mb-2 text-lg border-b pb-2">Event Details</h3>
              <div class="grid gap-3">
                <div>
                  <p class="text-sm font-medium text-[#303972]">Description:</p>
                  <p class="text-sm text-gray-600 mt-1">${formatValue(event.description)}</p>
                </div>
                ${event.needsRoom ? `
                  <div>
                    <p class="text-sm font-medium text-[#303972]">Room Needed:</p>
                    <p class="text-sm text-gray-600 mt-1">${formatValue(event.roomNumber)}</p>
                  </div>
                ` : ''}
              </div>
            </div>
  
            ${event.needsBudget ? `
              <!-- Budget Section -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-[#303972] font-semibold mb-2 text-lg border-b pb-2">Budget Information</h3>
                <div class="grid gap-3">
                  <div>
                    <p class="text-sm font-medium text-[#303972]">Budget Amount:</p>
                    <p class="text-sm text-gray-600 mt-1">${formatValue(event.budget, 'currency')}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-[#303972]">Budget Details:</p>
                    <p class="text-sm text-gray-600 mt-1">${formatValue(event.budgetDetails)}</p>
                  </div>
                </div>
              </div>
            ` : ''}
  
            ${event.needsGuestPasses ? `
              <!-- Guest Passes Section -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-[#303972] font-semibold mb-2 text-lg border-b pb-2">Guest Passes</h3>
                <p class="text-sm"><span class="font-medium text-[#303972]">Number of Passes:</span> 
                  <span class="text-gray-600">${formatValue(event.guestPassesCount, 'number')}</span>
                </p>
              </div>
            ` : ''}
  
            <!-- Additional Requirements Section -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-[#303972] font-semibold mb-2 text-lg border-b pb-2">Additional Requirements</h3>
              <p class="text-sm text-gray-600">${formatValue(event.additionalRequirements)}</p>
            </div>
          </div>
        </div>
      `;
  
      await Swal.fire({
        title: `<h2 class="text-xl font-bold text-[#303972]">${event.title}</h2>`,
        html: modalContent,
        confirmButtonText: 'Close',
        confirmButtonColor: '#4c44b3',
        customClass: {
          container: 'custom-swal-container',
          popup: 'custom-swal-popup',
          content: 'custom-swal-content',
        },
        width: '600px',
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster'
        }
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load event details',
        confirmButtonColor: '#4c44b3'
      });
    }
  };
  

  const handleAccept = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Provide Feedback (Optional)',
        input: 'textarea',
        inputPlaceholder: 'Enter your feedback...',
        showCancelButton: true,
        confirmButtonText: 'Accept',
        cancelButtonText: 'Cancel'
      });
  
      if (result.isConfirmed) {
        const feedback = result.value;
        const updatedEvent = {
          status: 'Responded',
          response: 'Accepted',
          feedback: feedback || ''
        };
  
        try {
          await axios.put(`https://clubsyncserver.vercel.app/events/${id}`, updatedEvent);
          allPendingRequestsRefetch();
          Swal.fire('Accepted', 'The event has been accepted.', 'success');
        } catch (error) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `Error - ${error.message}`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    } catch (error) {
      console.error('Error accepting event:', error);
    }
  };
  const handleReject = async (id) => {
    try {
      const { value: feedback } = await Swal.fire({
        title: 'Provide Feedback',
        input: 'textarea',
        inputPlaceholder: 'Enter your feedback...',
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'Please provide feedback';
          }
        }
      });

      if (feedback) {
        const updatedEvent = {
          status: 'Responded',
          response: 'Rejected',
          feedback
        };

        await axios.put(`https://clubsyncserver.vercel.app/events/${id}`, updatedEvent);
        allPendingRequestsRefetch();
        Swal.fire('Rejected', 'The event has been rejected.', 'success');
      }
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-[#4D44B5]"></span>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="navbar pb-3 mt-[-18px]">
        <div className="flex-1">
          <div>
            <a className="text-[1.62rem] font-bold text-[#303972]">Approval Request</a>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredRequests.length} of {allPendingRequests.length} requests
            </p>
          </div>
        </div>
        <div className="flex-none gap-4">
          <div className="form-control">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-xl bg-white border-2 border-[#4c44b3] border-opacity-30 
                         focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent
                         placeholder-gray-400 text-gray-600"
              />
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c44b3] h-5 w-5" />
            </div>
          </div>
          
          {/* Profile */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring-2 ring-[#4c44b3] ring-opacity-30"
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

      <div className="bg-white p-8 rounded-xl mt-2 shadow-md">
  {filteredRequests.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* Table Header */}
        <thead>
          <tr className="bg-[#4c44b3] bg-opacity-5">
            <th className="text-[#303972] font-semibold px-6 py-4 text-sm rounded-tl-xl">#</th>
            <th className="text-[#303972] font-semibold px-6 py-4 text-sm">Title</th>
            <th className="text-[#303972] font-semibold px-6 py-4 text-sm">Club</th>
            <th className="text-[#303972] font-semibold px-6 py-4 text-sm">Date</th>
            <th className="text-[#303972] font-semibold px-6 py-4 text-sm text-center rounded-tr-xl">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {filteredRequests.map((event, index) => {
            // Split and format club mail
            const clubNameParts = event?.clubMail?.split('@')[0].split('.');
            const formattedClubName = clubNameParts
              ?.map(part => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ');

            return (
              <tr 
                key={event._id} 
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {String(index + 1).padStart(2, '0')}
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#303972] text-base">
                      {event?.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Created on {new Date(event?.requestDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4c44b3] bg-opacity-10 flex items-center justify-center">
                      <span className="text-[#4c44b3] font-semibold">
                        {clubNameParts?.[0]?.charAt(0)?.toUpperCase()}
                        {clubNameParts?.[1]?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#303972] font-medium text-sm">
                        {formattedClubName}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {event?.clubMail}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                               bg-[#4c44b3] bg-opacity-10 text-[#4c44b3] font-medium">
                    {new Date(event?.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3">
                    {/* View Button */}
                    <button 
                      onClick={() => handleView(event._id)} 
                      className="group relative px-3 py-1.5 rounded-lg bg-[#FB7D5B]/10 hover:bg-[#FB7D5B]/20 
                               transition-all duration-200 cursor-pointer"
                    >
                      <BsEye className="text-lg text-[#FB7D5B]" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                   bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                                   group-hover:opacity-100 transition-opacity duration-200">
                        View
                      </span>
                    </button>
                    
                    {/* Accept Button */}
                    <button 
                      onClick={() => handleAccept(event._id)} 
                      className="px-4 py-1.5 rounded-lg text-sm font-medium text-[#4c44b3] 
                               bg-[#4c44b3]/10 hover:bg-[#4c44b3]/20 transition-all duration-200
                               flex items-center gap-2"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Accept
                    </button>
                    
                    {/* Reject Button */}
                    <button 
                      onClick={() => handleReject(event._id)} 
                      className="px-4 py-1.5 rounded-lg text-sm font-medium text-[#FB7D5B]
                               bg-[#FB7D5B]/10 hover:bg-[#FB7D5B]/20 transition-all duration-200
                               flex items-center gap-2"
                    >
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
          <div className="text-center py-10">
            <div className="text-[#4c44b3] text-lg font-medium">No requests found</div>
            <p className="text-gray-500 mt-2">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "No pending requests at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approval;