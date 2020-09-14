import * as usersTypes from './usersTypes';
import api from '../../classes/EmsApi';

export const fetchUsersRequest = (ids) => {
    return {
        type: usersTypes.FETCH_USERS_REQUEST,
        payload: ids
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
// We only want to fetch users that:
// - We don't already know about
// - We're not already fetching
export const fetchUsers = (args) => {
    const user_ids = args &&
        Object.prototype.hasOwnProperty.call(args, 'user_ids') ?
        args.user_ids :
        [];
    return (dispatch, getState) => {
        let url = 'users';

        // Only retrieve new users if we need to
        // First check that the users we've been asked
        // to retrieve don't already exist our store
        if (user_ids.length > 0) {
            // Get the users we already know about
            const { usersList, loading } = getState().users;
            // Now check if any of the users we've been asked to
            // get don't yet exist in usersList and are not
            // already being fetched
            const usersToGet = user_ids.filter(
                (userId) =>
                    !loading.includes(userId) &&
                    !usersList.some((existing) => existing.id === userId)
            );

            if (usersToGet.length > 0) {
                const usersString = usersToGet.join('_');
                url += `?user_ids=${usersString}`;
                // Set our loading state to the IDs we're fetching
                dispatch(fetchUsersRequest(usersToGet));
                // Make the request
                return api
                    .makeRequest(url, {})
                    .then((response) => response.data)
                    .then((data) => {
                        // Update our users state
                        dispatch(fetchUsersSuccess(data));
                    })
                    .catch((error) => {
                        // Update our error state
                        dispatch(fetchUsersFailure(error.message));
                    });
            }
        } else {
            return Promise.resolve({});
        }
    };
};
