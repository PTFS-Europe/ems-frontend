import React from 'react';
import { render } from '@testing-library/react';

import Message from './Message';

let m;

const mockMessage = {};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

const mockActiveUser = {
    id: 1,
    name: 'Joe Bloggs'
};

const mockUserYou = {
    id: 1,
    name: 'Joe Bloggs'
};

const mockUserOther = {
    id: 2,
    name: 'Jane Bloggs'
};

describe('Message display', () => {
    beforeEach(() => {
        m = render(
            <Message
                message={mockMessage}
                user={mockUserOther}
                activeUser={mockActiveUser}
            />
        );
    });
    test('displays message container', () => {
        const container = m.getByRole('listitem');
        expect(container).toBeTruthy();
    });
    test('displays user avatar', () => {
        const icon = m.getByRole('figure');
        expect(icon).toBeTruthy();
    });
    test('displays user name', () => {
        const name = m.getByRole('heading');
        expect(name).toBeTruthy();
    });
    test('displays message content', () => {
        const content = m.getByTestId('message-content');
        expect(content).toBeTruthy();
    });
    test('displays message timestamp', () => {
        const timestamp = m.getByTestId('message-timestamp');
        expect(timestamp).toBeTruthy();
    });
});

describe('Name display', () => {
    test('displays name of user if sender is not active user', () => {
        const mOther = render(
            <Message
                message={mockMessage}
                user={mockUserOther}
                activeUser={mockActiveUser}
            />
        );
        const name = mOther.getByText(mockUserOther.name);
        expect(name).toBeTruthy();
    });
    test('displays "You" if sender is active user', () => {
        const mOther = render(
            <Message
                message={mockMessage}
                user={mockUserYou}
                activeUser={mockActiveUser}
            />
        );
        const name = mOther.getByText('You');
        expect(name).toBeTruthy();
    });
});
