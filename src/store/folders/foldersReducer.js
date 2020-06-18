import * as foldersTypes from './foldersTypes';

const initialState = {
    loading: false,
    folderList: [],
    error: '',
    filter: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case foldersTypes.FETCH_FOLDERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case foldersTypes.FETCH_FOLDERS_SUCCESS:
            const folderList = action.payload.data;
            return {
                ...state,
                loading: false,
                folderList,
                error: ''
            };
        case foldersTypes.FETCH_FOLDERS_FAILURE:
            return {
                ...state,
                loading: false,
                folderList: [],
                error: action.payload
            };
        case foldersTypes.SET_FOLDERS_FILTER:
            return {
                ...state,
                filter: state.filter !== action.payload ? action.payload : null
            };
        default:
            return state;
    }
};

export default reducer;
