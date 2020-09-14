import * as foldersTypes from './foldersTypes';
import api from '../../classes/EmsApi';

export const fetchFoldersRequest = () => {
    return {
        type: foldersTypes.FETCH_FOLDERS_REQUEST
    };
};

export const fetchFoldersSuccess = (payload) => {
    return {
        type: foldersTypes.FETCH_FOLDERS_SUCCESS,
        payload
    };
};

export const fetchFoldersFailure = (error) => {
    return {
        type: foldersTypes.FETCH_FOLDERS_FAILURE,
        payload: error
    };
};

export const setFoldersFilter = (payload) => {
    return {
        type: foldersTypes.SET_FOLDERS_FILTER,
        payload
    };
};

export const setFoldersCounts = (payload) => {
    return {
        type: foldersTypes.SET_FOLDERS_COUNTS,
        payload
    };
};

// Our action creator for fetching folders
export const fetchFolders = () => {
    return (dispatch) => {
        // Set our loading state to true
        dispatch(fetchFoldersRequest());
        // Make the request
        return api
            .makeRequest('folders', {})
            .then((response) => response.data)
            .then((data) => {
                // Update our folders state
                dispatch(fetchFoldersSuccess({ data }));
            })
            .catch((error) => {
                // Update our error state
                dispatch(fetchFoldersFailure(error.message));
            });
    };
};
