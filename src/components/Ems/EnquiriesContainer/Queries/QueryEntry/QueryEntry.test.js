import React from 'react';
import { render } from '@testing-library/react';

import QueryEntry from './QueryEntry';

let qe;

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" />;
    }
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

describe('QueryEntry: loading', () => {
    beforeEach(() => {
        qe = render(<QueryEntry />);
    });
    test('displays the entry box', () => {
        const textarea = qe.getByRole('textbox');
        expect(textarea).toBeTruthy();
    });
    test('displays the two buttons', () => {
        const buttons = qe.getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });
});
