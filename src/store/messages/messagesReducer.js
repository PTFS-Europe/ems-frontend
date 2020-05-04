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
        default:
            return state;
    }
};

export default reducer;
