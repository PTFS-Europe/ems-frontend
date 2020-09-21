import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
    updateActiveQuery
} from '../store/queries/queriesActions';

export default () => {
    const { queryId } = useParams();

    const [id, setId] = useState(queryId);

    const stateActiveQuery = useSelector((state) => state.queries.activeQuery);
    const dispatch = useDispatch();

    // Make sure the active query changes when a new query is selected
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => resetActiveQuery(), [queryId]);

    useEffect(() => {
        dispatch(updateActiveQuery(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const setNewActiveQuery = (newValue) => {
        // If we're passed a number or null, use it
        if (!isNaN(newValue) || newValue === null) {
            setId(newValue);
        } else {
            // Try and use the route param
            if (queryId) {
                setId(queryId);
            }
        }
    };

    const resetActiveQuery = () => {
        setId(queryId);
    };

    return [stateActiveQuery, setNewActiveQuery, resetActiveQuery];
};
