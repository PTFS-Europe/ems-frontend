import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ConfirmAction from './ConfirmAction';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        // eslint-disable-next-line react/prop-types
        return <i className="fa" alt={props.alt} />;
    }
}));

let c;

const onConfirm = jest.fn();
const onCancel = jest.fn();

describe('QueryLabels', () => {
    describe('initialisation', () => {
        c = render(
            <ConfirmAction
                open={false}
                onConfirm={onConfirm}
                onCancel={onCancel}
            >
                <div data-testid="child">Hello there</div>
            </ConfirmAction>
        );
        test('displays the children', () => {
            const child = c.getByTestId('child');
            expect(child).toBeTruthy();
        });
        test('does not display the popover if open === false', () => {
            const dialog = c.queryByRole('dialog');
            expect(dialog).not.toBeTruthy();
        });
        test('displays the popover if open === true', () => {
            c.rerender(
                <ConfirmAction
                    open={true}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                >
                    <div data-testid="child">Hello there</div>
                </ConfirmAction>
            );
            const dialog = c.queryByRole('dialog');
            expect(dialog).toBeTruthy();
        });
    });
    describe('interaction', () => {
        beforeEach(() => {
            c.rerender(
                <ConfirmAction
                    open={true}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                >
                    <div data-testid="child">Hello there</div>
                </ConfirmAction>
            );
        });
        test('clicking the confirm button calls the correct function', () => {
            const buttons = c.getAllByRole('button');
            fireEvent.click(buttons[0]);
            expect(onConfirm).toHaveBeenCalled();
        });
        test('clicking the cancel button calls the correct function', () => {
            const buttons = c.getAllByRole('button');
            fireEvent.click(buttons[1]);
            expect(onCancel).toHaveBeenCalled();
        });
        test('clicking outside the component calls the correct function', () => {
            fireEvent.click(document);
            expect(onCancel).toHaveBeenCalled();
        });
    });
});
