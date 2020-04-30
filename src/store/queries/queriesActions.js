import * as queriesTypes from './queriesTypes';

export const fetchQueriesRequest = () => {
    return {
        type: queriesTypes.FETCH_QUERIES_REQUEST
    };
};

export const fetchQueriesSuccess = (queries) => {
    return {
        type: queriesTypes.FETCH_QUERIES_SUCCESS,
        payload: queries
    };
};

export const fetchQueriesFailure = (error) => {
    return {
        type: queriesTypes.FETCH_QUERIES_FAILURE,
        payload: error
    };
};

// Our action creator for fetching queries
export const fetchQueries = () => {
    return (dispatch) => {
        // Set our loading state to true
        dispatch(fetchQueriesRequest());
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/queries`)
            .then((response) => response.json())
            .then((data) => {
                // Update our queries state
                dispatch(fetchQueriesSuccess(data));
            })
            .catch((error) => {
                // Update our error state
                dispatch(fetchQueriesFailure(error.message));
            });
    };
};
