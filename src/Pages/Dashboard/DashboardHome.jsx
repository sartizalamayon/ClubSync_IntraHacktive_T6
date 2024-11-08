import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import axios from "axios";

const DashboardHome = () => {
    const {user} = useContext(AuthContext);
    useEffect(()=>{
        axios.get(`http://localhost:3000/`)
    },[])
    return (
        <div>
            this is home component dashboard {user.email}
        </div>
    );
};

export default DashboardHome;