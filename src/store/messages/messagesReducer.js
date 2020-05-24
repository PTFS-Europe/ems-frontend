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
            // be embellished if/when a response arrives
            return {
                ...state,
                loading: true,
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
        default:
            return state;
    }
};

export default reducer;
