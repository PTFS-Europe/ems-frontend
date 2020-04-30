import React from 'react';
import { render } from '@testing-library/react';

import QueryHeader from './QueryHeader';

describe('QueryHeader', () => {
    let q;
    beforeEach(() => {
        q = render(<QueryHeader />);
    });
    test('loads and displays header', () => {
        const header = q.getByRole('banner');
        expect(header).toBeTruthy();
    });

    test('displays user icon', () => {
        const icon = q.getByRole('figure');
        expect(icon).toBeTruthy();
    });

    test('displays query heading', () => {
        const heading = q.getByRole('heading');
        expect(heading).toBeTruthy();
    });
});
