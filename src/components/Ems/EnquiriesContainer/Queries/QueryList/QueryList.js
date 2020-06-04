import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchQueries } from '../../../../../store/queries/queriesActions';
import { fetchUsers } from '../../../../../store/users/usersActions';
import Query from './Query/Query';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';

import styles from './QueryList.module.scss';

const QueryList = () => {
    const { t } = useTranslation();
    // Make the state we need available
    const stateQueries = useSelector((state) => state.queries);

    // Enable us to dispatch
    const dispatch = useDispatch();

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
        dispatch(fetchQueries());
    }, [dispatch]);

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
            {!stateQueries.loading &&
                stateQueries.queryList &&
                stateQueries.queryList.length === 0 && (
                    <h1 className={styles.noQueries}>
                        {t('No queries found')}
                    </h1>
                )}
            <ol role="directory" className={styles.queryList}>
                {stateQueries.queryList &&
                    stateQueries.queryList.sort(querySorter).map((query) => (
                        <NavLink key={query.id} to={`/query/${query.id}`}>
                            <Query query={query} />
                        </NavLink>
                    ))}
            </ol>
        </nav>
    );
};

export default QueryList;
