import * as activeMessageTypes from './activeMessageTypes';

export const setActiveMessageId = (payload) => {
    return {
        type: activeMessageTypes.SET_ACTIVE_MESSAGE_ID,
        payload
    };
};

export const setActiveMessageText = (payload) => {
    return {
        type: activeMessageTypes.SET_ACTIVE_MESSAGE_TEXT,
        payload
    };
};
