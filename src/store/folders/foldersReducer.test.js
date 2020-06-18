import reducer from './foldersReducer';
import * as foldersTypes from './foldersTypes';

const initialState = {
    loading: false,
    folderList: [],
    filter: null,
    error: ''
};

describe('foldersReducer', () => {
    test('returns the initial state', async () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
    test('should handle FETCH_USERS_REQUEST', () => {
        expect(
            reducer(initialState, {
                type: foldersTypes.FETCH_FOLDERS_REQUEST
            })
        ).toEqual({
            loading: true,
            folderList: [],
            filter: null,
            error: ''
        });
    });
    test('should handle FETCH_FOLDERS_SUCCESS', () => {
        expect(
            reducer(
                { ...initialState, loading: true },
                {
                    type: foldersTypes.FETCH_FOLDERS_SUCCESS,
                    payload: { data: [{ id: 1 }] }
                }
            )
        ).toEqual({
            loading: false,
            folderList: [{ id: 1 }],
            filter: null,
            error: ''
        });
    });
    test('should handle FETCH_FOLDERS_FAILURE', () => {
        expect(
            reducer(initialState, {
                type: foldersTypes.FETCH_FOLDERS_FAILURE,
                payload: 'Oh no'
            })
        ).toEqual({
            loading: false,
            folderList: [],
            filter: null,
            error: 'Oh no'
        });
    });
});
