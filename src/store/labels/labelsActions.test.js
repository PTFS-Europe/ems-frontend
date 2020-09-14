import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './labelsActions';
import * as labelsTypes from './labelsTypes';

import api from '../../classes/EmsApi';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('labelsActions', () => {
    describe('fetch', () => {
        test('fetchLabelsRequest', async () => {
            const expected = {
                type: labelsTypes.FETCH_LABELS_REQUEST
            };
            expect(actions.fetchLabelsRequest()).toEqual(expected);
        });
        test('fetchLabelsSuccess', async () => {
            const expected = {
                type: labelsTypes.FETCH_LABELS_SUCCESS,
                payload: { test: 'me' }
            };
            expect(actions.fetchLabelsSuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('fetchLabelsFailure', async () => {
            const expected = {
                type: labelsTypes.FETCH_LABELS_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.fetchLabelsFailure({ my: 'error' })).toEqual(
                expected
            );
        });
        test('dispatches FETCH_LABELS_REQUEST & FETCH_LABELS_SUCCESS', () => {
            const store = mockStore({
                labels: {
                    loading: [],
                    labelsList: [],
                    error: ''
                }
            });
            const expectedBody = {
                labels: [
                    { id: 1, name: 'Important', colour: '#f00', position: 0 },
                    { id: 2, name: 'All queries', colour: '#0f0', position: 1 }
                ]
            };
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: expectedBody
                    });
                });
            };
            const expectedActions = [
                { type: labelsTypes.FETCH_LABELS_REQUEST },
                {
                    type: labelsTypes.FETCH_LABELS_SUCCESS,
                    payload: { data: expectedBody }
                }
            ];
            store.dispatch(actions.fetchLabels()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
    describe('create', () => {
        test('createLabelRequest', async () => {
            const expected = {
                type: labelsTypes.CREATE_LABEL_REQUEST,
                payload: { name: 'Jakku' }
            };
            expect(actions.createLabelRequest({ name: 'Jakku' })).toEqual(
                expected
            );
        });
        test('createLabelSuccess', async () => {
            const expected = {
                type: labelsTypes.CREATE_LABEL_SUCCESS,
                payload: { name: 'Exagol' }
            };
            expect(actions.createLabelSuccess({ name: 'Exagol' })).toEqual(
                expected
            );
        });
        test('createLabelFailure', async () => {
            const expected = {
                type: labelsTypes.CREATE_LABEL_FAILURE,
                payload: { name: 'Dantooine' }
            };
            expect(actions.createLabelFailure({ name: 'Dantooine' })).toEqual(
                expected
            );
        });
        test('dispatches CREATE_LABEL_REQUEST & CREATE_LABEL_SUCCESS', () => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: { name: 'Kashyyyk', colour: '#f00' }
                    });
                });
            };
            const store = mockStore({
                labels: {
                    labelList: [],
                    loading: false,
                    error: ''
                }
            });
            return store
                .dispatch(
                    actions.createLabel({
                        name: 'Kashyyyk',
                        colour: '#f00'
                    })
                )
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.type).toEqual('CREATE_LABEL_REQUEST');
                    expect(requestResp.payload.name).toEqual('Kashyyyk');
                    expect(requestResp.payload.colour).toEqual('#f00');
                    // Check the response contains the tempId
                    const tempId = requestResp.payload.tempId;
                    expect(requestResp.payload.tempId).toEqual(tempId);
                    expect(successResp.payload.data.name).toEqual('Kashyyyk');
                    expect(successResp.payload.data.colour).toEqual('#f00');
                });
        });
    });
    describe('update', () => {
        test('updateLabelRequest', async () => {
            const expected = {
                type: labelsTypes.UPDATE_LABEL_REQUEST,
                payload: { id: 1, name: 'Eadu' }
            };
            expect(actions.updateLabelRequest({ id: 1, name: 'Eadu' })).toEqual(
                expected
            );
        });
        test('updateLabelSuccess', async () => {
            const expected = {
                type: labelsTypes.UPDATE_LABEL_SUCCESS,
                payload: { id: 1, name: 'Scarif' }
            };
            expect(
                actions.updateLabelSuccess({ id: 1, name: 'Scarif' })
            ).toEqual(expected);
        });
        test('updateLabelFailure', async () => {
            const expected = {
                type: labelsTypes.UPDATE_LABEL_FAILURE,
                payload: { id: 1, name: 'Scarif' }
            };
            expect(
                actions.updateLabelFailure({ id: 1, name: 'Scarif' })
            ).toEqual(expected);
        });
        test('dispatches UPDATE_LABEL_REQUEST & UPDATE_LABEL_SUCCESS', () => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: { id: 1, name: 'Empty space' }
                    });
                });
            };
            const store = mockStore({
                labels: { labelList: [{ id: 1, name: 'Alderaan' }] }
            });
            return store
                .dispatch(
                    actions.updateLabel({
                        id: 1,
                        name: 'Empty space'
                    })
                )
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.payload.name).toEqual('Empty space');
                    expect(requestResp.payload.id).toEqual(1);
                    expect(successResp.payload.name).toEqual('Empty space');
                    expect(successResp.payload.id).toEqual(1);
                });
        });
    });
    describe('delete', () => {
        test('deleteLabelRequest', async () => {
            const expected = {
                type: labelsTypes.DELETE_LABEL_REQUEST,
                payload: { id: 1 }
            };
            expect(actions.deleteLabelRequest({ id: 1 })).toEqual(expected);
        });
        test('deleteLabelSuccess', async () => {
            const expected = {
                type: labelsTypes.DELETE_LABEL_SUCCESS,
                payload: { id: 1 }
            };
            expect(actions.deleteLabelSuccess({ id: 1 })).toEqual(expected);
        });
        test('deleteLabelFailure', async () => {
            const expected = {
                type: labelsTypes.DELETE_LABEL_FAILURE,
                payload: { error: 'These are not the droids youre looking for' }
            };
            expect(
                actions.deleteLabelFailure({
                    error: 'These are not the droids youre looking for'
                })
            ).toEqual(expected);
        });
        test('dispatches DELETE_LABEL_REQUEST & DELETE_LABEL_SUCCESS', () => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: {}
                    });
                });
            };
            const store = mockStore();
            return store.dispatch(actions.deleteLabel({ id: 1 })).then(() => {
                const [requestResp, successResp] = store.getActions();
                expect(requestResp.payload.id).toEqual(1);
                expect(successResp.payload.id).toEqual(1);
            });
        });
    });
});
