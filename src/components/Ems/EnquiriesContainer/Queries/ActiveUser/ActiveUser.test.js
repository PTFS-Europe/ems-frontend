import React from 'react';
import { render } from '@testing-library/react';

import ActiveUser from './ActiveUser';

describe('ActiveUser', () => {
    let q;
    beforeEach(() => {
        q = render(<ActiveUser />);
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
