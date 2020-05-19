import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import ActiveUser from './ActiveUser';

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
    activeUser: {
        userDetails: {
            id: 1,
            role_id: 14,
            name: 'Joe Customer'
        },
        loading: false,
        error: ''
    }
};

describe('ActiveUser', () => {
    let q;
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        q = render(<ActiveUser />);
    });
    afterEach(() => {
        useSelector.mockClear();
    });
    test('loads and displays active user component', () => {
        const header = q.getByRole('complementary');
        expect(header).toBeTruthy();
    });

    test('displays user icon', () => {
        const icon = q.getByRole('figure');
        expect(icon).toBeTruthy();
    });

    test('displays user name', () => {
        const heading = q.getByRole('heading');
        expect(heading).toBeTruthy();
    });
});
