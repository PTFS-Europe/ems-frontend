import React from 'react';
import { useSelector } from 'react-redux';
import { renderWithRouterMatch } from '../../../../../util/testHelpers';

import QueryHeader from './QueryHeader';

jest.mock('../../../../UI/UserIcon/UserIcon', () => {
    return {
        __esModule: true,
        default: () => <div role="figure">UserIcon</div>
    };
});

let q;

const mockState = {
    queries: {
        queryList: [
            {
                id: 1,
                title: 'This is the query title',
                participants: [1, 2, 3]
            }
        ],
        loading: false,
        error: ''
    }
};

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn()
}));

describe('QueryHeader', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        q = renderWithRouterMatch(QueryHeader, {
            path: '/query/:queryId',
            route: '/query/1'
        });
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('loads and displays header', () => {
        const header = q.getByRole('banner');
        expect(header).toBeTruthy();
    });

    test('displays the correct number of participant icons', () => {
        const icon = q.getAllByRole('figure');
        expect(icon).toHaveLength(3);
    });

    test('displays query heading', () => {
        const heading = q.getByRole('heading');
        expect(heading).toBeTruthy();
    });
});
