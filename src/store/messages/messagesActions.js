import * as messagesTypes from './messagesTypes';

export const fetchMessagesRequest = () => {
    return {
        type: messagesTypes.FETCH_MESSAGES_REQUEST
    };
};

export const fetchMessagesSuccess = (messages) => {
    return {
        type: messagesTypes.FETCH_MESSAGES_SUCCESS,
        payload: messages
    };
};

export const fetchMessagesFailure = (error) => {
    return {
        type: messagesTypes.FETCH_MESSAGES_FAILURE,
        payload: error
    };
};

// Our action creator for fetching messages
export const fetchMessages = (args) => {
    return (dispatch) => {
        // Set our loading state to true
        dispatch(fetchMessagesRequest());
        // Make the request
        const params = args.queryId ? `?query_id=${args.queryId}` : '';
        return fetch(`${process.env.REACT_APP_API_URL}/messages${params}`)
            .then((response) => response.json())
            .then((data) => {
                // Update our messages state
                dispatch(fetchMessagesSuccess(data));
            })
            .catch((error) => {
                // Update our error state
                dispatch(fetchMessagesFailure(error.message));
            });
    };
};
