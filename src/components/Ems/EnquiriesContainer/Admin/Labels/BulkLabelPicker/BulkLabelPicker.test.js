import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import BulkLabelPicker from './BulkLabelPicker';

const mockDispatch = jest.fn().mockImplementation(() => {});

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        // eslint-disable-next-line react/prop-types
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

jest.mock('../../../../../UI/OptionPicker/OptionPicker', () => {
    return {
        __esModule: true,
        default: (props) => (
            <div data-testid="option-picker">
                <div data-testid="selected">
                    {/* eslint-disable-next-line react/prop-types */}
                    selected {props.selected.join(',')}
                </div>
            </div>
        )
    };
});

const mockState = {
    labels: {
        labelList: [
            { id: 1, name: 'Tatooine', colour: '#0ff' },
            { id: 2, name: 'Utapau', colour: '#00f' },
            { id: 3, name: 'Kashyyyk', colour: '#ff0' },
            { id: 4, name: 'Mustafar', colour: '#f00' },
            { id: 5, name: 'Naboo', colour: '#f0f' }
        ]
    },
    queries: {
        queryList: [
            {
                id: 1,
                title: 'The Phantom Menace',
                labels: [1, 5]
            },
            {
                id: 2,
                title: 'Attack of the Clones',
                labels: [1, 2, 5]
            },
            {
                id: 3,
                title: 'Revenge of the Sith',
                labels: [1, 3, 4]
            }
        ],
        selected: [1, 2]
    }
};

let c;

describe('initialisation', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        c = render(<BulkLabelPicker />);
    });
    test('renders the component, which just renders the OptionPicker', () => {
        const button = c.getByTestId('option-picker');
        expect(button).toBeTruthy();
    });
});

describe('initialised', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        c = render(<BulkLabelPicker />);
    });
    test('passes the correctly calculated "selected" prop', () => {
        const selected = c.getByText('selected 1,5');
        expect(selected).toBeTruthy();
    });
});
