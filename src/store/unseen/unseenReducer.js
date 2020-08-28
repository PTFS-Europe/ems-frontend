import * as messagesTypes from '../messages/messagesTypes';
import * as unseenTypes from './unseenTypes';

const initialState = {
    mounted: [],
    unseenCounts: {},
    mostRecentSeen: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case messagesTypes.FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                mounted: []
            };
        case unseenTypes.SET_MOUNTED:
            return {
                ...state,
                mounted: [...state.mounted, action.payload]
            };
        case unseenTypes.UPDATE_UNSEEN_COUNTS:
            return {
                ...state,
                unseenCounts: {
                    ...state.unseenCounts,
                    ...action.payload
                }
            };
        case unseenTypes.UPDATE_MOST_RECENT_SEEN_LOCAL:
            return {
                ...state,
                mostRecentSeen: {
                    ...state.mostRecentSeen,
                    ...action.payload
                }
            };
        case unseenTypes.UPDATE_MOST_RECENT_SEEN_REQUEST:
            return {
                ...state,
                mostRecentSeen: {
                    ...state.mostRecentSeen,
                    ...action.payload
                }
            };
        case unseenTypes.UPDATE_MOST_RECENT_SEEN_SUCCESS:
            return {
                ...state,
                mostRecentSeen: {
                    ...state.mostRecentSeen,
                    ...action.payload
                }
            };
        case unseenTypes.UPDATE_MOST_RECENT_SEEN_FAILURE:
            // The request failed, don't modify the state
            return state;
        default:
            return state;
    }
};

export default reducer;
