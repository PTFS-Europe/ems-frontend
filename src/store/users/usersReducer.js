import * as usersTypes from './usersTypes';

// This object is for users we need to know about, initially
// senders of messages

const initialState = {
    loading: [],
    usersList: [],
    error: ''
};

// Take an array of users and add ones we don't already know
const updateUsersList = (oldUsersList, payload) => {
    // The IDs of users we already know about
    const oldIds = oldUsersList.map((ou) => ou.id);
    // Users that are new to us
    const newUsers = payload.filter((nu) => !oldIds.includes(nu.id));
    return [...oldUsersList, ...newUsers];
};

// Update our 'loading' state based on what we just received
const updateLoading = (oldLoading, payload) => {
    const receivedIds = payload.map((user) => user.id);
    // Remove the users we've received from 'loading'
    return oldLoading.filter((load) => !receivedIds.includes(load));
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case usersTypes.FETCH_USERS_REQUEST: {
        return {
            ...state,
            loading: [...state.loading, ...action.payload]
        };
    }
    case usersTypes.FETCH_USERS_SUCCESS: {
        const newUsersList = updateUsersList(
            state.usersList,
            action.payload
        );
        const newLoading = updateLoading(state.loading, action.payload);
        return {
            ...state,
            loading: newLoading,
            usersList: newUsersList,
            error: ''
        };
    }
    case usersTypes.FETCH_USERS_FAILURE: {
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
