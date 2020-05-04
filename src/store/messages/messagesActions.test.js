import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as actions from './messagesActions';
import * as messagesTypes from './messagesTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('messagesActions', () => {
    afterEach(() => {
        fetchMock.restore();
    });
    test('fetchMessagesRequest', async () => {
        const expected = {
            type: messagesTypes.FETCH_MESSAGES_REQUEST
        };
        expect(actions.fetchMessagesRequest()).toEqual(expected);
    });
    test('fetchMessagesSuccess', async () => {
        const expected = {
            type: messagesTypes.FETCH_MESSAGES_SUCCESS,
            payload: { test: 'me' }
        };
        expect(actions.fetchMessagesSuccess({ test: 'me' })).toEqual(expected);
    });
    test('fetchMessagesFailure', async () => {
        const expected = {
            type: messagesTypes.FETCH_MESSAGES_FAILURE,
            payload: { my: 'error' }
        };
        expect(actions.fetchMessagesFailure({ my: 'error' })).toEqual(expected);
    });
    test('dispatches FETCH_MESSAGES_REQUEST & FETCH_MESSAGES_SUCCESS', () => {
        fetchMock.getOnce(`${process.env.REACT_APP_API_URL}/messages`, {
            body: { messages: ['something'] }
        });
        const expectedActions = [
            { type: messagesTypes.FETCH_MESSAGES_REQUEST },
            {
                type: messagesTypes.FETCH_MESSAGES_SUCCESS,
                payload: { messages: ['something'] }
            }
        ];
        const store = mockStore();
        return store.dispatch(actions.fetchMessages()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
