import { useParams } from "react-router-dom";
import useAllClubs from "../../../hooks/useAllClubs";

const ClubDetails = () => {
  const { id } = useParams();
  const [allClubs] = useAllClubs();
  const club = allClubs.find((c) => c._id === id);

  if (!club) {
    return <div className="text-center text-gray-600">Club not found</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto mt-8">
      <div className="flex items-center mb-8">
        <img
          src={club.photo_url}
          alt={club.name}
          className="w-28 h-28 rounded-full mr-6 border-2 border-[#303972]"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#303972]">{club.fullName}</h1>
          <p className="text-gray-500 text-lg">Email: {club.email}</p>
        </div>
      </div>

      {club.description && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#303972] mb-4">Description</h2>
          <p className="text-gray-700">{club.description}</p>
        </div>
      )}

      {club.totalMembers && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#303972] mb-4">Total Members</h2>
          <p className="text-gray-700">{club.totalMembers}</p>
        </div>
      )}

      {club.advisors?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#303972] mb-4">Advisors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {club.advisors.map((advisor, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg flex items-center shadow-md"
              >
                <img
                  src={advisor.photo}
                  alt={advisor.name}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-[#303972]"
                />
                <div>
                  <h3 className="text-xl font-semibold text-[#303972]">{advisor.name}</h3>
                  <p className="text-gray-500">Email: {advisor.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {club.panel?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#303972] mb-4">Club Panel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {club.panel.map((member, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg flex items-center shadow-md"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-[#303972]"
                />
                <div>
                  <h3 className="text-xl font-semibold text-[#303972]">{member.name}</h3>
                  <p className="text-gray-500">Email: {member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {club.notableAlumnis?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#303972] mb-4">Notable Alumni</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {club.notableAlumnis.map((alumni, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg flex items-center shadow-md"
              >
                <img
                  src={alumni.photo}
                  alt={alumni.name}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-[#303972]"
                />
                <div>
                  <h3 className="text-xl font-semibold text-[#303972]">{alumni.name}</h3>
                  <p className="text-gray-500">Email: {alumni.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetails;
