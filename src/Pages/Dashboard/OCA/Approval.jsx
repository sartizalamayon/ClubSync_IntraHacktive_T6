import axios from "axios";
import { BsEye } from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import Swal from "sweetalert2";
import useAllPendingRequests from "../../../hooks/useAllPendingRequests";
import { useState, useMemo } from 'react';

const Approval = () => {
  const [allPendingRequests, allPendingRequestsRefetch] = useAllPendingRequests();
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
      const response = await axios.get(`http://localhost:3000/events/${id}`);
      const event = response.data;
      Swal.fire({
        title: event.title,
        html: `
          <p><strong>Club:</strong> ${event.clubMail}</p>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Description:</strong> ${event.description}</p>
          <p><strong>Budget:</strong> ${event.budget}</p>
          <p><strong>Budget Details:</strong> ${event.budgetDetails}</p>
          <p><strong>Guest Passes Count:</strong> ${event.guestPassesCount}</p>
          <p><strong>Room Number:</strong> ${event.roomNumber}</p>
          <p><strong>Additional Requirements:</strong> ${event.additionalRequirements}</p>
        `,
        confirmButtonText: 'Close'
      });
    } catch (error) {
      console.error('Error fetching event:', error);
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
          await axios.put(`http://localhost:3000/events/${id}`, updatedEvent);
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

        await axios.put(`http://localhost:3000/events/${id}`, updatedEvent);
        allPendingRequestsRefetch();
        Swal.fire('Rejected', 'The event has been rejected.', 'success');
      }
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };


  return (
    <div>
      {/* Header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <div>
            <a className="text-3xl font-bold text-[#303972]">Approval Request</a>
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

      <div className="bg-white p-8 rounded-xl mt-2">
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-[12px] font-semibold text-[#303972]">
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Club</th>
                  <th>Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((event, index) => (
                  <tr key={event._id} className="bg-white hover:bg-gray-50">
                    <th>{index + 1}</th>
                    <td className="text-lg font-semibold text-[#303972]">
                      {event?.title}
                    </td>
                    <td>{event?.clubMail}</td>
                    <td className="text-sm font-normal text-[#A098AE]">
                      {event?.date}
                    </td>
                    <td className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleView(event._id)} 
                        className="btn bg-[#FB7D5B] hover:bg-[#fa6b45] rounded-xl text-white font-normal"
                      >
                        <BsEye />
                      </button>
                      <button 
                        onClick={() => handleAccept(event._id)} 
                        className="btn bg-[#303972] hover:bg-[#252b54] rounded-xl text-white font-normal"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(event._id)} 
                        className="btn bg-[#FB7D5B] hover:bg-[#fa6b45] rounded-xl text-white font-normal"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
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