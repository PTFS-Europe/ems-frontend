import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';

import QueryLabels from './QueryLabels';

const mockDispatch = jest.fn().mockImplementation(() => {});

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" alt={props.alt} />;
    }
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: () => mockDispatch
}));

// Mock the query we're passing to QueryActionButton
const mockStateLabels = {
    labels: {
        labelList: [
            {
                id: 1,
                name: 'IG-88',
                colour: '#f00'
            },
            {
                id: 2,
                name: 'Bossk',
                colour: '#0f0'
            },
            {
                id: 3,
                name: 'Boba Fett',
                colour: '#00f'
            },
            {
                id: 4,
                name: 'Zuckuss',
                colour: '#000'
            }
        ],
        filter: null
    }
};

let qe;

describe('QueryLabels', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLabels);
        });
    });
    describe('initialisation', () => {
        beforeEach(() => {
            qe = render(<QueryLabels query={{ labels: [1, 2] }} />);
        });
        test('displays the component', () => {
            const comp = qe.getByRole('list');
            expect(comp).toBeTruthy();
        });
        test('contains the correct number of labels', () => {
            const buttons = qe.getAllByRole('listitem');
            expect(buttons).toHaveLength(2);
        });
        test('displays correct colour indicator', () => {
            const indicators = qe.getAllByTestId('labelindicator');
            expect(indicators[0]).toHaveStyle('background: #f00');
        });
    });
    describe('label stacking - 2 labels', () => {
        beforeEach(() => {
            qe = render(<QueryLabels query={{ labels: [1, 2] }} />);
        });
        test('two labels are not stacked', () => {
            qe = render(<QueryLabels query={{ labels: [1, 2] }} />);
            const buttons = qe.getAllByRole('listitem');
            expect(buttons[0]).toHaveClass('noStack');
        });
    });
    describe('label stacking - 3 labels', () => {
        beforeEach(() => {
            qe = render(<QueryLabels query={{ labels: [1, 2, 3] }} />);
        });
        test('three labels are stacked', () => {
            const buttons = qe.getAllByRole('listitem');
            expect(buttons[0]).toHaveClass('stack');
        });
        test('stacked labels have the last label highlighted by default', () => {
            const buttons = qe.getAllByRole('listitem');
            expect(buttons[2]).toHaveClass('highlighted');
        });
    });
    describe('interactivity', () => {
        beforeEach(() => {
            qe = render(<QueryLabels query={{ labels: [1, 2, 3] }} />);
        });
        test('clicking a label dispatches SET_LABELS_FILTER action', () => {
            const buttons = qe.getAllByRole('listitem');
            fireEvent.click(buttons[0]);
            expect(mockDispatch).toBeCalledWith({
                type: 'SET_LABELS_FILTER',
                payload: 1
            });
        });
    });
});
