import * as unseenTypes from './unseenTypes';
import api from '../../util/EmsApi';
import { debounce } from '../../util/ui';

export const setMounted = (payload) => {
    return {
        type: unseenTypes.SET_MOUNTED,
        payload
    };
};

export const updateUnseenCounts = (payload) => {
    return {
        type: unseenTypes.UPDATE_UNSEEN_COUNTS,
        payload
    };
};

export const updateMostRecentSeenLocal = (payload) => {
    return {
        type: unseenTypes.UPDATE_MOST_RECENT_SEEN_LOCAL,
        payload
    };
};

export const updateMostRecentSeenRequest = (payload) => {
    return {
        type: unseenTypes.UPDATE_MOST_RECENT_SEEN_REQUEST,
        payload
    };
};

export const updateMostRecentSeenSuccess = (payload) => {
    return {
        type: unseenTypes.UPDATE_MOST_RECENT_SEEN_SUCCESS,
        payload
    };
};

export const updateMostRecentSeenFailure = (payload) => {
    return {
        type: unseenTypes.UPDATE_MOST_RECENT_SEEN_FAILURE,
        payload
    };
};

// A debounced version of the API call we're making to
// update most recent seen
const debouncedUpdateMostRecentSeen = debounce(
    ({ queryId, userId, mostRecentSeen, dispatch }) => {
        // Make the request
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            data: { most_recent_seen: mostRecentSeen }
        };
        // If we're in dev mode we want to enable CORS mode
        if (process.env.NODE_ENV === 'development') {
            options.mode = 'cors';
        }
        return api
            .makeRequest(`/queryuser/${queryId}/user/${userId}`, options)
            .then((response) => response.data)
            .then((data) =>
                // Update our state
                dispatch(updateUnseenCounts({ [data.query_id]: data.unseen_count }))
            )
            .catch((error) =>
                dispatch(updateMostRecentSeenFailure())
            );
    },
    500
);

// We're we immediately update local state as soon as it's requested
// but we only update the API after a debounce period
export const updateMostRecentSeen = ({ queryId, messageId }) => {
    return (dispatch, getState) => {
        // Dispatch to update our local state
        dispatch(updateMostRecentSeenLocal({ [queryId]: messageId }));
        // Only make the API request if we can
        const userId = getState().activeUser.userDetails.id;
        if (!queryId || !messageId) {
            return;
        }
        const mostRecentSeen = getState().unseen.mostRecentSeen[queryId];
        debouncedUpdateMostRecentSeen({ queryId, userId, mostRecentSeen, dispatch });
    };
};