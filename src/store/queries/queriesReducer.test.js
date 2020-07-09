import reducer from './queriesReducer';
import * as queriesTypes from './queriesTypes';
import * as labelsTypes from '../labels/labelsTypes';

// TODO: Write tests for the other reducers we have here

const initialState = {
    loading: false,
    queryList: [],
    error: '',
    search: '',
    preserved: false
};

const populatedState = {
    loading: false,
    queryList: [{ id: 1 }, { id: 2 }, { id: 3 }],
    error: '',
    search: '',
    preserved: false
};

describe('queriesReducer', () => {
    describe('init', () => {
        test('returns the initial state', async () => {
            expect(reducer(undefined, {})).toEqual(initialState);
        });
    });
    describe('fetch', () => {
        test('should handle FETCH_QUERIES_REQUEST', () => {
            expect(
                reducer(initialState, {
                    type: queriesTypes.FETCH_QUERIES_REQUEST
                })
            ).toEqual({
                loading: true,
                queryList: [],
                error: '',
                search: '',
                preserved: false
            });
        });
        test('should handle FETCH_QUERIES_SUCCESS', () => {
            expect(
                reducer(initialState, {
                    type: queriesTypes.FETCH_QUERIES_SUCCESS,
                    payload: { data: [{ id: 1 }] }
                })
            ).toEqual({
                loading: false,
                queryList: [{ id: 1 }],
                error: '',
                search: '',
                preserved: false
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
                search: '',
                preserved: true
            });
        });
        test('should handle FETCH_QUERIES_FAILURE', () => {
            expect(
                reducer(initialState, {
                    type: queriesTypes.FETCH_QUERIES_FAILURE,
                    payload: 'Thats not true, thats impossible'
                })
            ).toEqual({
                loading: false,
                queryList: [],
                error: 'Thats not true, thats impossible',
                search: '',
                preserved: false
            });
        });
    });
    describe('update', () => {
        test('should handle UPDATE_QUERY_REQUEST', () => {
            const updateInitialState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'C-3PO'
                    },
                    {
                        id: 2,
                        title: 'R5-D4'
                    },
                    {
                        id: 3,
                        title: 'U-3PO'
                    }
                ]
            };
            const updateUpdatedState = {
                ...initialState,
                error: '',
                loading: false,
                preserved: false,
                queryList: [
                    {
                        id: 1,
                        title: 'C-3PO'
                    },
                    {
                        id: 2,
                        title: 'R2-D2'
                    },
                    {
                        id: 3,
                        title: 'U-3PO'
                    }
                ]
            };
            expect(
                reducer(updateInitialState, {
                    type: queriesTypes.UPDATE_QUERY_REQUEST,
                    payload: { id: 2, title: 'R2-D2' }
                })
            ).toEqual(updateUpdatedState);
        });
        test('should handle UPDATE_QUERY_SUCCESS', () => {
            const updateInitialState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'C-3PO'
                    },
                    {
                        id: 2,
                        title: 'R5-D4'
                    },
                    {
                        id: 3,
                        title: 'U-3PO'
                    }
                ]
            };
            const updateUpdatedState = {
                ...initialState,
                error: '',
                loading: false,
                preserved: false,
                queryList: [
                    {
                        id: 1,
                        title: 'C-3PO'
                    },
                    {
                        id: 2,
                        title: 'R2-D2'
                    },
                    {
                        id: 3,
                        title: 'U-3PO'
                    }
                ]
            };
            expect(
                reducer(updateInitialState, {
                    type: queriesTypes.UPDATE_QUERY_SUCCESS,
                    payload: { data: { id: 2, title: 'R2-D2' } }
                })
            ).toEqual(updateUpdatedState);
        });
        test('should handle UPDATE_QUERY_FAILURE', () => {
            const updateInitialState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'C-3PO'
                    },
                    {
                        id: 2,
                        title: 'R5-D4'
                    },
                    {
                        id: 3,
                        title: 'U-3PO'
                    }
                ]
            };
            const updateFailedState = {
                ...initialState,
                error: { message: 'Thats not true, thats impossible' },
                loading: false,
                preserved: false,
                queryList: [
                    {
                        id: 1,
                        title: 'C-3PO'
                    },
                    {
                        id: 2,
                        title: 'R5-D4'
                    },
                    {
                        id: 3,
                        title: 'U-3PO'
                    }
                ]
            };
            expect(
                reducer(updateInitialState, {
                    type: queriesTypes.UPDATE_QUERY_FAILURE,
                    payload: {
                        error: { message: 'Thats not true, thats impossible' },
                        unmodifiedQuery: updateInitialState.queryList[1]
                    }
                })
            ).toEqual(updateFailedState);
        });
    });
    describe('toggle label', () => {
        test('should handle TOGGLE_LABEL_REQUEST - adding a label', () => {
            const toggleInitialState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'BB-8',
                        labels: [1]
                    }
                ]
            };
            const toggleUpdatedState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'BB-8',
                        labels: [1, 2]
                    }
                ]
            };
            expect(
                reducer(toggleInitialState, {
                    type: queriesTypes.TOGGLE_LABEL_REQUEST,
                    payload: { labelId: 2, query: { id: 1, labels: [1] } }
                })
            ).toEqual(toggleUpdatedState);
        });
        test('should handle TOGGLE_LABEL_REQUEST - removing a label', () => {
            const toggleInitialState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'BB-8',
                        labels: [1, 2]
                    }
                ]
            };
            const toggleUpdatedState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'BB-8',
                        labels: [1]
                    }
                ]
            };
            expect(
                reducer(toggleInitialState, {
                    type: queriesTypes.TOGGLE_LABEL_REQUEST,
                    payload: { labelId: 2, query: { id: 1, labels: [1, 2] } }
                })
            ).toEqual(toggleUpdatedState);
        });
        test('should handle DELETE_LABEL_SUCCESS', () => {
            const delInitialState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'Gonk',
                        labels: [1, 2]
                    },
                    {
                        id: 2,
                        title: 'R5-D4',
                        labels: [3, 4]
                    }
                ]
            };
            const delUpdatedState = {
                ...initialState,
                queryList: [
                    {
                        id: 1,
                        title: 'Gonk',
                        labels: [1]
                    },
                    {
                        id: 2,
                        title: 'R5-D4',
                        labels: [3, 4]
                    }
                ]
            };
            expect(
                reducer(delInitialState, {
                    type: labelsTypes.DELETE_LABEL_SUCCESS,
                    payload: { id: 2 }
                })
            ).toEqual(delUpdatedState);
        });
    });
});
