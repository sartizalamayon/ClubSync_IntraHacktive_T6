import { MdNotificationsActive } from "react-icons/md";
import useAllClubs from "../../../hooks/useAllClubs";

const ClubInfo = () => {
  const [allClubs, allClubsRefetch] = useAllClubs();

  console.log(allClubs);

  return (
    <div>
      {/* Header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972]">All Clubs</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            {/* Search Input */}
            <label className="input input-bordered flex items-center gap-2 rounded-full bg-white">
              <input
                type="text"
                className="grow bg-white"
                placeholder="Search"
              />
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
          {/* Notification and Profile */}
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

      {/* Club Cards Section */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allClubs.map((club) => (
          <div
            key={club._id}
            className="bg-white p-5 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => window.location.href = `/dashboard/club-info/${club._id}`}
          >
            <img
              src={club.photo_url}
              alt={`${club.name} Logo`}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-[#303972]">{club.name}</h2>
            <p className="text-sm text-gray-600">{club.fullName}</p>
            <p className="text-sm text-gray-500 mt-2">{club.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubInfo;
