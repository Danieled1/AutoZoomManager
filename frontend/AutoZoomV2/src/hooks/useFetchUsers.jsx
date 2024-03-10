// hooks/useFetchUsers.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';


export const useFetchUsers = (apiBaseUrl) => {
    const [usersMap, setUsersMap] = useState({});
    const [areUsersAvailable, setAreUsersAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${apiBaseUrl}/api/zoom-users/`);
                console.log(data);
                const mappedUsers = data.ZoomUsers.reduce((acc, user) => {
                    acc[user.zoomAccountId] = user;
                    return acc;
                }, {});
                setUsersMap(mappedUsers);
                setAreUsersAvailable(Object.keys(mappedUsers).length > 0);
                setError(null);
            } catch (err) {
                setError(err.message);
                setUsersMap({});
                setAreUsersAvailable(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [apiBaseUrl]);

    return { usersMap, areUsersAvailable, loading, error };
};
