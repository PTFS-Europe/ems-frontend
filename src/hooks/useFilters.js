import { useSelector } from 'react-redux';

// Allow us to easily establish the status of all things that could affect
// the filtering of the query list:
// - An active search
// - An active folder filter
// - An active label filter

const useFilters = () => {
    const stateQueries = useSelector((state) => state.queries);
    const stateFolders = useSelector((state) => state.folders);
    const stateLabels = useSelector((state) => state.labels);

    const isActiveFilter = () => {
        return stateQueries.search.length > 2 ||
            stateFolders.filter ||
            stateLabels.filter
            ? true
            : false;
    };

    return {
        search: stateQueries.search,
        folders: stateFolders.filter,
        labels: stateLabels.filter,
        isActiveFilter: isActiveFilter()
    };
};

export default useFilters;
