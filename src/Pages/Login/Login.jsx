import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const [clubs, setClub] = useState([]);
  console.log(clubs);
  const onSubmit = (data) => {
    console.log(data);
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
    <div>
      <h1>Club Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm">
              Club list
            </label>
            <select
              {...register("email")}
              className="select select-info w-full max-w-xs"
            >
              <option disabled selected>
                Select Your Club
              </option>
              {clubs.map((club) => (
                <option key={club.name} value={club.email}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
            </div>
            <input
              type="password"
              {...register("password")}
              name="password"
              id="password"
              placeholder="*****"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
            />
          </div>
        </div>
        <input
          type="submit"
          value="Login"
          className="w-full btn text-text px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
        />
      </form>
    </div>
  );
};

export default Login;
