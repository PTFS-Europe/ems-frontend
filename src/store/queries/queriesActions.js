import * as queriesTypes from './queriesTypes';
import api from '../../util/EmsApi';

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
        return api
            .makeRequest(`queries${appendStr}`, {})
            .then((response) => response.data)
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
        return api
            .makeRequest(`queries/${id}`, {})
            .then((response) => response.data)
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
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: JSON.stringify(sendObj)
        };
        // If we're in dev mode we want to enable CORS mode
        if (process.env.NODE_ENV === 'development') {
            options.mode = 'cors';
        }
        console.log('**************');
        console.log(process.env.NODE_ENV);
        return api
            .makeRequest('queries', options)
            .then((response) => response.data)
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

export const updateQueryBulkRequest = (requestBody) => {
    return {
        type: queriesTypes.UPDATE_QUERY_BULK_REQUEST,
        payload: requestBody
    };
};

export const updateQueryBulkSuccess = (query) => {
    return {
        type: queriesTypes.UPDATE_QUERY_BULK_SUCCESS,
        payload: query
    };
};

export const updateQueryBulkFailure = (payload) => {
    return {
        type: queriesTypes.UPDATE_QUERY_BULK_FAILURE,
        payload
    };
};

// Our action creator for bulk updating queries
export const updateQueryBulk = (updatedQueries) => {
    return (dispatch, getState) => {
        // Find the queries we're updating
        const updatedQueryIds = updatedQueries.map(
            (updatedQuery) => updatedQuery.id
        );
        // Get an array of full query objects that need to be updated
        let toUpdate = getState().queries.queryList.filter((query) =>
            updatedQueryIds.includes(query.id)
        );
        // Make a copy of the queries we're about to update in case we
        // need to rollback
        const unmodifiedQueries = JSON.parse(JSON.stringify(toUpdate));
        // We update our state with the updated query here, it is then
        // replaced once we receive a response
        // For each of the queries to be updated, find the associated query in the updated
        // queries we were passed and replace any changed properties
        // What we get back is an array of updated query objects we can send to the API
        const updateObj = toUpdate.map((updateMe) => {
            // Get the object containing the updated properties for this query
            const updateWith = updatedQueries.find(
                (updateMeWith) => updateMeWith.id === updateMe.id
            );
            return { ...updateMe, ...updateWith };
        });
        dispatch(updateQueryBulkRequest(updateObj));
        // Make the request
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            data: JSON.stringify(updateObj)
        };
        // If we're in dev mode we want to enable CORS mode
        if (process.env.NODE_ENV === 'development') {
            options.mode = 'cors';
        }
        return api
            .makeRequest('queries', options)
            .then((response) => response.data)
            .then((data) =>
                // Update our queries state
                dispatch(updateQueryBulkSuccess({ data }))
            )
            .catch((error) =>
                // Update our error state
                dispatch(
                    updateQueryBulkFailure({
                        error: error.message,
                        unmodifiedQueries
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

export const setQuerySelected = (id) => {
    return {
        type: queriesTypes.SET_QUERY_SELECTED,
        payload: id
    };
};

export const setQuerySelectedAll = (newState) => {
    return {
        type: queriesTypes.SET_QUERY_SELECTED_ALL,
        payload: newState
    };
};

export const toggleLabelBulkRequest = (payload) => {
    return {
        type: queriesTypes.TOGGLE_LABEL_BULK_REQUEST,
        payload
    };
};

export const toggleLabelBulk = ({ labelId, isSelected, affectedQueries }) => {
    return (dispatch, getState) => {
        // Only proceed if we need to
        if (affectedQueries.length === 0) {
            return;
        }
        // Find the queries we're modifying
        const toUpdate = getState().queries.queryList.filter((query) =>
            affectedQueries.includes(query.id)
        );
        // Make a copy of the query we're about to update in case we
        // need to rollback
        const unmodifiedQueries = JSON.parse(JSON.stringify(toUpdate));
        // Dispatch the update request
        dispatch(
            toggleLabelBulkRequest({ labelId, isSelected, affectedQueries })
        );
        // Make the request
        // Determine what we're doing, if the label we're working with is already attached
        // to the query (or all queries in the case of a bulk operation),
        // we need the API method to be DELETE otherwise it's POST
        const method = isSelected ? 'DELETE' : 'POST';
        const joinedQueries = affectedQueries.join(',');
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method
        };
        // If we're in dev mode we want to enable CORS mode
        if (process.env.NODE_ENV === 'development') {
            options.mode = 'cors';
        }
        return api
            .makeRequest(`queries/${joinedQueries}/label/${labelId}`, options)
            .then((response) => response.data)
            .then((data) =>
                // Update our queries state
                dispatch(updateQueryBulkSuccess({ data }))
            )
            .catch((error) =>
                // Update our error state
                dispatch(
                    updateQueryBulkFailure({
                        error: error.message,
                        unmodifiedQueries
                    })
                )
            );
    };
};

export const updateActiveQuery = (payload) => {
    return {
        type: queriesTypes.UPDATE_ACTIVE_QUERY,
        payload
    };
};
