import * as labelsTypes from './labelsTypes';

const initialState = {
    loading: false,
    labelList: [],
    error: '',
    filter: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case labelsTypes.FETCH_LABELS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case labelsTypes.FETCH_LABELS_SUCCESS:
            const labelList = action.payload.data;
            return {
                ...state,
                loading: false,
                labelList,
                error: ''
            };
        case labelsTypes.FETCH_LABELS_FAILURE:
            return {
                ...state,
                loading: false,
                labelList: [],
                error: action.payload
            };
        case labelsTypes.SET_LABELS_FILTER:
            return {
                ...state,
                filter: state.filter !== action.payload ? action.payload : null
            };
        default:
            return state;
    }
};

export default reducer;
