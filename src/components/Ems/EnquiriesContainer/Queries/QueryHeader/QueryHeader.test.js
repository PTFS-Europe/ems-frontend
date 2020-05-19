import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import QueryHeader from './QueryHeader';

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn()
}));

jest.mock('../../../../UI/UserIcon/UserIcon', () => {
    return {
        __esModule: true,
        default: () => <div role="figure">UserIcon</div>
    };
});

const mockState = {
    queries: {
        queryList: [],
        loading: false,
        error: ''
    }
};

const mockMatch = {
    params: {
        queryId: 1
    }
};

describe('QueryHeader', () => {
    let q;
    beforeEach(() => {
        const history = createMemoryHistory();
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        q = render(
            <Router history={history}>
                <QueryHeader match={mockMatch} />
            </Router>
        );
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
