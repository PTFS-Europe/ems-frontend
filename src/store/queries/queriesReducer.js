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
        case queriesTypes.CREATE_QUERY_REQUEST:
            // Add the just sent query to our state, it will
            // be replaced if/when a response arrives
            return {
                ...state,
                // We don't set loading to true here as we do not want
                // the loading spinner to be displayed
                loading: false,
                queryList: [...state.queryList, action.payload]
            };
        case queriesTypes.CREATE_QUERY_SUCCESS:
            // Find and replace the query that we've just received
            // from the API
            const updatedQueries = state.queryList.map((query) => {
                if (query.id !== action.payload.tempId) {
                    return query;
                }
                return action.payload.data;
            });
            return {
                ...state,
                loading: false,
                queryList: updatedQueries,
                error: ''
            };
        case queriesTypes.CREATE_QUERY_FAILURE:
            // The query probably didn't get accepted by the API,
            // so remove it from our local state
            // TODO: We should announce to the user that something
            // went wrong
            const filteredQueries = state.queryList.filter(
                (query) => query.id !== action.payload.tempId
            );
            return {
                ...state,
                loading: false,
                queryList: filteredQueries,
                error: action.payload
            };
        case queriesTypes.UPDATE_QUERY_SUCCESS:
            // Receive an updated query and update our state
            const updatedQuery = state.queryList.map((query) => {
                if (query.id !== action.payload.id) {
                    return query;
                } else {
                    return action.payload;
                }
            });
            return {
                ...state,
                loading: false,
                queryList: updatedQuery,
                error: ''
            };
        default:
            return state;
    }
};

export default reducer;
