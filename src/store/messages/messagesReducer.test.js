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
