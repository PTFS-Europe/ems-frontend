import React from 'react';
import { render } from '@testing-library/react';

import Message from './Message';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: jest.fn().mockImplementation(() => () => {})
}));

let m;

const mockMessage = {
    id: 1,
    query_id: 1,
    creator_id: 2,
    content: 'Testing 1,2,3',
    created_at: '2020-05-04 11:59:02.614159+01',
    updated_at: '2020-05-04 11:59:02.614159+01',
    filename: null
};

describe('Message display', () => {
    beforeEach(() => {
        m = render(<Message message={mockMessage} />);
    });
    test('displays message container', () => {
        const container = m.getByRole('listitem');
        expect(container).toBeTruthy();
    });
});
