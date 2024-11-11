import { useState, useEffect, useContext } from 'react';
import { MdAdd, MdDelete, MdClose } from 'react-icons/md';
import { BiTime } from 'react-icons/bi';
import { BsPerson } from 'react-icons/bs';
import axios from 'axios';

import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthProvider';
import useCurrUser from '../../hooks/useCurrUser';

// This helper function formats the date
const formatDate = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMilliseconds = targetDate - now;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    // For future dates
    if (diffInDays > 0) {
      if (diffInDays === 1) return 'tomorrow';
      if (diffInDays < 7) return `in ${diffInDays} days`;
      if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      }
      if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `in ${months} ${months === 1 ? 'month' : 'months'}`;
      }
      const years = Math.floor(diffInDays / 365);
      return `in ${years} ${years === 1 ? 'year' : 'years'}`;
    }
  
    // For past dates
    if (diffInDays < 0) {
      const positiveDays = Math.abs(diffInDays);
      if (positiveDays === 1) return 'yesterday';
      if (positiveDays < 7) return `${positiveDays} days ago`;
      if (positiveDays < 30) {
        const weeks = Math.floor(positiveDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      }
      if (positiveDays < 365) {
        const months = Math.floor(positiveDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      }
      const years = Math.floor(positiveDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  
    // For today
    if (diffInHours > 0) return `in ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}`;
    if (diffInHours < 0) {
      const positiveHours = Math.abs(diffInHours);
      return `${positiveHours} ${positiveHours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInMinutes > 0) return `in ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`;
    if (diffInMinutes < 0) {
      const positiveMinutes = Math.abs(diffInMinutes);
      return `${positiveMinutes} ${positiveMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  
    return 'just now';
  };

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [currUser] = useCurrUser();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('https://clubsyncserver.vercel.app/announcements');
      setAnnouncements(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleAdd = async (formData) => {
    try {
      const response = await axios.post('https://clubsyncserver.vercel.app/add-announcement', {
        ...formData,
        date: new Date(),
        posterEmail: user.email
      });
      
      if (response.data.insertedId) {
        fetchAnnouncements();
        setShowAddModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Announcement Added Successfully',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'rounded-xl'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Adding Announcement',
        text: error.message,
        customClass: {
          popup: 'rounded-xl'
        }
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4c44b3',
        cancelButtonColor: '#FB7D5B',
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          popup: 'rounded-xl'
        }
      });

      if (result.isConfirmed) {
        await axios.delete(`https://clubsyncserver.vercel.app/delete-announcement/${id}`);
        fetchAnnouncements();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Announcement has been deleted.',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'rounded-xl'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        customClass: {
          popup: 'rounded-xl'
        }
      });
    }
  };

  const filteredAnnouncements = announcements?.filter(announcement => 
    activeTab === 'all' ? true : announcement?.posterEmail === user?.email
  );

  const canDelete = (announcement) => 
    currUser?.role === 'oca' || announcement?.posterEmail === user?.email;

  return (
    <div className="bg-white rounded-xl shadow-sm h-full">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#303972]">Announcements</h2>
          {(currUser?.role === 'oca' || currUser?.role === 'club') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-[#4c44b3]/10 text-[#4c44b3] rounded-lg hover:bg-[#4c44b3]/20 transition-colors"
              title="Add Announcement"
            >
              <MdAdd size={24} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'all' 
                ? 'bg-[#4c44b3] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('our')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'our' 
                ? 'bg-[#4c44b3] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            Ours
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="px-6 pb-6 max-h-[calc(100vh-20rem)] overflow-y-auto space-y-4 scroll-smooth">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement._id}
              className="bg-gray-50 rounded-xl p-4 relative group hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#303972] text-base">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {announcement.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <BsPerson className="h-4 w-4" />
                      <span className="text-sm">
                        {announcement?.posterEmail?.split('@')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <BiTime className="h-4 w-4" />
                      <span className="text-sm">
                        {formatDate(announcement.date)}
                      </span>
                    </div>
                  </div>
                </div>
                {canDelete(announcement) && (
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <MdDelete size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No announcements found
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <AddAnnouncementModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
};

const AddAnnouncementModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all fields',
        customClass: {
          popup: 'rounded-xl'
        }
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-[#303972]">New Announcement</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white"
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent resize-none bg-white   "
              placeholder="Enter announcement details"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4c44b3] text-white rounded-lg hover:bg-[#3f3794] transition-colors text-sm"
            >
              Post Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Announcements;
