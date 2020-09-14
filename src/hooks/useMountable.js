import { useState, useEffect } from 'react';

import api from '../classes/EmsApi';

// A hook to return whether a component can mount. May depend
// on the getting of a token
export default () => {
    const [complete, setComplete] = useState();

    // An array of paths that should not be blocked by token refresh
    const tokenRefreshWhitelist = ['login'];

    useEffect(() => {
        const path = window.location.pathname;
        const whitelisted = tokenRefreshWhitelist.find((entry) =>
            path.includes(entry)
        );
        // If this path is not whitelisted, we need to get the token before
        // rendering
        if (!whitelisted) {
            api.makeRequest('/token').finally(() => setComplete(true));
        } else {
            // We can render immediately
            setComplete(true);
        }
        // This hook should only run on mount, stop bugging me
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return complete;
};
