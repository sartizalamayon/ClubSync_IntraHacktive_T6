import { Outlet } from "react-router-dom";

const Root = () => {
  // const location = useLocation();
  // const footer = location.pathname === "/join-us" || location.pathname.includes('/dashboard')? false : true;
  return (
    <>
      <div className="font-poppins">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
