import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { BsShieldLock } from "react-icons/bs";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useContext(AuthContext);
  const { register, handleSubmit, setValue, watch } = useForm();
  // const [clubs, setClub] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const onSubmit = (data) => {
    login(data.email, data.password)
      .then(async () => {
        navigate("/dashboard");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged In",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: `${error}`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  const { data: clubs, isLoading } = useQuery({
    queryKey: ["clubInfo"],
    queryFn: () =>
      axios.get(`http://localhost:3000/get-club-list`).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-[#4D44B5]"></span>
      </div>
    );
  }

  const handleClubSelect = (club) => {
    setSelectedClub(club);
    setValue("email", club.email);
    setIsDropdownOpen(false);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[rgb(240,241,255)] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#4c44b3]">clubSync</h1>
          <p className="text-gray-500 mt-2">Streamline your club management</p>
        </motion.div>

        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-[#4c44b3] mb-6">
            Welcome Back!
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#4c44b3] font-medium text-sm mb-2">
                Select Your Organization
              </label>
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <FaUserCircle className="h-5 w-5 text-[#4c44b3] absolute left-3" />
                    <span
                      className={
                        selectedClub ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedClub ? selectedClub.name : "Choose your Role"}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="h-4 w-4 text-[#4c44b3]" />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div className="p-2">
                        {clubs.map((club) => (
                          <motion.div
                            key={club.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleClubSelect(club)}
                            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg transition-colors ${
                              club.name === "OCA"
                                ? "bg-gradient-to-r from-[#4c44b3] to-[#6a63d5] hover:from-[#443ca0] hover:to-[#5d56c8]"
                                : "hover:bg-[#4c44b3] hover:bg-opacity-10"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                club.name === "OCA"
                                  ? "bg-white bg-opacity-20"
                                  : "bg-[#4c44b3] bg-opacity-10"
                              }`}
                            >
                              {club.name === "OCA" ? (
                                <BsShieldLock className="h-4 w-4 text-white" />
                              ) : (
                                <FaUserCircle className="h-4 w-4 text-[#4c44b3]" />
                              )}
                            </div>
                            <div>
                              <div
                                className={`text-sm font-medium ${
                                  club.name === "OCA"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {club.name}
                              </div>
                              <div
                                className={`text-xs ${
                                  club.name === "OCA"
                                    ? "text-white text-opacity-80"
                                    : "text-gray-500"
                                }`}
                              >
                                {club.email}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input type="hidden" {...register("email")} />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="block text-[#4c44b3] font-medium text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-[#4c44b3]" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white"
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#4c44b3] text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              Sign In
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div
              className="mt-6 text-center text-sm tooltip hover:tooltip-open"
              data-tip="mail us at: admin@clubsync.com"
            >
              <a
                href="#"
                className="text-[#4c44b3] hover:underline w-full text-center"
              >
                Need help?
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          © 2024 clubSync. All rights reserved.
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
