import React, { useState } from 'react';

import QueryHeader from '../QueryHeader/QueryHeader';
import MessageList from '../../MessageList/MessageList';
import QueryEntry from '../QueryEntry/QueryEntry';

import styles from './ActiveQuery.module.scss';

const ActiveQuery = () => {
    const [message, setMessage] = useState({ content: '' });

    const updateMessage = (updatedMessage) => {
        setMessage(updatedMessage);
    };

    return (
        <main className={styles.activeQuery}>
            <QueryHeader />
            <MessageList updateMessage={updateMessage} />
            <QueryEntry
                className={styles.queryEntry}
                message={message}
                updateMessage={(msg) => updateMessage(msg)}
            />
        </main>
    );
};

export default ActiveQuery;
