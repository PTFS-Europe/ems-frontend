import uid from 'uid';

import * as messagesTypes from './messagesTypes';
import { refreshQuery } from '../queries/queriesActions';

// Call a query action which will cause an associated
// query to update itself
export const doRefreshQuery = (id, dispatch) => {
    dispatch(refreshQuery(id));
};

export const lib = {
    doRefreshQuery
};

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
        const tempId = uid();
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
            .then((data) => {
                // Repopulate the query metadata
                lib.doRefreshQuery(data.query_id, dispatch);
                // Update our messages state
                return dispatch(sendMessageSuccess({ data, tempId }));
            })
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
export const deleteMessage = (message) => {
    return (dispatch) => {
        // Update our state to reflect that we've sent the request
        // This will be updated again once we have deleted the
        // message at the API
        dispatch(deleteMessageRequest({ id: message.id }));
        // Make the request
        return fetch(
            `${process.env.REACT_APP_API_URL}/messages/${message.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                method: 'DELETE'
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
            .then(() => {
                // Repopulate the query metadata
                lib.doRefreshQuery(message.query_id, dispatch);
                // Update our messages state
                return dispatch(deleteMessageSuccess({ id: message.id }));
            })
            .catch((error) =>
                // Update our error state
                dispatch(
                    deleteMessageFailure({
                        error: error.message,
                        id: message.id
                    })
                )
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
            .then((data) => {
                // Repopulate the query metadata
                lib.doRefreshQuery(message.query_id, dispatch);
                // Update our messages state
                return dispatch(editMessageSuccess(data));
            })
            .catch((error) =>
                // Update our error state
                dispatch(
                    editMessageFailure({ error: error.message, id: message.id })
                )
            );
    };
};

export const uploadFileRequest = (payload) => {
    return {
        type: messagesTypes.UPLOAD_FILE_REQUEST,
        payload
    };
};

export const uploadFileSuccess = (payload) => {
    return {
        type: messagesTypes.UPLOAD_FILE_SUCCESS,
        payload
    };
};

export const uploadFileFailure = (errorPayload) => {
    return {
        type: messagesTypes.UPLOAD_FILE_FAILURE,
        payload: errorPayload
    };
};

// Our action creator for uploading a file
export const uploadFile = (files, queryId) => {
    return (dispatch, getState) => {
        // Create the formdata
        let formData = new FormData();

        // Create an message tempId => filename mapping
        // This will enable us to update the correct message
        // when file uploads are complete
        const messageIdFilenameMap = {};

        // We need an array of messages to pass to the uploadFileRequest
        // reducer, so we can temporarily add them to the state while
        // they upload
        let messageArray = [];

        // files is a FileList, not an array. Although it does share
        // much of its API, so we can convert it into an array
        const fileArray = Array.from(files);

        // The name of the fieldname needs to vary depending on the
        // number of files, the [] indicates this is an array of files
        const key = fileArray.length === 1 ? 'userfile' : 'userfiles[]';

        // Determine the active user
        const { userDetails } = getState().activeUser;

        // Iterate through our files
        fileArray.forEach((file) => {
            // Add the file to the form body
            formData.append(key, file);
            // Prepare an object to be tempoarily added to our messageList
            // Generate a temporary ID for this message, it will enable
            // us to find this message when we get a response and need to
            // replace it. Add the temporary ID and filename to our mapping
            const tempId = uid();
            let sendObj = {
                id: tempId,
                creator_id: userDetails.id,
                query_id: queryId,
                content: null,
                originalname: file.name,
                pending: true
            };
            messageIdFilenameMap[file.name] = tempId;
            messageArray.push(sendObj);
        });

        // Update our state to reflect that we're uploading
        // This will be updated again once we have confirmation from
        // the API that the file was received
        dispatch(uploadFileRequest(messageArray));

        // Append the additional data required
        formData.append('queryId', queryId);
        formData.append('userId', userDetails.id);

        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/upload`, {
            method: 'POST',
            body: formData
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
            .then((data) => {
                // Repopulate the query metadata
                lib.doRefreshQuery(queryId, dispatch);
                // Replace the temporary messages with actual ones
                dispatch(
                    uploadFileSuccess({
                        data,
                        messageMap: messageIdFilenameMap
                    })
                );
            })
            .catch((error) =>
                dispatch(
                    uploadFileFailure({
                        error,
                        messageMap: messageIdFilenameMap
                    })
                )
            );
    };
};
