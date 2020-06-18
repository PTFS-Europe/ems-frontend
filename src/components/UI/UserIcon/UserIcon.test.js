import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import UserIcon from './UserIcon';

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn()
}));

jest.mock('react-avatar', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="avatar">Avatar</div>,
        ConfigProvider: (wrapped) => wrapped.children
    };
});

const mockState = {
    users: {
        usersList: [
            {
                id: 1,
                name: 'Fred'
            }
        ],
        loading: false,
        error: ''
    }
};

describe('UserIcon', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('loads and displays user icon', () => {
        const { getByTestId } = render(<UserIcon userId={1} />);
        const userIcon = getByTestId('avatar');
        expect(userIcon).toBeTruthy();
    });
});
