import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

const useCurrUser = () => {
    const {user} = useContext(AuthContext)

    const mail = user?.email;

    const {data : currUser = {}, refetch: currUserRefetch} = useQuery({
        queryKey: ['currUser', user?.email],
        queryFn: async () => {
            const res = await axios.get(`https://clubsyncserver.vercel.app/current-user/${mail}`);
            return res.data
        },
    }
    )

    return [currUser, currUserRefetch]
};

export default useCurrUser;