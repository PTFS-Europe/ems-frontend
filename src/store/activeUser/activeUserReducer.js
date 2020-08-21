import * as activeUserTypes from './activeUserTypes';

const initialState = {
    userDetails: {},
    loading: false,
    error: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case activeUserTypes.FETCH_ACTIVE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case activeUserTypes.FETCH_ACTIVE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                userDetails: {
                    id: action.payload.id,
                    role: action.payload.role_code
                }
            };
        case activeUserTypes.FETCH_ACTIVE_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default reducer;
