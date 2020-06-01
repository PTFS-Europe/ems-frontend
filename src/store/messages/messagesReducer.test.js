import reducer from './messagesReducer';
import * as messagesTypes from './messagesTypes';

const initialState = {
    loading: false,
    messageList: [],
    error: ''
};

describe('messagesReducer', () => {
    test('returns the initial state', async () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
    describe('fetch', () => {
        test('should handle FETCH_MESSAGES_REQUEST', () => {
            expect(
                reducer(initialState, {
                    type: messagesTypes.FETCH_MESSAGES_REQUEST
                })
            ).toEqual({
                loading: true,
                messageList: [],
                error: ''
            });
        });
        test('should handle FETCH_MESSAGES_SUCCESS', () => {
            expect(
                reducer(initialState, {
                    type: messagesTypes.FETCH_MESSAGES_SUCCESS,
                    payload: [{ test: 'test' }]
                })
            ).toEqual({
                loading: false,
                messageList: [{ test: 'test' }],
                error: ''
            });
        });
        test('should handle FETCH_MESSAGES_FAILURE', () => {
            expect(
                reducer(initialState, {
                    type: messagesTypes.FETCH_MESSAGES_FAILURE,
                    payload: 'Oh no'
                })
            ).toEqual({
                loading: false,
                messageList: [],
                error: 'Oh no'
            });
        });
    });
    describe('send', () => {
        test('should handle SEND_MESSAGE_REQUEST', () => {
            expect(
                reducer(initialState, {
                    type: messagesTypes.SEND_MESSAGE_REQUEST,
                    payload: { id: 1 }
                })
            ).toEqual({
                loading: true,
                messageList: [{ id: 1 }],
                error: ''
            });
        });
        test('should handle SEND_MESSAGE_SUCCESS', () => {
            const sendInitialState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 987987987,
                        content: 'What brings you out this far?',
                        pending: true
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            const sendUpdatedState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?'
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            expect(
                reducer(sendInitialState, {
                    type: messagesTypes.SEND_MESSAGE_SUCCESS,
                    payload: {
                        tempId: 987987987,
                        data: {
                            id: 2,
                            content: 'What brings you out this far?'
                        }
                    }
                })
            ).toEqual(sendUpdatedState);
        });
        test('should handle SEND_MESSAGES_FAILURE', () => {
            expect(
                reducer(initialState, {
                    type: messagesTypes.SEND_MESSAGE_FAILURE,
                    payload: 'Oh no'
                })
            ).toEqual({
                loading: false,
                messageList: [],
                error: 'Oh no'
            });
        });
    });
    describe('delete', () => {
        test('should handle DELETE_MESSAGE_REQUEST', () => {
            const deleteInitialState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?'
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            const deleteUpdatedState = {
                loading: true,
                error: '',
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?',
                        pending: true
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            expect(
                reducer(deleteInitialState, {
                    type: messagesTypes.DELETE_MESSAGE_REQUEST,
                    payload: { id: 2 }
                })
            ).toEqual(deleteUpdatedState);
        });
        test('should handle DELETE_MESSAGE_SUCCESS', () => {
            const deleteInitialState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?',
                        pending: true
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            const deleteUpdatedState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            expect(
                reducer(deleteInitialState, {
                    type: messagesTypes.DELETE_MESSAGE_SUCCESS,
                    payload: {
                        id: 2
                    }
                })
            ).toEqual(deleteUpdatedState);
        });
        test('should handle DELETE_MESSAGE_FAILURE', () => {
            expect(
                reducer(initialState, {
                    type: messagesTypes.DELETE_MESSAGE_FAILURE,
                    payload: 'Oh no'
                })
            ).toEqual({
                loading: false,
                messageList: [],
                error: 'Oh no'
            });
        });
    });
    describe('edit', () => {
        test('should handle EDIT_MESSAGE_REQUEST', () => {
            const editInitialState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?'
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            const editUpdatedState = {
                loading: true,
                error: '',
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?',
                        pending: true
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            expect(
                reducer(editInitialState, {
                    type: messagesTypes.EDIT_MESSAGE_REQUEST,
                    payload: { id: 2, content: 'This little droid' }
                })
            ).toEqual(editUpdatedState);
        });
        test('should handle EDIT_MESSAGE_SUCCESS', () => {
            const editInitialState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?',
                        pending: true
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            const editUpdatedState = {
                ...initialState,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'This little droid'
                    },
                    {
                        id: 3,
                        content: 'Very interesting'
                    }
                ]
            };
            expect(
                reducer(editInitialState, {
                    type: messagesTypes.EDIT_MESSAGE_SUCCESS,
                    payload: {
                        id: 2,
                        content: 'This little droid'
                    }
                })
            ).toEqual(editUpdatedState);
        });
        test('should handle EDIT_MESSAGE_FAILURE', () => {
            expect(
                reducer(initialState, {
                    type: messagesTypes.EDIT_MESSAGE_FAILURE,
                    payload: 'Oh no'
                })
            ).toEqual({
                loading: false,
                messageList: [],
                error: 'Oh no'
            });
        });
    });
});
