import React from 'react';
import { render } from '@testing-library/react';

import UserIcon from './UserIcon';

test('loads and displays user icon', () => {
    const { getByRole } = render(<UserIcon />);
    const userIcon = getByRole('figure');
    expect(userIcon).toBeTruthy();
});
