import React, { useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { debounce } from '../../../../../util/ui';
import { fetchQueries } from '../../../../../store/queries/queriesActions';
import { fetchUsers } from '../../../../../store/users/usersActions';
import Query from './Query/Query';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';
import StartNewQuery from '../../../../UI/StartNewQuery/StartNewQuery';

import styles from './QueryList.module.scss';

const QueryList = ({ match }) => {
    const { t } = useTranslation();

    // The number of characters that must be present before a
    // search will trigger
    const minSearchLength = 3;

    // Prevent the search string hook from triggering during
    // mounting
    const myRef = useRef(false);

    // We create a ref containing a debounced dispatch. Just creating a
    // debounced dispatch, without storing it in a ref seemed to break the
    // debouncing, I think because the function that was returned was
    // different every time it was called (I'm not 100% sure why that would
    // be). So the debouncer didn't recognise it as multiple calls to the
    // same function
    const debouncedDispatchRef = useRef();

    const queryId = match.params.queryId;

    // Make the state we need available
    const stateQueries = useSelector((state) => state.queries);

    // Enable us to dispatch
    const dispatch = useDispatch();

    // Create the debounced dispatch and store it in the ref
    useEffect(() => {
        if (!debouncedDispatchRef.current) {
            debouncedDispatchRef.current = debounce(dispatch, 500);
        }
    }, [dispatch]);

    const querySorter = (a, b) => {
        if (
            a.hasOwnProperty('latestMessage') &&
            b.hasOwnProperty('latestMessage')
        ) {
            return (
                Date.parse(b.latestMessage.updated_at) -
                Date.parse(a.latestMessage.updated_at)
            );
        } else {
            return Date.parse(b.updated_at) - Date.parse(a.updated_at);
        }
    };

    // When we're mounted, fetch the queries
    useEffect(() => {
        // Only do this if we don't already have queries
        if (stateQueries.queryList.length === 0) {
            dispatch(fetchQueries());
        }
        // Disable linting here, we do not want stateQueries.queryList.length
        // to be a dependency, this hook should only fire when we first mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // When the search string changes, fetch the queries, debounced
    // We pass the query ID so the reducer can ultimately keep the
    // currently active query (if there is one) in the queryList
    useEffect(() => {
        const search = stateQueries.search;
        if (
            myRef.current &&
            (search.length >= minSearchLength || search.length === 0)
        ) {
            const debDispatch = debouncedDispatchRef.current;
            if (stateQueries.search.length > 0) {
                debDispatch(
                    fetchQueries({ title: stateQueries.search }, queryId)
                );
            } else {
                debDispatch(fetchQueries());
            }
        }
        myRef.current = true;
        // Disable the linting on the following line. It wants us to
        // add dispatch as a dependency, but we don't want to be
        // triggered by that, we have a separate hook for that
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateQueries.search]);

    // Should we display the "Start new query" button
    const shouldDisplayNewQuery = () => {
        // If there is an active search
        if (stateQueries.search.length > 0) {
            // The valid length of queryList varies according to whether
            // we have an active query or not
            if (
                (queryId && stateQueries.queryList.length === 1) ||
                (!queryId && stateQueries.queryList.length === 0)
            ) {
                return true;
            }
            return false;
        }
        return false;
    };

    // When we have the queries, make sure the initiators are populated
    useEffect(() => {
        if (stateQueries.queryList) {
            const initiators = stateQueries.queryList.map(
                (queryList) => queryList.initiator
            );
            dispatch(fetchUsers({ user_ids: initiators }));
        }
    }, [stateQueries.queryList, dispatch]);

    return (
        <nav className={styles.queryListContainer}>
            <h1 className={styles.yourQueries}>Your queries</h1>
            {stateQueries.loading && <LoadingSpinner />}
            <ol role="directory" className={styles.queryList}>
                {stateQueries.queryList &&
                    stateQueries.queryList.sort(querySorter).map((query) => (
                        <NavLink key={query.id} to={`/query/${query.id}`}>
                            <Query query={query} />
                        </NavLink>
                    ))}
            </ol>
            {!stateQueries.loading && shouldDisplayNewQuery() && (
                <div className={styles.noResultsContainer}>
                    <h1 className={styles.noQueries}>
                        {t('No queries found')}
                    </h1>
                    <div className={styles.startNewQuery}>
                        <StartNewQuery />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default withRouter(QueryList);
