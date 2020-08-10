import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './foldersActions';
import * as foldersTypes from './foldersTypes';

import api from '../../util/EmsApi';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('foldersActions', () => {
    test('fetchFoldersRequest', async () => {
        const expected = {
            type: foldersTypes.FETCH_FOLDERS_REQUEST
        };
        expect(actions.fetchFoldersRequest()).toEqual(expected);
    });
    test('fetchFoldersSuccess', async () => {
        const expected = {
            type: foldersTypes.FETCH_FOLDERS_SUCCESS,
            payload: { test: 'me' }
        };
        expect(actions.fetchFoldersSuccess({ test: 'me' })).toEqual(expected);
    });
    test('fetchFoldersFailure', async () => {
        const expected = {
            type: foldersTypes.FETCH_FOLDERS_FAILURE,
            payload: { my: 'error' }
        };
        expect(actions.fetchFoldersFailure({ my: 'error' })).toEqual(expected);
    });
    test('dispatches FETCH_FOLDERS_REQUEST & FETCH_FOLDERS_SUCCESS', () => {
        const expectedBody = {
            folders: [
                { id: 1, name: 'Unread', code: 'UNREAD', position: 0 },
                { id: 2, name: 'All queries', code: 'ALL_QUERIES', position: 1 }
            ]
        };
        api.makeRequest = () => {
            return new Promise((resolve) => {
                return resolve({ data: expectedBody });
            });
        };
        const store = mockStore({
            folders: {
                loading: [],
                foldersList: [],
                error: ''
            }
        });
        const expectedActions = [
            { type: foldersTypes.FETCH_FOLDERS_REQUEST },
            {
                type: foldersTypes.FETCH_FOLDERS_SUCCESS,
                payload: { data: expectedBody }
            }
        ];
        store.dispatch(actions.fetchFolders()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
