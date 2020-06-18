import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import QueryHeader from '../QueryHeader/QueryHeader';
import NewQuery from '../NewQuery/NewQuery';
import MessageList from '../../MessageList/MessageList';
import QueryEntry from '../QueryEntry/QueryEntry';

import styles from './ActiveQuery.module.scss';

const ActiveQuery = ({ match }) => {
    const [message, setMessage] = useState({ content: '' });

    const queryId = match.params.queryId;

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
