import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAllClubs = () => {
    const {data : allEvents = [], refetch: allEventsRefetch} = useQuery({
        queryKey: ['allEvents'],
        queryFn: async () => {
            const res = await axios.get(`https://clubsyncserver.vercel.app/all-events`);
            return res.data
        },
    }
    )

    return [allEvents, allEventsRefetch]
};

export default useAllClubs;