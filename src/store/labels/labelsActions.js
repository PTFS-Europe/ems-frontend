import * as labelsTypes from './labelsTypes';

export const fetchLabelsRequest = () => {
    return {
        type: labelsTypes.FETCH_LABELS_REQUEST
    };
};

export const fetchLabelsSuccess = (payload) => {
    return {
        type: labelsTypes.FETCH_LABELS_SUCCESS,
        payload
    };
};

export const fetchLabelsFailure = (error) => {
    return {
        type: labelsTypes.FETCH_LABELS_FAILURE,
        payload: error
    };
};

export const setLabelsFilter = (payload) => {
    return {
        type: labelsTypes.SET_LABELS_FILTER,
        payload
    };
};

// Our action creator for fetching labels
export const fetchLabels = (params) => {
    return (dispatch) => {
        // Set our loading state to true
        dispatch(fetchLabelsRequest());
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/labels`)
            .then((response) => response.json())
            .then((data) => {
                // Update our labels state
                dispatch(fetchLabelsSuccess({ data }));
            })
            .catch((error) => {
                // Update our error state
                dispatch(fetchLabelsFailure(error.message));
            });
    };
};
