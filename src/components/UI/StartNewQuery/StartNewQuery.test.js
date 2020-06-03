import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithRouterMatch } from '../../../util/testHelpers';
import StartNewQuery from './StartNewQuery';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

const mockDispatch = jest
    .fn()
    .mockImplementation(() =>
        Promise.resolve({ payload: { data: { id: 1234 } } })
    );

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch
    useDispatch: () => mockDispatch
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" alt={props.alt} />;
    }
}));

describe('Start new query display', () => {
    let c;
    beforeEach(() => {
        c = renderWithRouterMatch(StartNewQuery);
    });
    test('loads and displays button intially', () => {
        const button = c.getByText('Start a new query');
        expect(button).toBeInTheDocument();
    });
    test('clicking the button removes it', () => {
        const button = c.getByText('Start a new query');
        fireEvent.click(button);
        expect(button).not.toBeInTheDocument();
    });
    test('clicking the displays the input and submit button', () => {
        const button = c.getByText('Start a new query');
        fireEvent.click(button);
        const input = c.getByPlaceholderText('Enter a query title');
        expect(input).toBeInTheDocument();
        const submit = c.getByRole('button');
        expect(submit).toBeInTheDocument();
    });
    test('the submit button is initially disabled', () => {
        const button = c.getByText('Start a new query');
        fireEvent.click(button);
        const submit = c.getByRole('button');
        expect(submit).toBeDisabled();
    });
    test('entering text into the input enables the submit button', () => {
        const button = c.getByText('Start a new query');
        fireEvent.click(button);
        const input = c.getByPlaceholderText('Enter a query title');
        fireEvent.change(input, { target: { value: 'My title' } });
        const submit = c.getByRole('button');
        expect(submit).toBeEnabled();
    });
    test('clicking the submit calls dispatch if appropriate', () => {
        const button = c.getByText('Start a new query');
        fireEvent.click(button);
        const submit = c.getByRole('button');
        // dispatch should not be called if the title is empty
        fireEvent.click(submit);
        expect(mockDispatch).not.toBeCalled();
        const input = c.getByPlaceholderText('Enter a query title');
        fireEvent.change(input, { target: { value: 'My title' } });
        fireEvent.click(submit);
        expect(mockDispatch).toBeCalled();
    });
});
