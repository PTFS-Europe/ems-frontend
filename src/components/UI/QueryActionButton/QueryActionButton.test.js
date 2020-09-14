import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';

import QueryActionButton from './QueryActionButton';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => {
        return <i className="fa" />;
    }
}));

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

// Mock the query we're passing to QueryActionButton
let mockQuery = {
    id: 1,
    title: 'An elegant weapon, for a more civilized age',
    initiator: 1,
    folder: null
};

const mockStateFolders = {
    folders: {
        folderList: [
            {
                id: 1,
                name: 'Complete',
                code: 'COMPLETE',
                count: 0,
                position: 0
            },
            {
                id: 2,
                name: 'Escalated',
                code: 'ESCALATED',
                count: 0,
                position: 1
            },
            {
                id: 3,
                name: 'Bin',
                code: 'BIN',
                count: 0,
                position: 2
            }
        ],
        loading: false,
        error: ''
    }
};

let qe;

describe('QueryActionButton', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateFolders);
        });
        qe = render(<QueryActionButton query={mockQuery} />);
    });
    describe('initialisation', () => {
        test('displays the component', async () => {
            const comp = qe.getByRole('group');
            expect(comp).toBeTruthy();
        });
        test('markup contains the initial button, plus one for each folder', async () => {
            const buttons = qe.getAllByRole('button');
            expect(buttons).toHaveLength(4);
        });
    });
    describe('query folder is indicated correctly and correct actions are offered', () => {
        test('the first button reflects the initial query folder when folder is null', () => {
            const buttons = qe.getAllByRole('button');
            // Query currently has no folder, so it should have a specific class
            expect(buttons[0]).toHaveClass('folder_NONE');
        });
        // Change the query folder, the first button should also change
        test('the first button reflects a set query folder', () => {
            mockQuery = {
                ...mockQuery,
                folder: 'ESCALATED'
            };
            // Re-render the component with the new props
            qe.rerender(<QueryActionButton query={mockQuery} />);
            const buttons = qe.getAllByRole('button');
            expect(buttons[0]).toHaveClass('folder_ESCALATED');
        });
        // Change the query folder, the second button should be the reset button
        test('the second button is the reset button', () => {
            mockQuery = {
                ...mockQuery,
                folder: 'ESCALATED'
            };
            // Re-render the component with the new props
            qe.rerender(<QueryActionButton query={mockQuery} />);
            const buttons = qe.getAllByRole('button');
            expect(buttons[1]).toHaveClass('remove');
        });
        test('the remaining folder buttons are available', () => {
            const buttons = qe.getAllByRole('button');
            expect(buttons[2]).toHaveClass('COMPLETE');
            expect(buttons[3]).toHaveClass('BIN');
        });
    });
    describe('button interactivity', () => {
        test('clicking a folder button dispatches', () => {
            // Click the BIN button
            const buttons = qe.getAllByRole('button');
            fireEvent.click(buttons[3]);
            expect(mockDispatch).toBeCalled();
        });
    });
});
