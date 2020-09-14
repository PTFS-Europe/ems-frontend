import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import CalculatedFolders from './CalculatedFolders';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn()
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        // eslint-disable-next-line react/prop-types
        return <i className="fa" alt={props.alt} />;
    }
}));

let m;

const mockStateQueries = {
    queries: {
        loading: false,
        error: '',
        search: '',
        queryList: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
};

describe('CalculatedFolders display', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockStateQueries);
        });
        m = render(<CalculatedFolders />);
    });
    test('displays two folders', () => {
        const container = m.getAllByRole('listitem');
        expect(container).toHaveLength(2);
    });
});
