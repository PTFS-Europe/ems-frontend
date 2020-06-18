import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import Labels from './Labels';

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

jest.mock('./Label/Label', () => {
    return {
        __esModule: true,
        default: (props) => <li>{props.label.position}</li>
    };
});

let m;

const mockLabelsLoading = {
    labels: {
        loading: true,
        labelList: [],
        error: '',
        filter: null
    }
};

const mockLabelsLoaded = {
    labels: {
        loading: false,
        labelList: [
            { id: 3, position: 2 },
            { id: 1, position: 0 },
            { id: 2, position: 1 }
        ],
        error: '',
        filter: null
    }
};

describe('Labels display', () => {
    describe('loading', () => {
        beforeEach(() => {
            useSelector.mockImplementation((callback) => {
                return callback(mockLabelsLoading);
            });
            m = render(<Labels />);
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
                return callback(mockLabelsLoaded);
            });
            m = render(<Labels />);
        });
        test('displays heading', () => {
            const element = m.getByRole('heading');
            expect(element).toBeTruthy();
        });
        test('displays labels list', () => {
            const element = m.getByRole('list');
            expect(element).toBeTruthy();
        });
        test('sorts labels by ascending position', () => {
            const element = m.getAllByRole('listitem');
            expect(element.length).toEqual(3);
            expect(element[0].textContent).toEqual('0');
            expect(element[1].textContent).toEqual('1');
            expect(element[2].textContent).toEqual('2');
        });
    });
});
