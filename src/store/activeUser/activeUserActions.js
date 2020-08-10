import * as activeUserTypes from './activeUserTypes';
import { fetchUsersSuccess } from '../users/usersActions';
import api from '../../util/EmsApi';

export const fetchActiveUserRequest = () => {
    return {
        type: activeUserTypes.FETCH_ACTIVE_USER_REQUEST
    };
};

export const fetchActiveUserSuccess = (user) => {
    return {
        type: activeUserTypes.FETCH_ACTIVE_USER_SUCCESS,
        payload: user
    };
};

export const fetchActiveUserFailure = (error) => {
    return {
        type: activeUserTypes.FETCH_ACTIVE_USER_FAILURE,
        payload: error
    };
};

export const fetchActiveUser = () => {
    return (dispatch) => {
        dispatch(fetchActiveUserRequest());
        return api
            .makeRequest('activeuser', {})
            .then((response) => response.data)
            .then((data) => {
                dispatch(fetchActiveUserSuccess(data));
                dispatch(fetchUsersSuccess([data]));
            })
            .catch((error) => dispatch(fetchActiveUserFailure(error.message)));
    };
};

export const logoutUser = () => {
    return {
        type: activeUserTypes.LOGOUT_USER
    };
};
