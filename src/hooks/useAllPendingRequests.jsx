import { useQuery } from '@tanstack/react-query'
import axios from 'axios';

const useAllPendingRequests = () => {
    const {data : allPendingRequests = [], refetch: allPendingRequestsRefetch} = useQuery({
        queryKey: ['allPendingRequests'],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/get-all-pending-events`);
            return res.data
        },
    }
    )

    return [allPendingRequests, allPendingRequestsRefetch]
};

export default useAllPendingRequests;