import React from 'react';

import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './QueryHeader.module.scss';

const QueryHeader = () => {
    return (
        <div role="banner" className={styles.queryHeader}>
            <UserIcon />
            <h1 className={styles.headerTitle}>QueryHeader</h1>
        </div>
    );
};

export default QueryHeader;
