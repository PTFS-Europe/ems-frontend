import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as actions from './foldersActions';
import * as foldersTypes from './foldersTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('foldersActions', () => {
    afterEach(() => {
        fetchMock.restore();
    });
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
        const store = mockStore({
            folders: {
                loading: [],
                foldersList: [],
                error: ''
            }
        });
        const expectedBody = {
            folders: [
                { id: 1, name: 'Inbox', code: 'INBOX', position: 0 },
                { id: 2, name: 'All queries', code: 'ALL_QUERIES', position: 1 }
            ]
        };
        fetchMock.getOnce(`${process.env.REACT_APP_API_URL}/folders`, {
            body: expectedBody
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
