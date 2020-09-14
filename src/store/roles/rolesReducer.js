import * as rolesTypes from './rolesTypes';

// Our initial state
const initialState = {
    loading: [],
    rolesList: [],
    error: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case rolesTypes.FETCH_ROLES_REQUEST: {
        return {
            ...state,
            loading: true
        };
    }
    case rolesTypes.FETCH_ROLES_SUCCESS: {
        return {
            ...state,
            loading: false,
            rolesList: action.payload,
            error: ''
        };
    }
    case rolesTypes.FETCH_ROLES_FAILURE: {
        return {
            ...state,
            // We don't modify the loading state because we don't
            // know what failed, so can't meaningfully update it
            usersList: [],
            error: action.payload
        };
    }
    default:
        return state;
    }
};

export default reducer;
