import React from 'react';
import { useSelector } from 'react-redux';
import { renderWithRouterMatch } from '../../../../../util/testHelpers';

import QueryList from './QueryList';

let ql;

jest.mock('./Query/Query', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="query">Query</div>
    };
});

const mockStateFolders = {
    folders: {
        folderList: [{ code: 'UNREAD' }],
        loading: false,
        error: '',
        filter: ''
    }
};

const mockStateLabels = {
    labels: {
        labelList: [{ id: 1 }],
        loading: false,
        error: '',
        filter: ''
    }
};

const mockStateLoading = {
    queries: {
        queryList: [],
        loading: true,
        error: '',
        search: ''
    },
    ...mockStateFolders,
    ...mockStateLabels
};

const mockState = {
    queries: {
        queryList: [
            {
                created_at: '2020-04-30 10:08:58.348203+01',
                folder_id: null,
                id: 31,
                initiator: 1,
                participants: [1, 2, 4],
                title: 'Do you sell curry?',
                updated_at: '2020-04-30 10:08:58.348203+01'
            },
            {
                created_at: '2020-04-30 10:09:58.348203+01',
                folder_id: null,
                id: 32,
                initiator: 6,
                participants: [1, 2, 5],
                title: 'Do you sell chinese?',
                updated_at: '2020-04-30 10:09:58.348203+01'
            }
        ],
        loading: false,
        error: '',
        search: ''
    },
    ...mockStateFolders,
    ...mockStateLabels
};

const mockStateEmpty = {
    queries: {
        queryList: [],
        loading: false,
        error: '',
        search: 'abc'
    },
    ...mockStateFolders,
    ...mockStateLabels
};

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" />;
    }
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: jest.fn().mockImplementation(() => () => {})
}));

describe('loading', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoading);
        });
        ql = renderWithRouterMatch(QueryList);
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays loading spinner', () => {
        const spinner = ql.getByRole('alert');
        expect(spinner).toBeTruthy();
    });
});

describe('populated', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList);
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays query list', () => {
        const querylist = ql.getByRole('navigation');
        expect(querylist).toBeTruthy();
    });
    test('displays our two queries', () => {
        const queries = ql.getAllByTestId('query');
        expect(queries).toHaveLength(2);
    });
});

describe('empty', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateEmpty);
        });
        ql = renderWithRouterMatch(QueryList);
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays empty query list message', () => {
        // We should therefore have two headings
        // The "Your queries" one and "No queries one"
        const heading = ql.getAllByRole('heading');
        expect(heading).toHaveLength(2);
    });
});

describe('displays "Start new query" button correctly', () => {
    test('active search, search returned no results and active query', () => {
        // Active query is the query in queryList, so the button should
        // not display
        const mockState = {
            queries: {
                // This is our active query
                queryList: [
                    {
                        id: 33,
                        initiator: 1,
                        participants: [1, 2]
                    }
                ],
                loading: false,
                error: '',
                search: 'abc',
                preserved: false
            },
            ...mockStateFolders,
            ...mockStateLabels
        };
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList, {
            path: '/query/:queryId',
            route: '/query/33'
        });
        const button = ql.queryByText('Start a new query');
        expect(button).not.toBeInTheDocument();
    });
    test('active search, search returned no results and active query', () => {
        // Active query is not the query we already have, so the button should
        // not display
        const mockState = {
            queries: {
                queryList: [
                    {
                        id: 34,
                        initiator: 1,
                        participants: [1, 2]
                    }
                ],
                loading: false,
                error: '',
                search: 'abc',
                preserved: false
            },
            ...mockStateFolders,
            ...mockStateLabels
        };
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList, {
            path: '/query/:queryId',
            route: '/query/33'
        });
        const button = ql.queryByText('Start a new query');
        expect(button).not.toBeInTheDocument();
    });
    test('active search, search returned no results and no active query', () => {
        const mockState = {
            queries: {
                // No active query
                queryList: [],
                loading: false,
                error: '',
                search: 'abc',
                preserved: false
            },
            ...mockStateFolders,
            ...mockStateLabels
        };
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList);
        const button = ql.getByText('Start a new query');
        expect(button).toBeInTheDocument();
    });
    test('active folder filter, matching folder, should not display button', () => {
        const mockState = {
            queries: {
                // No active query
                queryList: [
                    {
                        id: 1,
                        folder: 'UNREAD',
                        initiator: 1,
                        participants: [1, 2]
                    }
                ],
                loading: false,
                error: '',
                search: '',
                preserved: false
            },
            folders: {
                ...mockStateFolders.folders,
                filter: 'UNREAD'
            },
            ...mockStateLabels
        };
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList);
        const button = ql.queryByText('Start a new query');
        expect(button).not.toBeInTheDocument();
    });
    test('active folder filter, no matching folder, should display button', () => {
        const mockState = {
            queries: {
                // No active query
                queryList: [],
                loading: false,
                error: '',
                search: '',
                preserved: false
            },
            folders: {
                ...mockStateFolders.folders,
                filter: 'UNREAD'
            },
            ...mockStateLabels
        };
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList);
        const button = ql.queryByText('Start a new query');
        expect(button).toBeInTheDocument();
    });
    test('active label filter, matching filter, should not display button', () => {
        const mockState = {
            queries: {
                // No active query
                queryList: [
                    {
                        id: 1,
                        folder: 'UNREAD',
                        initiator: 1,
                        participants: [1, 2]
                    }
                ],
                loading: false,
                error: '',
                search: '',
                preserved: false
            },
            ...mockStateFolders,
            labels: {
                ...mockStateLabels.labels,
                filter: 1
            }
        };
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList);
        const button = ql.queryByText('Start a new query');
        expect(button).not.toBeInTheDocument();
    });
    test('active label filter, no matching filter, should display button', () => {
        const mockState = {
            queries: {
                // No active query
                queryList: [],
                loading: false,
                error: '',
                search: '',
                preserved: false
            },
            ...mockStateFolders,
            labels: {
                ...mockStateLabels.labels,
                filter: 1
            }
        };
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = renderWithRouterMatch(QueryList);
        const button = ql.queryByText('Start a new query');
        expect(button).toBeInTheDocument();
    });
});
