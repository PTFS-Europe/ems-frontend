import reducer from './queriesReducer';
import * as queriesTypes from './queriesTypes';

const initialState = {
    loading: false,
    queryList: [],
    error: ''
};

describe('queriesReducer', () => {
    test('returns the initial state', async () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
    test('should handle FETCH_QUERIES_REQUEST', () => {
        expect(
            reducer(initialState, { type: queriesTypes.FETCH_QUERIES_REQUEST })
        ).toEqual({
            loading: true,
            queryList: [],
            error: ''
        });
    });
    test('should handle FETCH_QUERIES_SUCCESS', () => {
        expect(
            reducer(initialState, {
                type: queriesTypes.FETCH_QUERIES_SUCCESS,
                payload: [{ test: 'test' }]
            })
        ).toEqual({
            loading: false,
            queryList: [{ test: 'test' }],
            error: ''
        });
    });
    test('should handle FETCH_QUERIES_FAILURE', () => {
        expect(
            reducer(initialState, {
                type: queriesTypes.FETCH_QUERIES_FAILURE,
                payload: 'Oh no'
            })
        ).toEqual({
            loading: false,
            queryList: [],
            error: 'Oh no'
        });
    });
});
