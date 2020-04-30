import * as queriesTypes from './queriesTypes';

const initialState = {
    loading: false,
    queryList: [],
    error: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case queriesTypes.FETCH_QUERIES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case queriesTypes.FETCH_QUERIES_SUCCESS:
            return {
                ...state,
                loading: false,
                queryList: action.payload,
                error: ''
            };
        case queriesTypes.FETCH_QUERIES_FAILURE:
            return {
                ...state,
                loading: false,
                queryList: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default reducer;
