import React from 'react';
import { useSelector } from 'react-redux';
import { fireEvent } from '@testing-library/react';
import { renderWithRouterMatch } from '../../../../../util/testHelpers';

import QueryEntry from './QueryEntry';

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

// A populated message mock
let mockMessagePopulated = {
    content: 'Hello'
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
    useSelector.mockImplementation((callback) => {
        return callback(loading ? mockStateLoading : mockStateLoaded);
    });
    const comp = () => (
        <QueryEntry
            updateMessage={updateMessage}
            message={msgArg}
            match={mockMatch}
        />
    );
    return renderWithRouterMatch(comp, {
        path: '/query/:queryId',
        route: '/query/1'
    });
};

describe('QueryEntry: loading', () => {
    test('displays the entry box', () => {
        const qe = getComponent(mockMessage, true);
        const textarea = qe.getByRole('textbox');
        expect(textarea).toBeTruthy();
    });
    test('displays the send button', () => {
        const qe = getComponent(mockMessage, true);
        const buttons = qe.getAllByRole('button');
        expect(buttons).toHaveLength(1);
    });
    test('displays the attachment input', () => {
        const qe = getComponent(mockMessage, true);
        const buttons = qe.getByTestId('fileattach');
        expect(buttons).toBeTruthy();
    });
    test('entry box is initialised empty', () => {
        const qe = getComponent(mockMessage, true);
        const textarea = qe.getByRole('textbox');
        expect(textarea.value).toBe('');
    });
    test('disables the "Send" button if the loading state is true', () => {
        const qe = getComponent(mockMessage, true);
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
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
        expect(buttons[0]).toBeDisabled();
    });
    test('enables the "Send" button if the entry box is not empty', () => {
        const qe = getComponent(mockMessagePopulated);
        const buttons = qe.getAllByRole('button');
        expect(buttons[0]).toBeEnabled();
    });
    test('enables the "Attachment" button if the entry box is empty', () => {
        const qe = getComponent(mockMessage);
        const label = qe.getByTestId('fileattachlabel');
        expect(label.classList.contains('fileLabelDisabled')).toBe(false);
    });
    test('diables the "Attachment" button if the entry box is not empty', () => {
        const qe = getComponent(mockMessagePopulated);
        const label = qe.getByTestId('fileattachlabel');
        expect(label.classList.contains('fileLabelDisabled')).toBe(true);
    });
});

describe('QueryEntry: edit message - loaded', () => {
    test('adds the edit class to the entry box when in edit mode', () => {
        const qe = getComponent({ ...mockMessage, id: 1 });
        const textarea = qe.getByRole('textbox');
        expect(textarea.classList.contains('edit')).toBe(true);
    });
});
