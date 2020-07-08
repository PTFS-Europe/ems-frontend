import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import LabelEdit from './LabelEdit';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

const mockDispatch = jest.fn().mockImplementation(() => {});
const setActiveColourPicker = jest.fn();

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: () => mockDispatch
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" alt={props.alt} />;
    }
}));

let m;

const mockLabel = {
    id: 1,
    name: 'Unread',
    colour: '#f00',
    count: 10,
    created_at: '2020-05-04 11:59:02.614159+01',
    updated_at: '2020-05-04 11:59:02.614159+01'
};

describe('Label display', () => {
    describe('', () => {
        beforeEach(() => {
            m = render(
                <LabelEdit
                    label={mockLabel}
                    activeColourPicker={1}
                    setActiveColourPicker={setActiveColourPicker}
                />
            );
        });
        test('displays label', () => {
            const container = m.getByRole('listitem');
            expect(container).toBeTruthy();
        });
        test('display all buttons', () => {
            const buttons = m.getAllByRole('button');
            expect(buttons).toHaveLength(12);
        });
        test('display colour swatch the correct colour', () => {
            const buttons = m.getAllByRole('button');
            expect(buttons[1]).toHaveStyle('color: rgb(255, 0, 0);');
        });
        test('display the populated query input', () => {
            const input = m.getByRole('textbox');
            expect(input.value).toBe('Unread');
        });
        test('display the query count', () => {
            const count = m.getByText('10');
            expect(count).toBeTruthy();
        });
    });
});
describe('Label interactivity', () => {
    describe('', () => {
        beforeEach(() => {
            m = render(
                <LabelEdit
                    label={mockLabel}
                    activeColourPicker={1}
                    setActiveColourPicker={setActiveColourPicker}
                />
            );
        });
        test('clicking the swatch sets the active colour picker', () => {
            const buttons = m.getAllByRole('button');
            fireEvent.click(buttons[1]);
            expect(setActiveColourPicker).toBeCalled();
        });
    });
});
