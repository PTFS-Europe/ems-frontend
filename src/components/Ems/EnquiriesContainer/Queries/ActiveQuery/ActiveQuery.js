import React from 'react';

import QueryHeader from '../QueryHeader/QueryHeader';
import Messages from '../../Messages/Messages';

import styles from './ActiveQuery.module.css';

const ActiveQuery = () => {
    return (
        <main className={styles.activeQuery}>
            <QueryHeader />
            <Messages />
        </main>
    );
};

export default ActiveQuery;
