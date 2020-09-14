import { useEffect, useState } from 'react';

import api from '../classes/EmsApi';

// A hook to return the available authentication types
export default () => {
    const [authTypes, setAuthTypes] = useState([]);

    // Retrieve and make available the authentication types
    useEffect(() => {
        api.makeRequest('/authtypes').then(({ data }) => {
            setAuthTypes(data);
        });
    }, []);

    return authTypes;
};
