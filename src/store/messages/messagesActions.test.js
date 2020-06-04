import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as actions from './messagesActions';
import * as messagesTypes from './messagesTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

/*
jest.mock('./messagesActions', () => ({
    __esModule: true,
    doUpdateQuery: jest.fn().mockImplementation(() => Promise.resolve())
}));
*/
actions.lib.doUpdateQuery = jest.fn(() => Promise.resolve());

describe('messagesActions', () => {
    afterEach(() => {
        fetchMock.restore();
    });
    describe('fetch', () => {
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
            expect(actions.fetchMessagesSuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('fetchMessagesFailure', async () => {
            const expected = {
                type: messagesTypes.FETCH_MESSAGES_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.fetchMessagesFailure({ my: 'error' })).toEqual(
                expected
            );
        });
        test('dispatches FETCH_MESSAGES_REQUEST & FETCH_MESSAGES_SUCCESS', () => {
            fetchMock.getOnce(
                `${process.env.REACT_APP_API_URL}/messages?query_id=1`,
                {
                    body: { messages: ['something'] }
                }
            );
            const expectedActions = [
                { type: messagesTypes.FETCH_MESSAGES_REQUEST },
                {
                    type: messagesTypes.FETCH_MESSAGES_SUCCESS,
                    payload: { messages: ['something'] }
                }
            ];
            const store = mockStore();
            return store
                .dispatch(actions.fetchMessages({ queryId: 1 }))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
    });
    describe('send', () => {
        test('sendMessageRequest', async () => {
            const expected = {
                type: messagesTypes.SEND_MESSAGE_REQUEST,
                payload: { test: 'me' }
            };
            expect(actions.sendMessageRequest({ test: 'me' })).toEqual(
                expected
            );
        });
        test('sendMessageSuccess', async () => {
            const expected = {
                type: messagesTypes.SEND_MESSAGE_SUCCESS,
                payload: { test: 'me' }
            };
            expect(actions.sendMessageSuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('sendMessageFailure', async () => {
            const expected = {
                type: messagesTypes.SEND_MESSAGE_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.sendMessageFailure({ my: 'error' })).toEqual(
                expected
            );
        });
        test('dispatches SEND_MESSAGE_REQUEST & SEND_MESSAGE_SUCCESS', () => {
            fetchMock.postOnce(`${process.env.REACT_APP_API_URL}/messages`, {
                body: { content: 'Hello', query_id: 1 }
            });
            const store = mockStore({ activeUser: { userDetails: { id: 1 } } });
            return store
                .dispatch(
                    actions.sendMessage({
                        queryId: 1,
                        message: { content: 'Hello' }
                    })
                )
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.payload.content).toEqual('Hello');
                    expect(requestResp.payload.pending).toEqual(true);
                    expect(requestResp.payload.query_id).toEqual(1);
                    expect(successResp.payload.data.content).toEqual('Hello');
                    expect(successResp.payload).toHaveProperty('tempId');
                });
        });
    });
    describe('delete', () => {
        test('deleteMessageRequest', async () => {
            const expected = {
                type: messagesTypes.DELETE_MESSAGE_REQUEST,
                payload: { test: 'me' }
            };
            expect(actions.deleteMessageRequest({ test: 'me' })).toEqual(
                expected
            );
        });
        test('deleteMessageSuccess', async () => {
            const expected = {
                type: messagesTypes.DELETE_MESSAGE_SUCCESS,
                payload: { test: 'me' }
            };
            expect(actions.deleteMessageSuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('deleteMessageFailure', async () => {
            const expected = {
                type: messagesTypes.DELETE_MESSAGE_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.deleteMessageFailure({ my: 'error' })).toEqual(
                expected
            );
        });
        test('dispatches DELETE_MESSAGE_REQUEST & DELETE_MESSAGE_SUCCESS', () => {
            fetchMock.deleteOnce(
                `${process.env.REACT_APP_API_URL}/messages/1`,
                {}
            );
            const store = mockStore();
            return store.dispatch(actions.deleteMessage({ id: 1 })).then(() => {
                const [requestResp, successResp] = store.getActions();
                expect(requestResp.payload.id).toEqual(1);
                expect(successResp.payload.id).toEqual(1);
            });
        });
    });
    describe('edit', () => {
        test('editMessageRequest', async () => {
            const expected = {
                type: messagesTypes.EDIT_MESSAGE_REQUEST,
                payload: { test: 'me' }
            };
            expect(actions.editMessageRequest({ test: 'me' })).toEqual(
                expected
            );
        });
        test('editMessageSuccess', async () => {
            const expected = {
                type: messagesTypes.EDIT_MESSAGE_SUCCESS,
                payload: { test: 'me' }
            };
            expect(actions.editMessageSuccess({ test: 'me' })).toEqual(
                expected
            );
        });
        test('editMessageFailure', async () => {
            const expected = {
                type: messagesTypes.EDIT_MESSAGE_FAILURE,
                payload: { my: 'error' }
            };
            expect(actions.editMessageFailure({ my: 'error' })).toEqual(
                expected
            );
        });
        test('dispatches EDIT_MESSAGE_REQUEST & EDIT_MESSAGE_SUCCESS', () => {
            fetchMock.putOnce(`${process.env.REACT_APP_API_URL}/messages/1`, {
                body: { id: 1, content: 'Hello' }
            });
            const store = mockStore();
            return store
                .dispatch(
                    actions.editMessage({
                        id: 1,
                        content: 'Hello'
                    })
                )
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.payload.content).toEqual('Hello');
                    expect(requestResp.payload.id).toEqual(1);
                    expect(successResp.payload.content).toEqual('Hello');
                    expect(successResp.payload.id).toEqual(1);
                });
        });
    });
});
