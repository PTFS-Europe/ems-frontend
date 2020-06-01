import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './QueryHeader.module.scss';

const QueryHeader = ({ match }) => {
    const [query, setQuery] = useState({});

    // Make the state we need available
    const stateQueries = useSelector((state) => state.queries);

    // The ID of the query currently being viewed
    const queryId = parseInt(match.params.queryId);

    useEffect(() => {
        if (stateQueries) {
            const query = stateQueries.queryList.find(
                (query) => query.id === queryId
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

QueryHeader.propTypes = {
    match: PropTypes.object.isRequired
};

export default withRouter(QueryHeader);
