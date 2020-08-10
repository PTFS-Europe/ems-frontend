import * as rolesTypes from './rolesTypes';
import api from '../../util/api';

export const fetchRolesRequest = () => {
    return {
        type: rolesTypes.FETCH_ROLES_REQUEST
    };
};

export const fetchRolesSuccess = (roles) => {
    return {
        type: rolesTypes.FETCH_ROLES_SUCCESS,
        payload: roles
    };
};

export const fetchRolesFailure = (error) => {
    return {
        type: rolesTypes.FETCH_ROLES_FAILURE,
        payload: error
    };
};

// Our action creator for fetching roles
export const fetchRoles = (args) => {
    return (dispatch) => {
        // Set our loading state
        dispatch(fetchRolesRequest());
        // Make the request
        return api
            .makeRequest('roles', {})
            .then((response) => response.data)
            .then((data) => {
                // Update our roles state
                dispatch(fetchRolesSuccess(data));
            })
            .catch((error) => {
                // Update our error state
                dispatch(fetchRolesFailure(error.message));
            });
    };
};
