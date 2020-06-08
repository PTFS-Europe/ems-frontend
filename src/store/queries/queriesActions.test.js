import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as actions from './queriesActions';
import * as queriesTypes from './queriesTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('queriesActions', () => {
    afterEach(() => {
        fetchMock.restore();
    });
    test('fetchQueriesRequest', async () => {
        const expected = {
            type: queriesTypes.FETCH_QUERIES_REQUEST
        };
        expect(actions.fetchQueriesRequest()).toEqual(expected);
    });
    test('fetchQueriesSuccess', async () => {
        const expected = {
            type: queriesTypes.FETCH_QUERIES_SUCCESS,
            payload: { test: 'me' }
        };
        expect(actions.fetchQueriesSuccess({ test: 'me' })).toEqual(expected);
    });
    test('fetchQueriesFailure', async () => {
        const expected = {
            type: queriesTypes.FETCH_QUERIES_FAILURE,
            payload: { my: 'error' }
        };
        expect(actions.fetchQueriesFailure({ my: 'error' })).toEqual(expected);
    });
    test('dispatches FETCH_QUERIES_REQUEST & FETCH_QUERIES_SUCCESS with no queryId', () => {
        const store = mockStore();
        fetchMock.getOnce(`${process.env.REACT_APP_API_URL}/queries`, {
            body: { queries: ['something'] }
        });
        const expectedActions = [
            { type: queriesTypes.FETCH_QUERIES_REQUEST },
            {
                type: queriesTypes.FETCH_QUERIES_SUCCESS,
                payload: { data: { queries: ['something'] } }
            }
        ];
        return store.dispatch(actions.fetchQueries()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    test('dispatches FETCH_QUERIES_REQUEST & FETCH_QUERIES_SUCCESS with queryId', () => {
        const store = mockStore();
        fetchMock.getOnce(`${process.env.REACT_APP_API_URL}/queries`, {
            body: { queries: ['something'] }
        });
        const expectedActions = [
            { type: queriesTypes.FETCH_QUERIES_REQUEST },
            {
                type: queriesTypes.FETCH_QUERIES_SUCCESS,
                payload: { data: { queries: ['something'] }, queryId: 1 }
            }
        ];
        return store.dispatch(actions.fetchQueries({}, 1)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
