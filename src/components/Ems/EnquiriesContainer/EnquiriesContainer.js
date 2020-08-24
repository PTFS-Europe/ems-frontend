import React from 'react';

import styles from './EnquiriesContainer.module.scss';

import Admin from './Admin/Admin';
import Queries from './Queries/Queries';
import ActiveQuery from './Queries/ActiveQuery/ActiveQuery';
import useActiveUser from '../../../hooks/useActiveUser';

const EnquiriesContainer = () => {
    const [activeUser] = useActiveUser();
    return (
        <div className={styles.queriesContainer}>
            {activeUser.role_code === 'STAFF' && <Admin />}
            <Queries />
            <ActiveQuery />
        </div>
    );
};

export default EnquiriesContainer;
