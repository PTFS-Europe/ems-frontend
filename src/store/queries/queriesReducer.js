import * as queriesTypes from './queriesTypes';
import * as labelsTypes from '../labels/labelsTypes';

const initialState = {
    loading: false,
    queryList: [],
    error: '',
    search: '',
    selected: [],
    activeQuery: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case queriesTypes.FETCH_QUERIES_REQUEST: {
        return {
            ...state,
            loading: true
        };

    }
    case queriesTypes.FETCH_QUERIES_SUCCESS: {
        const queryList = action.payload.data;
        return {
            ...state,
            loading: false,
            queryList,
            error: ''
        };

    }
    case queriesTypes.FETCH_QUERIES_FAILURE: {
        return {
            ...state,
            loading: false,
            queryList: [],
            error: action.payload
        };
    }
    case queriesTypes.CREATE_QUERY_REQUEST: {
        // Add the just sent query to our state, it will
        // be replaced if/when a response arrives
        return {
            ...state,
            // We don't set loading to true here as we do not want
            // the loading spinner to be displayed
            loading: false,
            queryList: [...state.queryList, action.payload]
        };
    }
    case queriesTypes.CREATE_QUERY_SUCCESS: {
        // We may be replacing a query that has a temporary ID
        let updatedQueries = [];
        if (action.payload.tempId) {
            // Find and replace the query that we've just received
            // from the API
            updatedQueries = state.queryList.map((query) => {
                if (query.id !== action.payload.tempId) {
                    return query;
                }
                return action.payload.data;
            });
        } else {
            updatedQueries = [...state.queryList, action.payload.data];
        }
        return {
            ...state,
            loading: false,
            queryList: updatedQueries,
            error: ''
        };
    }
    case queriesTypes.CREATE_QUERY_FAILURE: {
        // The query probably didn't get accepted by the API,
        // so remove it from our local state
        // TODO: We should announce to the user that something
        // went wrong
        const filteredQueries = state.queryList.filter(
            (query) => query.id !== action.payload.tempId
        );
        return {
            ...state,
            loading: false,
            queryList: filteredQueries,
            error: action.payload
        };
    }
    case queriesTypes.UPDATE_QUERY_BULK_REQUEST: {
        // Update the just updated queries in our state, it will
        // be replaced if/when a response arrives
        //
        // Iterate all queries and for each see if it needs updating,
        // return all queries with the ones that need updating updated
        const updatedQueryList = state.queryList.map((maybeUpdate) => {
            // Is this query in our array of updated ones, if so get it
            const updated = action.payload.find(
                (iterUpdated) => iterUpdated.id === maybeUpdate.id
            );
            return updated ? updated : maybeUpdate;
        });
        return {
            ...state,
            // We don't set loading to true here as we do not want
            // the loading spinner to be displayed
            loading: false,
            queryList: updatedQueryList
        };
    }
    case queriesTypes.UPDATE_QUERY_BULK_SUCCESS: {
        // Find and replace the queries that we've just received
        // from the API
        const updatedQueriesBulkSuccess = state.queryList.map(
            (originalQuery) => {
                const updated = action.payload.data.find(
                    (iterUpdated) => iterUpdated.id === originalQuery.id
                );
                return updated ? updated : originalQuery;
            }
        );
        return {
            ...state,
            loading: false,
            queryList: updatedQueriesBulkSuccess,
            error: ''
        };
    }
    case queriesTypes.UPDATE_QUERY_BULK_FAILURE: {
        // One or more updpated queries probably didn't get accepted
        // by the API, so replace the failed queries in our state with
        // their original unmodified counterparts
        // TODO: We should announce to the user that something
        // went wrong
        const unmodifiedQueries = action.payload.unmodifiedQueries;
        const queriesBulkFailure = state.queryList.map((query) => {
            const unmodified = unmodifiedQueries.find(
                (iterUnmodified) => iterUnmodified.id === query.id
            );
            return unmodified ? unmodified : query;
        });
        return {
            ...state,
            loading: false,
            queryList: queriesBulkFailure,
            error: action.payload.error
        };
    }
    case queriesTypes.SET_QUERY_SEARCH: {
        return {
            ...state,
            search: action.payload
        };
    }
    case queriesTypes.SET_QUERY_SELECTED: {
        const selectedIndex = state.selected.findIndex(
            (s) => s === action.payload
        );
        const out = JSON.parse(JSON.stringify(state.selected));
        if (selectedIndex > -1) {
            out.splice(selectedIndex, 1);
        } else {
            out.push(action.payload);
        }
        return {
            ...state,
            selected: out
        };
    }
    case queriesTypes.SET_QUERY_SELECTED_ALL: {
        // We receive a bool indicating whether the "Select all"
        // is checked or not
        if (!action.payload) {
            return {
                ...state,
                selected: []
            };
        }
        // "selected" should be the IDs of all loaded queries
        return {
            ...state,
            selected: state.queryList.map((query) => query.id)
        };
    }
    case queriesTypes.TOGGLE_LABEL_BULK_REQUEST: {
        const {
            labelId: toggledLabelId,
            isSelected,
            affectedQueries
        } = action.payload;

        const modifiedBulkQueryList = state.queryList.map((iQuery) => {
            // Is this query one we need to modify
            if (affectedQueries.includes(iQuery.id)) {
                // If the label being toggled is already selected
                if (isSelected) {
                    iQuery.labels = iQuery.labels.filter(
                        (iLabel) => iLabel !== toggledLabelId
                    );
                } else {
                    // Ensure we don't add the same label twice
                    if (!iQuery.labels.includes(toggledLabelId)) {
                        iQuery.labels = [...iQuery.labels, toggledLabelId];
                    }
                }
            }
            return iQuery;
        });

        return {
            ...state,
            queryList: modifiedBulkQueryList
        };
    }
    // If a label is deleted, we need to modify our state to remove
    // that label from any queries that use it
    case labelsTypes.DELETE_LABEL_SUCCESS: {
        const { id: labelToRemove } = action.payload;
        const modifiedQueries = state.queryList.map((query) => ({
            ...query,
            labels: query.labels.filter((label) => label !== labelToRemove)
        }));
        return {
            ...state,
            queryList: modifiedQueries
        };
    }
    case queriesTypes.UPDATE_ACTIVE_QUERY: {
        if (!action.payload) {
            return {
                ...state,
                activeQuery: {}
            };
        }
        if (state.queryList.length > 0) {
            const activeQuery = state.queryList.find((query) =>
                parseInt(query.id) === parseInt(action.payload));
            if (activeQuery) {
                return {
                    ...state,
                    activeQuery
                };
            }
        }
        return state;
    }
    default:
        return state;
    }
};

export default reducer;
