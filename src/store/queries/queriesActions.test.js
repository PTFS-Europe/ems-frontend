import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './queriesActions';
import * as queriesTypes from './queriesTypes';

import api from '../../classes/EmsApi';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('queriesActions', () => {
    describe('fetch', () => {
        beforeEach(() => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: { queries: ['something'] },
                        queryId: null
                    });
                });
            };
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
        test('updateQueryBulkRequest', async () => {
            const expected = {
                type: queriesTypes.UPDATE_QUERY_BULK_REQUEST,
                payload: { test: 'me' }
            };
            expect(actions.updateQueryBulkRequest({ test: 'me' })).toEqual(
                expected
            );
        });
        test('updateQueryBulkSuccess', async () => {
            const expected = {
                type: queriesTypes.UPDATE_QUERY_BULK_SUCCESS,
                payload: { test: 'me' }
            };
            expect(actions.updateQueryBulkSuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('updateQueryBulkFailure', async () => {
            const expected = {
                type: queriesTypes.UPDATE_QUERY_BULK_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.updateQueryBulkFailure({ my: 'error' })).toEqual(
                expected
            );
        });
        test('dispatches UPDATE_QUERY_BULK_REQUEST & UPDATE_QUERY_BULK_SUCCESS', () => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: [
                            {
                                id: 1,
                                title: 'Hello'
                            }
                        ]
                    });
                });
            };
            const store = mockStore({
                queries: { queryList: [{ id: 1, title: 'Goodbye' }] }
            });

            return store
                .dispatch(
                    actions.updateQueryBulk([
                        {
                            id: 1,
                            title: 'Hello'
                        }
                    ])
                )
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.payload[0].title).toEqual('Hello');
                    expect(requestResp.payload[0].id).toEqual(1);
                    expect(successResp.payload.data[0].title).toEqual('Hello');
                    expect(successResp.payload.data[0].id).toEqual(1);
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
    describe('toggle label', () => {
        test('toggleLabelBulkRequest', async () => {
            const expected = {
                type: queriesTypes.TOGGLE_LABEL_BULK_REQUEST,
                payload: { baddie: 'Snoke' }
            };
            expect(actions.toggleLabelBulkRequest({ baddie: 'Snoke' })).toEqual(
                expected
            );
        });
        test('toggle on - dispatches TOGGLE_LABEL_BULK_REQUEST & UPDATE_QUERY_BULK_SUCCESS', () => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: {
                            id: 1,
                            labels: [1, 2]
                        }
                    });
                });
            };
            const store = mockStore({
                queries: { queryList: [{ id: 1, labels: [1] }] }
            });

            const payload = {
                labelId: 2,
                isSelected: false,
                affectedQueries: [1]
            };
            return store.dispatch(actions.toggleLabelBulk(payload)).then(() => {
                const [requestResp, successResp] = store.getActions();
                const expectedRequestResp = {
                    type: 'TOGGLE_LABEL_BULK_REQUEST',
                    payload: payload
                };
                const expectedSuccessResp = {
                    type: 'UPDATE_QUERY_BULK_SUCCESS',
                    payload: {
                        data: {
                            id: 1,
                            labels: [1, 2]
                        }
                    }
                };
                expect(requestResp).toEqual(expectedRequestResp);
                expect(successResp).toEqual(expectedSuccessResp);
            });
        });
        test('toggle off - dispatches TOGGLE_LABEL_BULK_REQUEST & UPDATE_QUERY_BULK_SUCCESS', () => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: {
                            id: 1,
                            labels: [1]
                        }
                    });
                });
            };
            const store = mockStore({
                queries: { queryList: [{ id: 1, labels: [1, 2] }] }
            });

            const payload = {
                labelId: 2,
                isSelected: true,
                affectedQueries: [1]
            };
            return store.dispatch(actions.toggleLabelBulk(payload)).then(() => {
                const [requestResp, successResp] = store.getActions();
                const expectedRequestResp = {
                    type: 'TOGGLE_LABEL_BULK_REQUEST',
                    payload: payload
                };
                const expectedSuccessResp = {
                    type: 'UPDATE_QUERY_BULK_SUCCESS',
                    payload: {
                        data: {
                            id: 1,
                            labels: [1]
                        }
                    }
                };
                expect(requestResp).toEqual(expectedRequestResp);
                expect(successResp).toEqual(expectedSuccessResp);
            });
        });
    });
});
