import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './usersActions';
import * as usersTypes from './usersTypes';

import api from '../../util/EmsApi';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('usersActions', () => {
    test('fetchUsersRequest', async () => {
        const expected = {
            type: usersTypes.FETCH_USERS_REQUEST
        };
        expect(actions.fetchUsersRequest()).toEqual(expected);
    });
    test('fetchUsersSuccess', async () => {
        const expected = {
            type: usersTypes.FETCH_USERS_SUCCESS,
            payload: { test: 'me' }
        };
        expect(actions.fetchUsersSuccess({ test: 'me' })).toEqual(expected);
    });
    test('fetchUsersFailure', async () => {
        const expected = {
            type: usersTypes.FETCH_USERS_FAILURE,
            payload: { my: 'error' }
        };
        expect(actions.fetchUsersFailure({ my: 'error' })).toEqual(expected);
    });
    test('Does not dispatch any actions if no user_ids are supplied', () => {
        const store = mockStore();
        // We should not make a request if user_ids are not passed
        store.dispatch(actions.fetchUsers()).then(() => {
            expect(store.getActions()).toEqual([]);
        });
    });
    test('dispatches FETCH_USERS_REQUEST & FETCH_USERS_SUCCESS if appropriate', () => {
        const store = mockStore({
            users: {
                loading: [],
                usersList: [],
                error: ''
            }
        });
        const expectedBody = {
            users: [
                { id: 1, name: 'Joe Bloggs' },
                { id: 2, name: 'Jane Bloggs' }
            ]
        };
        api.makeRequest = () => {
            return new Promise((resolve) => {
                return resolve({ data: expectedBody });
            });
        };
        // We should only make a request if user_ids are passed
        // If we do make a request, the FETCH_USERS_REQUEST action
        // should pass the IDs of the users we're requesting so
        // they can be passed to the reducer
        const expectedActions = [
            { type: usersTypes.FETCH_USERS_REQUEST, payload: [1, 2] },
            {
                type: usersTypes.FETCH_USERS_SUCCESS,
                payload: expectedBody
            }
        ];
        store.dispatch(actions.fetchUsers({ user_ids: [1, 2] })).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
