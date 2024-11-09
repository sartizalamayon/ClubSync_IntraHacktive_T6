import axios from "axios";
import { BsEye } from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";
import Swal from "sweetalert2";
import useAllPendingRequests from "../../../hooks/useAllPendingRequests";

const Approval = () => {
  const [allPendingRequests, allPendingRequestsRefetch] = useAllPendingRequests();

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
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {allPendingRequests.map((event, index) => (
                <tr key={index}>
                <th>1</th>
                <td className="text-lg font-semibold text-[#303972]">
                 {event?.title}
                </td>
                <td>{event?.clubMail}</td>
                <td className="text-sm font-normal text-[#A098AE]">
                  {event?.date}
                </td>
                <td className="flex justify-center items-center">
                  {/* view - A modal opens here with all the event info*/}
                  <button onClick={() => handleView(event._id)} className="btn bg-[#FB7D5B] rounded-xl text-white font-normal">
                    <BsEye />
                  </button>
                  {/* accept */}
                  <button onClick={() => handleAccept(event._id)} className="btn bg-[#FB7D5B] rounded-xl text-white font-normal ml-2">
                    Accept
                  </button>
                  {/* - reject */}
                  <button onClick={() => handleReject(event._id)} className="btn bg-[#FB7D5B] rounded-xl text-white font-normal ml-2">
                    Reject
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Approval;
