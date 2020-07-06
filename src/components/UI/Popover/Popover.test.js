import React from 'react';
import { render } from '@testing-library/react';

import Popover from './Popover';

describe('Popover', () => {
    let q;
    beforeEach(() => {
        q = render(
            <Popover instanceStyles={'123'}>
                <div data-testid="child">Hello</div>
            </Popover>
        );
    });
    test('component is rendered', () => {
        const popover = q.getByRole('dialog');
        expect(popover).toBeInTheDocument();
    });
    test('component renders children', () => {
        const child = q.getByTestId('child');
        expect(child).toBeInTheDocument();
    });
    test('component renders pointer', () => {
        const pointer = q.getByTestId('pointer');
        expect(pointer).toBeInTheDocument();
    });
    test('component applies passed styles', () => {
        const comp = q.getByRole('dialog');
        expect(comp).toHaveClass('123');
    });
});
