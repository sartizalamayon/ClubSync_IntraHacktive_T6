import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "axios";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    axios.get(`http://localhost:3000/`);
  }, []);

  


  return (
    <div className="flex flex-col fixed border min-h-screen my-auto">
      <div className="">
        <svg
          width="1017.000000"
          height="140.000000"
          viewBox="0 0 1017 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <desc>Created with Pixso.</desc>
          <defs />
          <path
            id="Mask"
            d="M20 0L997 0C1008.05 0 1017 8.95 1017 20L1017 140L0 140L0 20C0 8.95 8.95 0 20 0Z"
            fill="#428777"
            fill-opacity="1.000000"
            fill-rule="evenodd"
          />
        </svg>
      </div>
      <div className="absolute mt-10 ml-4">
        <svg
          width="200.000000"
          height="200.000015"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <desc>Created with Pixso.</desc>
          <defs />
          <rect
            id="placeholder"
            y="0.000010"
            rx="100.000000"
            width="200.000000"
            height="200.000000"
            fill="#C1BBEB"
            fill-opacity="1.000000"
          />
          <rect
            id="placeholder"
            x="4.000000"
            y="4.000010"
            rx="96.000000"
            width="192.000000"
            height="192.000000"
            stroke="#FFFFFF"
            stroke-opacity="1.000000"
            stroke-width="8.000000"
          />
        </svg>
      </div>
      <div className="pt-24"></div>
      <div className="p-6">
        <h1 className="text-3xl font-bold">Walter White</h1>
        <p className="font-bold">Student</p>
      </div>
      <div className="grid grid-cols-4 pl-32">
        <h1>Parents</h1>
        <h1>Address</h1>
        <h1>Phone</h1>
        <h1>Email</h1>
      </div>
      <div className=" grid grid-cols-4">
        <p>Carl Max</p>
        <p>Dhoom 5</p>
        <p>43857325892348</p>
        <p>kiss@gmail.com</p>
      </div>
    </div>
  );
};

export default DashboardHome;
