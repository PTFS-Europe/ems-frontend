import * as queriesTypes from './queriesTypes';

// TODO: Write tests for the other actions we have here

export const fetchQueriesRequest = () => {
    return {
        type: queriesTypes.FETCH_QUERIES_REQUEST
    };
};

export const fetchQueriesSuccess = (payload) => {
    return {
        type: queriesTypes.FETCH_QUERIES_SUCCESS,
        payload
    };
};

export const fetchQueriesFailure = (error) => {
    return {
        type: queriesTypes.FETCH_QUERIES_FAILURE,
        payload: error
    };
};

// Our action creator for fetching queries
export const fetchQueries = ({
    search = {},
    folder = null,
    label = null,
    showLoading = true
} = {}) => {
    return (dispatch) => {
        // Set our loading state to true
        // if appropriate
        if (showLoading) {
            dispatch(fetchQueriesRequest());
        }
        let append = [];
        if (search && search.title) {
            append.push(`title=${search.title}`);
        }
        if (folder) {
            append.push(`folder=${folder}`);
        }
        if (label) {
            append.push(`label=${label}`);
        }
        const appendStr = append.length > 0 ? '?' + append.join('&') : '';
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/queries${appendStr}`)
            .then((response) => response.json())
            .then((data) => {
                // Update our queries state
                const queryId =
                    search && search.queryId ? search.queryId : null;
                dispatch(fetchQueriesSuccess({ data, queryId }));
            })
            .catch((error) => {
                // Update our error state
                dispatch(fetchQueriesFailure(error.message));
            });
    };
};

export const refreshQuerySuccess = (query) => {
    return {
        type: queriesTypes.REFRESH_QUERY_SUCCESS,
        payload: query
    };
};

export const refreshQueryFailure = (error) => {
    return {
        type: queriesTypes.REFRESH_QUERY_FAILURE,
        payload: error
    };
};

// Our action creator for refreshing a query in our store
export const refreshQuery = (id) => {
    return (dispatch) => {
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/queries/${id}`)
            .then((response) => response.json())
            .then((data) => {
                // Update our queries state
                dispatch(refreshQuerySuccess(data));
            })
            .catch((error) => {
                // Update our error state
                dispatch(refreshQueryFailure(error.message));
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
                initiator: userDetails.id,
                participants: [],
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

export const updateQueryRequest = (requestBody) => {
    return {
        type: queriesTypes.UPDATE_QUERY_REQUEST,
        payload: requestBody
    };
};

export const updateQuerySuccess = (query) => {
    return {
        type: queriesTypes.UPDATE_QUERY_SUCCESS,
        payload: query
    };
};

export const updateQueryFailure = (payload) => {
    return {
        type: queriesTypes.UPDATE_QUERY_FAILURE,
        payload
    };
};

// Our action creator for updating a query
export const updateQuery = (updatedProps) => {
    return (dispatch, getState) => {
        // Find the query we're updating
        let toUpdate = getState().queries.queryList.find(
            (query) => query.id === updatedProps.id
        );
        // Make a copy of the query we're about to update in case we
        // need to rollback
        const unmodifiedQuery = JSON.parse(JSON.stringify(toUpdate));
        // Update our state to reflect that we've sent the request
        // We update our state with the updated query here, it is then
        // replaced once we receive a response
        const updateObj = {
            id: toUpdate.id,
            folder: toUpdate.folder,
            title: toUpdate.title,
            initiator: toUpdate.initiator,
            ...updatedProps
        };
        dispatch(updateQueryRequest(updateObj));
        // Make the request
        return fetch(
            `${process.env.REACT_APP_API_URL}/queries/${toUpdate.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(updateObj)
            }
        )
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
                dispatch(updateQuerySuccess({ data }))
            )
            .catch((error) =>
                // Update our error state
                dispatch(
                    updateQueryFailure({
                        error: error.message,
                        unmodifiedQuery
                    })
                )
            );
    };
};

export const setQuerySearch = ({ search }) => {
    return {
        type: queriesTypes.SET_QUERY_SEARCH,
        payload: search
    };
};

export const toggleLabelRequest = (payload) => {
    return {
        type: queriesTypes.TOGGLE_LABEL_REQUEST,
        payload
    };
};

export const toggleLabel = (payload) => {
    return (dispatch, getState) => {
        // Find the query we're modifying
        const toUpdate = getState().queries.queryList.find(
            (query) => query.id === payload.query.id
        );
        // Make a copy of the query we're about to update in case we
        // need to rollback
        const unmodifiedQuery = JSON.parse(JSON.stringify(toUpdate));
        // Dispatch the update request
        dispatch(toggleLabelRequest(payload));
        // Make the request
        // Determine what we're doing, if the label we're working with is already attached
        // to the query, we need the API method to be DELETE otherwise it's POST
        const method = unmodifiedQuery.labels.includes(payload.labelId)
            ? 'DELETE'
            : 'POST';
        return fetch(
            `${process.env.REACT_APP_API_URL}/queries/${payload.query.id}/label/${payload.labelId}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                method
            }
        )
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
                dispatch(updateQuerySuccess({ data }))
            )
            .catch((error) =>
                // Update our error state
                dispatch(
                    updateQueryFailure({
                        error: error.message,
                        unmodifiedQuery
                    })
                )
            );
    };
};
