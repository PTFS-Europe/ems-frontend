import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import QueryHeader from '../QueryHeader/QueryHeader';
import NewQuery from '../NewQuery/NewQuery';
import MessageList from '../../MessageList/MessageList';
import QueryEntry from '../QueryEntry/QueryEntry';
import { updateActiveQuery } from '../../../../../store/queries/queriesActions';

import styles from './ActiveQuery.module.scss';

const ActiveQuery = ({ match }) => {
    const dispatch = useDispatch();

    const queryId = match.params.queryId;

    // Ensure our state has the active query set
    useEffect(() => {
        dispatch(updateActiveQuery(parseInt(queryId)));
        // When we unmount, reset the state property
        return () => {
            dispatch(updateActiveQuery(null));
        };
    }, [queryId]);

    return (
        <main className={styles.activeQuery}>
            <QueryHeader />
            {!queryId && <NewQuery />}
            {queryId && <MessageList />}
            {queryId && <QueryEntry className={styles.queryEntry} />}
        </main>
    );
};

export default withRouter(ActiveQuery);
