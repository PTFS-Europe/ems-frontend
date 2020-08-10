import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './messagesActions';
import * as messagesTypes from './messagesTypes';

import api from '../../util/EmsApi';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

actions.lib.doRefreshQuery = jest.fn(() => Promise.resolve());

describe('messagesActions', () => {
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
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: { messages: ['something'] }
                    });
                });
            };
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
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: { content: 'Hello', query_id: 1 }
                    });
                });
            };
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
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: {}
                    });
                });
            };
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
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: { id: 1, content: 'R5-D4' }
                    });
                });
            };
            const store = mockStore({
                messages: { messageList: [{ id: 1, content: 'R2-D2' }] }
            });
            return store
                .dispatch(
                    actions.editMessage({
                        id: 1,
                        content: 'R5-D4'
                    })
                )
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.payload.content).toEqual('R5-D4');
                    expect(requestResp.payload.id).toEqual(1);
                    expect(successResp.payload.content).toEqual('R5-D4');
                    expect(successResp.payload.id).toEqual(1);
                });
        });
    });
    describe('upload', () => {
        test('uploadFileRequest', async () => {
            const expected = {
                type: messagesTypes.UPLOAD_FILE_REQUEST,
                payload: { test: 'me' }
            };
            expect(actions.uploadFileRequest({ test: 'me' })).toEqual(expected);
        });
        test('uploadFileSuccess', async () => {
            const expected = {
                type: messagesTypes.UPLOAD_FILE_SUCCESS,
                payload: { test: 'me' }
            };
            expect(actions.uploadFileSuccess({ test: 'me' })).toEqual(expected);
        });
        test('uploadFileFailure', async () => {
            const expected = {
                type: messagesTypes.UPLOAD_FILE_FAILURE,
                payload: { test: 'me' }
            };
            expect(actions.uploadFileFailure({ test: 'me' })).toEqual(expected);
        });
        test('dispatches UPLOAD_FILE_REQUEST & UPLOAD_FILE_SUCCESS', () => {
            api.makeRequest = () => {
                return new Promise((resolve) => {
                    return resolve({
                        data: { id: 1, originalname: 'myfile.txt' }
                    });
                });
            };
            const store = mockStore({ activeUser: { userDetails: { id: 1 } } });
            return store
                .dispatch(actions.uploadFile([{ name: 'myfile.txt' }], 3))
                .then(() => {
                    const [requestResp, successResp] = store.getActions();
                    expect(requestResp.payload).toHaveLength(1);
                    expect(requestResp.payload[0].query_id).toEqual(3);
                    expect(requestResp.payload[0].creator_id).toEqual(1);
                    expect(requestResp.payload[0].content).toEqual(null);
                    expect(requestResp.payload[0].originalname).toEqual(
                        'myfile.txt'
                    );
                    expect(successResp.payload.data.originalname).toEqual(
                        'myfile.txt'
                    );
                    // We test the keys here because the property value will
                    // be the randomly generated ID
                    expect(
                        Object.keys(successResp.payload.messageMap)
                    ).toEqual(['myfile.txt']);
                });
        });
    });
});
