import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';

import QueryLabels from './QueryLabels';

const mockDispatch = jest.fn().mockImplementation(() => {});

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
        qe = render(<QueryLabels labels={[1, 3]} />);
    });
    describe('initialisation', () => {
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
    describe('label stacking', () => {
        test('two labels are not stacked', () => {
            const buttons = qe.getAllByRole('listitem');
            expect(buttons[0]).toHaveClass('noStack');
        });
        test('three labels are stacked', () => {
            qe.rerender(<QueryLabels labels={[1, 2, 3]} />);
            const buttons = qe.getAllByRole('listitem');
            expect(buttons[0]).toHaveClass('stack');
        });
        test('stacked labels have the last label highlighted by default', () => {
            qe.rerender(<QueryLabels labels={[1, 2, 3]} />);
            const buttons = qe.getAllByRole('listitem');
            expect(buttons[2]).toHaveClass('highlighted');
        });
    });
    describe('interactivity', () => {
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
