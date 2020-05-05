import reducer from './usersReducer';
import * as usersTypes from './usersTypes';

const initialState = {
    loading: false,
    usersList: [],
    error: ''
};

describe('usersReducer', () => {
    test('returns the initial state', async () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
    test('should handle FETCH_USERS_REQUEST', () => {
        expect(
            reducer(initialState, { type: usersTypes.FETCH_USERS_REQUEST })
        ).toEqual({
            loading: true,
            usersList: [],
            error: ''
        });
    });
    test('should handle FETCH_USERS_SUCCESS', () => {
        expect(
            reducer(initialState, {
                type: usersTypes.FETCH_USERS_SUCCESS,
                payload: [{ test: 'test' }]
            })
        ).toEqual({
            loading: false,
            usersList: [{ test: 'test' }],
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
            loading: false,
            usersList: [],
            error: 'Oh no'
        });
    });
});
