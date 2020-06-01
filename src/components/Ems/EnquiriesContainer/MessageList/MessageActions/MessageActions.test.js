import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import MessageActions from './MessageActions';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" alt={props.alt} />;
    }
}));

let m;

const deleteMess = jest.fn();
const editMess = jest.fn();

const mockProps = {
    delete: {
        alt: 'Delete Alt',
        callback: deleteMess
    },
    edit: {
        alt: 'Edit Alt',
        callback: editMess
    }
};

describe('MessageActions display', () => {
    beforeEach(() => {
        m = render(<MessageActions actions={mockProps} />);
    });
    test('displays MessageActions container', () => {
        const container = m.getByRole('group');
        expect(container).toBeTruthy();
    });
    test('displays 3 buttons', () => {
        const buttons = m.getAllByRole('button');
        expect(buttons).toHaveLength(3);
    });
    test('clicking the edit button calls its callback', () => {
        const buttons = m.getAllByRole('button');
        fireEvent.click(buttons[2], new MouseEvent('click'));
        expect(editMess).toBeCalled();
    });
    test('clicking the delete button calls its callback', () => {
        const buttons = m.getAllByRole('button');
        fireEvent.click(buttons[1], new MouseEvent('click'));
        expect(deleteMess).toBeCalled();
    });
});
