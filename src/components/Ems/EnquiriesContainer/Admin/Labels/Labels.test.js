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

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" alt={props.alt} />;
    }
}));

jest.mock('./Label/Label', () => {
    return {
        __esModule: true,
        default: (props) => <li>{props.label.id}</li>
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
            { id: 3, name: 'a' },
            { id: 1, name: 'c' },
            { id: 2, name: 'b' }
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
        test('sorts labels by ascending name', () => {
            const element = m.getAllByRole('listitem');
            expect(element.length).toEqual(3);
            expect(element[0].textContent).toEqual('3');
            expect(element[1].textContent).toEqual('2');
            expect(element[2].textContent).toEqual('1');
        });
    });
});
