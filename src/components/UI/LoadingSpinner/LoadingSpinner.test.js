import React from 'react';
import { render } from '@testing-library/react';

import LoadingSpinner from './LoadingSpinner';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

test('loads and displays spinner', () => {
    const { getByRole } = render(<LoadingSpinner />);
    const spinner = getByRole('alert');
    expect(spinner).toBeTruthy();
});
