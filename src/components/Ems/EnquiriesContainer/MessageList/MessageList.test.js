import React from 'react';
import { useSelector } from 'react-redux';
import { renderWithRouterMatch } from '../../../../util/testHelpers';

import MessageList from './MessageList';

jest.mock('./MessageCollection/MessageCollection', () => {
    return {
        __esModule: true,
        default: () => (
            <div data-testid="mock-message-collection">Message collection</div>
        )
    };
});

let ml;

const mockStateBase = {
    activeUser: {
        userDetails: {
            id: 1,
            name: 'Joe Bloggs'
        }
    },
    users: {
        usersList: [
            {
                name: 'Joe Bloggs'
            }
        ],
        loading: false,
        error: ''
    }
};

const mockStateLoading = {
    ...mockStateBase,
    queries: {
        loading: false,
        error: '',
        queryList: [
            {
                id: 1,
                initiator: 1
            }
        ]
    },
    messages: {
        messageList: [],
        loading: true,
        error: ''
    }
};

const mockState = {
    ...mockStateBase,
    queries: {
        loading: false,
        error: '',
        queryList: [
            {
                id: 1,
                initiator: 1
            }
        ]
    },
    messages: {
        messageList: [
            {
                id: 4,
                query_id: 33,
                creator_id: 1,
                content:
                    'Hi - I\'d like to order some chippies and two pea fritters please',
                created_at: '2020-05-04 11:56:49.75614+01',
                updated_at: '2020-05-04 11:56:49.75614+01',
                filename: null
            },
            {
                id: 5,
                query_id: 33,
                creator_id: 2,
                content:
                    'Sure, though I\'ve some bad news, we just sold the last pea fritter',
                created_at: '2020-05-04 11:57:18.972605+01',
                updated_at: '2020-05-04 11:57:18.972605+01',
                filename: null
            }
        ],
        loading: false,
        error: ''
    }
};

const mockStateEmpty = {
    ...mockStateBase,
    queries: {
        queryList: [],
        loading: false,
        error: ''
    },
    messages: {
        messageList: [],
        loading: false,
        error: ''
    }
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: jest.fn().mockImplementation(() => () => {})
}));

describe('MessageList: loading', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoading);
        });
        ml = renderWithRouterMatch(MessageList, {
            path: '/query/:queryId',
            route: '/query/33'
        });
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays loading spinner', () => {
        const spinner = ml.getByRole('alert');
        expect(spinner).toBeTruthy();
    });
});

describe('MessageList: populated', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ml = renderWithRouterMatch(MessageList, {
            path: '/query/:queryId',
            route: '/query/33'
        });
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays collection list', () => {
        const querylist = ml.getByRole('list');
        expect(querylist).toBeTruthy();
    });
    test('displays our collections', () => {
        const queries = ml.getAllByTestId('mock-message-collection');
        expect(queries).toHaveLength(2);
    });
});

describe('MessageList: empty', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateEmpty);
        });
        ml = renderWithRouterMatch(MessageList, {
            path: '/query/:queryId',
            route: '/query/33'
        });
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays empty message list message', () => {
        const heading = ml.getByRole('heading');
        expect(heading).toBeTruthy();
    });
});
