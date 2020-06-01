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
            content: message.content
        };
        // Generate a temporary ID for this message, it will enable
        // us to find this message when we get a response and need to
        // replace it
        const tempId = Date.now();
        // Update our state to reflect that we've sent the request
        // We update our state with the message here, it is then
        // replaced once we receive a response
        dispatch(sendMessageRequest({ ...sendObj, id: tempId, pending: true }));
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

export const deleteMessageRequest = (requestBody) => {
    return {
        type: messagesTypes.DELETE_MESSAGE_REQUEST,
        payload: requestBody
    };
};

export const deleteMessageSuccess = (success) => {
    return {
        type: messagesTypes.DELETE_MESSAGE_SUCCESS,
        payload: success
    };
};

export const deleteMessageFailure = (errorPayload) => {
    return {
        type: messagesTypes.DELETE_MESSAGE_FAILURE,
        payload: errorPayload
    };
};

// Our action creator for deleting a message
export const deleteMessage = ({ id }) => {
    return (dispatch) => {
        // Update our state to reflect that we've sent the request
        // This will be updated again once we have deleted the
        // message at the API
        dispatch(deleteMessageRequest({ id }));
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/messages/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'DELETE'
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
            .then(() =>
                // Update our messages state
                dispatch(deleteMessageSuccess({ id }))
            )
            .catch((error) =>
                // Update our error state
                dispatch(deleteMessageFailure({ error: error.message, id }))
            );
    };
};

export const editMessageRequest = (requestBody) => {
    return {
        type: messagesTypes.EDIT_MESSAGE_REQUEST,
        payload: requestBody
    };
};

export const editMessageSuccess = (success) => {
    return {
        type: messagesTypes.EDIT_MESSAGE_SUCCESS,
        payload: success
    };
};

export const editMessageFailure = (errorPayload) => {
    return {
        type: messagesTypes.EDIT_MESSAGE_FAILURE,
        payload: errorPayload
    };
};

// Our action creator for editing a message
export const editMessage = (message) => {
    return (dispatch) => {
        // Update our state to reflect that we've sent the request
        // This will be updated again once we have confirmation from
        // the API that the message was edited
        dispatch(editMessageRequest(message));
        const sendObj = {
            content: message.content
        };
        // Make the request
        return fetch(
            `${process.env.REACT_APP_API_URL}/messages/${message.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(sendObj)
            }
        )
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
                dispatch(editMessageSuccess(data))
            )
            .catch((error) =>
                // Update our error state
                dispatch(
                    editMessageFailure({ error: error.message, id: message.id })
                )
            );
    };
};
