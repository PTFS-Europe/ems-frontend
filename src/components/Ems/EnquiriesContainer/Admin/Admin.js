import React from 'react';

import ActiveUser from '../Queries/ActiveUser/ActiveUser';
import QueryHeader from '../Queries/QueryHeader/QueryHeader';
import QuerySearch from '../Queries/QuerySearch/QuerySearch';
import Folders from './Folders/Folders';
import Labels from './Labels/Labels';

import styles from './Admin.module.scss';

const Admin = ({ children }) => {
    return (
        <div className={styles.adminContainer}>
            <div className={styles.leftColumn}>
                <div className={styles.activeUserContainer}>
                    <ActiveUser />
                </div>
                <div className={styles.foldersLabelsContainer}>
                    <Folders />
                    <Labels />
                </div>
            </div>
            <div className={styles.rightColumn}>
                <div className={styles.rightColumnHeading}>
                    <div className={styles.search}>
                        <QuerySearch placeholder={'Search queries'} />
                    </div>
                    <div className={styles.queryHeader}>
                        <QueryHeader />
                    </div>
                </div>
                <div className={styles.enq}>{children}</div>
            </div>
        </div>
    );
};

export default Admin;
