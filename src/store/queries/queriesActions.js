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

export const updateQuerySuccess = (query) => {
    return {
        type: queriesTypes.UPDATE_QUERY_SUCCESS,
        payload: query
    };
};

export const updateQueryFailure = (error) => {
    return {
        type: queriesTypes.UPDATE_QUERY_FAILURE,
        payload: error
    };
};

// Our action creator for updating a query in our store
export const updateQuery = (id) => {
    return (dispatch) => {
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/queries/${id}`)
            .then((response) => response.json())
            .then((data) => {
                // Update our queries state
                dispatch(updateQuerySuccess(data));
            })
            .catch((error) => {
                // Update our error state
                dispatch(updateQueryFailure(error.message));
            });
    };
};

export const createQueryRequest = (requestBody) => {
    return {
        type: queriesTypes.CREATE_QUERY_REQUEST,
        payload: requestBody
    };
};

export const createQuerySuccess = (query) => {
    return {
        type: queriesTypes.CREATE_QUERY_SUCCESS,
        payload: query
    };
};

export const createQueryFailure = (error) => {
    return {
        type: queriesTypes.CREATE_QUERY_FAILURE,
        payload: error
    };
};

// Our action creator for creating a query
export const createQuery = ({ query }) => {
    return (dispatch, getState) => {
        // First determine the active user
        const { userDetails } = getState().activeUser;
        // Prepare our object for sending
        let sendObj = {
            title: query,
            initiator: userDetails.id
        };
        // Generate a temporary ID for this query, it will enable
        // us to find this query when we get a response and need to
        // replace it
        const currentDate = new Date();
        const tempId = currentDate.getTime();
        // Update our state to reflect that we've sent the request
        // We update our state with the query here, it is then
        // replaced once we receive a response
        dispatch(
            createQueryRequest({
                ...sendObj,
                id: tempId,
                pending: true,
                updated_at: currentDate
            })
        );
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/queries`, {
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(sendObj)
        })
            .then((response) => {
                // Fetch will not reject if we encounter an HTTP error
                // so we need to manually reject in that case
                if (!response.ok) {
                    throw Error(response.statusText);
                } else {
                    return response;
                }
            })
            .then((response) => response.json())
            .then((data) =>
                // Update our queries state
                dispatch(createQuerySuccess({ data, tempId }))
            )
            .catch((error) =>
                // Update our error state
                dispatch(createQueryFailure({ error: error.message, tempId }))
            );
    };
};
