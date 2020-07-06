import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ColourPicker from './ColourPicker';

// Our mock props
const updateColour = jest.fn();
const icon = jest
    .fn()
    .mockImplementation((colour) => (
        <div data-testid={'mockIcon'}>{colour}</div>
    ));

describe('ColourPicker', () => {
    let q;
    beforeEach(() => {
        q = render(
            <ColourPicker
                updateColour={updateColour}
                icon={icon}
            ></ColourPicker>
        );
    });
    test('one button for each colour is rendered', () => {
        const buttons = q.getAllByRole('button');
        expect(buttons).toHaveLength(10);
    });
    test('clicking a button causes the passed callback to be called', () => {
        const buttons = q.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(updateColour).toHaveBeenCalled();
    });
    test('the passed icon function is called with the icons colour', () => {
        const icon = q.getByText('#c65050');
        expect(icon).toBeTruthy();
    });
});
