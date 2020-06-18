import React from 'react';

import { useSelector } from 'react-redux';

import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './ActiveUser.module.scss';

const ActiveUser = ({ colour = '#fff' }) => {
    const stateActiveUser = useSelector((state) => state.activeUser);

    return (
        <aside className={styles.activeUser}>
            <UserIcon userId={stateActiveUser.userDetails.id} />
            <h1 className={styles.userName} style={{ color: colour }}>
                {stateActiveUser.userDetails.name}
            </h1>
        </aside>
    );
};

export default ActiveUser;
