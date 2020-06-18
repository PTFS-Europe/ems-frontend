import reducer from './labelsReducer';
import * as labelsTypes from './labelsTypes';

const initialState = {
    loading: false,
    labelList: [],
    filter: null,
    error: ''
};

describe('labelsReducer', () => {
    test('returns the initial state', async () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
    test('should handle FETCH_USERS_REQUEST', () => {
        expect(
            reducer(initialState, {
                type: labelsTypes.FETCH_LABELS_REQUEST
            })
        ).toEqual({
            loading: true,
            labelList: [],
            filter: null,
            error: ''
        });
    });
    test('should handle FETCH_LABELS_SUCCESS', () => {
        expect(
            reducer(
                { ...initialState, loading: true },
                {
                    type: labelsTypes.FETCH_LABELS_SUCCESS,
                    payload: { data: [{ id: 1 }] }
                }
            )
        ).toEqual({
            loading: false,
            labelList: [{ id: 1 }],
            filter: null,
            error: ''
        });
    });
    test('should handle FETCH_LABELS_FAILURE', () => {
        expect(
            reducer(initialState, {
                type: labelsTypes.FETCH_LABELS_FAILURE,
                payload: 'Oh no'
            })
        ).toEqual({
            loading: false,
            labelList: [],
            filter: null,
            error: 'Oh no'
        });
    });
});
