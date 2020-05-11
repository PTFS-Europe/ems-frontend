import React from 'react';

import QueryHeader from '../QueryHeader/QueryHeader';
import MessageList from '../../MessageList/MessageList';
import QueryEntry from '../QueryEntry/QueryEntry';

import styles from './ActiveQuery.module.css';

const ActiveQuery = () => {
    return (
        <main className={styles.activeQuery}>
            <QueryHeader />
            <MessageList />
            <QueryEntry className={styles.queryEntry} />
        </main>
    );
};

export default ActiveQuery;
