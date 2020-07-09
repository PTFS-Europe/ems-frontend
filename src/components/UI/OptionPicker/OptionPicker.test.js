import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import OptionPicker from './OptionPicker';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" />;
    }
}));

const onChoose = jest.fn();

const mockOptions = [
    { id: 4, label: 'A New Hope', colour: '#ff0' },
    { id: 5, label: 'The Empire Strikes Back', colour: '#00f' },
    { id: 6, label: 'Return of the Jedi', colour: '#0f0' }
];

const mockButton = {
    label: 'Do or do not',
    icon: 'yoda'
};

let c;

describe('initialisation', () => {
    beforeEach(() => {
        c = render(
            <OptionPicker
                button={mockButton}
                promptText={'There is no try'}
                selected={[1, 2]}
                options={mockOptions}
                shouldClose={false}
                onChoose={onChoose}
            />
        );
    });
    test('displays the open button', () => {
        const openButton = c.getByRole('button');
        expect(openButton).toBeTruthy();
    });
    test('does not display the popover', () => {
        const popover = c.queryByRole('dialog');
        expect(popover).not.toBeTruthy();
    });
    test('if no options are selected, displays the prompt text', () => {
        c.rerender(
            <OptionPicker
                button={mockButton}
                promptText={'There is no try'}
                selected={[]}
                options={mockOptions}
                shouldClose={false}
                onChoose={onChoose}
            />
        );
        const text = c.getByText('There is no try');
        expect(text).toBeTruthy();
    });
});

describe('interaction', () => {
    beforeEach(() => {
        c = render(
            <OptionPicker
                button={mockButton}
                promptText={'There is no try'}
                selected={[4, 5]}
                options={mockOptions}
                shouldClose={false}
                onChoose={onChoose}
            />
        );
    });
    test('clicking the open button opens the popover', () => {
        const openButton = c.getByRole('button');
        fireEvent.click(openButton);
        const popover = c.getByRole('dialog');
        expect(popover).toBeTruthy();
    });
    test('clicking outside the popover closes it', () => {
        fireEvent.click(window);
        const popover = c.queryByRole('dialog');
        expect(popover).not.toBeTruthy();
    });
    test('popover displays all options', () => {
        const openButton = c.getByRole('button');
        fireEvent.click(openButton);
        const buttons = c.getAllByRole('button');
        // All options plus the activation button
        expect(buttons).toHaveLength(4);
    });
    test('selected options have the correct class', () => {
        const openButton = c.getByRole('button');
        fireEvent.click(openButton);
        const buttons = c.getAllByRole('button');
        expect(buttons[1]).toHaveClass('selected');
        expect(buttons[2]).toHaveClass('selected');
        expect(buttons[3]).not.toHaveClass('selected');
    });
    test('clicking an option calls the passed callback', () => {
        const openButton = c.getByRole('button');
        fireEvent.click(openButton);
        const buttons = c.getAllByRole('button');
        fireEvent.click(buttons[1]);
        expect(onChoose).toHaveBeenCalledWith(4);
        fireEvent.click(buttons[3]);
        expect(onChoose).toHaveBeenCalledWith(6);
    });
});
