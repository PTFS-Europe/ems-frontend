import React from 'react';

import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './ActiveUser.module.css';

const ActiveUser = () => {
    return (
        <aside className={styles.activeUser}>
            <UserIcon />
            <h1 className={styles.userName}>Andrew Isherwood</h1>
        </aside>
    );
};

export default ActiveUser;
