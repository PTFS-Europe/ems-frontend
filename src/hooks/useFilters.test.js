import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';

import useFilters from './useFilters';

jest.mock('react-redux', () => ({
    // Mock useSelector
    useSelector: jest.fn()
}));

const mockState = {
    queries: {
        search: ''
    },
    folders: {
        filter: null
    },
    labels: {
        filter: null
    }
};

describe('useFilters', () => {
    test('returns the correct state with no active filter', () => {
        useSelector.mockImplementation((callback) => {
            return callback(mockState);
        });
        const { result } = renderHook(() => useFilters());
        expect(result.current).toEqual({
            search: '',
            folders: null,
            labels: null,
            isActiveFilter: false
        });
    });
    test('returns the correct state with active search', () => {
        useSelector.mockImplementation((callback) => {
            return callback({ ...mockState, queries: { search: 'dooku' } });
        });
        const { result } = renderHook(() => useFilters());
        expect(result.current).toEqual({
            search: 'dooku',
            folders: null,
            labels: null,
            isActiveFilter: true
        });
    });
    test('returns the correct state with active folder', () => {
        useSelector.mockImplementation((callback) => {
            return callback({ ...mockState, folders: { filter: 1 } });
        });
        const { result } = renderHook(() => useFilters());
        expect(result.current).toEqual({
            search: '',
            folders: 1,
            labels: null,
            isActiveFilter: true
        });
    });
    test('returns the correct state with active label', () => {
        useSelector.mockImplementation((callback) => {
            return callback({ ...mockState, labels: { filter: 1 } });
        });
        const { result } = renderHook(() => useFilters());
        expect(result.current).toEqual({
            search: '',
            folders: null,
            labels: 1,
            isActiveFilter: true
        });
    });
});
