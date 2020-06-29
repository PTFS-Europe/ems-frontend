import * as queriesTypes from './queriesTypes';

const initialState = {
    loading: false,
    queryList: [],
    error: '',
    search: '',
    preserved: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case queriesTypes.FETCH_QUERIES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case queriesTypes.FETCH_QUERIES_SUCCESS:
            // If we've received a queryId (the ID of the
            // active query) we need to keep that query in
            // our state. This situation can arise if the
            // user is doing a search whilst an active query
            // is selected
            let preserve = false;
            const queryList = action.payload.data;
            if (action.payload.queryId) {
                // Ensure we don't add it again if it's already there
                const found = queryList.find(
                    (returned) =>
                        returned.id === parseInt(action.payload.queryId)
                );
                if (!found) {
                    preserve = state.queryList.find(
                        (query) => query.id === parseInt(action.payload.queryId)
                    );
                    if (preserve) {
                        queryList.push(preserve);
                    }
                }
            }
            return {
                ...state,
                loading: false,
                queryList,
                error: '',
                preserved: preserve ? true : false
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
        case queriesTypes.UPDATE_QUERY_REQUEST:
            // Update the just updated query in our state, it will
            // be replaced if/when a response arrives
            const updatedQueriesPending = state.queryList.map((query) =>
                query.id === action.payload.id
                    ? { ...query, ...action.payload }
                    : query
            );
            return {
                ...state,
                // We don't set loading to true here as we do not want
                // the loading spinner to be displayed
                loading: false,
                queryList: updatedQueriesPending
            };
        case queriesTypes.UPDATE_QUERY_SUCCESS:
            // Find and replace the query that we've just received
            // from the API
            const updatedQueriesSuccess = state.queryList.map((query) =>
                query.id === action.payload.data.id
                    ? action.payload.data
                    : query
            );
            return {
                ...state,
                loading: false,
                queryList: updatedQueriesSuccess,
                error: ''
            };
        case queriesTypes.UPDATE_QUERY_FAILURE:
            // The query probably didn't get accepted by the API
            // TODO: We should announce to the user that something
            // went wrong
            const unmodified = action.payload.unmodifiedQuery;
            const queriesFailure = state.queryList.map((query) =>
                query.id === unmodified.id ? unmodified : query
            );
            return {
                ...state,
                loading: false,
                queryList: queriesFailure,
                error: action.payload.error
            };
        case queriesTypes.REFRESH_QUERY_SUCCESS:
            // Receive an refreshed query and update our state
            const refreshedQueries = state.queryList.map((query) => {
                if (query.id !== action.payload.id) {
                    return query;
                } else {
                    return action.payload;
                }
            });
            return {
                ...state,
                loading: false,
                queryList: refreshedQueries,
                error: ''
            };
        case queriesTypes.SET_QUERY_SEARCH:
            return {
                ...state,
                search: action.payload
            };
        default:
            return state;
    }
};

export default reducer;
