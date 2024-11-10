import { MdNotificationsActive } from "react-icons/md";
import useAllClubs from "../../../hooks/useAllClubs";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import { BsBuilding } from "react-icons/bs";
import { useState, useMemo } from "react";

const ClubInfo = () => {
  const [allClubs, allClubsRefetch, isLoading] = useAllClubs();
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtered clubs
  const filteredClubs = useMemo(() => {
    return allClubs.filter((club) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        club.name.toLowerCase().includes(searchTerm) ||
        club.fullName.toLowerCase().includes(searchTerm) ||
        club.email.toLowerCase().includes(searchTerm) ||
        (club.department && club.department.toLowerCase().includes(searchTerm))
      );
    });
  }, [allClubs, searchQuery]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <div>
            <a className="text-3xl font-bold text-[#303972]">All Clubs</a>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredClubs.length} of {allClubs.length} clubs
            </p>
          </div>
        </div>
        <div className="flex-none gap-4">
          <div className="form-control">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search clubs..."
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

      {/* Club Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {filteredClubs.map((club) => (
          <Link
            to={`/dashboard/club-info/${club._id}`}
            key={club._id}
            className="group"
          >
            <div
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
                          transform hover:-translate-y-1 overflow-hidden w-[95%]"
            >
              {/* Image Container - Now Square */}
              <div className="relative aspect-square overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
                <img
                  src={club.photo_url}
                  alt={`${club.name} Logo`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Club Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {club.name}
                  </h2>
                  <p className="text-white/90 text-sm line-clamp-2">
                    {club.fullName}
                  </p>
                </div>
              </div>

              {/* Club Details */}
              <div className="p-4">
                <div className="space-y-2">
                  {/* Email */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiOutlineMail className="h-4 w-4 text-[#4c44b3]" />
                    <span className="text-sm truncate" title={club.email}>
                      {club.email}
                    </span>
                  </div>

                  {/* Department/Location if available */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <BsBuilding className="h-4 w-4 text-[#4c44b3]" />
                    <span className="text-sm">
                      Department of {club.department || "General"}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-4 flex justify-end">
                  <span className="text-[#303472] text-sm font-medium group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* No Results Message */}
        {filteredClubs.length === 0 && (
          <div className="col-span-full text-center py-10">
            <div className="text-[#4c44b3] text-lg font-medium">
              No clubs found
            </div>
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubInfo;
