import React from 'react';

import ActiveUser from '../Queries/ActiveUser/ActiveUser';
import Folders from './Folders/Folders';
import Labels from './Labels/Labels';

import styles from './Admin.module.scss';

const Admin = () => {
    return (
        <div className={styles.adminContainer}>
            <div className={styles.activeUserContainer}>
                <ActiveUser />
            </div>
            <div className={styles.foldersLabelsContainer}>
                <Folders />
                <Labels />
            </div>
        </div>
    );
};

export default Admin;
