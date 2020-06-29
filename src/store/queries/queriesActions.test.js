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
    describe('fetch', () => {
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
            expect(actions.fetchQueriesSuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('fetchQueriesFailure', async () => {
            const expected = {
                type: queriesTypes.FETCH_QUERIES_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.fetchQueriesFailure({ my: 'error' })).toEqual(
                expected
            );
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
                    payload: { data: { queries: ['something'] }, queryId: null }
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
            return store
                .dispatch(actions.fetchQueries({ search: { queryId: 1 } }))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
        test('makes API request with passed parameters', () => {
            const store = mockStore();
            fetchMock.getOnce(
                `${process.env.REACT_APP_API_URL}/queries?title=Mos%20Eisley%20Spaceport&folder=UNREAD&label=1`,
                {
                    body: { queries: ['something'] }
                }
            );
            const expectedActions = [
                { type: queriesTypes.FETCH_QUERIES_REQUEST },
                {
                    type: queriesTypes.FETCH_QUERIES_SUCCESS,
                    payload: { data: { queries: ['something'] }, queryId: null }
                }
            ];
            return store
                .dispatch(
                    actions.fetchQueries({
                        search: {
                            title: 'Mos Eisley Spaceport'
                        },
                        folder: 'UNREAD',
                        label: 1
                    })
                )
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
        test('does not dispatch FETCH_QUERIES_REQUEST if showLoading is falsy', () => {
            const store = mockStore();
            fetchMock.getOnce(`${process.env.REACT_APP_API_URL}/queries`, {
                body: { queries: ['something'] }
            });
            const expectedActions = [
                {
                    type: queriesTypes.FETCH_QUERIES_SUCCESS,
                    payload: { data: { queries: ['something'] }, queryId: null }
                }
            ];
            return store
                .dispatch(
                    actions.fetchQueries({
                        showLoading: false
                    })
                )
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
    });
    describe('update', () => {
        test('updateQueryRequest', async () => {
            const expected = {
                type: queriesTypes.UPDATE_QUERY_REQUEST,
                payload: { test: 'me' }
            };
            expect(actions.updateQueryRequest({ test: 'me' })).toEqual(
                expected
            );
        });
        test('updateQuerySuccess', async () => {
            const expected = {
                type: queriesTypes.UPDATE_QUERY_SUCCESS,
                payload: { test: 'me' }
            };
            expect(actions.updateQuerySuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('updateQueryFailure', async () => {
            const expected = {
                type: queriesTypes.UPDATE_QUERY_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.updateQueryFailure({ my: 'error' })).toEqual(
                expected
            );
        });
        test('dispatches UPDATE_QUERY_REQUEST & UPDATE_QUERY_SUCCESS', () => {
            fetchMock.putOnce(`${process.env.REACT_APP_API_URL}/queries/1`, {
                body: { id: 1, title: 'Hello' }
            });
            const store = mockStore({
                queries: { queryList: [{ id: 1, title: 'Goodbye' }] }
            });

            return store
                .dispatch(
                    actions.updateQuery({
                        id: 1,
                        title: 'Hello'
                    })
                )
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.payload.title).toEqual('Hello');
                    expect(requestResp.payload.id).toEqual(1);
                    expect(successResp.payload.data.title).toEqual('Hello');
                    expect(successResp.payload.data.id).toEqual(1);
                });
        });
    });
    describe('search', () => {
        test('setQuerySearch', async () => {
            const expected = {
                type: queriesTypes.SET_QUERY_SEARCH,
                payload: 'chewie'
            };
            expect(actions.setQuerySearch({ search: 'chewie' })).toEqual(
                expected
            );
        });
    });
});
