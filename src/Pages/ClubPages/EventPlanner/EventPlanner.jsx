import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../../Context/AuthProvider';
import Swal from 'sweetalert2';
import usePendingRequests from '../../../hooks/usePendingRequests';
import useRespondedRequests from '../../../hooks/useRespondedRequests';
import { MdNotificationsActive } from 'react-icons/md';

const EventPlanner = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const {user} = useContext(AuthContext)
  //
  const [pendingRequests, pendingRequestsRefetch] = usePendingRequests();
  const [respondedRequests, respondedRequestsRefetch] = useRespondedRequests();

  console.log(respondedRequests)


  const showBudget = watch('needsBudget') || false;
  const showRoom = watch('needsRoom') || false;
  const showGuestPasses = watch('needsGuestPasses') || false;

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post('http://localhost:3000/new-event', data);
    },
    onSuccess: () =>{
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Request Sent",
        showConfirmButton: false,
        timer: 1500,
      });

      //clear the form
      reset();

      //refetch pending requests
      pendingRequestsRefetch();
    },
    onError: (e) =>{
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `Error - ${e}`,
          showConfirmButton: false,
          timer: 1500,
        })
    }
  });

  const onSubmit = (data) => {
    const postData = {...data, status:"Pending", response:"", feedback:"", requestDate: new Date(), clubMail:user?.email}
    console.log(postData)
    mutation.mutate(postData);
  };



  return (
    <div>
       <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Create a Proposal</a>
        </div>
        <div className="flex-none gap-2">
          
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
      <div className="flex gap-8">
        {/* Main Form Section - 60% width */}
        <div className="w-[55%]">
          
          <div className="bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-6 bg-[#4c44b3] text-white p-3 rounded-tr-xl rounded-tl-xl w-full pl-4">Details</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-9">
              {/* Title */}
              <div>
                <label className="block mb-2 text-[#4c44b3] font-medium ">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title', { required: true })}
                  className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4c44b3] bg-white border-[#4c44b3] border-opacity-30 border-2"
                  placeholder="Event Title"
                />
                {errors.title && <span className="text-red-500">Title is required</span>}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-[#4c44b3] font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full p-2 bg-white border-[#4c44b3] border-opacity-30 border-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4c44b3]"
                  rows={4}
                  placeholder="Event Description"
                />
                {errors.description && <span className="text-red-500">Description is required</span>}
              </div>

              {/* Budget Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('needsBudget')}
                    className="form-checkbox text-[#4c44b3] bg-white"
                  />
                  <span className="text-[#4c44b3] font-medium">Budget Required</span>
                </label>

                {showBudget && (
                  <div className="space-y-4 pl-6">
                    <div>
                      <input
                        type="number"
                        {...register('budget', { required: showBudget })}
                        className="w-full p-2 bg-white border-[#4c44b3] border-opacity-30 border-2 rounded"
                        placeholder="Budget Amount"
                      />
                    </div>
                    <div>
                      <textarea
                        {...register('budgetDetails', { required: showBudget })}
                        className="w-full p-2 rounded bg-white border-[#4c44b3] border-opacity-30 border-2"
                        rows={3}
                        placeholder="Provide detailed budget breakdown"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Room Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('needsRoom')}
                    className="form-checkbox text-[#4c44b3]"
                  />
                  <span className="text-[#4c44b3] font-medium">Room Required</span>
                </label>

                {showRoom && (
                  <div className="pl-6">
                    <select
                      {...register('roomNumber', { required: showRoom })}
                      className="w-full p-2 bg-white border-[#4c44b3] border-opacity-30 border-2 rounded"
                    >
                      <option value="">Select a room</option>
                      {[
                        "Club Room 1",
                        "Club Room 2",
                        "Club Room 3",
                        "Club Room 4",
                        "Multipurpose Hall",
                        "Theatre",
                        "Auditorium"
                      ].map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Guest Passes Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('needsGuestPasses')}
                    className="form-checkbox text-[#4c44b3]"
                  />
                  <span className="text-[#4c44b3] font-medium">Guest Passes Required</span>
                </label>

                {showGuestPasses && (
                  <div className="pl-6">
                    <input
                      type="number"
                      {...register('guestPassesCount', { required: showGuestPasses })}
                      className="w-full p-2 bg-white border-[#4c44b3] border-opacity-30 border-2 rounded"
                      placeholder="Number of passes needed"
                    />
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block mb-2 text-[#4c44b3] font-medium">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('date', { required: true })}
                  className="w-full p-2 bg-white border-[#4c44b3] border-opacity-30 border-2 rounded"
                />
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block mb-2 text-[#4c44b3] font-medium">Additional Requirements or Documents</label>
                <textarea
                  {...register('additionalRequirements')}
                  className="w-full p-2 bg-white border-[#4c44b3] border-opacity-30 border-2 rounded"
                  rows={4}
                  placeholder="Anything else you need - Sound System, IT support or something else. If you want to submit a document upload the document in the drive and share the drive link here."
                />
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('termsAgreed', { required: true })}
                    className="form-checkbox text-[#4c44b3]"
                  />
                  <span className="text-[#4c44b3] font-medium">Our supervisor approves this request</span>
                </label>
                {errors.termsAgreed && (
                  <span className="text-red-500 block mt-1">
                    This must be filled up
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className='w-full flex justify-end pb-5'>
                <button
                  type="submit"
                  className="bg-[#4c44b3] text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Sections - 35% width */}
        <div className="w-[40%] flex flex-col gap-6 pt-[4.3rem]">
          {/* Pending Events Section */}
<div className="rounded-lg">
  <div className='bg-white rounded-xl shadow-lg p-6'>
    <h2 className="text-[#4c44b3] text-[1.3rem] font-bold">Pending Events</h2>
    <p className="text-gray-500">Events that are not yet responded by the OCA</p>
  </div>
  <div className="mt-4 space-y-4">
    {pendingRequests?.map((event) => (
      <ProposalCard key={event._id} event={event} pendingRequestsRefetch={pendingRequestsRefetch}/>
    ))}
  </div>
</div>

{/* Previous Proposals Section */}
<div className="rounded-lg">
  <div className='bg-white rounded-xl shadow-lg p-6'>
    <h2 className="text-[#4c44b3] text-[1.3rem] font-bold">Recent Proposals</h2>
    <p className="text-gray-500">Accepted or Rejected proposals with feedback</p>
  </div>
  <div className="mt-4 space-y-4">
    {respondedRequests?.map((event) => (
      <EventCard key={event._id} event={event} />
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default EventPlanner;

// ProposalCard for Pending Events
const ProposalCard = ({ event , pendingRequestsRefetch}) => {
  const handleDelete = (eventId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/event-planner/${eventId}`)
        .then(() => {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            pendingRequestsRefetch()
          }
          
      )
      }
    }).catch((error) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `Error - ${error}`,
        showConfirmButton: false,
        timer: 1500,
    })
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-4  border-l-8 border-[#4c44b3]">
      <div className="flex items-start gap-4 relative">
        <div className='text-[#4c44b3] font-bold absolute bottom-0 right-1 flex justify-center items-center gap-2 border border-gray-200 p-1 rounded-lg' >
          <span className='h-2 w-2 inline-block rounded-full bg-[#b6cc29]'></span>Pending
        </div>

        <button onClick={() => handleDelete(event._id)} className='absolute font-mono text-xl top-0 right-0 text-gray-500 hover:text-gray-700'>
          x
        </button>
        {/* Left colored bar */}
        <div className="w-2 h-full bg-[rgb(240,241,255)] rounded-full self-stretch" />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-[#4c44b3]">{event.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{event.description.substring(0, 100)}...</p>
            </div>
            {/* Status circle */}
            <div className="w-3 h-3 rounded-full bg-[rgb(240,241,255)]" />
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date(event.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

// EventCard for Previous Proposals
const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-4 border-l-8 border-[#4c44b3] relative">
      <span className={`w-3 h-3 rounded-full absolute top-4 right-4 ${event.response === 'Accepted' ? 'bg-green-500' : 'bg-red-500'}`}></span>
      <div className="flex items-start gap-4">
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-[#4c44b3]">{event.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{event.description.substring(0, 100)}...</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{new Date(event.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            {event.feedback && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Feedback: </span>
                  {event.feedback || 'No feedback provided'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
