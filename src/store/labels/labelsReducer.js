import * as labelsTypes from './labelsTypes';

const initialState = {
    loading: false,
    labelList: [],
    error: '',
    filter: null,
    labelsCounts: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case labelsTypes.FETCH_LABELS_REQUEST: {
        return {
            ...state,
            loading: true
        };
    }
    case labelsTypes.FETCH_LABELS_SUCCESS: {
        const labelList = action.payload.data;
        return {
            ...state,
            loading: false,
            labelList,
            error: ''
        };
    }
    case labelsTypes.FETCH_LABELS_FAILURE: {
        return {
            ...state,
            loading: false,
            labelList: [],
            error: action.payload
        };
    }
    case labelsTypes.SET_LABELS_FILTER: {
        return {
            ...state,
            filter: state.filter !== action.payload ? action.payload : null
        };
    }
    case labelsTypes.CREATE_LABEL_REQUEST: {
        const labelListCreate = [...state.labelList, action.payload];
        return {
            ...state,
            labelList: labelListCreate
        };
    }
    case labelsTypes.CREATE_LABEL_SUCCESS: {
        // We're passed the payload, plus the temporary ID of the label
        // we're replacing
        const { data, tempId } = action.payload;
        const labelListSuccess = state.labelList.map((label) =>
            label.id === tempId ? data : label
        );
        return {
            ...state,
            labelList: labelListSuccess
        };
    }
    case labelsTypes.CREATE_LABEL_FAILURE: {
        // Remove the label that couldn't be created
        const { tempId: deleteTempId } = action.payload;
        const labelListFailure = state.labelList.filter(
            (label) => label.id !== deleteTempId
        );
        return {
            ...state,
            labelList: labelListFailure
        };
    }
    case labelsTypes.UPDATE_LABEL_REQUEST: {
        // Find and update the label so the user sees immediate feedback
        // this will be finalised once the API has responded
        const updatedLabelsPending = state.labelList.map((label) =>
            label.id === action.payload.id ? action.payload : label
        );
        return {
            ...state,
            labelList: updatedLabelsPending
        };
    }
    case labelsTypes.UPDATE_LABEL_SUCCESS: {
        // We don't just replace the original object with the one we got
        // back from the API, because the API response doesn't contain
        // all properties, 'count' being the current example
        const updatedLabelsSuccess = state.labelList.map((label) =>
            label.id === action.payload.id
                ? { ...label, ...action.payload }
                : label
        );
        return {
            ...state,
            labelList: updatedLabelsSuccess
        };
    }
    case labelsTypes.UPDATE_LABEL_FAILURE: {
        const { unmodifiedLabel, error } = action.payload;
        const updatedLabelsFailure = state.labelList.map((label) =>
            label.id === unmodifiedLabel.id ? unmodifiedLabel : label
        );
        return {
            ...state,
            labelList: updatedLabelsFailure,
            error
        };
    }
    case labelsTypes.DELETE_LABEL_REQUEST: {
        // Find and modify the label in our state
        // pending property, so the UI updates to indicate
        // something is happening with this label
        const updatedLabelsDelPending = state.labelList.map((label) => {
            if (label.id !== action.payload.id) {
                return label;
            }
            return {
                ...label,
                pending: true
            };
        });
        return {
            ...state,
            labelList: updatedLabelsDelPending
        };
    }
    case labelsTypes.DELETE_LABEL_SUCCESS: {
        // Remove the label from our local state
        let updatedLabelsDelSuccess = [];
        state.labelList.forEach((label) => {
            if (label.id !== action.payload.id) {
                updatedLabelsDelSuccess.push(label);
            }
        });
        return {
            ...state,
            loading: false,
            labelList: updatedLabelsDelSuccess,
            error: ''
        };
    }
    case labelsTypes.DELETE_LABEL_FAILURE: {
        // The deletion probably didn't get accepted by the API,
        // so just update the pending status for the label
        // TODO: Add some UI feedback as to what is happening
        const { id: failedId, error: failedError } = action.payload;
        const updatedLabelsDelFailure = state.labelList.map((label) => {
            if (label.id !== failedId) {
                return label;
            }
            delete label.pending;
            return label;
        });
        return {
            ...state,
            loading: false,
            labelList: updatedLabelsDelFailure,
            error: failedError
        };
    }
    case labelsTypes.SET_LABELS_COUNTS: {
        return {
            ...state,
            labelsCounts: action.payload
        };
    }
    case labelsTypes.RECEIVE_CREATED_LABEL: {
        // A label has arrived (via a websocket)
        // Add it to our label list
        const withNewLabel = [...state.labelList, action.payload];
        return {
            ...state,
            labelList: withNewLabel
        };
    }
    default:
        return state;
    }
};

export default reducer;
