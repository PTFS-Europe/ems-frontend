import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';

import QueryBulk from './QueryBulk';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" />;
    }
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

const mockDispatch = jest.fn().mockImplementation(() => () => {});

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: () => mockDispatch()
}));

jest.mock('../../../../../hooks/useFilters', () => {
    return {
        __esModule: true,
        default: () => ({
            search: '',
            folders: null,
            labels: 1,
            isActiveFilter: true
        })
    };
});
jest.mock('../../Admin/Labels/BulkLabelPicker/BulkLabelPicker', () => {
    return {
        __esModule: true,
        default: () => (
            <div data-testid="bulk-label-picker">Bulk label picker</div>
        )
    };
});

const mockState = {
    queries: {
        queryList: [
            { id: 1, name: 'Dagobah', colour: '#0f0' },
            { id: 2, name: 'Hoth', colour: '#00f' },
            { id: 3, name: 'Tatooine', colour: '#ff0' }
        ],
        selected: [1, 2, 3]
    }
};

let c;

describe('initialisation', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        c = render(<QueryBulk />);
    });
    describe('renders the component', () => {
        test('checkbox', () => {
            const checkbox = c.getByRole('checkbox');
            expect(checkbox).toBeTruthy();
        });
        test('checkbox should be checked if all queries are selected', () => {
            const checkbox = c.getByRole('checkbox');
            expect(checkbox.checked).toBeTruthy();
        });
        test('checkbox should be unchecked if not all queries are selected', () => {
            useSelector.mockImplementation((callback) => {
                return callback({
                    ...mockState,
                    queries: { ...mockState.queries, selected: [1, 2] }
                });
            });
            c.rerender(<QueryBulk />);
            const checkbox = c.getByRole('checkbox');
            expect(checkbox.checked).toBeFalsy();
        });
        test('checkbox should be enabled if there is an active filter', () => {
            const checkbox = c.getByRole('checkbox');
            expect(checkbox.disabled).toBeFalsy();
        });
        test('button', () => {
            const button = c.getByRole('button');
            expect(button).toBeTruthy();
        });
        test('button should be enabled if at least one query is selected', () => {
            useSelector.mockImplementation((callback) => {
                return callback({
                    ...mockState,
                    queries: { ...mockState.queries, selected: [1] }
                });
            });
            c.rerender(<QueryBulk />);
            const button = c.getByRole('button');
            expect(button.disabled).toBeFalsy();
        });
        test('button should be disabled if no queries are selected', () => {
            useSelector.mockImplementation((callback) => {
                return callback({
                    ...mockState,
                    queries: { ...mockState.queries, selected: [] }
                });
            });
            c.rerender(<QueryBulk />);
            const button = c.getByRole('button');
            expect(button.disabled).toBeTruthy();
        });
        test('BulkLabelPicker', () => {
            const blp = c.getByTestId('bulk-label-picker');
            expect(blp).toBeTruthy();
        });
    });
    describe('interaction', () => {
        test('clicking the button dispatches', () => {
            const button = c.getByRole('button');
            fireEvent.click(button);
            expect(mockDispatch).toBeCalled();
        });
    });
});
