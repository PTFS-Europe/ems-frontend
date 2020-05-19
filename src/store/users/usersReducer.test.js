import reducer from './usersReducer';
import * as usersTypes from './usersTypes';

const initialState = {
    loading: [],
    usersList: [],
    error: ''
};

describe('usersReducer', () => {
    test('returns the initial state', async () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
    // Here we are testing the FETCH_USERS_REQUEST reducer updates the
    // loading property with the IDs of the users we're requesting
    test('should handle FETCH_USERS_REQUEST', () => {
        expect(
            reducer(initialState, {
                type: usersTypes.FETCH_USERS_REQUEST,
                payload: [1, 2]
            })
        ).toEqual({
            loading: [1, 2],
            usersList: [],
            error: ''
        });
    });
    // Here we are testing that the FETCH_USERS_SUCCESS reducer not only
    // updates the state with the fetched users, but also removes their
    // ID from the loading property
    test('should handle FETCH_USERS_SUCCESS', () => {
        expect(
            reducer(
                { ...initialState, loading: [1, 2] },
                {
                    type: usersTypes.FETCH_USERS_SUCCESS,
                    payload: [{ id: 1 }]
                }
            )
        ).toEqual({
            loading: [2],
            usersList: [{ id: 1 }],
            error: ''
        });
    });
    test('should handle FETCH_USERS_FAILURE', () => {
        expect(
            reducer(initialState, {
                type: usersTypes.FETCH_USERS_FAILURE,
                payload: 'Oh no'
            })
        ).toEqual({
            loading: [],
            usersList: [],
            error: 'Oh no'
        });
    });
});
