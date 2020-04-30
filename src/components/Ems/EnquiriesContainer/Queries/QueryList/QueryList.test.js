import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import QueryList from './QueryList';

let ql;

const mockStateLoading = {
    queries: {
        queryList: [],
        loading: true,
        error: ''
    }
};

const mockState = {
    queries: {
        queryList: [
            {
                created_at: '2020-04-30 10:08:58.348203+01',
                folder_id: null,
                id: 31,
                title: 'Do you sell curry?',
                updated_at: '2020-04-30 10:08:58.348203+01'
            },
            {
                created_at: '2020-04-30 10:09:58.348203+01',
                folder_id: null,
                id: 32,
                title: 'Do you sell chinese?',
                updated_at: '2020-04-30 10:09:58.348203+01'
            }
        ],
        loading: false,
        error: ''
    }
};

const mockStateEmpty = {
    queries: {
        queryList: [],
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

describe('QueryList: loading', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoading);
        });
        ql = render(<QueryList />);
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays loading spinner', () => {
        const spinner = ql.getByRole('alert');
        expect(spinner).toBeTruthy();
    });
});

describe('QueryList: populated', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        ql = render(<QueryList />);
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays query list', () => {
        const querylist = ql.getByRole('navigation');
        expect(querylist).toBeTruthy();
    });
    test('displays our two queries', () => {
        const queries = ql.getAllByRole('listitem');
        expect(queries).toHaveLength(2);
    });
});

describe('QueryList: empty', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateEmpty);
        });
        ql = render(<QueryList />);
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('displays empty query list message', () => {
        const heading = ql.getByRole('heading');
        expect(heading).toBeTruthy();
    });
});
