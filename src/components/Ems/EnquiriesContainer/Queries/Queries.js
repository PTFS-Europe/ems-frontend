import React from 'react';

import ActiveUser from './ActiveUser/ActiveUser';
import QuerySearch from './QuerySearch/QuerySearch';
import QueryList from './QueryList/QueryList';

import styles from './Queries.module.scss';

const Queries = () => {
    return (
        <div className={styles.queries}>
            <ActiveUser></ActiveUser>
            <QuerySearch></QuerySearch>
            <QueryList></QueryList>
        </div>
    );
};

export default Queries;
