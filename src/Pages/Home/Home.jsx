import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsCalendarEvent, BsBuilding, BsPeople } from "react-icons/bs";
import { MdApproval } from "react-icons/md";
import { BiTime } from "react-icons/bi";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
  >
    <div className="h-12 w-12 rounded-lg bg-[#4c44b3]/10 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-[#4c44b3]" />
    </div>
    <h3 className="text-lg font-bold text-[#303972] mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

const Home = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home | ClubSync</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <div className="min-h-screen bg-[rgb(240,241,255)]">
        {/* Navbar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#303972]">clubSync</span>
              </div>
              <div className="flex items-center gap-6">
                <Link 
                  to="/login" 
                  className="bg-[#4c44b3] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 
                           transition-all font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Improved Hero Section with geometric patterns */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#4c44b3] to-[#303972]">
          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rotate-45 transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-white rotate-45 transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-white rotate-45 transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center text-center py-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white max-w-3xl"
              >
                <div className="inline-block px-4 py-1 bg-white/10 rounded-full mb-6">
                  <span className="text-white text-sm font-medium">Manage Your Club Better</span>
                </div>
                <h1 className="text-6xl font-bold leading-tight mb-6">
                  Streamline Your 
                  <span className="text-[#FB7D5B]"> Club Management</span> Experience
                </h1>
                <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
                  ClubSync helps university clubs organize events, manage approvals, and 
                  coordinate seamlessly with the Office of Club Affairs.
                </p>
                <div className="flex flex-wrap gap-6 justify-center">
                  <Link 
                    to="/login"
                    className="bg-white text-[#4c44b3] px-8 py-4 rounded-lg hover:bg-opacity-90 
                             transition-all font-medium text-lg shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                  <a 
                    href="#features"
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg 
                             hover:bg-white/10 transition-all font-medium text-lg"
                  >
                    Learn More
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#303972] mb-4">
                Everything You Need to Manage Your Club
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From event planning to approval management, ClubSync provides all the tools
                you need to run your university club efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={BsCalendarEvent}
                title="Event Planning"
                description="Create and manage club events with ease. Handle registrations, venues, and schedules all in one place."
              />
              <FeatureCard 
                icon={MdApproval}
                title="Quick Approvals"
                description="Streamlined approval process for all club activities. Get faster responses from the Office of Club Affairs."
              />
              <FeatureCard 
                icon={BsBuilding}
                title="Room Management"
                description="Book rooms and venues for your events with real-time availability checking and instant confirmation."
              />
              <FeatureCard 
                icon={BiTime}
                title="Real-time Updates"
                description="Get instant notifications about event approvals, room bookings, and important announcements."
              />
              <FeatureCard 
                icon={BsPeople}
                title="Member Management"
                description="Keep track of club members, roles, and responsibilities. Manage executive committee efficiently."
              />
              <FeatureCard 
                icon={BsCalendarEvent}
                title="Central Calendar"
                description="Access a centralized calendar showing all club events and activities across the university."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#303972] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">clubSync</h3>
                <p className="text-gray-300 text-sm">
                  Streamlining university club management and event planning.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/login" className="hover:text-[#FB7D5B] transition-colors">Sign In</Link></li>
                  <li><a href="#features" className="hover:text-[#FB7D5B] transition-colors">Features</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li>Email: support@clubsync.com</li>
                  <li>Phone: (123) 456-7890</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  {/* Add social media icons here */}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
              © 2024 clubSync. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;