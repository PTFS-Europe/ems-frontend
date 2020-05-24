import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useSelector } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';

import QueryEntry from './QueryEntry';

let qe;

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
    useDispatch: () => jest.fn()
}));

const mockMatch = {
    params: {
        queryId: 1
    }
};

const mockStateLoading = {
    messages: {
        messageList: [],
        loading: true,
        error: ''
    }
};

const mockStateLoaded = {
    messages: {
        messageList: [],
        loading: false,
        error: ''
    }
};

describe('QueryEntry: loading', () => {
    test('displays the entry box', () => {
        const history = createMemoryHistory();
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoading);
        });
        qe = render(
            <Router history={history}>
                <QueryEntry match={mockMatch} />
            </Router>
        );
        const textarea = qe.getByRole('textbox');
        expect(textarea).toBeTruthy();
    });
    test('displays the two buttons', () => {
        const history = createMemoryHistory();
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoading);
        });
        qe = render(
            <Router history={history}>
                <QueryEntry match={mockMatch} />
            </Router>
        );
        const buttons = qe.getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });
    test('entry box is initialised empty', () => {
        const history = createMemoryHistory();
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoading);
        });
        qe = render(
            <Router history={history}>
                <QueryEntry match={mockMatch} />
            </Router>
        );
        const textarea = qe.getByRole('textbox');
        expect(textarea.value).toBe('');
    });
    test('disables the "Send" & "Attachment" buttons if the loading state is true', () => {
        const history = createMemoryHistory();
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoading);
        });
        qe = render(
            <Router history={history}>
                <QueryEntry match={mockMatch} />
            </Router>
        );
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).toBeDisabled();
    });
});
describe('QueryEntry: loaded', () => {
    beforeEach(() => {
        const history = createMemoryHistory();
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLoaded);
        });
        qe = render(
            <Router history={history}>
                <QueryEntry match={mockMatch} />
            </Router>
        );
    });
    test('disables the "Send" button if the entry box is empty', () => {
        const buttons = qe.getAllByRole('button');
        expect(buttons[1]).toBeDisabled();
    });
    test('enables the "Send" button if the entry box is not empty', () => {
        const textarea = qe.getByRole('textbox');
        fireEvent.input(textarea, { target: { value: 'Hello' } });
        const buttons = qe.getAllByRole('button');
        expect(buttons[1]).toBeEnabled();
    });
    test('disables the "Attachment" button if the entry box is not empty', () => {
        const textarea = qe.getByRole('textbox');
        fireEvent.input(textarea, { target: { value: 'Hello' } });
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
    });
    test('enables the "Attachment" button if the entry box is empty', () => {
        const textarea = qe.getByRole('textbox');
        fireEvent.input(textarea, { target: { value: '' } });
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeEnabled();
    });
});
