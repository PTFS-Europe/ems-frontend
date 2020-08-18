import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import QueryHeader from '../QueryHeader/QueryHeader';
import NewQuery from '../NewQuery/NewQuery';
import MessageList from '../../MessageList/MessageList';
import QueryEntry from '../QueryEntry/QueryEntry';
import { updateActiveQuery } from '../../../../../store/queries/queriesActions';

import styles from './ActiveQuery.module.scss';

const ActiveQuery = ({ match }) => {
    const [message, setMessage] = useState({ content: '' });

    const dispatch = useDispatch();

    const queryId = match.params.queryId;

    // Ensure our state has the active query set
    useEffect(() => {
        dispatch(updateActiveQuery(parseInt(queryId)));
        // When we unmount, reset the state property
        return () => {
            dispatch(updateActiveQuery(null));
        }
    }, [queryId]);

    const updateMessage = (updatedMessage) => {
        setMessage(updatedMessage);
    };

    return (
        <main className={styles.activeQuery}>
            {/* <QueryHeader /> */}
            {!queryId && <NewQuery />}
            {queryId && <MessageList updateMessage={updateMessage} />}
            {queryId && (
                <QueryEntry
                    className={styles.queryEntry}
                    message={message}
                    updateMessage={(msg) => updateMessage(msg)}
                />
            )}
        </main>
    );
};

export default withRouter(ActiveQuery);
