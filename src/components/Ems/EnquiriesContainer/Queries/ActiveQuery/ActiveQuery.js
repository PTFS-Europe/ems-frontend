import React from 'react';

import QueryHeader from '../QueryHeader/QueryHeader';
import MessageList from '../../MessageList/MessageList';

import styles from './ActiveQuery.module.css';

const ActiveQuery = () => {
    return (
        <main className={styles.activeQuery}>
            <QueryHeader />
            <MessageList />
        </main>
    );
};

export default ActiveQuery;
