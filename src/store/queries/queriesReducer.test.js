import reducer from './queriesReducer';
import * as queriesTypes from './queriesTypes';

// TODO: Write tests for the other reducers we have here

const initialState = {
    loading: false,
    queryList: [],
    error: '',
    search: ''
};

const populatedState = {
    loading: false,
    queryList: [{ id: 1 }, { id: 2 }, { id: 3 }],
    error: '',
    search: ''
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
            error: '',
            search: ''
        });
    });
    test('should handle FETCH_QUERIES_SUCCESS', () => {
        expect(
            reducer(initialState, {
                type: queriesTypes.FETCH_QUERIES_SUCCESS,
                payload: { data: [{ test: 'test' }] }
            })
        ).toEqual({
            loading: false,
            queryList: [{ test: 'test' }],
            error: '',
            search: ''
        });
    });
    // If a query ID is passed, we should preserve that query in
    // the queryList when we replace its contents
    test('should handle FETCH_QUERIES_SUCCESS with queryId', () => {
        expect(
            reducer(populatedState, {
                type: queriesTypes.FETCH_QUERIES_SUCCESS,
                payload: { data: [{ id: 4 }], queryId: 2 }
            })
        ).toEqual({
            loading: false,
            queryList: [{ id: 4 }, { id: 2 }],
            error: '',
            search: ''
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
            error: 'Oh no',
            search: ''
        });
    });
});
