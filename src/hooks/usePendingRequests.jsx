import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';

const usePendingRequests = () => {
    const {user} = useContext(AuthContext)
    const {data : pendingRequests = [], refetch: pendingRequestsRefetch} = useQuery({
        queryKey: ['pending-events'],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/get-pending-events/${user?.email}`);
            return res.data
        },
    }
    )

    return [pendingRequests, pendingRequestsRefetch]
};

export default usePendingRequests;