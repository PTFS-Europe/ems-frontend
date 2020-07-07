import uid from 'uid';

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

export const createLabelRequest = (requestBody) => {
    return {
        type: labelsTypes.CREATE_LABEL_REQUEST,
        payload: requestBody
    };
};

export const createLabelSuccess = (payload) => {
    return {
        type: labelsTypes.CREATE_LABEL_SUCCESS,
        payload
    };
};

export const createLabelFailure = (errorPayload) => {
    return {
        type: labelsTypes.CREATE_LABEL_FAILURE,
        payload: errorPayload
    };
};

// Our message creator for updating a label
// The label we are passed may be incomplete, so we just
// pass what we've got, plus a temporary ID
export const createLabel = (label) => {
    return (dispatch, getState) => {
        // Our temporary ID
        const tempId = uid();
        dispatch(createLabelRequest({ ...label, id: tempId }));
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/labels`, {
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(label)
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
            .then((data) => {
                // Update our labels state
                return dispatch(createLabelSuccess({ data, tempId }));
            })
            .catch((error) =>
                // Update our error state and revert
                dispatch(
                    createLabelFailure({
                        error: error.message,
                        tempId
                    })
                )
            );
    };
};

export const updateLabelRequest = (requestBody) => {
    return {
        type: labelsTypes.UPDATE_LABEL_REQUEST,
        payload: requestBody
    };
};

export const updateLabelSuccess = (success) => {
    return {
        type: labelsTypes.UPDATE_LABEL_SUCCESS,
        payload: success
    };
};

export const updateLabelFailure = (errorPayload) => {
    return {
        type: labelsTypes.UPDATE_LABEL_FAILURE,
        payload: errorPayload
    };
};

// Our message creator for updating a label
// The label we are passed may be incomplete, it will
// just contain an ID and the properties that are being
// updated
export const updateLabel = (label) => {
    return (dispatch, getState) => {
        // Make a copy of the label we're about to update in case we
        // need to rollback
        const toUpdate = getState().labels.labelList.find(
            (iterLabel) => iterLabel.id === label.id
        );
        const unmodifiedLabel = JSON.parse(JSON.stringify(toUpdate));
        // Update our state to reflect that we've sent the request
        // This will be updated again once we have confirmation from
        // the API that the label was updated
        // We pass a full label object, containing the updated properties
        const sendObj = {
            ...toUpdate,
            ...label
        };
        dispatch(updateLabelRequest(sendObj));
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/labels/${sendObj.id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'PUT',
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
            .then((data) => {
                // Update our labels state
                return dispatch(updateLabelSuccess(data));
            })
            .catch((error) =>
                // Update our error state and revert
                dispatch(
                    updateLabelFailure({
                        error: error.message,
                        unmodifiedLabel
                    })
                )
            );
    };
};

export const deleteLabelRequest = (requestBody) => {
    return {
        type: labelsTypes.DELETE_LABEL_REQUEST,
        payload: requestBody
    };
};

export const deleteLabelSuccess = (success) => {
    return {
        type: labelsTypes.DELETE_LABEL_SUCCESS,
        payload: success
    };
};

export const deleteLabelFailure = (errorPayload) => {
    return {
        type: labelsTypes.DELETE_LABEL_FAILURE,
        payload: errorPayload
    };
};

// Our action creator for deleting a label
export const deleteLabel = (label) => {
    return (dispatch) => {
        // Update our state to reflect that we've sent the request
        // This will be updated again once we have deleted the
        // label at the API
        dispatch(deleteLabelRequest({ id: label.id }));
        // Make the request
        return fetch(`${process.env.REACT_APP_API_URL}/labels/${label.id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'DELETE'
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
            .then(() => {
                // Update our messages state
                return dispatch(deleteLabelSuccess({ id: label.id }));
            })
            .catch((error) =>
                // Update our error state
                dispatch(
                    deleteLabelFailure({
                        error: error.message,
                        id: label.id
                    })
                )
            );
    };
};
