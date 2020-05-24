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

export const sendMessageRequest = (requestBody) => {
    // Detemine the active user
    return {
        type: messagesTypes.SEND_MESSAGE_REQUEST,
        payload: requestBody
    };
};

export const sendMessageSuccess = (message) => {
    return {
        type: messagesTypes.SEND_MESSAGE_SUCCESS,
        payload: message
    };
};

export const sendMessageFailure = (error) => {
    return {
        type: messagesTypes.SEND_MESSAGE_FAILURE,
        payload: error
    };
};

// Our action creator for sending a message
export const sendMessage = ({ queryId, message }) => {
    return (dispatch, getState) => {
        // First determine the active user
        const { userDetails } = getState().activeUser;
        // Prepare our object for sending
        let sendObj = {
            creator_id: userDetails.id,
            query_id: queryId,
            content: message
        };
        // Generate a temporary ID for this message, it will enable
        // us to find this message when we get a response and need to
        // replace it
        const tempId = Date.now();
        // Update our state to reflect that we've sent the request,
        // we update our state with the message here, it is then
        // embellished once we receive a response
        sendObj = {
            ...sendObj,
            id: tempId
        };
        dispatch(sendMessageRequest(sendObj));
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/messages`, {
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(sendObj)
        })
            .then((response) => {
                // Fetch will not reject if we encounter an HTTP error
                // so we need to manually reject in that case
                if (!response.ok) {
                    throw Error(response.statusText);
                } else {
                    return response;
                }
            })
            .then((response) => response.json())
            .then((data) =>
                // Update our messages state
                dispatch(sendMessageSuccess({ data, tempId }))
            )
            .catch((error) =>
                // Update our error state
                dispatch(sendMessageFailure({ error: error.message, tempId }))
            );
    };
};
