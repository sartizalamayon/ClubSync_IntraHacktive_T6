import { Outlet } from "react-router-dom";
import Header from "../Pages/Shared/Header";

const Root = () => {
    // const location = useLocation();
    // const footer = location.pathname === "/join-us" || location.pathname.includes('/dashboard')? false : true;
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default Root;