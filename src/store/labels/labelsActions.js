import uid from 'uid';

import * as labelsTypes from './labelsTypes';
import api from '../../classes/EmsApi';

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

export const setLabelsCounts = (payload) => {
    return {
        type: labelsTypes.SET_LABELS_COUNTS,
        payload
    };
};

// Our action creator for fetching labels
export const fetchLabels = () => {
    return (dispatch) => {
        // Set our loading state to true
        dispatch(fetchLabelsRequest());
        // Make the request
        return api
            .makeRequest('labels', {})
            .then((response) => response.data)
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
    return (dispatch) => {
        // Our temporary ID
        const tempId = uid();
        dispatch(createLabelRequest({ ...label, id: tempId }));
        // Make the request
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: JSON.stringify(label)
        };
        // If we're in dev mode we want to enable CORS mode
        if (process.env.NODE_ENV === 'development') {
            options.mode = 'cors';
        }
        return api
            .makeRequest('labels', options)
            .then((response) => response.data)
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
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            data: JSON.stringify(sendObj)
        };
        // If we're in dev mode we want to enable CORS mode
        if (process.env.NODE_ENV === 'development') {
            options.mode = 'cors';
        }
        return api
            .makeRequest(`labels/${sendObj.id}`, options)
            .then((response) => response.data)
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
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        };
        // If we're in dev mode we want to enable CORS mode
        if (process.env.NODE_ENV === 'development') {
            options.mode = 'cors';
        }
        return api
            .makeRequest(`labels/${label.id}`, options)
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

export const receiveCreatedLabel = (label) => {
    return {
        type: labelsTypes.RECEIVE_CREATED_LABEL,
        payload: label
    };
};
