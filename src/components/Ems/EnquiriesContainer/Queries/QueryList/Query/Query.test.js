import React from 'react';
import { render } from '@testing-library/react';

import Query from './Query';

jest.mock('../../../../../UI/UserIcon/UserIcon', () => {
    return {
        __esModule: true,
        default: () => <div role="figure">UserIcon</div>
    };
});

let q;

const query = {
    created_at: '2020-04-30 10:08:58.348203+01',
    folder_id: null,
    id: 31,
    title: 'Do you sell curry?',
    updated_at: '2020-04-30 10:08:58.348203+01'
};

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        return <i className="fa" />;
    }
}));

beforeEach(() => {
    q = render(<Query query={query} />);
});

describe('Query', () => {
    test('displays query', () => {
        const query = q.getByRole('listitem');
        expect(query).toBeTruthy();
    });

    test('displays user icon', () => {
        const icon = q.getByRole('figure');
        expect(icon).toBeTruthy();
    });

    test('displays the query title', () => {
        const title = q.getByText('Do you sell curry?');
        expect(title).toBeTruthy();
    });

    test('displays the query timestamp', () => {
        const time = q.getByRole('complementary');
        expect(time).toBeTruthy();
    });

    test('displays the action button', () => {
        const button = q.getByRole('button');
        expect(button).toBeTruthy();
    });
});
