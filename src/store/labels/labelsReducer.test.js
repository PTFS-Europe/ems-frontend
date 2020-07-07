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
    describe('fetch', () => {
        test('should handle FETCH_LABELS_REQUEST', () => {
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
    describe('create', () => {
        test('should handle CREATE_LABEL_REQUEST', () => {
            expect(
                reducer(initialState, {
                    type: labelsTypes.CREATE_LABEL_REQUEST,
                    payload: { id: 1234, name: 'Biggs' }
                })
            ).toEqual({
                labelList: [{ id: 1234, name: 'Biggs' }],
                filter: null,
                loading: false,
                error: ''
            });
        });
        test('should handle CREATE_LABEL_SUCCESS', () => {
            const createInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        content: 'Camie'
                    },
                    {
                        id: 987987987,
                        content: 'Fixer'
                    },
                    {
                        id: 3,
                        content: 'Wormie'
                    }
                ]
            };
            const createUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        content: 'Camie'
                    },
                    {
                        id: 2,
                        content: 'Fixer'
                    },
                    {
                        id: 3,
                        content: 'Wormie'
                    }
                ]
            };
            expect(
                reducer(createInitialState, {
                    type: labelsTypes.CREATE_LABEL_SUCCESS,
                    payload: {
                        tempId: 987987987,
                        data: {
                            id: 2,
                            content: 'Fixer'
                        }
                    }
                })
            ).toEqual(createUpdatedState);
        });
        test('should handle CREATE_LABELS_FAILURE', () => {
            const createFailInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        content: 'Camie'
                    },
                    {
                        id: 987987987,
                        content: 'Fixer'
                    },
                    {
                        id: 3,
                        content: 'Wormie'
                    }
                ]
            };
            const createFailUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        content: 'Camie'
                    },
                    {
                        id: 3,
                        content: 'Wormie'
                    }
                ]
            };
            expect(
                reducer(createFailInitialState, {
                    type: labelsTypes.CREATE_LABEL_FAILURE,
                    payload: { tempId: 987987987 }
                })
            ).toEqual(createFailUpdatedState);
        });
    });
    describe('update', () => {
        test('should handle UPDATE_LABEL_REQUEST', () => {
            const updateInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'Obi-Wan Kenobi'
                    },
                    {
                        id: 2,
                        name: 'Mace Windu'
                    },
                    {
                        id: 3,
                        name: 'Plo Koon'
                    }
                ]
            };
            const updateUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'Ben Kenobi'
                    },
                    {
                        id: 2,
                        name: 'Mace Windu'
                    },
                    {
                        id: 3,
                        name: 'Plo Koon'
                    }
                ]
            };
            expect(
                reducer(updateInitialState, {
                    type: labelsTypes.UPDATE_LABEL_REQUEST,
                    payload: { id: 1, name: 'Ben Kenobi' }
                })
            ).toEqual(updateUpdatedState);
        });
        test('should handle UPDATE_LABEL_SUCCESS', () => {
            const updateInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'Ahsoka Tano'
                    },
                    {
                        id: 2,
                        name: 'Ki-Adi-Mundi'
                    },
                    {
                        id: 3,
                        name: 'Yoda'
                    }
                ]
            };
            const updateUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'Ahsoka Tano'
                    },
                    {
                        id: 2,
                        name: 'Saesee Tin'
                    },
                    {
                        id: 3,
                        name: 'Yoda'
                    }
                ]
            };
            expect(
                reducer(updateInitialState, {
                    type: labelsTypes.UPDATE_LABEL_SUCCESS,
                    payload: {
                        id: 2,
                        name: 'Saesee Tin'
                    }
                })
            ).toEqual(updateUpdatedState);
        });
        test('should handle UPDATE_LABEL_FAILURE', () => {
            const updateInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'Ahsoka Tano'
                    },
                    {
                        id: 2,
                        name: 'Saesee Tin'
                    },
                    {
                        id: 3,
                        name: 'Yoda'
                    }
                ]
            };
            const updateUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'Ahsoka Tano'
                    },
                    {
                        id: 2,
                        name: 'Ki-Adi-Mundi'
                    },
                    {
                        id: 3,
                        name: 'Yoda'
                    }
                ]
            };
            expect(
                reducer(updateInitialState, {
                    type: labelsTypes.UPDATE_LABEL_FAILURE,
                    payload: {
                        error: 'The dark side clouds everything',
                        unmodifiedLabel: { id: 2, name: 'Ki-Adi-Mundi' }
                    }
                })
            ).toEqual({
                ...updateUpdatedState,
                error: 'The dark side clouds everything'
            });
        });
    });
    describe('delete', () => {
        test('should handle DELETE_LABEL_REQUEST', () => {
            const deleteInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'A young Jedi named Darth Vader'
                    },
                    {
                        id: 2,
                        name: 'Who was a pupil of mine until he turned to evil'
                    },
                    {
                        id: 3,
                        name: 'Helped the Empire hunt down and destroy the Jedi'
                    }
                ]
            };
            const deleteUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'A young Jedi named Darth Vader'
                    },
                    {
                        id: 2,
                        name: 'Who was a pupil of mine until he turned to evil',
                        pending: true
                    },
                    {
                        id: 3,
                        name: 'Helped the Empire hunt down and destroy the Jedi'
                    }
                ]
            };
            expect(
                reducer(deleteInitialState, {
                    type: labelsTypes.DELETE_LABEL_REQUEST,
                    payload: { id: 2 }
                })
            ).toEqual(deleteUpdatedState);
        });
        test('should handle DELETE_LABEL_SUCCESS', () => {
            const deleteInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'A young Jedi named Darth Vader'
                    },
                    {
                        id: 2,
                        name: 'Who was a pupil of mine until he turned to evil',
                        pending: true
                    },
                    {
                        id: 3,
                        name: 'Helped the Empire hunt down and destroy the Jedi'
                    }
                ]
            };
            const deleteUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'A young Jedi named Darth Vader'
                    },
                    {
                        id: 3,
                        name: 'Helped the Empire hunt down and destroy the Jedi'
                    }
                ]
            };
            expect(
                reducer(deleteInitialState, {
                    type: labelsTypes.DELETE_LABEL_SUCCESS,
                    payload: {
                        id: 2
                    }
                })
            ).toEqual(deleteUpdatedState);
        });
        test('should handle DELETE_LABEL_FAILURE', () => {
            const deleteFailInitialState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'A young Jedi named Darth Vader'
                    },
                    {
                        id: 2,
                        name: 'Who was a pupil of mine until he turned to evil',
                        pending: true
                    },
                    {
                        id: 3,
                        name: 'Helped the Empire hunt down and destroy the Jedi'
                    }
                ]
            };
            const deleteFailUpdatedState = {
                ...initialState,
                labelList: [
                    {
                        id: 1,
                        name: 'A young Jedi named Darth Vader'
                    },
                    {
                        id: 2,
                        name: 'Who was a pupil of mine until he turned to evil'
                    },
                    {
                        id: 3,
                        name: 'Helped the Empire hunt down and destroy the Jedi'
                    }
                ]
            };
            expect(
                reducer(deleteFailInitialState, {
                    type: labelsTypes.DELETE_LABEL_FAILURE,
                    payload: {
                        id: 2,
                        error: 'Vader was seduced by the dark side of the Force'
                    }
                })
            ).toEqual({
                ...deleteFailUpdatedState,
                error: 'Vader was seduced by the dark side of the Force'
            });
        });
    });
});
