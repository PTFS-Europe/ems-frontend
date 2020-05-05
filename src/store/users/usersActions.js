import * as usersTypes from './usersTypes';

export const fetchUsersRequest = () => {
    return {
        type: usersTypes.FETCH_USERS_REQUEST
    };
};

export const fetchUsersSuccess = (users) => {
    return {
        type: usersTypes.FETCH_USERS_SUCCESS,
        payload: users
    };
};

export const fetchUsersFailure = (error) => {
    return {
        type: usersTypes.FETCH_USERS_FAILURE,
        payload: error
    };
};

// Our action creator for fetching users
export const fetchUsers = (args) => {
    const user_ids =
        args && args.hasOwnProperty('user_ids') ? args.user_ids : [];
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/users`;
        let shouldFetch = false;

        // Only retrieve new users if we need to
        // First check that the users we've been asked
        // to retrieve don't already exist our store
        if (user_ids.length > 0) {
            // Get the users we already know about
            const { usersList } = getState().users;
            // Now check if any of the users we've been asked to
            // get don't yet exist in usersList
            const usersToGet = user_ids.filter(
                (userId) =>
                    !usersList.some((existing) => existing.id === userId)
            );
            if (usersToGet.length > 0) {
                const usersString = usersToGet.join('_');
                url += `?user_ids=${usersString}`;
                shouldFetch = true;
            }
        }

        if (shouldFetch) {
            // Set our loading state to true
            dispatch(fetchUsersRequest());
            // Make the request
            return fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    // Update our users state
                    dispatch(fetchUsersSuccess(data));
                })
                .catch((error) => {
                    // Update our error state
                    dispatch(fetchUsersFailure(error.message));
                });
        } else {
            return Promise.resolve({});
        }
    };
};
