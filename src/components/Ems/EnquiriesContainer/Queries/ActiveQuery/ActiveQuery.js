import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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
        // We don't want dispatch to be a dependency of this hook
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

ActiveQuery.propTypes = {
    match: PropTypes.object.isRequired
};

export default withRouter(ActiveQuery);
