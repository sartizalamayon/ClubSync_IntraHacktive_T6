import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAllClubs = () => {
    const {data : allClubs = [], refetch: allClubsRefetch} = useQuery({
        queryKey: ['allClubs'],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/all-clubs`);
            return res.data
        },
    }
    )

    return [allClubs, allClubsRefetch]
};

export default useAllClubs;