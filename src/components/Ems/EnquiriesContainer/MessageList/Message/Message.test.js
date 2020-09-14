import React from 'react';
import { render } from '@testing-library/react';

import Message from './Message';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key })
}));

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn(),
    // Mock useDispatch, it just returns a function
    useDispatch: jest.fn().mockImplementation(() => () => {})
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props) => {
        // eslint-disable-next-line react/prop-types
        return <i className="fa" alt={props.alt} />;
    }
}));

let m;

const mockMessage = {
    id: 1,
    query_id: 1,
    creator_id: 2,
    content: 'Testing 1,2,3',
    created_at: '2020-05-04 11:59:02.614159+01',
    updated_at: '2020-05-04 11:59:02.614159+01',
    filename: null,
    originalname: null
};
const mockUploading = {
    id: 2,
    query_id: 1,
    creator_id: 2,
    content: null,
    created_at: '2020-05-04 11:59:02.614159+01',
    updated_at: '2020-05-04 11:59:02.614159+01',
    filename: 'myfile-1234.txt',
    originalname: 'myfile.txt',
    uploading: true
};

const mockAttachment = {
    id: 2,
    query_id: 1,
    creator_id: 2,
    content: null,
    created_at: '2020-05-04 11:59:02.614159+01',
    updated_at: '2020-05-04 11:59:02.614159+01',
    filename: 'myfile-1234.txt',
    originalname: 'myfile.txt'
};

describe('Message display', () => {
    beforeEach(() => {
        m = render(<Message message={mockMessage} />);
    });
    test('displays message container', () => {
        const container = m.getByRole('listitem');
        expect(container).toBeTruthy();
    });
    test('displays message content', () => {
        const content = m.getByText('Testing 1,2,3');
        expect(content).toBeTruthy();
    });
});

describe('Attachment uploading', () => {
    beforeEach(() => {
        m = render(<Message message={mockUploading} />);
    });
    test('displays message container', () => {
        const container = m.getByRole('listitem');
        expect(container).toBeTruthy();
    });
    test('displays loading spinner', () => {
        const alert = m.getByRole('alert');
        expect(alert).toBeTruthy();
    });
});

describe('Attachment display', () => {
    beforeEach(() => {
        m = render(<Message message={mockAttachment} />);
    });
    test('displays attachment container', () => {
        const container = m.getByRole('listitem');
        expect(container).toBeTruthy();
    });
    test('displays download link', () => {
        const link = m.getByRole('link');
        expect(link).toBeTruthy();
    });
});
