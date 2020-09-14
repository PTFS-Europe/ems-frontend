import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    fetchActiveUser,
    logoutUser
} from '../store/activeUser/activeUserActions';

// A hook to return the active user object or an empty object if there
// isn't one
export default () => {
    const [user, setUser] = useState({});
    const activeUser = useSelector((state) => state.activeUser);
    const usersList = useSelector((state) => state.users.usersList);

    const dispatch = useDispatch();

    // Ensure we have an active user object
    useEffect(() => {
        if (!activeUser.userDetails.id) {
            dispatch(fetchActiveUser());
        }
        // We only want this to fire on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Make sure we're returning up to date data
    useEffect(() => {
        if (!activeUser.userDetails.id || usersList.length === 0) {
            setUser({});
        } else if (!user.id) {
            setUser(
                usersList.find((user) => user.id === activeUser.userDetails.id)
            );
        }
    }, [activeUser, usersList, user.id]);

    const logout = () => {
        dispatch(logoutUser());
    };

    return [user, logout];
};
