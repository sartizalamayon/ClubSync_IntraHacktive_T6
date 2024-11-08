import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const EventPlanner = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const showBudget = watch('needsBudget') || false;
  const showRoom = watch('needsRoom') || false;
  const showGuestPasses = watch('needsGuestPasses') || false;

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post('/api/events', data);
    },
  });

  const onSubmit = (data) => {
    console.log(data)
    mutation.mutate(data);
  };



  return (
    <div className="min-h-screen bg-[rgb(243,244,245)]">
      <div className="flex gap-8">
        {/* Main Form Section - 60% width */}
        <div className="w-[55%]">
          <h1 className="text-3xl font-semibold mb-8 text-[#4c44b3] text">Request for Events</h1>
          
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
                <label className="block mb-2 text-[#4c44b3] font-medium">Additional Requirements</label>
                <textarea
                  {...register('additionalRequirements')}
                  className="w-full p-2 bg-white border-[#4c44b3] border-opacity-30 border-2 rounded"
                  rows={4}
                  placeholder="Anything else you need - Sound System, IT support or something else. (Optional)"
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
              <div>
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
        <div className="w-[40%] flex flex-col gap-6">
          {/* Pending Events Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-64">
            <h2 className="text-red-500 text-lg font-semibold">Pending Events</h2>
            <p className="text-red-400">Events that is not responded by the OCA</p>
          </div>

          {/* Previous Proposals Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-64">
            <h2 className="text-red-500 text-lg font-semibold">Previous Proposals</h2>
            <p className="text-red-400">
              Events that is responded by the OCA
              <br />
              Here Two Types of thing will be there.
              <br />
              Accepted | Rejected
              <br />
              rejected ones will have a feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPlanner;