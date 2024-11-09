import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthProvider";
import { FaUserCircle } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const [clubs, setClub] = useState([]);

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

  useEffect(() => {
    axios.get("http://localhost:3000/get-club-list").then((res) => {
      setClub(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(240,241,255)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#4c44b3]">clubSync</h1>
          <p className="text-gray-500 mt-2">Streamline your club management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#4c44b3] mb-6">Welcome Back!</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Club Selection */}
            <div className="space-y-2">
              <label className="block text-[#4c44b3] font-medium text-sm mb-2">
                Select Your Club
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserCircle className="h-5 w-5 text-[#4c44b3]" />
                </div>
                <select
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-2 border-2 border-[#4c44b3] border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c44b3] focus:border-transparent bg-white"
                >
                  <option value="" disabled selected>
                    Choose your club
                  </option>
                  {clubs.map((club) => (
                    <option key={club.name} value={club.email}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#4c44b3] text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <a href="#" className="text-[#4c44b3] hover:underline">
              Forgot password?
            </a>
            <span className="mx-2 text-gray-400">•</span>
            <a href="#" className="text-[#4c44b3] hover:underline">
              Need help?
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          © 2024 clubSync. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;