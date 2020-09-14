import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';

import QuerySearch from './QuerySearch';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => {
        return <i className="fa" />;
    }
}));

const mockDispatch = jest.fn().mockImplementation(() => {});

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: () => mockDispatch
}));

const mockState = {
    queries: {
        queryList: [],
        loading: false,
        error: '',
        search: ''
    }
};

describe('QuerySearch', () => {
    let q;
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
    });
    describe('showAdd is true', () => {
        beforeEach(() => {
            q = render(<QuerySearch showAdd={true} />);
        });
        test('loads and displays query search component', () => {
            const header = q.getByRole('search');
            expect(header).toBeTruthy();
        });
        test('displays search icon', () => {
            const search_icon = q.getByTestId('query-search-icon');
            expect(search_icon).toBeTruthy();
        });
        test('displays start new query button when showAdd is true', () => {
            const new_query_button = q.getByRole('button');
            expect(new_query_button).toBeInTheDocument();
        });
        test('displays search text box', () => {
            const search_box = q.getByRole('textbox');
            expect(search_box).toBeTruthy();
        });
        test('entering search text dispatches setQuerySearch when appropriate', () => {
            const textbox = q.getByRole('textbox');
            fireEvent.input(textbox, { target: { value: 'My search' } });
            expect(mockDispatch).toBeCalledWith({
                type: 'SET_QUERY_SEARCH',
                payload: 'My search'
            });
        });
    });

    describe('showAdd is falsy', () => {
        beforeEach(() => {
            q = render(<QuerySearch showAdd={false} />);
        });
        test('does not display start new query button when showAdd is falsy', () => {
            const new_query_button = q.queryByRole('button');
            expect(new_query_button).not.toBeInTheDocument();
        });
    });
});
