import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchQueries } from '../../../../../store/queries/queriesActions';
import Query from './Query/Query';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';

import styles from './QueryList.module.scss';

const QueryList = () => {
    const { t } = useTranslation();
    // Make the state we need available
    const d = useSelector((state) => state.queries);

    // Enable us to dispatch
    const dispatch = useDispatch();

    // When we're mounted, fetch the queries
    useEffect(() => {
        dispatch(fetchQueries());
    }, [dispatch]);

    return (
        <nav className={styles.queryListContainer}>
            <h1 className={styles.yourQueries}>Your queries</h1>
            {d.loading && <LoadingSpinner />}
            {!d.loading && d.queryList && d.queryList.length === 0 && (
                <h1 className={styles.noQueries}>{t('No queries found')}</h1>
            )}
            <ol role="directory" className={styles.queryList}>
                {d.queryList &&
                    d.queryList.map((query) => (
                        <NavLink key={query.id} to={`/query/${query.id}`}>
                            <Query query={query} />
                        </NavLink>
                    ))}
            </ol>
        </nav>
    );
};

export default QueryList;
