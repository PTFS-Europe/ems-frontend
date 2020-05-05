import * as usersTypes from './usersTypes';

// This object is for users we need to know about, initially
// senders of messages

const initialState = {
    loading: false,
    usersList: [],
    error: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case usersTypes.FETCH_USERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case usersTypes.FETCH_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                usersList: action.payload,
                error: ''
            };
        case usersTypes.FETCH_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                usersList: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default reducer;
