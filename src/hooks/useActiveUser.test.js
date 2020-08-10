import { useSelector } from 'react-redux';

import { testHook } from '../util/testHelpers';
import useActiveUser from './useActiveUser';

// NOTE: This test is incomplete, it's the beginnings of an
// aborted test to test the useActiveUser hook. It's unclear at the
// moment whether the test should directly test the hook (via a minimal
// consuming component), or just test the components that consume
// the hook and allow the hook to be tested indirectly.
// See here for some thoughts:
// https://kentcdodds.com/blog/how-to-test-custom-react-hooks

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

let activeUser;
beforeEach(() => {
    testHook(() => {
        activeUser = useActiveUser();
    });
});

const mockState = {
    activeUser: {
        userDetails: { id: 1 },
        loading: false,
        error: ''
    }
};

describe('useActiveUser', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
    });
    it('should have a logout function', () => {
        expect(activeUser.logout).toBeInstanceOf(Function);
    });
});
