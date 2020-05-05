import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as actions from './usersActions';
import * as usersTypes from './usersTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('usersActions', () => {
    afterEach(() => {
        fetchMock.restore();
    });
    test('fetchUsersRequest', async () => {
        const expected = {
            type: usersTypes.FETCH_USERS_REQUEST
        };
        expect(actions.fetchUsersRequest()).toEqual(expected);
    });
    test('fetchQueriesSuccess', async () => {
        const expected = {
            type: usersTypes.FETCH_USERS_SUCCESS,
            payload: { test: 'me' }
        };
        expect(actions.fetchUsersSuccess({ test: 'me' })).toEqual(expected);
    });
    test('fetchQueriesFailure', async () => {
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
                loading: false,
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
        fetchMock.getOnce(
            `${process.env.REACT_APP_API_URL}/users?user_ids=1_2`,
            {
                body: expectedBody
            }
        );
        // We should only make a request if user_ids are passed
        const expectedActions = [
            { type: usersTypes.FETCH_USERS_REQUEST },
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
