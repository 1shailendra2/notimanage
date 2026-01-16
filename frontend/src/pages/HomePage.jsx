import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRootGroup = async () => {
            try {
                const res = await api.get('/groups/root');
                if (res.data.group) {
                    navigate(`/group/${res.data.group._id}`);
                }
            } catch (error) {
                console.error("Failed to fetch root group", error);
                navigate('/login');
            }
        };
        fetchRootGroup();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
        </div>
    );
}
