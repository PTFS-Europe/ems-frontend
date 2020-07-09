import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import LabelPicker from './LabelPicker';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" />;
    }
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: jest.fn().mockImplementation(() => () => {})
}));

const mockStateLabels = {
    labels: {
        labelList: [
            { id: 1, name: 'Dagobah', colour: '#0f0' },
            { id: 2, name: 'Hoth', colour: '#00f' },
            { id: 3, name: 'Tatooine', colour: '#ff0' }
        ]
    }
};

const mockQuery = {
    id: 1,
    labels: [1, 2]
};

let c;

describe('initialisation', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateLabels);
        });
        c = render(<LabelPicker query={mockQuery} />);
    });
    test('renders the component, which initially consists of a single button', () => {
        const button = c.getByRole('button');
        expect(button).toBeTruthy();
    });
});
