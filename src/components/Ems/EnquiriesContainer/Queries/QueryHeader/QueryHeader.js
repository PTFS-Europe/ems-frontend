import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import UserIcon from '../../../../UI/UserIcon/UserIcon';
import useActiveQuery from '../../../../../hooks/useActiveQuery';

import styles from './QueryHeader.module.scss';

const QueryHeader = () => {
    const [query, setQuery] = useState({});

    const [queryId] = useActiveQuery();

    // Make the state we need available
    const stateQueries = useSelector((state) => state.queries);

    useEffect(() => {
        if (stateQueries) {
            const query = stateQueries.queryList.find(
                (query) => parseInt(query.id) === parseInt(queryId)
            );
            setQuery(query);
        }
    }, [stateQueries, queryId]);

    return (
        <div role="banner" className={styles.queryHeader}>
            {query && (
                <React.Fragment>
                    {query &&
                        query.participants &&
                        query.participants.map((participant) => (
                            <div
                                key={participant}
                                className={styles.iconContainer}
                            >
                                <UserIcon userId={participant} />
                            </div>
                        ))}
                    <h1 className={styles.headerTitle}>{query.title}</h1>
                </React.Fragment>
            )}
        </div>
    );
};

export default QueryHeader;
