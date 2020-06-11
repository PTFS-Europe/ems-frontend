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
                messageList: [{ id: 1 }],
                loading: false,
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
                error: '',
                loading: false,
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
                error: '',
                loading: false,
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
    describe('upload', () => {
        test('should handle UPLOAD_FILE_REQUEST', () => {
            const uploadInitialState = {
                error: '',
                loading: false,
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?'
                    }
                ]
            };
            const uploadUpdatedState = {
                error: '',
                loading: false,
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
                        content: 'Very interesting',
                        uploading: true
                    },
                    {
                        id: 4,
                        content: 'Quickly, they are on the move',
                        uploading: true
                    }
                ]
            };
            expect(
                reducer(uploadInitialState, {
                    type: messagesTypes.UPLOAD_FILE_REQUEST,
                    payload: [
                        { id: 3, content: 'Very interesting' },
                        { id: 4, content: 'Quickly, they are on the move' }
                    ]
                })
            ).toEqual(uploadUpdatedState);
        });
        test('should handle UPLOAD_FILE_SUCCESS', () => {
            const uploadInitialState = {
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
                        content: 'Very interesting',
                        uploading: true,
                        originalname: 'myfile.txt'
                    }
                ]
            };
            const uploadUpdatedState = {
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
                        content: 'Very interesting',
                        originalname: 'myfile.txt'
                    }
                ]
            };
            expect(
                reducer(uploadInitialState, {
                    type: messagesTypes.UPLOAD_FILE_SUCCESS,
                    payload: {
                        data: [
                            {
                                id: 3,
                                content: 'Very interesting',
                                originalname: 'myfile.txt'
                            }
                        ],
                        messageMap: {
                            'myfile.txt': 3
                        }
                    }
                })
            ).toEqual(uploadUpdatedState);
        });
        test('should handle UPLOAD_FILE_FAILURE', () => {
            const uploadInitialState = {
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
                        content: 'Very interesting',
                        uploading: true,
                        originalname: 'myfile.txt'
                    }
                ]
            };
            const uploadFailedState = {
                ...initialState,
                loading: false,
                error: 'Oh no',
                messageList: [
                    {
                        id: 1,
                        content: 'Hello there'
                    },
                    {
                        id: 2,
                        content: 'What brings you out this far?'
                    }
                ]
            };
            expect(
                reducer(uploadInitialState, {
                    type: messagesTypes.UPLOAD_FILE_FAILURE,
                    payload: {
                        messageMap: {
                            'myfile.txt': 3
                        },
                        error: 'Oh no'
                    }
                })
            ).toEqual(uploadFailedState);
        });
    });
});
