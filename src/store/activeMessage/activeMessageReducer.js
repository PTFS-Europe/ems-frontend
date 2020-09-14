import * as activeMessageTypes from './activeMessageTypes';

const initialState = {
    id: null,
    text: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case activeMessageTypes.SET_ACTIVE_MESSAGE_ID: {
        return {
            ...state,
            id: action.payload
        };
    }
    case activeMessageTypes.SET_ACTIVE_MESSAGE_TEXT: {
        return {
            ...state,
            text: action.payload
        };
    }
    default:
        return state;
    }
};

export default reducer;
