import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import Folders from './Folders';

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

jest.mock('./Folder/Folder', () => {
    return {
        __esModule: true,
        default: (props) => <li>{props.folder.position}</li>
    };
});

jest.mock('./CalculatedFolders/CalculatedFolders', () => {
    return {
        __esModule: true,
        default: () => <li>Calculated</li>
    };
});

let m;

const mockFoldersLoading = {
    folders: {
        loading: true,
        folderList: [],
        error: '',
        filter: null
    }
};

const mockFoldersLoaded = {
    folders: {
        loading: false,
        folderList: [
            { id: 3, position: 2 },
            { id: 1, position: 0 },
            { id: 2, position: 1 }
        ],
        error: '',
        filter: null
    }
};

describe('Folders display', () => {
    describe('loading', () => {
        beforeEach(() => {
            useSelector.mockImplementation((callback) => {
                return callback(mockFoldersLoading);
            });
            m = render(<Folders />);
        });
        test('displays heading', () => {
            const element = m.getByRole('heading');
            expect(element).toBeTruthy();
        });
        test('displays loading spinner', () => {
            const element = m.getByRole('alert');
            expect(element).toBeTruthy();
        });
    });
    describe('loaded', () => {
        beforeEach(() => {
            useSelector.mockImplementation((callback) => {
                return callback(mockFoldersLoaded);
            });
            m = render(<Folders />);
        });
        test('displays heading', () => {
            const element = m.getByRole('heading');
            expect(element).toBeTruthy();
        });
        test('displays both folders list', () => {
            const element = m.getAllByRole('list');
            expect(element).toHaveLength(2);
        });
        test('displays calculated and regular folders', () => {
            const lists = m.getAllByRole('list');
            expect(lists).toHaveLength(2);
        });
        test('sorts folders by ascending position', () => {
            const element = m.getAllByRole('listitem');
            // Length is 4 here because our mocked <CalculatedFolders>
            // component returns a single list item
            expect(element.length).toEqual(4);
            // We start at index 1 here because we want to ignore our
            // mocked <CalculatedFolders> component
            expect(element[1].textContent).toEqual('0');
            expect(element[2].textContent).toEqual('1');
            expect(element[3].textContent).toEqual('2');
        });
    });
});
