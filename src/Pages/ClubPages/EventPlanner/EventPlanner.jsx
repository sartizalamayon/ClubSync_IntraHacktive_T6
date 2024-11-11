import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { BiMoney } from "react-icons/bi";
import { BsBuilding } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { HiOutlineUserGroup, HiOutlineViewList } from "react-icons/hi";
import {
  MdDateRange,
  MdDescription,
  MdNotificationsActive,
  MdTitle,
} from "react-icons/md";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthProvider";
import usePendingRequests from "../../../hooks/usePendingRequests";
import useRespondedRequests from "../../../hooks/useRespondedRequests";
import useCurrUser from "../../../hooks/useCurrUser";

{
  /* These imports should be added at the top of your file */
}

const Tooltip = ({ message, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 top-full mt-1 whitespace-nowrap z-50">
        {message}
        <div className="absolute bottom-full right-2 border-4 border-transparent border-b-gray-800"></div>
      </div>
    </div>
  );
};

const EventPlanner = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [currUser] = useCurrUser();

  const { user } = useContext(AuthContext);
  // const [clubInfo, setClubInfo] = useState([]);
  const [pendingRequests, pendingRequestsRefetch] = usePendingRequests();
  const [respondedRequests, respondedRequestsRefetch] = useRespondedRequests();

  const showBudget = watch("needsBudget") || false;
  const showRoom = watch("needsRoom") || false;
  const showGuestPasses = watch("needsGuestPasses") || false;

  // Get only the first two items for initial display
  const visiblePendingRequests = pendingRequests?.slice(0, 2);
  const visibleRespondedRequests = respondedRequests?.slice(0, 2);

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post("http://localhost:3000/new-event", data);
    },
    onSuccess: () => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Request Sent",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      pendingRequestsRefetch();
    },
    onError: (e) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `Error - ${e}`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

const onSubmit = async (data) => {
  try {
    setIsSubmitting(true);
    const date = data.date;
    const room = data.roomNumber;

    // Check if date is before today
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Cannot select a past date",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    // Check room availability if room is selected
    if (room) {
      try {
        const response = await axios.post(`http://localhost:3000/check-room-availability`, {
          date,
          roomNumber: room
        });

        if (!response.data.available) {
          Swal.fire({
            icon: "error",
            title: "Room Not Available",
            text: "This room is already booked for the selected date",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
      } catch (error) {
        console.error("Room check error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to check room availability",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
    }

    // If all checks pass, proceed with form submission
    const postData = {
      ...data,
      status: "Pending",
      response: "",
      feedback: "",
      requestDate: new Date(),
      clubMail: user?.email,
      advisorEmail: clubInfo.advisors[0].advisorEmail,
    };

    mutation.mutate(postData);

  } catch (error) {
    console.error("Submit error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to submit form",
      showConfirmButton: false,
      timer: 1500,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const { data: clubInfo, isLoading: isClubInfoLoading } = useQuery({
    queryKey: ["clubInfo", user?.email],
    queryFn: () =>
      axios
        .get(`http://localhost:3000/dashboard-info/${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  if (isClubInfoLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-[#4D44B5]"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-[1.62rem] font-bold text-[#303972] ">
            Create a Proposal
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={currUser?.photo_url}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        {/* Main Form Section - 55% width */}
        <div className="w-[55%]">
          <div className="bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-6 bg-[#4c44b3] text-white p-3 rounded-tr-xl rounded-tl-xl w-full pl-4">
              Details
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-9">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-[#4c44b3] font-medium text-sm">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdTitle className="h-5 w-5 text-[#4c44b3]" />
                  </div>
                  <input
                    {...register("title", { required: true })}
                    className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white placeholder:text-sm"
                    placeholder="Event Title"
                  />
                  {errors.title && (
                    <span className="text-red-500 text-sm mt-1">
                      Title is required
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-[#4c44b3] font-medium text-sm">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 pointer-events-none">
                    <MdDescription className="h-5 w-5 text-[#4c44b3]" />
                  </div>
                  <textarea
                    {...register("description", { required: true })}
                    className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white placeholder:text-sm"
                    rows={4}
                    placeholder="Event Description"
                  />
                  {errors.description && (
                    <span className="text-red-500 text-sm mt-1">
                      Description is required
                    </span>
                  )}
                </div>
              </div>

              {/* Budget Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("needsBudget")}
                      className="peer sr-only"
                    />
                    <div
                      className="w-4 h-4 border-2 border-[#4c44b3] border-opacity-30 rounded 
                         bg-white transition-all duration-300
                         peer-checked:border-[#4c44b3] peer-checked:border-opacity-100
                         peer-checked:bg-[#4c44b3] group-hover:border-opacity-50"
                    ></div>
                    <div
                      className="absolute top-[2px] left-[5px] opacity-0 
                         peer-checked:opacity-100 transition-opacity duration-300 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 0 0"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#4c44b3] font-medium select-none flex items-center gap-2 text-sm">
                    Budget Required
                  </span>
                </label>

                {showBudget && (
                  <div className="space-y-4 pl-8 animate-fadeIn">
                    <div className="relative">
                      <input
                        type="number"
                        {...register("budget", { required: showBudget })}
                        className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white placeholder:text-sm"
                        placeholder="Budget Amount"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BiMoney className="h-5 w-5 text-[#4c44b3]" />
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 pointer-events-none">
                        <FaRegFileAlt className="h-5 w-5 text-[#4c44b3]" />
                      </div>
                      <textarea
                        {...register("budgetDetails", { required: showBudget })}
                        className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white placeholder:text-sm"
                        rows={3}
                        placeholder="Provide detailed budget breakdown"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Room Section with similar styling */}
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("needsRoom")}
                      className="peer sr-only"
                    />
                    <div
                      className="w-4 h-4 border-2 border-[#4c44b3] border-opacity-30 rounded 
                         bg-white transition-all duration-300
                         peer-checked:border-[#4c44b3] peer-checked:border-opacity-100
                         peer-checked:bg-[#4c44b3] group-hover:border-opacity-50"
                    ></div>
                    <div
                      className="absolute top-[2px] left-[5px] opacity-0 
                         peer-checked:opacity-100 transition-opacity duration-300 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 0 0"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#4c44b3] text-sm font-medium select-none flex items-center gap-2">
                    Room Required
                  </span>
                </label>

                {showRoom && (
                  <div className="pl-8 animate-fadeIn">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BsBuilding className="h-5 w-5 text-[#4c44b3]" />
                      </div>
                      <select
                        {...register("roomNumber", { required: showRoom })}
                        className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white text-sm"
                      >
                        <option value="">Select a room</option>
                        {[
                          "Club Room 1",
                          "Club Room 2",
                          "Club Room 3",
                          "Club Room 4",
                          "Multipurpose Hall",
                          "Theatre",
                          "Auditorium",
                        ].map((room) => (
                          <option key={room} value={room}>
                            {room}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Passes Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("needsGuestPasses")}
                      className="peer sr-only"
                    />
                    <div
                      className="w-4 h-4 border-2 border-[#4c44b3] border-opacity-30 rounded 
                         bg-white transition-all duration-300
                         peer-checked:border-[#4c44b3] peer-checked:border-opacity-100
                         peer-checked:bg-[#4c44b3] group-hover:border-opacity-50"
                    ></div>
                    <div
                      className="absolute top-[2px] left-[5px] opacity-0 
                         peer-checked:opacity-100 transition-opacity duration-300 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 0 0"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#4c44b3] text-sm font-medium select-none flex items-center gap-2">
                    Guest Passes Required
                  </span>
                </label>

                {showGuestPasses && (
                  <div className="pl-8 animate-fadeIn">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineUserGroup className="h-5 w-5 text-[#4c44b3]" />
                      </div>
                      <input
                        type="number"
                        {...register("guestPassesCount", {
                          required: showGuestPasses,
                        })}
                        className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white placeholder:text-sm"
                        placeholder="Number of passes needed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date Section */}
              <div className="space-y-2">
                <label className="block text-[#4c44b3] font-medium text-sm ">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdDateRange className="h-5 w-5 text-[#4c44b3]" />
                  </div>
                  <input
                    type="date"
                    {...register("date", { required: true })}
                    className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white placeholder:text-sm text-sm"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-2">
                <label className="block text-[#4c44b3] font-medium text-sm">
                  Additional Requirements or Documents
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 pointer-events-none">
                    <FaRegFileAlt className="h-5 w-5 text-[#4c44b3]" />
                  </div>
                  <textarea
                    {...register("additionalRequirements")}
                    className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white placeholder:text-sm"
                    rows={4}
                    placeholder="Anything else you need - Sound System, IT support or something else.  

Or If you want to submit a document upload the document in the drive and share the drive link here."
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("termsAgreed", { required: true })}
                      className="peer sr-only"
                    />
                    <div
                      className="w-4 h-4 border-2 border-[#4c44b3] border-opacity-30 rounded 
                   bg-white transition-all duration-300
                   peer-checked:border-[#4c44b3] peer-checked:border-opacity-100
                   peer-checked:bg-[#4c44b3] group-hover:border-opacity-50"
                    ></div>
                    <div
                      className="absolute top-[2px] left-[5px] opacity-0 
                   peer-checked:opacity-100 transition-opacity duration-300 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 0 0"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#4c44b3] font-medium select-none flex items-center gap-2 text-sm">
                    Notify your Advisor through email
                  </span>
                </label>
                {errors.termsAgreed && (
                  <span className="text-red-500 text-sm block pl-8">
                    Supervisor approval is required
                  </span>
                )}
              </div>

              {/* Submit Button */}
<div className="w-full flex justify-end pb-5 pt-2">
  <button
    type="submit"
    className="bg-[#4c44b3] text-white px-8 py-2.5 rounded-lg hover:bg-opacity-90 
             transition-colors font-medium flex items-center gap-2 shadow-md
             hover:shadow-lg active:scale-[0.98] transform duration-100
             disabled:opacity-50 disabled:cursor-not-allowed"
  >
      Submit Proposal
  </button>
</div>
            </form>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="w-[40%] flex flex-col gap-6">
          {/* Pending Events Section */}
          <div className="rounded-lg">
            <div className="bg-white rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-[#4c44b3] text-[1.1rem] font-bold">
                  Pending Events
                </h2>
                {pendingRequests?.length > 2 && (
                  <Tooltip message="View all pending events">
                    <label
                      htmlFor="pending-modal"
                      className="cursor-pointer text-[#4c44b3] hover:text-[#303972] transition-colors"
                    >
                      <HiOutlineViewList className="text-2xl" />
                    </label>
                  </Tooltip>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                Events that are not yet responded by the OCA
              </p>
            </div>
            <div className="mt-4 space-y-4">
              {visiblePendingRequests?.map((event, index) => (
                <ProposalCard
                  key={event._id}
                  event={event}
                  pendingRequestsRefetch={pendingRequestsRefetch}
                  borderColor={
                    index % 2 === 0 ? "rgb(247,102,74)" : "rgb(249,185,48)"
                  }
                />
              ))}
            </div>
          </div>

          {/* Previous Proposals Section */}
          <div className="rounded-lg">
            <div className="bg-white rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-[#4c44b3] text-[1.1rem] font-bold">
                  Recent Proposals
                </h2>
                {respondedRequests?.length > 2 && (
                  <Tooltip message="View all proposals">
                    <label
                      htmlFor="responded-modal"
                      className="cursor-pointer text-[#4c44b3] hover:text-[#303972] transition-colors"
                    >
                      <HiOutlineViewList className="text-2xl" />
                    </label>
                  </Tooltip>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                Accepted or Rejected proposals with feedback
              </p>
            </div>
            <div className="mt-4 space-y-4">
              {visibleRespondedRequests?.map((event, index) => (
                <EventCard
                  key={event._id}
                  event={event}
                  borderColor={
                    index % 2 === 0 ? "rgb(247,102,74)" : "rgb(249,185,48)"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DaisyUI Modals */}
      <input type="checkbox" id="pending-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-11/12 max-w-3xl bg-white relative">
          <label
            htmlFor="pending-modal"
            className="btn btn-sm btn-circle bg-white hover:bg-gray-100 border-none text-gray-500 absolute right-4 top-4"
          >
            ✕
          </label>
          <div className="border-b pb-4 mb-4">
            <h3 className="font-bold text-[1.1rem] text-[#4c44b3]">
              All Pending Events
            </h3>
          </div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {pendingRequests?.map((event, index) => (
              <ProposalCard
                key={event._id}
                event={event}
                pendingRequestsRefetch={pendingRequestsRefetch}
                borderColor={
                  index % 2 === 0 ? "rgb(247,102,74)" : "rgb(249,185,48)"
                }
              />
            ))}
          </div>
        </div>
      </div>

      <input type="checkbox" id="responded-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-4xl bg-white relative">
          <label
            htmlFor="responded-modal"
            className="btn btn-sm btn-circle bg-white hover:bg-gray-100 border-none text-gray-500 absolute right-4 top-4"
          >
            ✕
          </label>
          <div className="border-b pb-4 mb-4">
            <h3 className="font-bold text-[1.1rem] text-[#4c44b3]">
              All Recent Proposals
            </h3>
          </div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {respondedRequests?.map((event, index) => (
              <EventCard
                key={event._id}
                event={event}
                borderColor={
                  index % 2 === 0 ? "rgb(247,102,74)" : "rgb(249,185,48)"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPlanner;

// ProposalCard for Pending Events
const ProposalCard = ({ event, pendingRequestsRefetch, borderColor }) => {
  const handleDelete = (eventId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:3000/event-planner/${eventId}`)
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              pendingRequestsRefetch();
            });
        }
      })
      .catch((error) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `Error - ${error}`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-4 mt-4"
      style={{ borderLeft: `8px solid ${borderColor}` }}
    >
      <div className="flex items-start gap-4 relative">
        <div className="text-[#4c44b3]  absolute bottom-0 right-1 flex justify-center items-center gap-2 border border-gray-200 p-1 rounded-lg text-sm">
          <span className="h-2 w-2 inline-block rounded-full bg-[#b6cc29]"></span>
          Pending
        </div>

        <button
          onClick={() => handleDelete(event._id)}
          className="absolute font-mono text-xl top-0 right-0 text-gray-500 hover:text-gray-700"
        >
          x
        </button>
        {/* Left colored bar */}
        <div className="w-2 h-full bg-[rgb(240,241,255)] rounded-full self-stretch" />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-base text-[#4c44b3]">
                {event.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {event.description.substring(0, 100)}...
              </p>
            </div>
            {/* Status circle */}
            <div className="w-3 h-3 rounded-full bg-[rgb(240,241,255)]" />
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {new Date(event.requestDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// EventCard for Previous Proposals
const EventCard = ({ event, borderColor }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-4 mt-4 relative"
      style={{ borderLeft: `8px solid ${borderColor}` }}
    >
      <span
        className={`w-3 h-3 rounded-full absolute right-2 top-2 ${
          event.response === "Accepted" ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-base text-[#4c44b3]">
                {event.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {event.description.substring(0, 100)}...
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {new Date(event.requestDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            {event.feedback && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Feedback: </span>
                  {event.feedback || "No feedback provided"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
