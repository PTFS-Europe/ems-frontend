import * as messagesTypes from './messagesTypes';

const initialState = {
    loading: false,
    messageList: [],
    error: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case messagesTypes.FETCH_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case messagesTypes.FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                messageList: action.payload,
                error: ''
            };
        case messagesTypes.FETCH_MESSAGES_FAILURE:
            return {
                ...state,
                loading: false,
                messageList: [],
                error: action.payload
            };
        case messagesTypes.SEND_MESSAGE_REQUEST:
            // Add the just sent message to our state, it will
            // be replaced if/when a response arrives
            return {
                ...state,
                messageList: [...state.messageList, action.payload]
            };
        case messagesTypes.SEND_MESSAGE_SUCCESS:
            // Find and replace the message that we've just received
            // from the API
            const updatedMessages = state.messageList.map((msg) => {
                if (msg.id !== action.payload.tempId) {
                    return msg;
                }
                return action.payload.data;
            });
            return {
                ...state,
                loading: false,
                messageList: updatedMessages,
                error: ''
            };
        case messagesTypes.SEND_MESSAGE_FAILURE:
            // The message probably didn't get accepted by the API,
            // so remove it from our local state
            // TODO: We should probably replace the message with an
            // "Unable to send" error instead
            const filteredMessages = state.messageList.filter(
                (msg) => msg.id !== action.payload.tempId
            );
            return {
                ...state,
                loading: false,
                messageList: filteredMessages,
                error: action.payload
            };
        case messagesTypes.DELETE_MESSAGE_REQUEST:
            // Find and modify the message in our state, adding a
            // pending property, so the UI updates to indicate
            // something is happening with this message
            const updatedMessagesDelPending = state.messageList.map((msg) => {
                if (msg.id !== action.payload.id) {
                    return msg;
                }
                return {
                    ...msg,
                    pending: true
                };
            });
            return {
                ...state,
                messageList: updatedMessagesDelPending
            };
        case messagesTypes.DELETE_MESSAGE_SUCCESS:
            // Remove the message from our local state
            let updatedMessagesDelSuccess = [];
            state.messageList.forEach((msg) => {
                if (msg.id !== action.payload.id) {
                    updatedMessagesDelSuccess.push(msg);
                }
            });
            return {
                ...state,
                loading: false,
                messageList: updatedMessagesDelSuccess,
                error: ''
            };
        case messagesTypes.DELETE_MESSAGE_FAILURE:
            // The deletion probably didn't get accepted by the API,
            // so just update the pending status for the message
            // TODO: Add some UI feedback as to what is happening
            const updatedMessagesDelFailure = state.messageList.map((msg) => {
                if (msg.id !== action.payload.id) {
                    return msg;
                }
                delete msg.pending;
                return msg;
            });
            return {
                ...state,
                loading: false,
                messageList: updatedMessagesDelFailure,
                error: action.payload
            };
        case messagesTypes.EDIT_MESSAGE_REQUEST:
            // Find and modify the message in our state, adding a
            // pending property, so the UI updates to indicate
            // something is happening with this message
            const updatedMessagesEditPending = state.messageList.map((msg) => {
                if (msg.id !== action.payload.id) {
                    return msg;
                }
                return {
                    ...msg,
                    pending: true
                };
            });
            return {
                ...state,
                messageList: updatedMessagesEditPending
            };
        case messagesTypes.EDIT_MESSAGE_SUCCESS:
            // Update the message that was edited
            const editedMessages = state.messageList.map((msg) => {
                if (msg.id !== action.payload.id) {
                    return msg;
                } else {
                    return action.payload;
                }
            });
            return {
                ...state,
                loading: false,
                messageList: editedMessages,
                error: ''
            };
        case messagesTypes.EDIT_MESSAGE_FAILURE:
            // The edit probably didn't get accepted by the API,
            // so just update the pending status for the message
            // TODO: Add some UI feedback as to what is happening
            const updatedMessagesEditFailure = state.messageList.map((msg) => {
                if (msg.id !== action.payload.id) {
                    return msg;
                }
                delete msg.pending;
                return msg;
            });
            return {
                ...state,
                loading: false,
                messageList: updatedMessagesEditFailure,
                error: action.payload
            };
        case messagesTypes.UPLOAD_FILE_REQUEST:
            // Add the uploading flag to the messages
            const msgUploading = action.payload.map((message) => ({
                ...message,
                uploading: true
            }));
            return {
                ...state,
                messageList: [...state.messageList, ...msgUploading]
            };
        case messagesTypes.UPLOAD_FILE_SUCCESS:
            // Find and replace the messages that we've just
            // received from the API
            // Our iteration of messageList is reversed because it is
            // conceivable that the user will have uploaded files with
            // the same name multiple times, the one we want is the most
            // recent one. We also keep track of how many replacements we've made
            // so we can stop when we're done
            let replacements = 0;
            const msgMapSuccess = action.payload.messageMap;
            const updatedMsg = state.messageList.reverse().map((msg) => {
                // If this message is one we're concerned with
                if (
                    msgMapSuccess.hasOwnProperty(msg.originalname) &&
                    replacements < Object.keys(msgMapSuccess).length
                ) {
                    const newMsg = action.payload.data.find(
                        (retMsg) => retMsg.originalname === msg.originalname
                    );
                    replacements++;
                    return newMsg;
                } else {
                    return msg;
                }
            });
            return {
                ...state,
                messageList: updatedMsg.reverse()
            };
        case messagesTypes.UPLOAD_FILE_FAILURE:
            // The upload probably didn't get accepted by the API,
            // so remove it from our local state
            // TODO: We should probably replace the message with an
            // "Unable to send" error instead
            // Our iteration of messageList is reversed because it is
            // conceivable that the user will have uploaded files with
            // the same name multiple times, the one we want is the most
            // recent one. We also keep track of how many replacements we've made
            // so we can stop when we're done
            let removals = 0;
            let msgMapFailure = action.payload.messageMap;
            const filtered = state.messageList.reverse().filter((msg) => {
                if (
                    msgMapFailure.hasOwnProperty(msg.originalname) &&
                    removals < Object.keys(msgMapFailure).length
                ) {
                    removals++;
                    return false;
                } else {
                    return true;
                }
            });
            return {
                ...state,
                loading: false,
                messageList: filtered.reverse(),
                error: action.payload.error
            };
        default:
            return state;
    }
};

export default reducer;
