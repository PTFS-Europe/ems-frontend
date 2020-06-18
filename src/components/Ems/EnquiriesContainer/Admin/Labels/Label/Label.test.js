import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Label from './Label';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

const mockDispatch = jest.fn().mockImplementation(() => {});

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
    position: 0,
    colour: '#f00',
    count: 10,
    created_at: '2020-05-04 11:59:02.614159+01',
    updated_at: '2020-05-04 11:59:02.614159+01'
};

const mockStateLabels = {
    labelList: [],
    loading: false,
    error: '',
    filter: null
};

describe('Label display', () => {
    describe('No active filter', () => {
        beforeEach(() => {
            m = render(
                <Label label={mockLabel} stateLabels={mockStateLabels} />
            );
        });
        test('displays label', () => {
            const container = m.getByRole('listitem');
            expect(container).toBeTruthy();
        });
        test('displays label icon', () => {
            const content = m.getByTestId('labelIcon');
            expect(content).toBeTruthy();
        });
        test('displays label name button with correct text', () => {
            const content = m.getByText('Unread');
            expect(content).toBeTruthy();
        });
        test('displays label count', () => {
            const content = m.getByText('10');
            expect(content).toBeTruthy();
        });
        test('clicking the button causes the dispatch to be called', () => {
            const content = m.getByRole('button');
            fireEvent.click(content);
            expect(mockDispatch).toBeCalled();
        });
    });
    describe('Matching active filter', () => {
        beforeEach(() => {
            const withActive = { ...mockStateLabels, filter: 1 };
            m = render(<Label label={mockLabel} stateLabels={withActive} />);
        });
        test('the label matching the filter should have a selected class', () => {
            const container = m.getByRole('listitem');
            expect(container.classList.contains('selected')).toBe(true);
        });
    });
    describe('Non-matching active filter', () => {
        beforeEach(() => {
            const withActive = { ...mockStateLabels, filter: 2 };
            m = render(<Label label={mockLabel} stateLabels={withActive} />);
        });
        test('the label not matching the filter should not have a selected class', () => {
            const container = m.getByRole('listitem');
            expect(container.classList.contains('selected')).toBe(false);
        });
    });
});
