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

// Mock the props we're passing to QueryEntry
let mockMessage = {
    content: ''
};

const updateMessage = jest.fn();

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

const getComponent = (msgArg, loading) => {
    const history = createMemoryHistory();
    useSelector.mockImplementation((callback) => {
        return callback(loading ? mockStateLoading : mockStateLoaded);
    });
    return render(
        <Router history={history}>
            <QueryEntry
                updateMessage={updateMessage}
                message={msgArg}
                match={mockMatch}
            />
        </Router>
    );
};

describe('QueryEntry: loading', () => {
    test('displays the entry box', () => {
        const qe = getComponent(mockMessage, true);
        const textarea = qe.getByRole('textbox');
        expect(textarea).toBeTruthy();
    });
    test('displays the two buttons', () => {
        const qe = getComponent(mockMessage, true);
        const buttons = qe.getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });
    test('entry box is initialised empty', () => {
        const qe = getComponent(mockMessage, true);
        const textarea = qe.getByRole('textbox');
        expect(textarea.value).toBe('');
    });
    test('disables the "Send" & "Attachment" buttons if the loading state is true', () => {
        const qe = getComponent(mockMessage, true);
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).toBeDisabled();
    });
});
describe('QueryEntry: new message - loaded', () => {
    test('entering text in the entry box calls updateMessage', async () => {
        const qe = getComponent(mockMessage);
        const textarea = qe.getByRole('textbox');
        fireEvent.input(textarea, { target: { value: 'Hello' } });
        expect(updateMessage).toBeCalled();
    });
    test('disables the "Send" button if the entry box is empty', () => {
        const qe = getComponent(mockMessage);
        const buttons = qe.getAllByRole('button');
        expect(buttons[1]).toBeDisabled();
    });
    test('enables the "Attachment" button if the entry box is empty', () => {
        const qe = getComponent(mockMessage);
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeEnabled();
    });
    test('entering text in the entry box disables the "Attachment" button', () => {
        const qe = getComponent({ content: 'Hello' });
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
    });
});

describe('QueryEntry: edit message - loaded', () => {
    test('adds the edit class to the entry box when in edit mode', () => {
        const qe = getComponent({ ...mockMessage, id: 1 });
        const textarea = qe.getByRole('textbox');
        expect(textarea.classList.contains('edit')).toBe(true);
    });
});
