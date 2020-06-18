import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as actions from './labelsActions';
import * as labelsTypes from './labelsTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('labelsActions', () => {
    afterEach(() => {
        fetchMock.restore();
    });
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
        expect(actions.fetchLabelsSuccess({ test: 'me' })).toEqual(expected);
    });
    test('fetchLabelsFailure', async () => {
        const expected = {
            type: labelsTypes.FETCH_LABELS_FAILURE,
            payload: { my: 'error' }
        };
        expect(actions.fetchLabelsFailure({ my: 'error' })).toEqual(expected);
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
        fetchMock.getOnce(`${process.env.REACT_APP_API_URL}/labels`, {
            body: expectedBody
        });
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
