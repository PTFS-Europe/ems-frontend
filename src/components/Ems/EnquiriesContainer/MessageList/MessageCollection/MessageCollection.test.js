import React from 'react';
import { render } from '@testing-library/react';

import MessageCollection from './MessageCollection';

jest.mock('../Message/Message', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="mock-message">Message</div>
    };
});

let mc;

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

const mockMessageCollection = {
    sender: 2, // Jane is the sender
    timestamp: '2020-05-04 11:59:02.614159+01',
    messages: [
        {
            id: 1,
            query_id: 1,
            creator_id: 2,
            content: 'Testing 1,2,3',
            created_at: '2020-05-04 11:59:02.614159+01',
            updated_at: '2020-05-04 11:59:02.614159+01',
            filename: null
        },
        {
            id: 2,
            query_id: 1,
            creator_id: 2,
            content: 'Testing 4,5,6',
            created_at: '2020-05-04 11:59:04.614159+01',
            updated_at: '2020-05-04 11:59:04.614159+01',
            filename: null
        }
    ]
};

const mockUserList = [
    {
        id: 1,
        name: 'Joe Bloggs'
    },
    {
        id: 2,
        name: 'Jane Bloggs'
    }
];

const mockActiveUserJoe = mockUserList[0];
const mockActiveUserJane = mockUserList[1];

describe('MessageCollection display', () => {
    beforeEach(() => {
        mc = render(
            <MessageCollection
                collection={mockMessageCollection}
                usersList={mockUserList}
                initiator={1}
                activeUser={mockActiveUserJoe}
            />
        );
    });
    test('displays MessageCollection', () => {
        const container = mc.getByRole('group');
        expect(container).toBeTruthy();
    });
    test('displays sender avatar', () => {
        const avatar = mc.getByRole('figure');
        expect(avatar).toBeTruthy();
    });
    test('displays user name', () => {
        const name = mc.getByRole('heading');
        expect(name).toBeTruthy();
    });
    test('displays timestamp', () => {
        const timestamp = mc.getByTestId('message-timestamp');
        expect(timestamp).toBeTruthy();
    });
});

describe('Name display', () => {
    test('displays name of user if sender is not active user', () => {
        const mOther = render(
            <MessageCollection
                collection={mockMessageCollection}
                usersList={mockUserList}
                initiator={1}
                activeUser={mockActiveUserJoe}
            />
        );
        const name = mOther.getByText(mockActiveUserJane.name);
        expect(name).toBeTruthy();
    });
    test('displays "You" if sender is active user', () => {
        const mYou = render(
            <MessageCollection
                collection={mockMessageCollection}
                usersList={mockUserList}
                initiator={1}
                activeUser={mockActiveUserJane}
            />
        );
        const name = mYou.getByText('You');
        expect(name).toBeTruthy();
    });
});

describe('Message display', () => {
    test('displays passed messages', () => {
        const m = render(
            <MessageCollection
                collection={mockMessageCollection}
                usersList={mockUserList}
                initiator={1}
                activeUser={mockActiveUserJoe}
            />
        );
        const messages = m.getAllByTestId('mock-message');
        expect(messages).toHaveLength(2);
    });
});
