import React from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);
const loading = false;
const user = true;
  if (loading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (user) {
    return children;}
  return <Navigate to={"/login"}></Navigate>;
};

export default PrivateRoute;
