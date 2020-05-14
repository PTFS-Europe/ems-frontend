import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './QueryHeader.module.scss';

const QueryHeader = ({ match }) => {
    // Make the state we need available
    const stateQueries = useSelector((state) => state.queries);

    // The ID of the query currently being viewed
    const queryId = parseInt(match.params.queryId);

    const getQueryTitle = () => {
        const query = stateQueries.queryList.find(
            (query) => query.id === queryId
        );
        return query ? query.title : null;
    };

    return (
        <div role="banner" className={styles.queryHeader}>
            <UserIcon />
            <h1 className={styles.headerTitle}>{getQueryTitle()}</h1>
        </div>
    );
};

export default withRouter(QueryHeader);
