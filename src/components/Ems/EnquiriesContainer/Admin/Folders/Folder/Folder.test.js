import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Folder from './Folder';

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

const mockFolder = {
    id: 1,
    name: 'Inbox',
    code: 'INBOX',
    position: 0,
    count: 10,
    created_at: '2020-05-04 11:59:02.614159+01',
    updated_at: '2020-05-04 11:59:02.614159+01'
};

const mockStateFolders = {
    folderList: [],
    loading: false,
    error: '',
    filter: null
};

describe('Folder display', () => {
    describe('No active filter', () => {
        beforeEach(() => {
            m = render(
                <Folder folder={mockFolder} stateFolders={mockStateFolders} />
            );
        });
        test('displays folder', () => {
            const container = m.getByRole('listitem');
            expect(container).toBeTruthy();
        });
        test('displays folder icon', () => {
            const content = m.getByTestId('folderIcon');
            expect(content).toBeTruthy();
        });
        test('displays folder name button with correct text', () => {
            const content = m.getByText('folderName_INBOX');
            expect(content).toBeTruthy();
        });
        test('displays folder count', () => {
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
            const withActive = { ...mockStateFolders, filter: 'INBOX' };
            m = render(
                <Folder folder={mockFolder} stateFolders={withActive} />
            );
        });
        test('the folder matching the filter should have a selected class', () => {
            const container = m.getByRole('listitem');
            expect(container.classList.contains('selected')).toBe(true);
        });
    });
    describe('Non-matching active filter', () => {
        beforeEach(() => {
            const withActive = { ...mockStateFolders, filter: 'OUTBOX' };
            m = render(
                <Folder folder={mockFolder} stateFolders={withActive} />
            );
        });
        test('the folder not matching the filter should not have a selected class', () => {
            const container = m.getByRole('listitem');
            expect(container.classList.contains('selected')).toBe(false);
        });
    });
});
