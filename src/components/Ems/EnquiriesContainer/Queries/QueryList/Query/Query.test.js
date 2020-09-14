import React from 'react';
import MutationObserver from 'mutation-observer';
import { useSelector } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Query from './Query';

// We need to do an async test for "clicking the checkbox dispatches"
// Unfortunately waitFor seems to trigger an error, described here:
// https://github.com/testing-library/react-testing-library/issues/731
// So I'm using the workaround described in this comment:
// https://github.com/testing-library/react-testing-library/issues/731#issuecomment-658826050
global.MutationObserver = MutationObserver;

const mockDispatch = jest.fn().mockImplementation(() => {});

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: () => mockDispatch
}));

jest.mock('../../../../../UI/UserIcon/UserIcon', () => {
    return {
        __esModule: true,
        default: () => <div role="figure">UserIcon</div>
    };
});

jest.mock('../../../../../UI/QueryActionButton/QueryActionButton', () => {
    return {
        __esModule: true,
        default: () => <button>QueryActionButton</button>
    };
});

jest.mock('../../../../../UI/QueryLabels/QueryLabels', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="querylabels">QueryLabels</div>
    };
});

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => {
        return <i className="fa" />;
    }
}));

let q;

const query = {
    created_at: '2020-04-30 10:08:58.348203+01',
    folder: null,
    id: 31,
    title: 'Do you sell curry?',
    latestMessage: {
        creator_id: 1,
        content: 'This is the latest message'
    },
    updated_at: '2020-04-30 10:08:58.348203+01'
};

const stateQueries = {
    queries: {
        selected: [31]
    }
};

describe('Query', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(stateQueries);
        });
        q = render(<Query query={query} />);
    });
    test('displays query', () => {
        const query = q.getByRole('listitem');
        expect(query).toBeTruthy();
    });

    test('displays user icon', () => {
        const icon = q.getByRole('figure');
        expect(icon).toBeTruthy();
    });

    test('displays the query title', () => {
        const title = q.getByText('Do you sell curry?');
        expect(title).toBeTruthy();
    });

    test('displays the query timestamp', () => {
        const time = q.getByRole('complementary');
        expect(time).toBeTruthy();
    });

    test('displays the latest message text', () => {
        const time = q.getByText('This is the latest message');
        expect(time).toBeTruthy();
    });

    test('displays the action button', () => {
        const button = q.getByRole('button');
        expect(button).toBeTruthy();
    });

    test('displays the query labels', () => {
        const button = q.getByTestId('querylabels');
        expect(button).toBeTruthy();
    });
    test('a selected query has a checked checkbox', () => {
        const checkbox = q.getByRole('checkbox');
        expect(checkbox.checked).toEqual(true);
    });
    test('an unselected query has an unchecked checkbox', () => {
        useSelector.mockImplementation((callback) => {
            return callback({ queries: { selected: [32] } });
        });
        q.rerender(<Query query={query} />);
        const checkbox = q.getByRole('checkbox');
        expect(checkbox.checked).toEqual(false);
    });
    test('clicking the checkbox dispatches', async () => {
        const checkbox = q.getByRole('checkbox');
        fireEvent.click(checkbox);
        await waitFor(() => expect(mockDispatch).toBeCalled());
    });
});
