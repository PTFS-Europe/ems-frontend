import React from 'react';
import { render } from '@testing-library/react';

import QuerySearch from './QuerySearch';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" />;
    }
}));

describe('QuerySearch', () => {
    let q;
    beforeEach(() => {
        q = render(<QuerySearch />);
    });
    test('loads and displays query search component', () => {
        const header = q.getByRole('search');
        expect(header).toBeTruthy();
    });

    test('displays search icon', () => {
        const search_icon = q.getByTestId('query-search-icon');
        expect(search_icon).toBeTruthy();
    });

    test('displays search text box', () => {
        const search_box = q.getByRole('textbox');
        expect(search_box).toBeTruthy();
    });
});
